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

    if (!trimmedValue || disabled) {
      return;
    }

    onSubmit(trimmedValue);
    setValue("");
  };

  return (
    <div className={`w-full ${maxWidthClass}`}>
      <div
        className={`overflow-hidden rounded-[14px] border bg-[#fbfaf8] transition ${
          disabled
            ? "border-[#ddd8d2] opacity-70"
            : "border-[#d8d3cd] shadow-[0_6px_16px_rgba(26,26,26,0.05)]"
        }`}
      >
        <div className="relative min-h-[110px]">
          <textarea
            rows={1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask or build anything"
            disabled={disabled}
            aria-label="Message input"
            className="h-[82px] w-full resize-none bg-transparent px-4 pt-3.5 pb-11 text-[14px] leading-5 text-zinc-700 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
          />

          <div className="absolute inset-x-0 bottom-2 flex items-center justify-between px-3">
            <button
              aria-label="Select model"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-zinc-700 transition-colors hover:bg-white"
            >
              <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full border border-zinc-300 text-[9px] font-semibold text-zinc-400">
                Q
              </span>
              <span>QuantAI</span>
              <ChevronDown size={12} className="text-zinc-400" />
            </button>

            <div className="flex items-center gap-0.5">
              <button
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white hover:text-zinc-700"
                aria-label="Voice input"
              >
                <Mic size={18} strokeWidth={1.75} />
              </button>
              <button
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white hover:text-zinc-700"
                aria-label="Attach file"
              >
                <Paperclip size={18} strokeWidth={1.75} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`rounded-md p-1.5 transition-colors hover:bg-white hover:text-zinc-700 ${
                  canSubmit
                    ? "text-zinc-500 cursor-pointer"
                    : "text-zinc-300 cursor-not-allowed opacity-55"
                }`}
                aria-label="Send message"
              >
                <ArrowUp size={17} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#e4dfda] px-4 py-1.5 text-[12px] font-mono text-zinc-500">
          <span>claude opus 4.5</span>
          <span className="font-medium text-zinc-600">build agent</span>
        </div>
      </div>
    </div>
  );
}
