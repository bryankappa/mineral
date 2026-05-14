"use client";

import Image from "next/image";
import quartzAvatar from "@/app/Untitled.png";
import type { Skill, ToolCall } from "@/lib/backend";

interface ThinkingPanelProps {
  toolCalls: ToolCall[];
  message: string | null;
  userPrompt: string | null;
  isThinking: boolean;
  skills: Skill[];
  activeSkillIds: string[];
  onSkillClick: (skillId: string) => void;
}

export default function ThinkingPanel({
  toolCalls,
  message,
  userPrompt,
  isThinking,
}: ThinkingPanelProps) {
  const showEmptyState =
    !toolCalls.length && !message && !isThinking && !userPrompt;
  const activeToolLabel = getActiveToolLabel(toolCalls);

  return (
    <div className="transcript-stage relative mx-auto flex w-full max-w-[860px] flex-col px-9 py-9">
      {showEmptyState ? <EmptyTranscript /> : null}
      {userPrompt ? <UserMessage prompt={userPrompt} /> : null}

      {isThinking ? <QuartzThinking label={activeToolLabel} /> : null}
      {message ? <QuartzMessage message={message} /> : null}
    </div>
  );
}

function EmptyTranscript() {
  return (
    <section className="artifact-enter ml-[34px] max-w-[640px] rounded-[5px] border border-[#d7e1ee] bg-white/86 px-3.5 py-3 text-[13px] leading-[1.55] text-[#31445d] shadow-[0_8px_20px_rgba(64,91,124,0.06)]">
      <p className="font-medium text-[#102033]">Mineral is ready.</p>
      <p className="mt-1 text-[#6b7c93]">
        Ask Quartz to inspect, build, compare, or investigate. The session will
        stay compact: conversation first, tools and artifacts only when useful.
      </p>
    </section>
  );
}

function UserMessage({ prompt }: { prompt: string }) {
  return (
    <section className="artifact-enter mb-5 flex justify-end pr-5">
      <div className="flex max-w-[650px] items-start gap-2">
        <div className="rounded-[18px] bg-white px-3.5 py-2.5 text-[13px] leading-[1.5] text-[#31445d] shadow-[0_8px_22px_rgba(64,91,124,0.1)] ring-1 ring-[#d7e1ee]">
          {prompt}
        </div>
        <div className="mt-0.5 h-6 w-6 rounded-full bg-[linear-gradient(135deg,#d8e7ff,#7e9ac6)] ring-2 ring-white" aria-hidden="true" />
      </div>
    </section>
  );
}

function QuartzThinking({ label }: { label: string }) {
  return (
    <section className="artifact-enter mb-4 ml-[34px] max-w-[680px]">
      <div className="flex items-center gap-1.5 text-[12px] text-[#6b7c93]">
        <span>Task</span>
        <span className="rounded bg-[#edf3fb] px-1.5 py-0.5 font-mono text-[11px] text-[#31445d]">
          {label}
        </span>
        <span aria-hidden="true">—</span>
        <div className="quartz-thinking-text relative h-[18px] min-w-[330px] overflow-hidden italic text-[#7e91a9]">
          <span>Explore the request and relevant context</span>
          <span>Gather source material and prepare the response</span>
          <span>Check the answer shape before posting</span>
        </div>
      </div>
    </section>
  );
}

function QuartzMessage({ message }: { message: string }) {
  return (
    <section className="artifact-enter mb-6 flex max-w-[720px] items-start gap-2.5">
      <QuartzAvatar />
      <div className="min-w-0 flex-1 rounded-[5px] border border-[#d7e1ee] bg-white/92 px-3.5 py-3 text-[13px] leading-[1.58] text-[#31445d] shadow-[0_8px_22px_rgba(64,91,124,0.07)]">
        <AnswerArtifact message={message} />
      </div>
    </section>
  );
}

function QuartzAvatar() {
  return (
    <Image
      src={quartzAvatar}
      alt="Quartz"
      width={24}
      height={24}
      className="mt-0.5 rounded-full ring-2 ring-white"
    />
  );
}

function AnswerArtifact({ message }: { message: string }) {
  const normalizedMessage = message
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
  return <div className="prose-mineral whitespace-pre-wrap">{normalizedMessage}</div>;
}

function getActiveToolLabel(toolCalls: ToolCall[]): string {
  const activeTool =
    toolCalls.find((toolCall) => toolCall.status === "running") ??
    toolCalls.at(-1);

  if (!activeTool) return "explore";

  const lower = activeTool.toolName.toLowerCase();
  if (lower.includes("sql") || lower.includes("query")) return "query";
  if (lower.includes("search")) return "search";
  if (lower.includes("read") || lower.includes("document")) return "read";
  if (lower.includes("code") || lower.includes("shell")) return "run";
  return "explore";
}
