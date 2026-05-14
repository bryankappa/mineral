"use client";

import { useCallback, useEffect } from "react";
import { Boxes, Plus, X } from "lucide-react";

interface SandboxBrowserProps {
  onClose: () => void;
}

export default function SandboxBrowser({ onClose }: SandboxBrowserProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sandboxes"
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[82vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Boxes size={14} className="text-slate-500" />
            <h2 className="text-[14px] font-semibold text-slate-900">Sandboxes</h2>
            <span className="text-[12px] text-slate-400">· Databricks compute</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="dot-pattern absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
            <Boxes size={20} strokeWidth={1.5} />
          </div>
          <h3 className="relative z-10 mt-4 text-[14px] font-semibold text-slate-900">
            No sandboxes yet
          </h3>
          <p className="relative z-10 mt-1.5 max-w-[380px] text-center text-[12.5px] leading-[1.55] text-slate-500">
            Spin up an isolated environment on your Databricks cluster to let
            agents run code, shell commands, and notebooks without touching the
            host.
          </p>
          <button
            disabled
            className="relative z-10 mt-5 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-400"
          >
            <Plus size={12} strokeWidth={2} />
            New sandbox
          </button>
          <p className="relative z-10 mt-3 text-[11px] text-slate-400">
            Not yet wired — placeholder UI.
          </p>
        </div>
      </div>
    </div>
  );
}
