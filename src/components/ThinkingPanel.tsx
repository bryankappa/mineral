"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  skills,
  activeSkillIds,
  onSkillClick,
}: ThinkingPanelProps) {
  const showEmptyState =
    !toolCalls.length && !message && !isThinking && !userPrompt;
  const activeSkills = activeSkillIds
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => s != null);

  return (
    <div className="mx-auto flex w-full max-w-[780px] flex-col px-10 py-12">
      {showEmptyState ? (
        <p className="text-[13px] italic text-[#6b7c93]">
          No activity yet. Send a prompt to start a Mineral session.
        </p>
      ) : null}

      {userPrompt ? (
        <div className="mb-8 flex items-start gap-3">
          <Image
            src={quartzAvatar}
            alt="Quartz"
            width={22}
            height={22}
            className="mt-[2px] rounded-full"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#102033]">
              Quartz
            </span>
            <p className="whitespace-pre-wrap text-[14px] leading-[1.55] text-[#31445d]">
              {userPrompt}
            </p>
          </div>
        </div>
      ) : null}

      {activeSkills.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-x-2 text-[11px] text-[#7e91a9]">
          <span className="font-mono uppercase tracking-[0.09em] text-[#8ea1b7]">
            skills
          </span>
          {activeSkills.map((skill, idx) => (
            <span key={skill.id} className="flex items-center gap-2">
              {idx > 0 ? <span className="text-[#c6d3e2]">·</span> : null}
              <button
                onClick={() => onSkillClick(skill.id)}
                className="text-[#5f738d] transition-colors hover:text-[#102033]"
              >
                {skill.title}
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {toolCalls.length > 0 || isThinking ? (
        <div className="relative border-l border-[#dce5f0] pl-5">
          {toolCalls.map((call) => (
            <ToolCallLine key={call.id} call={call} />
          ))}

          {isThinking && toolCalls.every((c) => c.status === "complete") ? (
            <div className="relative py-2">
              <Dot running />
              <span className="shimmer-text text-[12.5px] font-medium">
                Thinking
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {message ? (
        <div className="mt-10">
          <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.09em] text-[#8ea1b7]">
            answer
          </p>
          <div className="whitespace-pre-wrap text-[14.5px] leading-[1.65] text-[#1b2f43]">
            {message}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolCallLine({ call }: { call: ToolCall }) {
  const [expanded, setExpanded] = useState(false);
  const running = call.status === "running";
  const displayName = formatToolName(call.toolName);
  const inputPreview = previewInput(call.input);

  return (
    <div className="relative">
      <Dot running={running} />
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="group flex w-full items-baseline gap-2 py-2 text-left"
      >
        {expanded ? (
          <ChevronDown
            size={11}
            strokeWidth={2}
            className="translate-y-[1px] text-[#c1cedc] transition-colors group-hover:text-[#6b7c93]"
          />
        ) : (
          <ChevronRight
            size={11}
            strokeWidth={2}
            className="translate-y-[1px] text-[#c1cedc] transition-colors group-hover:text-[#6b7c93]"
          />
        )}
        <span
          className={`text-[12.5px] font-medium ${
            running ? "shimmer-text" : "text-[#31445d]"
          }`}
        >
          {displayName}
        </span>
        {inputPreview ? (
          <span className="truncate font-mono text-[11px] text-[#8ea1b7]">
            {inputPreview}
          </span>
        ) : null}
        <span className="ml-auto shrink-0 font-mono text-[10.5px] text-[#8ea1b7]">
          {running ? "running" : `${call.durationMs}ms`}
        </span>
      </button>

      {expanded ? (
        <div className="space-y-3 pb-3 pl-5 pt-1">
          {Object.keys(call.input).length > 0 ? (
            <Block label="Input">
              <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-[1.55] text-[#31445d]">
                {formatInput(call.input)}
              </pre>
            </Block>
          ) : null}
          {call.output ? (
            <Block label="Output">
              <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap font-mono text-[11.5px] leading-[1.55] text-[#5f738d]">
                {call.output}
              </pre>
            </Block>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Dot({ running }: { running: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-[-23px] top-[13px] h-[6px] w-[6px] rounded-full ${
        running ? "animate-pulse bg-[#1e5dd8]" : "bg-[#c3d2e3]"
      }`}
    />
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.09em] text-[#8ea1b7]">
        {label}
      </p>
      {children}
    </div>
  );
}

function formatToolName(name: string): string {
  return name.replace(/_/g, " ");
}

function previewInput(input: Record<string, unknown>): string {
  if (!input || Object.keys(input).length === 0) return "";
  const sql = input.sql;
  if (typeof sql === "string") return sql.replace(/\s+/g, " ").slice(0, 60);
  const query = input.query;
  if (typeof query === "string") return query.slice(0, 60);
  const raw = input._raw;
  if (typeof raw === "string") return raw.slice(0, 60);
  return "";
}

function formatInput(input: Record<string, unknown>): string {
  const sql = input.sql;
  if (typeof sql === "string") return sql;
  return JSON.stringify(input, null, 2);
}
