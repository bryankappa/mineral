"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddSkillModal from "./AddSkillModal";

export default function MetricCards() {
  const [showSkillModal, setShowSkillModal] = useState(false);

  return (
    <>
      <div className="mt-4 grid w-full max-w-[610px] grid-cols-3 gap-3">
        <MetricCard
          label="Databricks Cluster Usage"
          value="--"
          sub="Awaiting telemetry"
        />

        <MetricCard
          label="Active Skills / SMEs"
          value="0"
          sub="No modules loaded"
          action={
            <button
              onClick={() => setShowSkillModal(true)}
              aria-label="Add a new skill or SME module"
              className="flex items-center gap-1 text-[11.5px] text-zinc-500 transition-colors hover:text-zinc-700"
            >
              <Plus size={12} strokeWidth={2} />
              <span>Add Skill</span>
            </button>
          }
          chartTone="blue"
        />

        <MetricCard
          label="Agents Online"
          value="0"
          sub="No active agents"
          badge={
            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-zinc-300" />
          }
          chartTone="green"
        />
      </div>

      {showSkillModal ? (
        <AddSkillModal onClose={() => setShowSkillModal(false)} />
      ) : null}
    </>
  );
}

function Sparkline({ tone }: { tone: "blue" | "green" | "none" }) {
  if (tone === "none") return null;

  const stroke = tone === "blue" ? "#a5b9f8" : "#86c68e";
  const fillId = `fill-${tone}`;
  const fillStart = tone === "blue" ? "#c7d6fc" : "#b8e3be";

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
}: {
  label: string;
  value: string;
  sub?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  chartTone?: "blue" | "green" | "none";
}) {
  return (
    <div className="flex min-h-[180px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="px-4 pt-4">
        <p className="text-[12px] font-medium leading-snug text-zinc-500">{label}</p>
        <div className="mt-2 flex items-center">
          <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] text-zinc-900">
            {value}
          </p>
          {badge}
        </div>
        {sub ? <p className="mt-1.5 text-[11px] text-zinc-400">{sub}</p> : null}
        {action ? <div className="mt-2.5">{action}</div> : null}
      </div>

      <div className="relative mt-auto h-[72px] overflow-hidden">
        {chartTone !== "none" ? (
          <Sparkline tone={chartTone} />
        ) : (
          <div className="absolute inset-x-4 bottom-4 h-px bg-zinc-100" />
        )}
      </div>
    </div>
  );
}
