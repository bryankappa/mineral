"use client";

import { BookOpen, Boxes } from "lucide-react";

interface MetricCardsProps {
  skillCount: number;
  onOpenSkills: () => void;
  onOpenSandbox: () => void;
}

export default function MetricCards({ skillCount, onOpenSkills, onOpenSandbox }: MetricCardsProps) {
  return (
    <div className="mt-3 grid w-full max-w-[470px] grid-cols-3 gap-2.5">
      <MetricCard
        label="Sandbox capacity"
        value="--"
        sub="Isolated execution"
        onClick={onOpenSandbox}
        action={
          <span className="flex items-center gap-1 text-[11.5px] text-[#5f738d]">
            <Boxes size={12} strokeWidth={2} />
            <span>Build sandbox</span>
          </span>
        }
      />

      <MetricCard
        label="Skills loaded"
        value={String(skillCount)}
        sub="Available tools"
        action={
          <button
            onClick={onOpenSkills}
            aria-label="Browse the skills library"
            className="flex items-center gap-1 text-[11.5px] text-[#5f738d] transition-colors hover:text-[#1d2f44]"
          >
            <BookOpen size={12} strokeWidth={2} />
            <span>Browse skills</span>
          </button>
        }
        chartTone="blue"
      />

      <MetricCard
        label="Agents online"
        // Hardcoded to 1 (the current user). Wire to a presence endpoint when
        // multi-user support lands.
        value="1"
        sub="Ready"
        badge={
          <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-[#4b9b7c] shadow-[0_0_0_4px_rgba(75,155,124,0.14)]" />
        }
        chartTone="green"
      />
    </div>
  );
}

function Sparkline({ tone }: { tone: "blue" | "green" | "none" }) {
  if (tone === "none") return null;

  const palette =
    tone === "green"
      ? { stroke: "#3b8066", fillStart: "#61b192" }
      : { stroke: "#3f6ed8", fillStart: "#6f95ee" };
  const fillId = `fill-${tone}`;

  return (
    <svg
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.fillStart} stopOpacity="0.42" />
          <stop offset="100%" stopColor={palette.fillStart} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d="M0,38 C8,34 14,22 24,26 C34,30 42,14 54,16 C66,18 76,28 88,22 C100,16 110,20 120,18 L120,44 L0,44 Z"
        fill={`url(#${fillId})`}
      />
      <path
        d="M0,38 C8,34 14,22 24,26 C34,30 42,14 54,16 C66,18 76,28 88,22 C100,16 110,20 120,18"
        fill="none"
        stroke={palette.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  sub,
  action,
  badge,
  chartTone = "none",
  onClick,
}: {
  label: string;
  value: string;
  sub?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  chartTone?: "blue" | "green" | "none";
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex min-h-[148px] flex-col overflow-hidden rounded-[5px] border border-[#d9e2ed] bg-[#f7f9fc]/92 shadow-[0_8px_22px_rgba(64,91,124,0.07)] backdrop-blur-sm transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:-translate-y-px hover:border-[#bfd0e5] hover:bg-white/96"
          : ""
      }`}
    >
      <div className="px-3 pt-3">
        <p className="text-[11.5px] font-medium leading-snug text-[#657891]">{label}</p>
        <div className="mt-2 flex items-center">
          <p className="text-[22px] font-medium leading-none tracking-[-0.03em] text-[#102033]">
            {value}
          </p>
          {badge}
        </div>
        {sub ? <p className="mt-1.5 text-[11px] text-[#8ea1b7]">{sub}</p> : null}
        {action ? <div className="mt-2.5">{action}</div> : null}
      </div>

      <div className="relative mt-auto h-[54px] overflow-hidden bg-gradient-to-b from-transparent to-[#f1f5fa]">
        {chartTone !== "none" ? (
          <Sparkline tone={chartTone} />
        ) : (
          <div className="absolute inset-x-4 bottom-4 h-px bg-[#d7e1ee]" />
        )}
      </div>
    </div>
  );
}
