"use client";

import { BookOpen, Boxes } from "lucide-react";

interface MetricCardsProps {
  skillCount: number;
  onOpenSkills: () => void;
  onOpenSandbox: () => void;
}

export default function MetricCards({ skillCount, onOpenSkills, onOpenSandbox }: MetricCardsProps) {
  return (
    <div className="mt-4 grid w-full max-w-[610px] grid-cols-3 gap-3">
      <MetricCard
        label="Databricks Cluster Usage"
        value="--"
        sub="Spin up an isolated env"
        onClick={onOpenSandbox}
        action={
          <span className="flex items-center gap-1 text-[11.5px] text-slate-500">
            <Boxes size={12} strokeWidth={2} />
            <span>Build Sandbox</span>
          </span>
        }
      />

      <MetricCard
        label="Active Skills / SMEs"
        value={String(skillCount)}
        sub="Loaded from skills/"
        action={
          <button
            onClick={onOpenSkills}
            aria-label="Browse the skills library"
            className="flex items-center gap-1 text-[11.5px] text-slate-500 transition-colors hover:text-slate-700"
          >
            <BookOpen size={12} strokeWidth={2} />
            <span>Browse Skills</span>
          </button>
        }
        chartTone="blue"
      />

      <MetricCard
        label="Agents Online"
        // Hardcoded to 1 (the current user). Wire to a presence endpoint when
        // multi-user support lands.
        value="1"
        sub="You're online"
        badge={
          <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-slate-400" />
        }
        chartTone="green"
      />
    </div>
  );
}

function Sparkline({ tone }: { tone: "blue" | "green" | "none" }) {
  if (tone === "none") return null;

  const stroke = "#94a3b8";
  const fillId = `fill-${tone}`;
  const fillStart = "#cbd5e1";

  return (
    <svg
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillStart} stopOpacity="0.55" />
          <stop offset="100%" stopColor={fillStart} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d="M0,38 C8,34 14,22 24,26 C34,30 42,14 54,16 C66,18 76,28 88,22 C100,16 110,20 120,18 L120,44 L0,44 Z"
        fill={`url(#${fillId})`}
      />
      <path
        d="M0,38 C8,34 14,22 24,26 C34,30 42,14 54,16 C66,18 76,28 88,22 C100,16 110,20 120,18"
        fill="none"
        stroke={stroke}
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
      className={`flex min-h-[180px] flex-col overflow-hidden rounded-xl bg-slate-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.025)] ${
        onClick ? "cursor-pointer transition-colors hover:bg-slate-100/70" : ""
      }`}
    >
      <div className="px-4 pt-4">
        <p className="text-[12px] font-medium leading-snug text-slate-500">{label}</p>
        <div className="mt-2 flex items-center">
          <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] text-slate-900">
            {value}
          </p>
          {badge}
        </div>
        {sub ? <p className="mt-1.5 text-[11px] text-slate-400">{sub}</p> : null}
        {action ? <div className="mt-2.5">{action}</div> : null}
      </div>

      <div className="relative mt-auto h-[72px] overflow-hidden">
        {chartTone !== "none" ? (
          <Sparkline tone={chartTone} />
        ) : (
          <div className="absolute inset-x-4 bottom-4 h-px bg-slate-100" />
        )}
      </div>
    </div>
  );
}
