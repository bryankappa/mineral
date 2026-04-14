"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronRight, Sparkles, Zap } from "lucide-react";
import type { Skill, ToolCall } from "@/lib/backend";

interface ThinkingPanelProps {
  toolCalls: ToolCall[];
  message: string | null;
  isThinking: boolean;
  skills: Skill[];
  activeSkillIds: string[];
  onSkillClick: (skillId: string) => void;
}

export default function ThinkingPanel({
  toolCalls,
  message,
  isThinking,
  skills,
  activeSkillIds,
  onSkillClick,
}: ThinkingPanelProps) {
  const showEmptyState = !toolCalls.length && !message && !isThinking;
  const activeSkills = activeSkillIds
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => s != null);

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col gap-4 px-8 py-8">
      {showEmptyState ? (
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-5 py-6 text-[13px] text-zinc-400">
          No activity yet. Send a prompt to start a QuantAI session.
        </div>
      ) : null}

      {activeSkills.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
            <Sparkles size={10} className="text-amber-400" />
            Skills in use
          </span>
          {activeSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => onSkillClick(skill.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              {skill.title}
            </button>
          ))}
        </div>
      ) : null}

      {toolCalls.map((toolCall) => (
        <ToolCallRow key={toolCall.id} call={toolCall} />
      ))}

      {isThinking ? (
        <div className="flex items-center gap-3 px-4 py-3" aria-live="polite">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
          </div>
          <span className="text-xs text-zinc-400">Processing...</span>
        </div>
      ) : null}

      {message ? (
        <div className="mt-2 flex gap-3">
          <div
            className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100"
            aria-label="QuantAI Assistant"
          >
            <Bot size={14} className="text-zinc-600" />
          </div>
          <div className="whitespace-pre-wrap rounded-[14px] border border-zinc-200 bg-white px-5 py-4 text-[14px] leading-6 text-zinc-700 shadow-sm">
            {message}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolCallRow({ call }: { call: ToolCall }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-[12px] border border-zinc-200 bg-white shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`Tool call: ${formatToolName(call.toolName)}`}
        className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50"
      >
        {expanded ? (
          <ChevronDown size={14} className="text-zinc-400" />
        ) : (
          <ChevronRight size={14} className="text-zinc-400" />
        )}
        <Zap size={14} className="text-amber-500" />
        <span className="text-sm font-medium text-zinc-700">
          {formatToolName(call.toolName)}
        </span>
        {call.status === "running" ? (
          <span className="ml-auto flex gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
          </span>
        ) : (
          <span className="ml-auto font-mono text-xs text-zinc-400">
            {call.durationMs}ms
          </span>
        )}
      </button>

      {expanded ? (
        <div className="space-y-3 border-t border-zinc-100 bg-zinc-50 px-4 py-3">
          <div>
            <span className="text-xs text-zinc-400">Input:</span>
            <pre className="mt-1 overflow-x-auto rounded-md border border-zinc-100 bg-white p-2 font-mono text-xs text-zinc-600">
              <code>{JSON.stringify(call.input, null, 2)}</code>
            </pre>
          </div>
          <div>
            <span className="text-xs text-zinc-400">Output:</span>
            <pre className="mt-1 overflow-x-auto rounded-md border border-zinc-100 bg-white p-2 font-mono text-xs text-zinc-600">
              <code>{call.output}</code>
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatToolName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
