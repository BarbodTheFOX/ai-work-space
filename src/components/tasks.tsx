"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useOps } from "@/app/providers";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { formatDate, isOverdue } from "@/lib/utils";
import type { Priority, Task, TaskStatus } from "@/types/ops";

const statusTone: Record<TaskStatus, "neutral" | "purple" | "lime" | "danger" | "warning" | "info"> = {
  todo: "neutral",
  in_progress: "info",
  waiting: "warning",
  review: "purple",
  done: "lime",
  blocked: "danger",
};

const priorityTone: Record<Priority, "neutral" | "purple" | "lime" | "danger" | "warning" | "info"> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  urgent: "danger",
};

export function TaskCard({ task, onOpen }: { task: Task; onOpen?: (task: Task) => void }) {
  const { users, projects, today } = useOps();
  const owner = users.find((user) => user.id === task.owner_id);
  const project = projects.find((item) => item.id === task.project_id);
  const overdue = isOverdue(task, today);

  return (
    <button
      type="button"
      onClick={() => onOpen?.(task)}
      className="w-full rounded-xl border border-eventum-border bg-eventum-elevated p-3.5 text-left transition hover:border-eventum-borderStrong hover:bg-eventum-surface"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-eventum-text">{task.title}</h3>
          <p className="mt-1 text-xs text-eventum-muted">{project?.name}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
          <Badge tone={statusTone[task.status]}>{task.status.replace("_", " ")}</Badge>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-eventum-muted">
        <span>{owner?.avatar} {owner?.name}</span>
        <span className={overdue ? "text-eventum-cinnabar" : ""}>{formatDate(task.deadline)}</span>
      </div>
      <div className="mt-2.5">
        <ProgressBar value={task.progress} />
      </div>
    </button>
  );
}

export function TaskDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { users, projects, currentUser, updateTaskStatus, updateTaskProgress } = useOps();
  if (!task) return null;
  const owner = users.find((user) => user.id === task.owner_id);
  const project = projects.find((item) => item.id === task.project_id);
  const canEdit = currentUser.role === "founder" || currentUser.id === task.owner_id;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60">
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-eventum-border bg-eventum-page p-7 shadow-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-eventum-muted">{project?.name}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{task.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-eventum-muted hover:bg-eventum-soft">
            <X size={18} />
          </button>
        </div>
        <p className="mt-4 text-eventum-muted">{task.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-eventum-border bg-eventum-elevated p-3">
            <dt className="text-eventum-dim">Owner</dt>
            <dd className="mt-1 text-eventum-text">{owner?.name}</dd>
          </div>
          <div className="rounded-xl border border-eventum-border bg-eventum-elevated p-3">
            <dt className="text-eventum-dim">Deadline</dt>
            <dd className="mt-1 text-eventum-text">{formatDate(task.deadline)}</dd>
          </div>
          <div className="rounded-xl border border-eventum-border bg-eventum-elevated p-3">
            <dt className="text-eventum-dim">Source</dt>
            <dd className="mt-1 text-eventum-text">{task.source}</dd>
          </div>
          <div className="rounded-xl border border-eventum-border bg-eventum-elevated p-3">
            <dt className="text-eventum-dim">Timeframe</dt>
            <dd className="mt-1 text-eventum-text">{task.timeframe}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <p className="mb-2 text-sm text-eventum-muted">Progress: {task.progress}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={task.progress}
            disabled={!canEdit}
            onChange={(event) => updateTaskProgress(task.id, Number(event.target.value))}
            className="w-full accent-eventum-clay"
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["todo", "in_progress", "waiting", "review", "done", "blocked"] as TaskStatus[]).map((status) => (
            <Button
              key={status}
              variant={task.status === status ? "primary" : "secondary"}
              disabled={!canEdit}
              onClick={() => updateTaskStatus(task.id, status)}
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
        {!canEdit ? <p className="mt-4 text-sm text-eventum-dim">This mock user can view this task but cannot update it.</p> : null}
      </aside>
    </div>
  );
}

export function CreateTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { users, projects, currentUser, createTask } = useOps();
  const [title, setTitle] = useState("");
  const [ownerId, setOwnerId] = useState(currentUser.id);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <Card className="w-full max-w-lg">
        <h2 className="text-xl font-semibold">Create mock task</h2>
        <p className="mt-1 text-sm text-eventum-muted">Local state only. This does not call an API.</p>
        <div className="mt-5 space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            className="w-full rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-2 outline-none focus:border-eventum-borderStrong"
          />
          <select value={ownerId} onChange={(event) => setOwnerId(event.target.value)} className="w-full rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-2">
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="w-full rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-2">
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!title.trim()}
            onClick={() => {
              createTask({
                title,
                description: "Created in the Phase 2 local mock prototype.",
                owner_id: ownerId,
                project_id: projectId,
                priority: "normal",
                deadline: "2026-05-28",
                timeframe: "one_time",
              });
              setTitle("");
              onClose();
            }}
          >
            Create
          </Button>
        </div>
      </Card>
    </div>
  );
}
