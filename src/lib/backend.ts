/**
 * Mineral Backend
 *
 * Calls /api/chat (the Next.js proxy route to Databricks) and consumes
 * the SSE stream, dispatching events to the provided callbacks.
 *
 * SSE event vocabulary (emitted by the Python agent):
 *   skills_activated → { ids }
 *   task_plan        → { tasks: [str, ...] }
 *   task_update      → { index: number, status: "complete" }
 *   tool_call_start  → { id, toolName }
 *   tool_call_delta  → { id, inputChunk }
 *   tool_call_end    → { id, output, durationMs }
 *   message_delta    → { text }
 *   done             → {}
 */

export interface ToolCall {
  id: string;
  toolName: string;
  input: Record<string, unknown>;
  output: string;
  durationMs: number;
  status: "running" | "complete";
}

type TaskStatus = "pending" | "running" | "complete";

export interface Task {
  title: string;
  status: TaskStatus;
}

export interface Skill {
  id: string;
  title: string;
  domain: string;
  description: string;
  triggers: string[];
  examples: string[];
  enabled: boolean;
  body: string;
}

interface StreamCallbacks {
  onSkillsActivated: (ids: string[]) => void;
  onTaskPlan: (tasks: string[]) => void;
  onTaskUpdate: (index: number) => void;
  onToolCallStart: (id: string, toolName: string) => void;
  onToolCallDelta: (id: string, inputChunk: string) => void;
  onToolCallEnd: (id: string, output: string, durationMs: number) => void;
  onMessageDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch("/api/skills", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Skills fetch failed: HTTP ${response.status}`);
  }
  const json = (await response.json()) as { skills?: Skill[] };
  return json.skills ?? [];
}

export async function callMineralBackend(
  prompt: string,
  callbacks: StreamCallbacks
): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  } catch (err) {
    callbacks.onError(new Error(`Network error: ${String(err)}`));
    return;
  }

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => `HTTP ${response.status}`);
    callbacks.onError(new Error(text));
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last (possibly incomplete) line in the buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (!raw || raw === "{}") {
            if (currentEvent === "done") callbacks.onDone();
            currentEvent = "";
            continue;
          }
          try {
            const data = JSON.parse(raw) as Record<string, unknown>;
            dispatchEvent(currentEvent, data, callbacks);
          } catch {
            // Malformed JSON in SSE data — skip
          }
          currentEvent = "";
        } else if (line === "") {
          // Blank line = SSE event separator; reset event type
          currentEvent = "";
        }
      }
    }
  } catch (err) {
    callbacks.onError(new Error(`Stream read error: ${String(err)}`));
  } finally {
    reader.releaseLock();
  }
}

function dispatchEvent(
  event: string,
  data: Record<string, unknown>,
  cb: StreamCallbacks
): void {
  switch (event) {
    case "skills_activated":
      cb.onSkillsActivated((data.ids as string[]) ?? []);
      break;
    case "task_plan":
      cb.onTaskPlan((data.tasks as string[]) ?? []);
      break;
    case "task_update":
      cb.onTaskUpdate((data.index as number) ?? 0);
      break;
    case "tool_call_start":
      cb.onToolCallStart(data.id as string, data.toolName as string);
      break;
    case "tool_call_delta":
      cb.onToolCallDelta(data.id as string, data.inputChunk as string);
      break;
    case "tool_call_end":
      cb.onToolCallEnd(
        data.id as string,
        data.output as string,
        data.durationMs as number
      );
      break;
    case "message_delta":
      cb.onMessageDelta(data.text as string);
      break;
    case "done":
      cb.onDone();
      break;
  }
}
