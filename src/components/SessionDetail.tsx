"use client";

import { Bot, Clock, MessageSquare, Share2, Terminal, Upload } from "lucide-react";
import type { Skill, ToolCall } from "@/lib/backend";
import type { Session } from "@/lib/types";
import ChatInput from "./ChatInput";
import ThinkingPanel from "./ThinkingPanel";

interface SessionDetailProps {
  session: Session;
  toolCalls: ToolCall[];
  responseMessage: string | null;
  isThinking: boolean;
  onSendMessage: (prompt: string) => void;
  skills: Skill[];
  activeSkillIds: string[];
  onSkillClick: (skillId: string) => void;
}

export default function SessionDetail({
  session,
  toolCalls,
  responseMessage,
  isThinking,
  onSendMessage,
  skills,
  activeSkillIds,
  onSkillClick,
}: SessionDetailProps) {
  return (
    <div className="flex h-screen flex-1 flex-col bg-white">
      <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-zinc-300" />
          <h1 className="max-w-lg truncate text-[13.5px] font-semibold text-zinc-800">
            {session.title}
          </h1>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
            aria-label="Share"
          >
            <Share2 size={14} />
          </button>
          <button
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
            aria-label="Terminal"
          >
            <Terminal size={14} />
          </button>
          <button
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
            aria-label="Export"
          >
            <Upload size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <ThinkingPanel
            toolCalls={toolCalls}
            message={responseMessage}
            isThinking={isThinking}
            skills={skills}
            activeSkillIds={activeSkillIds}
            onSkillClick={onSkillClick}
          />
          <div className="mt-auto" />
        </div>

        <aside className="hidden w-[256px] min-w-[256px] overflow-y-auto border-l border-zinc-100 bg-white px-5 py-5 lg:block">
          <div className="space-y-4">
            <MetaRow
              icon={<Bot size={13} className="mt-px text-zinc-400" />}
              label="Status"
              value="Placeholder backend"
            />
            <MetaRow
              icon={<Clock size={13} className="mt-px text-zinc-400" />}
              label="Updated"
              value={session.age}
            />
            <MetaRow
              icon={<span className="mt-[5px] inline-block h-1.5 w-1.5 rounded-full bg-zinc-300" />}
              label="Model"
              value="claude-opus-4-5"
            />
            <MetaRow
              icon={<span className="mt-[5px] inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />}
              label="Session"
              value={session.subtitle || "Created locally"}
            />
          </div>

          <div className="mt-5 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Backend
            </p>
            <p className="mt-2 text-[12px] leading-[1.6] text-zinc-500">
              Replace <code className="rounded bg-zinc-100 px-1 py-px text-[11px]">callQuantAIBackend(prompt)</code> in{" "}
              <code className="rounded bg-zinc-100 px-1 py-px text-[11px]">src/lib/backend.ts</code> when your Databricks endpoint is ready.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[11.5px] font-semibold text-zinc-700">Tasks</p>
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
    <div className="flex items-start gap-2.5">
      {icon}
      <div>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
          {label}
        </p>
        <p className="mt-0.5 text-[12.5px] text-zinc-600">{value}</p>
      </div>
    </div>
  );
}
