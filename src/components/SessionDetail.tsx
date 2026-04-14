"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  Terminal,
  Upload,
} from "lucide-react";
import type { Skill, Task, ToolCall } from "@/lib/backend";
import type { Session } from "@/lib/types";
import ChatInput from "./ChatInput";
import TaskPlan from "./TaskPlan";
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
  tasks: Task[];
}

const STORAGE_KEY = "quantai.rightpanel.open";

export default function SessionDetail({
  session,
  toolCalls,
  responseMessage,
  isThinking,
  onSendMessage,
  skills,
  activeSkillIds,
  onSkillClick,
  tasks,
}: SessionDetailProps) {
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing persisted UI state from localStorage
    if (saved === "0") setPanelOpen(false);
  }, []);

  const togglePanel = () => {
    setPanelOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      }
      return next;
    });
  };

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
          <div className="mx-1 h-4 w-px bg-zinc-200" />
          <button
            onClick={togglePanel}
            aria-label={panelOpen ? "Collapse task panel" : "Expand task panel"}
            title={panelOpen ? "Collapse task panel" : "Expand task panel"}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
          >
            {panelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
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

        {panelOpen ? (
          <aside className="hidden w-[260px] min-w-[260px] flex-col overflow-y-auto border-l border-zinc-100 bg-white lg:flex">
            <div className="px-5 pb-4 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-zinc-400">
                Tasks
              </p>
              <div className="mt-3">
                <TaskPlan tasks={tasks} />
              </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 px-5 py-4">
              <MetaRow label="Status" value={session.active ? "Active" : "Idle"} />
              <MetaRow label="Updated" value={session.age} />
              <MetaRow label="Model" value="claude-opus-4-5" />
            </div>
          </aside>
        ) : null}
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

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-zinc-400">
        {label}
      </span>
      <span className="truncate text-[11.5px] text-zinc-600">{value}</span>
    </div>
  );
}
