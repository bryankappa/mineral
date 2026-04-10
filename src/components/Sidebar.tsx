"use client";

import { useState } from "react";
import { Clock3, Search, User } from "lucide-react";
import type { Session } from "@/lib/types";

interface SidebarProps {
  sessions: Session[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function Sidebar({ sessions, selectedId, onSelect }: SidebarProps) {
  const [query, setQuery] = useState("");

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(query.toLowerCase()) ||
      session.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const activeSessions = filteredSessions.filter((session) => session.active);
  const inactiveSessions = filteredSessions.filter((session) => !session.active);

  return (
    <aside className="flex h-screen w-[250px] min-w-[250px] flex-col border-r border-[#ddd8d2] bg-[#f4f1ec]">
      <div className="flex items-center justify-between px-5 pb-5 pt-8">
        <div className="flex items-center gap-2 text-zinc-900">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 11.5L8 2l6 9.5"
              stroke="currentColor"
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 14h6"
              stroke="currentColor"
              strokeWidth="1.45"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[14px] font-medium tracking-[-0.01em]">QuantAI</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-0.5 text-zinc-600 transition-colors hover:text-zinc-800"
            aria-label="View history"
          >
            <Clock3 size={16} strokeWidth={1.7} />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8c9b9]"
            aria-label="User profile"
          >
            <User size={15} className="text-[#916842]" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.7}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search sessions..."
            aria-label="Search sessions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent py-1 pl-7 pr-2 text-[15px] text-zinc-700 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mx-5 border-b border-[#d8d3cd]" />

      <div className="min-h-0 flex-1 overflow-y-auto pb-5 pt-2">
        {activeSessions.length > 0 ? (
          <SessionGroup
            sessions={activeSessions}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : null}

        {inactiveSessions.length > 0 ? (
          <>
            <div className="px-5 pb-1 pt-5 text-[12px] text-zinc-500">Inactive</div>
            <div className="mx-5 mb-1 border-b border-[#ddd8d2]" />
            <SessionGroup
              sessions={inactiveSessions}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </>
        ) : null}

        {!filteredSessions.length && query ? (
          <div className="px-5 pt-4 text-[13px] text-zinc-400">No matching sessions</div>
        ) : null}
      </div>
    </aside>
  );
}

function SessionGroup({
  sessions,
  selectedId,
  onSelect,
}: {
  sessions: Session[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col px-1.5">
      {sessions.map((session) => (
        <li key={session.id}>
          <button
            onClick={() => onSelect(session.id)}
            className={`w-full rounded-md px-3.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
              selectedId === session.id ? "bg-white/80" : "hover:bg-white/55"
            }`}
          >
            <p className="truncate text-[15px] leading-[1.3] text-zinc-900">{session.title}</p>
            {session.age || session.subtitle ? (
              <p className="mt-1 truncate text-[13px] text-zinc-500">
                {session.age}
                {session.age && session.subtitle ? (
                  <>
                    {" "}
                    &middot;
                    {" "}
                  </>
                ) : null}
                {session.subtitle}
              </p>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
