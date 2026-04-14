"use client";

import { useState } from "react";
import { ArrowUp, ChevronDown, Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
  maxWidthClass?: string;
}

export default function ChatInput({
  onSubmit,
  disabled,
  maxWidthClass = "max-w-[610px]",
}: ChatInputProps) {
  const [value, setValue] = useState("");
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
            ? "border-zinc-200 opacity-60"
            : "border-zinc-200 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
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
          className="min-h-[72px] w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[14px] leading-6 text-zinc-800 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <button
            aria-label="Select model"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-zinc-50"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-zinc-100 text-[9px] font-semibold text-zinc-600">
              Q
            </span>
            <span className="font-medium text-zinc-600">QuantAI</span>
            <ChevronDown size={11} className="text-zinc-400" />
          </button>

          <div className="flex items-center gap-0.5">
            <button
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
              aria-label="Voice input"
            >
              <Mic size={16} strokeWidth={1.75} />
            </button>
            <button
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
              aria-label="Attach file"
            >
              <Paperclip size={16} strokeWidth={1.75} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`ml-0.5 rounded-full p-1.5 transition-all duration-150 ${
                canSubmit
                  ? "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-700"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300"
              }`}
              aria-label="Send message"
            >
              <ArrowUp size={15} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2 text-[11px]">
          <span className="font-mono text-zinc-400">claude opus 4.5</span>
          <span className="font-medium text-zinc-500">build agent</span>
        </div>
      </div>
    </div>
  );
}
