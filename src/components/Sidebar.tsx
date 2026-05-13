"use client";

import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Search, User } from "lucide-react";
import Image from "next/image";
import logo from "@/app/Untitled.png";
import type { Session } from "@/lib/types";

interface SidebarProps {
  sessions: Session[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLogoClick?: () => void;
}

const STORAGE_KEY = "mineral.sidebar.expanded";

export default function Sidebar({
  sessions,
  selectedId,
  onSelect,
  onLogoClick,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing persisted UI state from localStorage
    if (saved === "1") setExpanded(true);
  }, []);

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      }
      return next;
    });
  };

  if (!expanded) {
    return (
      <aside className="flex h-screen w-[56px] min-w-[56px] flex-col items-center border-r border-[#d7e1ee] bg-white/75 py-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="New chat"
          title="New chat"
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#edf4ff]"
        >
          <Image src={logo} alt="Mineral" width={18} height={18} />
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="mt-2 flex h-8 w-8 items-center justify-center rounded-md text-[#7b8ea7] transition-colors hover:bg-[#edf4ff] hover:text-[#1d2f44]"
        >
          <PanelLeftOpen size={15} strokeWidth={1.7} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          aria-label="User profile"
          title="Profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf3fb] text-[#5f738d] transition-colors hover:bg-[#dce8ff]"
        >
          <User size={13} strokeWidth={1.7} />
        </button>
      </aside>
    );
  }

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(query.toLowerCase())
  );

  const activeSessions = filteredSessions.filter((s) => s.active);
  const inactiveSessions = filteredSessions.filter((s) => !s.active);

  return (
    <aside className="flex h-screen w-[220px] min-w-[220px] flex-col border-r border-[#d7e1ee] bg-white/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-3 pb-3 pt-4">
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="New chat"
          className="-m-1 flex items-center gap-2 rounded-md p-1 text-[#102033] transition-colors hover:bg-[#edf4ff]"
        >
          <Image src={logo} alt="Logo" width={18} height={18} />
          <span className="text-[13px] font-semibold tracking-[-0.01em]">Mineral</span>
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="rounded-md p-1 text-[#7b8ea7] transition-colors hover:bg-[#edf4ff] hover:text-[#1d2f44]"
        >
          <PanelLeftClose size={14} strokeWidth={1.7} />
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-xl border border-[#d7e1ee] bg-white/78 px-3 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
          <Search size={12} strokeWidth={1.7} className="shrink-0 text-[#8aa0bc]" />
          <input
            type="text"
            placeholder="Search"
            aria-label="Search sessions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[12px] text-[#31445d] placeholder:text-[#91a0b3] focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-3 pt-1">
        {activeSessions.length > 0 ? (
          <SessionGroup
            sessions={activeSessions}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : null}

        {inactiveSessions.length > 0 ? (
          <>
            <div className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8ea1b7]">
              Inactive
            </div>
            <SessionGroup
              sessions={inactiveSessions}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </>
        ) : null}

        {!filteredSessions.length ? (
          <div className="px-2 pt-4 text-[11.5px] text-[#7e91a9]">
            {query ? "No matching sessions" : "No sessions yet"}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-t border-[#d7e1ee] px-3 py-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#edf3fb]">
          <User size={11} className="text-[#5f738d]" strokeWidth={1.7} />
        </div>
        <span className="text-[11.5px] text-[#5f738d]">You</span>
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
            className={`w-full rounded-md px-2.5 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5d8f3] ${
              selectedId === session.id
                ? "bg-[#dce8ff] text-[#1b4db5] shadow-[inset_0_0_0_1px_rgba(30,93,216,0.1)]"
                : "text-[#31445d] hover:bg-white/85"
            }`}
          >
            <p className="truncate text-[12px] font-medium leading-[1.35]">{session.title}</p>
            {session.age ? (
              <p className="mt-0.5 truncate text-[10.5px] text-[#8ea1b7]">{session.age}</p>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
