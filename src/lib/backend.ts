/**
 * QuantAI Backend Placeholder
 *
 * This function is the single integration point for the Databricks MLflow
 * responses agent. Replace the mock implementation below with a real
 * fetch/gRPC/SDK call when you're ready to wire in the backend.
 */

export interface ToolCall {
  id: string;
  toolName: string;
  input: Record<string, unknown>;
  output: string;
  durationMs: number;
}

interface QuantAIResponse {
  message: string;
  toolCalls: ToolCall[];
}

// ──────────────────────────────────────────────
//  PLACEHOLDER — swap this out for the real call
// ──────────────────────────────────────────────
export async function callQuantAIBackend(
  prompt: string
): Promise<QuantAIResponse> {
  void prompt;

  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    message:
      "QuantAI backend placeholder.\n\nReplace callQuantAIBackend(prompt) in src/lib/backend.ts with your Databricks MLflow Responses Agent integration when the endpoint is ready.",
    toolCalls: [],
  };
}
