"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUp, ChevronDown, Paperclip } from "lucide-react";
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
        className={`overflow-hidden rounded-[18px] border bg-white shadow-[0_18px_42px_rgba(31,45,61,0.08),0_2px_8px_rgba(31,45,61,0.04)] transition-all duration-200 ${
          disabled
            ? "border-[#dce5f0] opacity-65"
            : "border-[#ccd6e3] hover:border-[#b9c8d9] focus-within:border-[#8facf6] focus-within:shadow-[0_0_0_3px_rgba(90,130,240,0.12),0_20px_48px_rgba(31,45,61,0.1)]"
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
          className="min-h-[46px] w-full resize-none bg-transparent px-4 pt-3 pb-0 text-[14px] leading-5 text-[#25364c] placeholder:text-[#91a0b3] focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 pb-1.5">
          <button
            aria-label="Select model"
            className="flex h-8 items-center gap-1.5 rounded-[10px] px-2 text-[13px] transition-colors hover:bg-[#f0f5fb]"
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
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#8ea1b7] transition-colors hover:bg-[#f0f5fb] hover:text-[#31445d]"
              aria-label="Attach file"
            >
              <Paperclip size={15} strokeWidth={1.75} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors ${
                canSubmit
                  ? "cursor-pointer text-[#1e5dd8] hover:bg-[#f0f5fb]"
                  : "cursor-not-allowed text-[#c4d1e0]"
              }`}
              aria-label="Send message"
            >
              <ArrowUp size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-2 text-[10.5px]">
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
          ? "bg-[#eef4ff] text-[#1b4db5] shadow-[inset_0_0_0_1px_rgba(90,130,240,0.14)]"
          : "text-[#7e91a9] hover:text-[#31445d]"
      }`}
    >
      {label}
    </button>
  );
}
