import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Task } from "@/types/ops";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isToday(date: string, today = "2026-05-26") {
  return date === today;
}

export function isOverdue(task: Task, today = "2026-05-26") {
  return task.deadline < today && task.status !== "done";
}

export function percent(done: number, total: number) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
