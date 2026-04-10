"use client";

import { useCallback, useState } from "react";
import ChatInput from "@/components/ChatInput";
import MetricCards from "@/components/MetricCards";
import SessionDetail from "@/components/SessionDetail";
import Sidebar from "@/components/Sidebar";
import { callQuantAIBackend } from "@/lib/backend";
import type { ToolCall } from "@/lib/backend";
import type { Session } from "@/lib/types";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? null;

  const handleSendMessage = useCallback(
    async (prompt: string) => {
      const sessionId =
        selectedSessionId ??
        globalThis.crypto?.randomUUID?.() ??
        `session-${Date.now()}`;

      if (!selectedSessionId) {
        setSessions((previousSessions) => [
          {
            id: sessionId,
            title: toSessionTitle(prompt),
            subtitle: "",
            age: "now",
            active: true,
          },
          ...previousSessions,
        ]);
        setSelectedSessionId(sessionId);
      }

      setIsThinking(true);
      setToolCalls([]);
      setResponseMessage(null);

      try {
        const result = await callQuantAIBackend(prompt);

        for (const toolCall of result.toolCalls) {
          await new Promise((resolve) => setTimeout(resolve, 180));
          setToolCalls((previousToolCalls) => [...previousToolCalls, toolCall]);
        }

        setResponseMessage(result.message);
      } finally {
        setIsThinking(false);
      }
    },
    [selectedSessionId]
  );

  return (
    <div className="flex h-full">
      <Sidebar
        sessions={sessions}
        selectedId={selectedSessionId}
        onSelect={setSelectedSessionId}
      />

      {selectedSession ? (
        <SessionDetail
          session={selectedSession}
          toolCalls={toolCalls}
          responseMessage={responseMessage}
          isThinking={isThinking}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <HomeView onSendMessage={handleSendMessage} isThinking={isThinking} />
      )}
    </div>
  );
}

function HomeView({
  onSendMessage,
  isThinking,
}: {
  onSendMessage: (prompt: string) => void;
  isThinking: boolean;
}) {
  return (
    <main className="relative flex-1 overflow-hidden bg-white">
      <div className="dot-pattern absolute inset-0" aria-hidden="true" />
      <div
        className="dot-cluster dot-cluster-left absolute -left-[2%] top-[46%] h-[420px] w-[420px]"
        aria-hidden="true"
      />
      <div
        className="dot-cluster dot-cluster-right absolute right-[9%] top-[54%] h-[250px] w-[520px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-10">
        <div className="flex w-full translate-y-5 flex-col items-center">
          <ChatInput onSubmit={onSendMessage} disabled={isThinking} />
          <MetricCards />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#ddd8d2] bg-white px-4 py-2 text-[12px] text-zinc-400 shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-[7px] w-[7px] rounded-full bg-zinc-300" />
          <span>No agents connected</span>
        </div>
      </div>
    </main>
  );
}

function toSessionTitle(prompt: string): string {
  const normalizedPrompt = prompt.trim().replace(/\s+/g, " ");

  if (normalizedPrompt.length <= 52) {
    return normalizedPrompt;
  }

  return `${normalizedPrompt.slice(0, 52)}...`;
}
