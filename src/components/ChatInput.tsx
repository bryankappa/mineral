"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ChevronDown, Mic, Paperclip } from "lucide-react";
import logo from "@/app/Untitled.png";

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
  maxWidthClass?: string;
}

type AgentMode = "ask" | "build";

export default function ChatInput({
  onSubmit,
  disabled,
  maxWidthClass = "max-w-[610px]",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<AgentMode>("build");
  const canSubmit = Boolean(value.trim()) && !disabled;

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || disabled) return;
    onSubmit(trimmedValue);
    setValue("");
  };

  return (
    <div className={`w-full ${maxWidthClass}`}>
      <div
        className={`overflow-hidden rounded-2xl border bg-white transition-all duration-150 ${
          disabled
            ? "border-slate-200 opacity-60"
            : "border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06)]"
        }`}
      >
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask or build anything"
          disabled={disabled}
          aria-label="Message input"
          className="min-h-[72px] w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[14px] leading-6 text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <button
            aria-label="Select model"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-slate-50"
          >
            <Image
              src={logo}
              alt=""
              width={18}
              height={18}
              className="shrink-0"
            />
            <span className="font-medium text-slate-700">Quartz</span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          <div className="flex items-center gap-1">
            <button
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              aria-label="Voice input"
            >
              <Mic size={15} strokeWidth={1.75} />
            </button>
            <button
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              aria-label="Attach file"
            >
              <Paperclip size={15} strokeWidth={1.75} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`rounded-lg p-1.5 transition-colors ${
                canSubmit
                  ? "cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  : "cursor-not-allowed text-slate-300"
              }`}
              aria-label="Send message"
            >
              <ArrowUp size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-100/70 px-3 py-1.5 text-[11px]">
          <span className="px-1 font-mono text-slate-400">quantai</span>
          <div
            role="tablist"
            aria-label="Agent mode"
            className="flex items-center gap-0.5 rounded-md bg-slate-200/60 p-0.5"
          >
            <ModeTab
              label="ask"
              active={mode === "ask"}
              onClick={() => setMode("ask")}
            />
            <ModeTab
              label="build"
              active={mode === "build"}
              onClick={() => setMode("build")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded px-2 py-0.5 text-[10.5px] font-medium transition-colors ${
        active
          ? "bg-white text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
