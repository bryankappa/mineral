"use client";

import { useState } from "react";
import { Clock3, Search, User } from "lucide-react";
import Image from "next/image";
import logo from "@/app/Untitled.png";
import type { Session } from "@/lib/types";

interface SidebarProps {
  sessions: Session[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLogoClick?: () => void;
}

export default function Sidebar({ sessions, selectedId, onSelect, onLogoClick }: SidebarProps) {
  const [query, setQuery] = useState("");

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(query.toLowerCase()) ||
      session.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const activeSessions = filteredSessions.filter((session) => session.active);
  const inactiveSessions = filteredSessions.filter((session) => !session.active);

  return (
    <aside className="flex h-screen w-[240px] min-w-[240px] flex-col border-r border-zinc-100 bg-white">
      <div className="flex items-center justify-between px-4 pb-4 pt-6">
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="New chat"
          className="-m-1 flex items-center gap-2 rounded-md p-1 text-zinc-900 transition-colors hover:bg-zinc-50"
        >
          <Image src={logo} alt="Logo" width={20} height={20} />
          <span className="text-[13.5px] font-semibold tracking-[-0.01em]">QuantAI</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="View history"
          >
            <Clock3 size={15} strokeWidth={1.7} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100"
            aria-label="User profile"
          >
            <User size={13} className="text-zinc-500" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
          <Search size={13} strokeWidth={1.7} className="shrink-0 text-zinc-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            aria-label="Search sessions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-1">
        {activeSessions.length > 0 ? (
          <SessionGroup
            sessions={activeSessions}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : null}

        {inactiveSessions.length > 0 ? (
          <>
            <div className="px-2 pb-1 pt-4 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
              Inactive
            </div>
            <SessionGroup
              sessions={inactiveSessions}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </>
        ) : null}

        {!filteredSessions.length && query ? (
          <div className="px-2 pt-4 text-[12px] text-zinc-400">No matching sessions</div>
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
    <ul className="flex flex-col gap-px">
      {sessions.map((session) => (
        <li key={session.id}>
          <button
            onClick={() => onSelect(session.id)}
            className={`w-full rounded-lg px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
              selectedId === session.id
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <p className="truncate text-[13px] font-medium leading-[1.35]">{session.title}</p>
            {session.age || session.subtitle ? (
              <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                {session.age}
                {session.age && session.subtitle ? " · " : null}
                {session.subtitle}
              </p>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
