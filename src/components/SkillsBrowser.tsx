"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Sparkles, X } from "lucide-react";
import type { Skill } from "@/lib/backend";

interface SkillsBrowserProps {
  skills: Skill[];
  focusSkillId?: string | null;
  onClose: () => void;
  onRunExample: (prompt: string) => void;
}

export default function SkillsBrowser({
  skills,
  focusSkillId,
  onClose,
  onRunExample,
}: SkillsBrowserProps) {
  const focused = focusSkillId
    ? skills.find((s) => s.id === focusSkillId) ?? null
    : null;
  const [selectedDomain, setSelectedDomain] = useState<string>(
    focused ? focused.domain : "All"
  );
  const [expandedId, setExpandedId] = useState<string | null>(
    focused ? focused.id : null
  );

  const domains = useMemo(() => {
    const counts = new Map<string, number>();
    for (const skill of skills) {
      counts.set(skill.domain, (counts.get(skill.domain) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [skills]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filteredSkills =
    selectedDomain === "All"
      ? skills
      : skills.filter((s) => s.domain === selectedDomain);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Skills Library"
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[82vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <h2 className="text-[14px] font-semibold text-zinc-900">
              Skills Library
            </h2>
            <span className="text-[12px] text-zinc-400">
              · {skills.length} skill{skills.length === 1 ? "" : "s"} loaded
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className="w-[220px] shrink-0 border-r border-zinc-100 bg-zinc-50/50 py-4">
            <DomainFilter
              label="All skills"
              count={skills.length}
              selected={selectedDomain === "All"}
              onClick={() => setSelectedDomain("All")}
            />
            {domains.map(([domain, count]) => (
              <DomainFilter
                key={domain}
                label={domain}
                count={count}
                selected={selectedDomain === domain}
                onClick={() => setSelectedDomain(domain)}
              />
            ))}
          </aside>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {filteredSkills.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-[12px] text-zinc-400">
                No skills in this domain yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    expanded={expandedId === skill.id}
                    onToggle={() =>
                      setExpandedId(expandedId === skill.id ? null : skill.id)
                    }
                    onRunExample={(prompt) => {
                      onRunExample(prompt);
                      onClose();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainFilter({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between px-5 py-1.5 text-left text-[12.5px] transition-colors ${
        selected
          ? "bg-zinc-900/5 font-semibold text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100/60"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="ml-2 font-mono text-[10.5px] text-zinc-400">{count}</span>
    </button>
  );
}

function SkillCard({
  skill,
  expanded,
  onToggle,
  onRunExample,
}: {
  skill: Skill;
  expanded: boolean;
  onToggle: () => void;
  onRunExample: (prompt: string) => void;
}) {
  const disabled = !skill.enabled;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[14px] border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-opacity ${
        disabled ? "border-zinc-100 opacity-75" : "border-zinc-200"
      }`}
    >
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[13.5px] font-semibold leading-snug text-zinc-900">
            {skill.title}
          </h3>
          <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            {skill.domain}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.5] text-zinc-500">
          {skill.description}
        </p>

        {disabled ? (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-amber-700">
            <span className="inline-block h-1 w-1 rounded-full bg-amber-500" />
            Tools not yet wired
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-1.5">
            {skill.examples.slice(0, 3).map((example, idx) => (
              <button
                key={idx}
                onClick={() => onRunExample(example)}
                className="group flex items-start gap-1.5 rounded-lg border border-zinc-100 bg-zinc-50 px-2.5 py-1.5 text-left text-[11.5px] leading-[1.4] text-zinc-600 transition-all hover:border-zinc-300 hover:bg-white hover:text-zinc-900"
              >
                <Sparkles
                  size={10}
                  className="mt-[3px] shrink-0 text-amber-400 transition-colors group-hover:text-amber-500"
                />
                <span className="flex-1">{example}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 border-t border-zinc-100 px-4 py-2 text-left text-[11px] text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
      >
        {expanded ? (
          <ChevronDown size={11} />
        ) : (
          <ChevronRight size={11} />
        )}
        <span>{expanded ? "Hide details" : "View details"}</span>
      </button>

      {expanded ? (
        <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap border-t border-zinc-100 bg-zinc-50/60 px-4 py-3 font-mono text-[11px] leading-[1.55] text-zinc-600">
          {skill.body || "No detailed documentation provided."}
        </pre>
      ) : null}
    </div>
  );
}
