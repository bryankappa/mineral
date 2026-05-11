import { NextRequest } from "next/server";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function sse(event: string, data: object): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

// ── Mock stream — used when MOCK_MODE=true in .env.local ─────────────────────
// Simulates a real agent response with 3 tool calls + a streamed message.
// Lets you test the full UI pipeline without any Databricks connection.
function mockStream(prompt: string): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const emit = (event: string, data: object) =>
        controller.enqueue(enc.encode(sse(event, data)));
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      // Tool 1 — search_documents
      emit("tool_call_start", { id: "tc_1", toolName: "search_documents" });
      await wait(300);
      emit("tool_call_delta", { id: "tc_1", inputChunk: `{"query": "${prompt.slice(0, 40)}"}` });
      await wait(600);
      emit("tool_call_end", {
        id: "tc_1",
        output: JSON.stringify({
          results: [
            { doc_path: "/Volumes/main/mineral/docs/energy_overview.md", excerpt: "Total renewable capacity reached 420 GW in 2024, led by solar (210 GW) and wind (180 GW)...", score: 0.94 },
            { doc_path: "/Volumes/main/mineral/docs/doe_funding_2024.md", excerpt: "DOE awarded $2.4B in clean energy grants across 14 programs in FY2024...", score: 0.87 },
          ],
        }),
        durationMs: 612,
      });

      await wait(200);

      // Tool 2 — query_sql
      emit("tool_call_start", { id: "tc_2", toolName: "query_sql" });
      await wait(300);
      emit("tool_call_delta", { id: "tc_2", inputChunk: '{"sql": "SELECT state_code, SUM(net_generation_mwh) AS total_mwh FROM main.energy.eia_monthly_generation WHERE energy_source = \'Solar\' GROUP BY state_code ORDER BY total_mwh DESC LIMIT 5"}' });
      await wait(900);
      emit("tool_call_end", {
        id: "tc_2",
        output: JSON.stringify({
          columns: ["state_code", "total_mwh"],
          rows: [
            { state_code: "CA", total_mwh: 42800000 },
            { state_code: "TX", total_mwh: 31200000 },
            { state_code: "FL", total_mwh: 18900000 },
            { state_code: "AZ", total_mwh: 16400000 },
            { state_code: "NC", total_mwh: 12100000 },
          ],
          row_count: 5,
        }),
        durationMs: 934,
      });

      await wait(200);

      // Tool 3 — read_document
      emit("tool_call_start", { id: "tc_3", toolName: "read_document" });
      await wait(300);
      emit("tool_call_delta", { id: "tc_3", inputChunk: '{"path": "/Volumes/main/mineral/docs/energy_overview.md"}' });
      await wait(500);
      emit("tool_call_end", {
        id: "tc_3",
        output: JSON.stringify({
          path: "/Volumes/main/mineral/docs/energy_overview.md",
          content: "# US Energy Overview 2024\n\nTotal renewable capacity reached 420 GW...\n\n## Solar\nCalifornia leads with 42.8 TWh annual generation...",
        }),
        durationMs: 487,
      });

      await wait(400);

      // Stream the final answer word by word
      const answer =
        `Based on my analysis of \`main.energy.eia_monthly_generation\` and ` +
        `/Volumes/main/mineral/docs/energy_overview.md:\n\n` +
        `**Top 5 Solar States (2024)**\n` +
        `1. California — 42.8 TWh\n` +
        `2. Texas — 31.2 TWh\n` +
        `3. Florida — 18.9 TWh\n` +
        `4. Arizona — 16.4 TWh\n` +
        `5. North Carolina — 12.1 TWh\n\n` +
        `California leads by a significant margin, accounting for roughly 28% of total US utility-scale solar generation.`;

      for (const word of answer.split(" ")) {
        emit("message_delta", { text: word + " " });
        await wait(40);
      }

      emit("done", {});
      controller.close();
    },
  });
}

// ── Real Databricks stream ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt: string = body.prompt ?? "";
  const messages: unknown[] = body.messages ?? [{ role: "user", content: prompt }];

  // Mock mode: set MOCK_MODE=true in .env.local to test without Databricks
  if (process.env.MOCK_MODE === "true") {
    return new Response(mockStream(prompt), { headers: SSE_HEADERS });
  }

  const endpointUrl = process.env.DATABRICKS_ENDPOINT_URL;
  const token = process.env.DATABRICKS_TOKEN;

  if (!endpointUrl || !token) {
    return new Response(
      JSON.stringify({ error: "DATABRICKS_ENDPOINT_URL and DATABRICKS_TOKEN must be set in .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, stream: true }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Failed to reach Databricks endpoint: ${String(err)}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return new Response(
      JSON.stringify({ error: text }),
      { status: upstream.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(upstream.body, { headers: SSE_HEADERS });
}
