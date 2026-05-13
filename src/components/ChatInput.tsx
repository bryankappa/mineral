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
        className={`overflow-hidden rounded-[28px] border bg-white/82 backdrop-blur-xl transition-all duration-200 ${
          disabled
            ? "border-[#d7e1ee] opacity-65"
            : "border-[#d7e1ee] shadow-[0_18px_44px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#b9cde4] hover:shadow-[0_24px_54px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.92)] focus-within:border-[#1e5dd8] focus-within:shadow-[0_0_0_4px_rgba(30,93,216,0.12),0_24px_54px_rgba(15,23,42,0.12)]"
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
          className="min-h-[72px] w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[14px] leading-6 text-[#31445d] placeholder:text-[#91a0b3] focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <button
            aria-label="Select model"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-[#edf4ff]"
          >
            <Image
              src={logo}
              alt=""
              width={18}
              height={18}
              className="shrink-0"
            />
            <span className="font-medium text-[#1d2f44]">Quartz</span>
            <ChevronDown size={11} className="text-[#8aa0bc]" />
          </button>

          <div className="flex items-center gap-1">
            <button
              className="rounded-lg p-1.5 text-[#7b8ea7] transition-colors hover:bg-[#edf4ff] hover:text-[#1d2f44]"
              aria-label="Voice input"
            >
              <Mic size={15} strokeWidth={1.75} />
            </button>
            <button
              className="rounded-lg p-1.5 text-[#7b8ea7] transition-colors hover:bg-[#edf4ff] hover:text-[#1d2f44]"
              aria-label="Attach file"
            >
              <Paperclip size={15} strokeWidth={1.75} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`rounded-lg p-1.5 transition-colors ${
                canSubmit
                  ? "cursor-pointer text-[#1e5dd8] hover:bg-[#edf4ff] hover:text-[#1b4db5]"
                  : "cursor-not-allowed text-[#c4d1e0]"
              }`}
              aria-label="Send message"
            >
              <ArrowUp size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#dce5f0] bg-[linear-gradient(180deg,rgba(237,243,250,0.92),rgba(246,249,253,0.98))] px-3 py-1.5 text-[11px]">
          <span className="px-1 font-mono text-[#7e91a9]">quantai</span>
          <div
            role="tablist"
            aria-label="Agent mode"
            className="flex items-center gap-0.5 rounded-md bg-[#d9e4f1]/70 p-0.5"
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
          ? "bg-white text-[#1b4db5] shadow-[0_8px_18px_rgba(15,23,42,0.08)]"
          : "text-[#6b7c93] hover:text-[#1d2f44]"
      }`}
    >
      {label}
    </button>
  );
}
