"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUp, ChevronDown, Mic, Paperclip } from "lucide-react";
import logo from "@/app/Untitled.png";

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
  maxWidthClass?: string;
}

type AgentMode = "ask" | "build";

const subscribeToHydration = () => () => {};
const getClientHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

export default function ChatInput({
  onSubmit,
  disabled,
  maxWidthClass = "max-w-[470px]",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<AgentMode>("build");
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot
  );
  const canSubmit = hydrated && Boolean(value.trim()) && !disabled;

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || disabled) return;
    onSubmit(trimmedValue);
    setValue("");
  };

  return (
    <div className={`w-full ${maxWidthClass}`}>
      <div
        className={`overflow-hidden rounded-[5px] border bg-white/92 shadow-[0_8px_22px_rgba(64,91,124,0.07)] backdrop-blur-sm transition-all duration-200 ${
          disabled
            ? "border-[#dce5f0] opacity-65"
            : "border-[#d7e1ee] hover:border-[#bfd0e5] focus-within:border-[#7da0f6] focus-within:shadow-[0_0_0_1px_rgba(90,130,240,0.18),0_10px_26px_rgba(64,91,124,0.08)]"
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
          className="min-h-[58px] w-full resize-none bg-transparent px-3 pt-3 pb-1 text-[12.5px] leading-5 text-[#31445d] placeholder:text-[#91a0b3] focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 pb-2">
          <button
            aria-label="Select model"
            className="flex items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 text-[12px] transition-colors hover:bg-[#eef4fb]"
          >
            <Image
              src={logo}
              alt=""
              width={18}
              height={18}
              className="shrink-0"
            />
            <span className="font-medium text-[#24344b]">Quartz</span>
            <ChevronDown size={11} className="text-[#91a0b3]" />
          </button>

          <div className="flex items-center gap-1">
            <button
              className="rounded-[4px] p-1.5 text-[#8ea1b7] transition-colors hover:bg-[#eef4fb] hover:text-[#31445d]"
              aria-label="Voice input"
            >
              <Mic size={15} strokeWidth={1.75} />
            </button>
            <button
              className="rounded-[4px] p-1.5 text-[#8ea1b7] transition-colors hover:bg-[#eef4fb] hover:text-[#31445d]"
              aria-label="Attach file"
            >
              <Paperclip size={15} strokeWidth={1.75} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`rounded-[4px] p-1.5 transition-colors ${
                canSubmit
                  ? "cursor-pointer text-[#1e5dd8] hover:bg-[#eef4fb]"
                  : "cursor-not-allowed text-[#c4d1e0]"
              }`}
              aria-label="Send message"
            >
              <ArrowUp size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#dce5f0] bg-[#f3f7fc] px-3 py-1.5 text-[10.5px]">
          <span className="px-1 font-mono text-[#7e91a9]">quantai</span>
          <div
            role="tablist"
            aria-label="Agent mode"
            className="flex items-center gap-1 font-mono text-[10px]"
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
          ? "bg-white text-[#1b4db5] shadow-[0_1px_4px_rgba(64,91,124,0.14)]"
          : "text-[#7e91a9] hover:text-[#31445d]"
      }`}
    >
      {label}
    </button>
  );
}
