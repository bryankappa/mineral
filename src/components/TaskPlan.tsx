"use client";

import { Check } from "lucide-react";
import type { Task } from "@/lib/backend";

interface TaskPlanProps {
  tasks: Task[];
}

export default function TaskPlan({ tasks }: TaskPlanProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-[11.5px] leading-[1.55] text-zinc-400">
        No plan yet. Send a prompt to see the agent&rsquo;s step-by-step plan here.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task, index) => (
        <li key={index} className="flex items-start gap-2.5">
          <Checkbox status={task.status} />
          <span
            className={`flex-1 text-[12px] leading-[1.45] transition-colors ${
              task.status === "complete"
                ? "text-zinc-400"
                : task.status === "running"
                ? "shimmer-text font-medium"
                : "text-zinc-600"
            }`}
          >
            {task.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Checkbox({ status }: { status: Task["status"] }) {
  if (status === "complete") {
    return (
      <span
        aria-hidden="true"
        className="mt-[2px] flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-[3px] bg-zinc-900"
      >
        <Check size={10} className="text-white" strokeWidth={3} />
      </span>
    );
  }

  if (status === "running") {
    return (
      <span
        aria-hidden="true"
        className="mt-[2px] flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-zinc-900 bg-white"
      >
        <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-zinc-900" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="mt-[2px] h-[14px] w-[14px] flex-shrink-0 rounded-[3px] border-[1.5px] border-zinc-300 bg-white"
    />
  );
}
