"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOps } from "@/app/providers";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { formatDate, isOverdue } from "@/lib/utils";
import type { Priority, Task, TaskStatus, Timeframe } from "@/types/ops";

const statuses: TaskStatus[] = ["todo", "in_progress", "waiting", "review", "done", "blocked"];
const priorities: Priority[] = ["low", "normal", "high", "urgent"];
const timeframes: Timeframe[] = ["daily", "weekly", "monthly", "one_time"];

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

type TaskDraft = {
  title: string;
  description: string;
  owner_id: string;
  project_id: string;
  status: TaskStatus;
  priority: Priority;
  deadline: string;
  timeframe: Timeframe;
  progress: number;
};

function draftFromTask(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    owner_id: task.owner_id,
    project_id: task.project_id,
    status: task.status,
    priority: task.priority,
    deadline: task.deadline,
    timeframe: task.timeframe,
    progress: task.progress,
  };
}

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
        <span className={overdue ? "text-eventum-cinnabar" : ""}>{task.deadline ? formatDate(task.deadline) : "No date"}</span>
      </div>
      <div className="mt-2.5">
        <ProgressBar value={task.progress} />
      </div>
    </button>
  );
}

export function TaskDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { users, projects, currentUser, updateTask, deleteTask } = useOps();
  const [draft, setDraft] = useState<TaskDraft | null>(task ? draftFromTask(task) : null);

  useEffect(() => {
    setDraft(task ? draftFromTask(task) : null);
  }, [task]);

  if (!task || !draft) return null;
  const canEdit = currentUser.role === "founder" || currentUser.id === task.owner_id || currentUser.id === task.created_by;
  const canDelete = currentUser.role === "founder";

  function save() {
    updateTask(task!.id, draft!);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/35">
      <aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-eventum-border bg-eventum-page p-7 shadow-subtle">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-eventum-muted">Task item</p>
            <input
              value={draft.title}
              disabled={!canEdit}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className="mt-1 w-full border-none bg-transparent text-2xl font-semibold tracking-tight outline-none"
            />
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-eventum-muted hover:bg-eventum-soft">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Field label="Owner">
            <select value={draft.owner_id} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, owner_id: e.target.value })} className="field">
              {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
          </Field>
          <Field label="Project">
            <select value={draft.project_id} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className="field">
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={draft.status} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })} className="field">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={draft.priority} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })} className="field">
              {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </Field>
          <Field label="Deadline">
            <input type="date" value={draft.deadline} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} className="field" />
          </Field>
          <Field label="Timeframe">
            <select value={draft.timeframe} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, timeframe: e.target.value as Timeframe })} className="field">
              {timeframes.map((timeframe) => <option key={timeframe} value={timeframe}>{timeframe}</option>)}
            </select>
          </Field>
        </div>

        <div className="mt-5">
          <label className="text-sm text-eventum-muted">Description</label>
          <textarea
            value={draft.description}
            disabled={!canEdit}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            className="mt-2 min-h-32 w-full rounded-xl border border-eventum-border bg-eventum-elevated p-3 text-sm outline-none focus:border-eventum-borderStrong"
          />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm text-eventum-muted">Progress: {draft.progress}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={draft.progress}
            disabled={!canEdit}
            onChange={(event) => setDraft({ ...draft, progress: Number(event.target.value) })}
            className="w-full accent-eventum-clay"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button disabled={!canEdit || !draft.title.trim()} onClick={save}>Save task</Button>
          </div>
          {canDelete ? <Button variant="danger" onClick={() => { deleteTask(task.id); onClose(); }}>Delete</Button> : null}
        </div>
      </aside>
    </div>
  );
}

export function CreateTaskModal({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId?: string }) {
  const { users, projects, currentUser, createTask, today } = useOps();
  const [draft, setDraft] = useState<TaskDraft>({
    title: "",
    description: "",
    owner_id: currentUser.id,
    project_id: projectId ?? projects[0]?.id ?? "",
    status: "todo",
    priority: "normal",
    deadline: today,
    timeframe: "one_time",
    progress: 0,
  });

  useEffect(() => {
    if (!open) return;
    setDraft((existing) => ({
      ...existing,
      owner_id: currentUser.id,
      project_id: projectId ?? existing.project_id ?? projects[0]?.id ?? "",
    }));
  }, [currentUser.id, open, projectId, projects]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6">
      <Card className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Create task</h2>
        <p className="mt-1 text-sm text-eventum-muted">Saved locally in this browser.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="field" />
          </Field>
          <Field label="Owner">
            <select value={draft.owner_id} onChange={(e) => setDraft({ ...draft, owner_id: e.target.value })} className="field">
              {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
          </Field>
          <Field label="Project">
            <select value={draft.project_id} onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className="field">
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })} className="field">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })} className="field">
              {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </Field>
          <Field label="Deadline">
            <input type="date" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} className="field" />
          </Field>
          <Field label="Timeframe">
            <select value={draft.timeframe} onChange={(e) => setDraft({ ...draft, timeframe: e.target.value as Timeframe })} className="field">
              {timeframes.map((timeframe) => <option key={timeframe} value={timeframe}>{timeframe}</option>)}
            </select>
          </Field>
          <Field label="Progress">
            <input type="number" min="0" max="100" value={draft.progress} onChange={(e) => setDraft({ ...draft, progress: Number(e.target.value) })} className="field" />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Description">
            <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="field min-h-24" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!draft.title.trim()}
            onClick={() => {
              createTask(draft);
              setDraft({ ...draft, title: "", description: "", progress: 0 });
              onClose();
            }}
          >
            Create task
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs text-eventum-muted">{label}</span>
      {children}
    </label>
  );
}
