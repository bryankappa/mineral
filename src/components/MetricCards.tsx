"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddSkillModal from "./AddSkillModal";

export default function MetricCards() {
  const [showSkillModal, setShowSkillModal] = useState(false);

  return (
    <>
      <div className="mt-5 grid w-full max-w-[610px] grid-cols-3 gap-4">
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
              className="flex items-center gap-1 text-[12px] text-zinc-600 transition-colors hover:text-zinc-800"
            >
              <Plus size={13} strokeWidth={1.8} />
              <span>Add Skill</span>
            </button>
          }
          chartTone="blue"
        />

        <MetricCard
          label="Agents Online"
          value="0"
          sub="No active agents"
          badge={<span className="ml-2 inline-flex h-2.5 w-2.5 rounded-full bg-zinc-300" />}
          chartTone="green"
        />
      </div>

      {showSkillModal ? (
        <AddSkillModal onClose={() => setShowSkillModal(false)} />
      ) : null}
    </>
  );
}

function MetricCard({
  label,
  value,
  sub,
  action,
  badge,
  chartTone = "blue",
}: {
  label: string;
  value: string;
  sub?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  chartTone?: "blue" | "green";
}) {
  const chartToneClass =
    chartTone === "green"
      ? "from-[#cfd7c6] via-[#e5e9de] to-transparent"
      : "from-[#cdd7f0] via-[#e8edf8] to-transparent";

  return (
    <div className="flex min-h-[202px] flex-col overflow-hidden rounded-[9px] border border-[#ded9d3] bg-[#f4f1ec] shadow-[0_2px_5px_rgba(23,23,23,0.04)]">
      <div className="px-4 pt-4">
        <p className="text-[13px] leading-[1.15] text-zinc-600">{label}</p>
        <div className="mt-2 flex items-center">
          <p className="text-[22px] font-medium leading-none tracking-[-0.02em] text-zinc-900">
            {value}
          </p>
          {badge}
        </div>
        {sub ? <p className="mt-2 text-[11px] text-zinc-500">{sub}</p> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>

      <div className={`relative mt-auto h-[88px] bg-gradient-to-t ${chartToneClass}`}>
        <div className="absolute inset-x-0 bottom-0 h-[56px] bg-gradient-to-t from-white/55 to-transparent" />
        <div className="absolute bottom-[16px] left-4 right-4 h-px bg-zinc-300/75" />
      </div>
    </div>
  );
}
