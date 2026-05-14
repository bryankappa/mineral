"use client";

import { useCallback, useEffect, useState } from "react";
import ChatInput from "@/components/ChatInput";
import MetricCards from "@/components/MetricCards";
import SessionDetail from "@/components/SessionDetail";
import Sidebar from "@/components/Sidebar";
import SandboxBrowser from "@/components/SandboxBrowser";
import SkillsBrowser from "@/components/SkillsBrowser";
import { callMineralBackend, fetchSkills } from "@/lib/backend";
import type { Skill, Task, ToolCall } from "@/lib/backend";
import type { Session } from "@/lib/types";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeSkillIds, setActiveSkillIds] = useState<string[]>([]);
  const [showSkills, setShowSkills] = useState(false);
  const [focusSkillId, setFocusSkillId] = useState<string | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? null;

  useEffect(() => {
    let cancelled = false;
    fetchSkills()
      .then((loaded) => {
        if (!cancelled) setSkills(loaded);
      })
      .catch((err) => console.error("Failed to fetch skills:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenSkills = useCallback((skillId?: string) => {
    setFocusSkillId(skillId ?? null);
    setShowSkills(true);
  }, []);

  const handleLogoClick = useCallback(() => {
    setSelectedSessionId(null);
    setToolCalls([]);
    setResponseMessage(null);
    setUserPrompt(null);
    setActiveSkillIds([]);
    setTasks([]);
    setIsThinking(false);
  }, []);

  const handleSendMessage = useCallback(
    async (prompt: string) => {
      const sessionId =
        selectedSessionId ??
        globalThis.crypto?.randomUUID?.() ??
        `session-${Date.now()}`;

      if (!selectedSessionId) {
        setSessions((previousSessions) => [
          {
            id: sessionId,
            title: toSessionTitle(prompt),
            age: "now",
            active: true,
          },
          ...previousSessions,
        ]);
        setSelectedSessionId(sessionId);
      }

      setIsThinking(true);
      setToolCalls([]);
      setResponseMessage(null);
      setUserPrompt(prompt);
      setActiveSkillIds([]);
      setTasks([]);

      // Accumulate raw input JSON per tool call id
      const inputBuffers: Record<string, string> = {};

      await callMineralBackend(prompt, {
        onSkillsActivated: (ids) => {
          setActiveSkillIds(ids);
        },
        onTaskPlan: (titles) => {
          setTasks(
            titles.map((title, idx) => ({
              title,
              status: idx === 0 ? "running" : "pending",
            }))
          );
        },
        onTaskUpdate: (index) => {
          setTasks((prev) => advanceTasks(prev, index));
        },
        onToolCallStart: (id, toolName) => {
          inputBuffers[id] = "";
          setToolCalls((prev) => [
            ...prev,
            { id, toolName, input: {}, output: "", durationMs: 0, status: "running" },
          ]);
        },
        onToolCallDelta: (id, inputChunk) => {
          inputBuffers[id] = (inputBuffers[id] ?? "") + inputChunk;
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === id
                ? { ...tc, input: safeParseJson(inputBuffers[id]) }
                : tc
            )
          );
        },
        onToolCallEnd: (id, output, durationMs) => {
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === id ? { ...tc, output, durationMs, status: "complete" } : tc
            )
          );
          setTasks((prev) => advanceNextRunning(prev));
        },
        onMessageDelta: (text) => {
          setResponseMessage((prev) => (prev ?? "") + text);
        },
        onDone: () => {
          setIsThinking(false);
          setTasks((prev) => completeAllTasks(prev));
        },
        onError: (error) => {
          console.error("Mineral stream error:", error);
          setIsThinking(false);
        },
      });
    },
    [selectedSessionId]
  );

  return (
    <div className="flex h-full bg-[#f4f8fc] text-[#102033]">
      <Sidebar
        sessions={sessions}
        selectedId={selectedSessionId}
        onSelect={setSelectedSessionId}
        onLogoClick={handleLogoClick}
      />

      {selectedSession ? (
        <SessionDetail
          session={selectedSession}
          toolCalls={toolCalls}
          responseMessage={responseMessage}
          userPrompt={userPrompt}
          isThinking={isThinking}
          onSendMessage={handleSendMessage}
          skills={skills}
          activeSkillIds={activeSkillIds}
          onSkillClick={(id) => handleOpenSkills(id)}
          tasks={tasks}
        />
      ) : (
        <HomeView
          onSendMessage={handleSendMessage}
          isThinking={isThinking}
          skillCount={skills.length}
          onOpenSkills={() => handleOpenSkills()}
          onOpenSandbox={() => setShowSandbox(true)}
        />
      )}

      {showSkills ? (
        <SkillsBrowser
          key={focusSkillId ?? "browser"}
          skills={skills}
          focusSkillId={focusSkillId}
          onClose={() => setShowSkills(false)}
          onRunExample={(prompt) => handleSendMessage(prompt)}
        />
      ) : null}

      {showSandbox ? (
        <SandboxBrowser onClose={() => setShowSandbox(false)} />
      ) : null}
    </div>
  );
}

