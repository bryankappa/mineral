"use client";

import { Bot, Clock, MessageSquare, Share2, Terminal, Upload } from "lucide-react";
import type { ToolCall } from "@/lib/backend";
import type { Session } from "@/lib/types";
import ChatInput from "./ChatInput";
import ThinkingPanel from "./ThinkingPanel";

interface SessionDetailProps {
  session: Session;
  toolCalls: ToolCall[];
  responseMessage: string | null;
  isThinking: boolean;
  onSendMessage: (prompt: string) => void;
}

export default function SessionDetail({
  session,
  toolCalls,
  responseMessage,
  isThinking,
  onSendMessage,
}: SessionDetailProps) {
  return (
    <div className="flex h-screen flex-1 flex-col bg-white">
      <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <MessageSquare size={15} className="text-zinc-400" />
          <h1 className="max-w-lg truncate text-[14px] font-semibold text-zinc-900">
            {session.title}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-50"
            aria-label="Share"
          >
            <Share2 size={15} />
          </button>
          <button
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-50"
            aria-label="Terminal"
          >
            <Terminal size={15} />
          </button>
          <button
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-50"
            aria-label="Export"
          >
            <Upload size={15} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <ThinkingPanel
            toolCalls={toolCalls}
            message={responseMessage}
            isThinking={isThinking}
          />
          <div className="mt-auto" />
        </div>

        <aside className="hidden w-[270px] min-w-[270px] overflow-y-auto border-l border-zinc-100 bg-white px-5 py-5 lg:block">
          <div className="space-y-4 text-[12px] text-zinc-500">
            <MetaRow
              icon={<Bot size={14} className="mt-0.5 text-zinc-400" />}
              label="Status"
              value="Placeholder backend"
            />
            <MetaRow
              icon={<Clock size={14} className="mt-0.5 text-zinc-400" />}
              label="Updated"
              value={session.age}
            />
            <MetaRow
              icon={<span className="mt-[7px] inline-block h-2 w-2 rounded-full bg-zinc-300" />}
              label="Model"
              value="claude-opus-4-5"
            />
            <MetaRow
              icon={<span className="mt-[7px] inline-block h-2 w-2 rounded-full bg-amber-300" />}
              label="Session"
              value={session.subtitle || "Created locally"}
            />
          </div>

          <div className="mt-6 rounded-[16px] border border-zinc-200 bg-zinc-50/70 px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">
              Backend
            </p>
            <p className="mt-2 text-[12px] leading-5 text-zinc-500">
              Replace <code>callQuantAIBackend(prompt)</code> in
              <code> src/lib/backend.ts</code> when your Databricks endpoint is
              ready.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[12px] font-semibold text-zinc-700">Tasks</p>
            <p className="mt-2 text-[12px] text-zinc-400">No tasks reported yet.</p>
          </div>
        </aside>
      </div>

      <div className="flex justify-center border-t border-zinc-100 bg-white px-6 py-4">
        <ChatInput
          onSubmit={onSendMessage}
          disabled={isThinking}
          maxWidthClass="max-w-[860px]"
        />
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">
          {label}
        </p>
        <p className="mt-1 text-zinc-600">{value}</p>
      </div>
    </div>
  );
}
