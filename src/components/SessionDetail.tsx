"use client";

import { useEffect, useState } from "react";
import { MessageSquare, PanelRightClose, PanelRightOpen } from "lucide-react";
import type { Skill, Task, ToolCall } from "@/lib/backend";
import type { Session } from "@/lib/types";
import ChatInput from "./ChatInput";
import TaskPlan from "./TaskPlan";
import ThinkingPanel from "./ThinkingPanel";

interface SessionDetailProps {
  session: Session;
  toolCalls: ToolCall[];
  responseMessage: string | null;
  userPrompt: string | null;
  isThinking: boolean;
  onSendMessage: (prompt: string) => void;
  skills: Skill[];
  activeSkillIds: string[];
  onSkillClick: (skillId: string) => void;
  tasks: Task[];
}

const STORAGE_KEY = "mineral.rightpanel.open";

export default function SessionDetail({
  session,
  toolCalls,
  responseMessage,
  userPrompt,
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
    <div className="flex h-screen flex-1 flex-col bg-[#f7faff]">
      <header className="flex items-center justify-between border-b border-[#d7e1ee] bg-white/72 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-[#91a0b3]" />
          <h1 className="max-w-lg truncate text-[13.5px] font-semibold text-[#102033]">
            {session.title}
          </h1>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={togglePanel}
            aria-label={panelOpen ? "Collapse task panel" : "Expand task panel"}
            title={panelOpen ? "Collapse task panel" : "Expand task panel"}
            className="rounded-lg p-1.5 text-[#7b8ea7] transition-colors hover:bg-[#edf4ff] hover:text-[#1d2f44]"
          >
            {panelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <ThinkingPanel
              toolCalls={toolCalls}
              message={responseMessage}
              userPrompt={userPrompt}
              isThinking={isThinking}
              skills={skills}
              activeSkillIds={activeSkillIds}
              onSkillClick={onSkillClick}
            />
          </div>

          <div className="shrink-0 bg-[linear-gradient(180deg,rgba(247,250,255,0),rgba(247,250,255,0.94)_26%,rgba(247,250,255,1)_100%)]">
            <div className="mx-auto w-full max-w-[780px] px-10 pb-6 pt-2">
              <ChatInput
                onSubmit={onSendMessage}
                disabled={isThinking}
                maxWidthClass=""
              />
            </div>
          </div>
        </div>

        {panelOpen ? (
          <aside className="hidden w-[260px] min-w-[260px] flex-col overflow-y-auto border-l border-[#d7e1ee] bg-white/78 lg:flex">
            <div className="px-5 pb-4 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#8ea1b7]">
                Tasks
              </p>
              <div className="mt-3">
                <TaskPlan tasks={tasks} />
              </div>
            </div>

            <div className="mt-auto border-t border-[#d7e1ee] px-5 py-4">
              <MetaRow label="Status" value={session.active ? "Active" : "Idle"} />
              <MetaRow label="Updated" value={session.age} />
              <MetaRow label="Model" value="claude-opus-4-5" />
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#8ea1b7]">
        {label}
      </span>
      <span className="truncate text-[11.5px] text-[#31445d]">{value}</span>
    </div>
  );
}