function HomeView({
  onSendMessage,
  isThinking,
  skillCount,
  onOpenSkills,
  onOpenSandbox,
}: {
  onSendMessage: (prompt: string) => void;
  isThinking: boolean;
  skillCount: number;
  onOpenSkills: () => void;
  onOpenSandbox: () => void;
}) {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#f4f8fc]">
      <div className="home-ambient absolute inset-0" aria-hidden="true" />
      <div className="dot-pattern absolute inset-0" aria-hidden="true" />
      <div
        className="dot-cluster dot-cluster-left absolute left-[8%] top-[34%] h-[420px] w-[520px]"
        aria-hidden="true"
      />
      <div
        className="dot-cluster dot-cluster-right absolute right-[2%] top-[32%] h-[340px] w-[520px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 py-12">
        <div className="flex w-full translate-y-2 flex-col items-center">
          <div className="mb-5 text-center">
            <h1 className="text-[17px] font-semibold tracking-[-0.03em] text-[#102033]">
              Mineral
            </h1>
            <p className="mt-2 text-[12.5px] text-[#6b7c93]">
              An agent workspace for data and engineering work
            </p>
          </div>
          <ChatInput onSubmit={onSendMessage} disabled={isThinking} />
          <MetricCards
            skillCount={skillCount}
            onOpenSkills={onOpenSkills}
            onOpenSandbox={onOpenSandbox}
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#d7e1ee] bg-white/80 px-3.5 py-1.5 text-[11.5px] text-[#5f738d] shadow-[0_14px_34px_rgba(64,91,124,0.12)] backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-[6px] w-[6px] animate-pulse rounded-full bg-[#4b9b7c] shadow-[0_0_0_4px_rgba(75,155,124,0.14)]" />
          <span>1 agent online</span>
        </div>
      </div>
    </main>
  );
}

function safeParseJson(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s) as Record<string, unknown>;
  } catch {
    return { _raw: s };
  }
}

function advanceTasks(tasks: Task[], completedIndex: number): Task[] {
  return tasks.map((task, idx) => {
    if (idx <= completedIndex) return { ...task, status: "complete" };
    if (idx === completedIndex + 1) return { ...task, status: "running" };
    return task;
  });
}

function advanceNextRunning(tasks: Task[]): Task[] {
  const firstRunning = tasks.findIndex((t) => t.status === "running");
  if (firstRunning === -1) return tasks;
  return tasks.map((task, idx) => {
    if (idx < firstRunning) return task;
    if (idx === firstRunning) return { ...task, status: "complete" };
    if (idx === firstRunning + 1 && task.status === "pending")
      return { ...task, status: "running" };
    return task;
  });
}

function completeAllTasks(tasks: Task[]): Task[] {
  return tasks.map((task) => ({ ...task, status: "complete" }));
}

function toSessionTitle(prompt: string): string {
  const normalizedPrompt = prompt.trim().replace(/\s+/g, " ");

  if (normalizedPrompt.length <= 52) {
    return normalizedPrompt;
  }

  return `${normalizedPrompt.slice(0, 52)}...`;
}
