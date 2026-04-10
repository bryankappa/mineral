"use client";

import { useCallback, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface AddSkillModalProps {
  onClose: () => void;
}

export default function AddSkillModal({ onClose }: AddSkillModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Skills"
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex w-[380px] flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 pb-3 pt-4">
          <h2 className="text-sm font-semibold text-zinc-900">Skills</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-[20px] border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white">
              <Plus size={16} className="text-zinc-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-700">
              No skill modules yet
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Connect QuantAI to Databricks when you are ready to load SMEs and
              skill modules here.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
