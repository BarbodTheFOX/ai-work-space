"use client";

import Link from "next/link";
import { useState } from "react";
import { useOps } from "@/app/providers";
import { ProjectCard } from "@/components/projects";
import { RoutineChecklist, RoutineProgressWidget } from "@/components/routines";
import { CreateTaskModal, TaskCard, TaskDrawer } from "@/components/tasks";
import { Badge, Button, Card, EmptyState, ProgressBar, SectionHeader, StatCard } from "@/components/ui";
import { formatDate, isOverdue, isToday, percent } from "@/lib/utils";
import { summarizeRoutineCompletions } from "@/lib/routine-utils";
import type { Meeting, Note, Task, TaskStatus } from "@/types/ops";

export function MyTasksView() {
  const { currentUser, tasks, projects, routines, routineCompletions, today, markRoutine, clearRoutine } = useOps();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const mine = tasks.filter((task) => task.owner_id === currentUser.id);
  const owners = { [currentUser.id]: currentUser.name };
  const projectNames = Object.fromEntries(projects.map((project) => [project.id, project.name]));
  const myRoutines = routines.filter((routine) => routine.active && routine.owner_id === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-eventum-muted">{currentUser.operationalArea}</p>
          <h1 className="text-2xl font-semibold tracking-tight">My execution queue</h1>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Task</Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <SectionHeader title="Today tasks" />
          <TaskStack tasks={mine.filter((task) => isToday(task.deadline, today) && task.status !== "done")} onOpen={setSelectedTask} />
        </Card>
        <Card>
          <SectionHeader title="My Daily Routines" />
          <RoutineChecklist
            routines={myRoutines}
            completions={routineCompletions.filter((completion) => completion.date === today)}
            ownerNamesById={owners}
            projectNamesById={projectNames}
            currentUserId={currentUser.id}
            onMarkDone={(id) => markRoutine(id, "done")}
            onMarkSkipped={(id) => markRoutine(id, "skipped")}
            onClear={clearRoutine}
          />
        </Card>
        <Card>
          <SectionHeader title="AI daily briefing" eyebrow="Mock draft" />
          <p className="text-sm leading-6 text-eventum-muted">Focus on overdue or due-today work first, then clear anything waiting for review. This panel is static mock content.</p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><SectionHeader title="Weekly tasks" /><TaskStack tasks={mine.filter((task) => task.timeframe === "weekly")} onOpen={setSelectedTask} /></Card>
        <Card><SectionHeader title="Overdue" /><TaskStack tasks={mine.filter((task) => isOverdue(task, today))} onOpen={setSelectedTask} /></Card>
        <Card><SectionHeader title="Waiting for review" /><TaskStack tasks={mine.filter((task) => task.status === "review")} onOpen={setSelectedTask} /></Card>
      </div>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export function TeamTasksView() {
  const { tasks, users, projects, today } = useOps();
  const [view, setView] = useState<"list" | "board">("list");
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const filtered = tasks.filter((task) => (owner === "all" || task.owner_id === owner) && (status === "all" || task.status === status));
  const statuses: TaskStatus[] = ["todo", "in_progress", "waiting", "review", "done", "blocked"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-eventum-muted">Shared task management</p><h1 className="text-2xl font-semibold tracking-tight">Team Tasks</h1></div>
        <div className="flex gap-2"><Button variant="secondary" onClick={() => setView(view === "list" ? "board" : "list")}>{view === "list" ? "Board View" : "List View"}</Button><Button onClick={() => setCreateOpen(true)}>Create Task</Button></div>
      </div>
      <Card className="flex flex-wrap gap-3 p-3 shadow-none">
        <select value={owner} onChange={(e) => setOwner(e.target.value)} className="rounded border border-eventum-border bg-eventum-elevated px-3 py-1.5 text-sm">
          <option value="all">All owners</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border border-eventum-border bg-eventum-elevated px-3 py-1.5 text-sm">
          <option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <Badge tone="lime">{filtered.filter((task) => isToday(task.deadline, today)).length} due today</Badge>
        <Badge tone="danger">{filtered.filter((task) => isOverdue(task, today)).length} overdue</Badge>
      </Card>
      {view === "list" ? (
        <div className="grid gap-3">{filtered.map((task) => <TaskCard key={task.id} task={task} onOpen={setSelectedTask} />)}</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-6">
          {statuses.map((item) => <Card key={item} className="p-3 shadow-none"><h2 className="mb-3 text-sm font-semibold">{item.replace("_", " ")}</h2><div className="space-y-3">{filtered.filter((task) => task.status === item).map((task) => <TaskCard key={task.id} task={task} onOpen={setSelectedTask} />)}</div></Card>)}
        </div>
      )}
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export function ProjectsView() {
  const { projects } = useOps();
  return <div className="space-y-6"><PageTitle eyebrow="Project-level overview" title="Projects" /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></div>;
}

export function ProjectDetailView({ id }: { id: string }) {
  const { projects, tasks, meetings, notes, activityLogs, users, today } = useOps();
  const project = projects.find((item) => item.id === id);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  if (!project) return <EmptyState title="Project not found" description="This mock route does not have a project with that id." />;
  const projectTasks = tasks.filter((task) => task.project_id === project.id);
  const done = projectTasks.filter((task) => task.status === "done").length;
  return (
    <div className="space-y-6">
      <PageTitle eyebrow={project.status} title={project.name} />
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Progress" value={`${percent(done, projectTasks.length)}%`} /><StatCard label="Active" value={projectTasks.length - done} /><StatCard label="Done" value={done} tone="lime" /><StatCard label="Overdue" value={projectTasks.filter((task) => isOverdue(task, today)).length} tone="danger" /></div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><SectionHeader title="Active tasks" /><TaskStack tasks={projectTasks.filter((task) => task.status !== "done")} onOpen={setSelectedTask} /></Card>
        <Card><SectionHeader title="Linked notes" />{notes.filter((note) => note.project_id === project.id).map((note) => <MiniNote key={note.id} note={note} />)}</Card>
        <Card><SectionHeader title="Related meetings" />{meetings.filter((meeting) => meeting.project_id === project.id).map((meeting) => <MeetingLine key={meeting.id} meeting={meeting} />)}<SectionHeader title="Activity" />{activityLogs.map((log) => <p key={log.id} className="text-sm text-eventum-muted">{users.find((user) => user.id === log.user_id)?.name} {log.action}</p>)}</Card>
      </div>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}

export function MeetingsView() {
  const { meetings, actionItems, projects } = useOps();
  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Meeting notes and action items" title="Meetings" />
      <div className="grid gap-5 xl:grid-cols-3">{meetings.map((meeting) => <Link key={meeting.id} href={`/meetings/${meeting.id}`}><Card className="h-full transition hover:border-eventum-borderStrong"><p className="text-sm text-eventum-muted">{projects.find((project) => project.id === meeting.project_id)?.name}</p><h2 className="mt-2 font-semibold">{meeting.title}</h2><p className="mt-2 text-sm text-eventum-muted">{meeting.summary}</p><p className="mt-4 text-sm text-eventum-muted">{actionItems.filter((item) => item.meeting_id === meeting.id).length} action items</p></Card></Link>)}</div>
    </div>
  );
}

export function MeetingDetailView({ id }: { id: string }) {
  const { meetings, users, projects, actionItems, tasks, aiOutputs } = useOps();
  const meeting = meetings.find((item) => item.id === id);
  if (!meeting) return <EmptyState title="Meeting not found" description="This mock route does not have that meeting." />;
  const ai = aiOutputs.find((output) => output.type === "extract_tasks")?.output_json as { tasks?: { title: string; owner_suggestion: string }[]; risks?: string[] } | undefined;
  return (
    <div className="space-y-6"><PageTitle eyebrow={projects.find((project) => project.id === meeting.project_id)?.name} title={meeting.title} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card><SectionHeader title="Raw notes" /><p className="whitespace-pre-wrap text-sm leading-6 text-eventum-muted">{meeting.raw_notes}</p><SectionHeader title="Attendees" />{meeting.attendees.map((id) => <Badge key={id} tone="neutral">{users.find((user) => user.id === id)?.name}</Badge>)}</Card>
        <Card><SectionHeader title="Summary and decisions" /><p className="text-sm text-eventum-muted">{meeting.summary}</p><div className="mt-4 space-y-2">{meeting.decisions.map((decision) => <p key={decision} className="rounded-md bg-eventum-elevated p-3 text-sm">{decision}</p>)}</div></Card>
        <Card><SectionHeader title="Action items" />{actionItems.filter((item) => item.meeting_id === meeting.id).map((item) => <p key={item.id} className="mb-3 rounded-md bg-eventum-elevated p-3 text-sm">{item.title}<br /><span className="text-eventum-muted">Owner: {users.find((user) => user.id === item.owner_id)?.name} | {item.status}</span></p>)}<SectionHeader title="AI extraction preview" eyebrow="Mock only" />{ai?.tasks?.map((task) => <p key={task.title} className="text-sm text-eventum-muted">{task.title} - {task.owner_suggestion}</p>)}{ai?.risks?.map((risk) => <p key={risk} className="mt-2 text-sm text-red-300">{risk}</p>)}<SectionHeader title="Linked tasks" />{tasks.filter((task) => actionItems.some((item) => item.task_id === task.id && item.meeting_id === meeting.id)).map((task) => <p key={task.id} className="text-sm text-eventum-muted">{task.title}</p>)}</Card>
      </div>
    </div>
  );
}

export function NotesView() {
  const { notes, projects } = useOps();
  return <div className="space-y-6"><PageTitle eyebrow="Documentation" title="Notes" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{notes.map((note) => <Link key={note.id} href={`/notes/${note.id}`}><Card className="h-full transition hover:border-eventum-borderStrong"><Badge tone="neutral">{note.type}</Badge><h2 className="mt-3 font-semibold">{note.title}</h2><p className="mt-2 line-clamp-4 text-sm text-eventum-muted">{note.content}</p><p className="mt-4 text-xs text-eventum-dim">{projects.find((project) => project.id === note.project_id)?.name ?? "Unlinked"}</p></Card></Link>)}</div></div>;
}

export function NoteDetailView({ id }: { id: string }) {
  const { notes, projects, tasks, meetings, users } = useOps();
  const note = notes.find((item) => item.id === id);
  if (!note) return <EmptyState title="Note not found" description="This mock route does not have that note." />;
  return <div className="space-y-6"><PageTitle eyebrow={note.type} title={note.title} /><div className="grid gap-6 xl:grid-cols-[1fr_0.45fr]"><Card><p className="whitespace-pre-wrap leading-7 text-eventum-muted">{note.content}</p></Card><Card><SectionHeader title="Linked context" /><p className="text-sm text-eventum-muted">Author: {users.find((user) => user.id === note.created_by)?.name}</p><p className="mt-2 text-sm text-eventum-muted">Project: {projects.find((project) => project.id === note.project_id)?.name ?? "None"}</p><p className="mt-2 text-sm text-eventum-muted">Task: {tasks.find((task) => task.id === note.task_id)?.title ?? "None"}</p><p className="mt-2 text-sm text-eventum-muted">Meeting: {meetings.find((meeting) => meeting.id === note.meeting_id)?.title ?? "None"}</p></Card></div></div>;
}

export function AiAssistantView() {
  const { aiOutputs } = useOps();
  const [selected, setSelected] = useState(aiOutputs[1]);
  return <div className="space-y-6"><PageTitle eyebrow="Structured suggestions only" title="AI Assistant" /><div className="grid gap-6 xl:grid-cols-[0.7fr_1fr_1fr]"><Card><SectionHeader title="Suggested actions" eyebrow="Mock assistant" />{aiOutputs.map((output) => <button key={output.id} onClick={() => setSelected(output)} className="mb-2 w-full rounded bg-eventum-elevated px-3 py-2 text-left text-sm text-eventum-muted transition hover:bg-eventum-soft hover:text-eventum-text">{output.type.replace("_", " ")}</button>)}</Card><Card><SectionHeader title="Input" /><textarea defaultValue={selected.input_text} className="min-h-64 w-full rounded-md border border-eventum-border bg-eventum-elevated p-3 text-sm outline-none focus:border-eventum-borderStrong" /><p className="mt-3 text-sm text-eventum-dim">No real AI call is made in Phase 2.</p></Card><Card><SectionHeader title="Structured output preview" /><pre className="max-h-96 overflow-auto rounded-md border border-eventum-border bg-eventum-elevated p-4 text-xs leading-5 text-eventum-muted">{JSON.stringify(selected.output_json, null, 2)}</pre><div className="mt-4 flex gap-2"><Button>Approve selected</Button><Button variant="ghost">Reject</Button></div></Card></div></div>;
}

export function ReportsView() {
  const { tasks, users, projects, routines, routineCompletions, today, aiOutputs } = useOps();
  const done = tasks.filter((task) => task.status === "done").length;
  const routineSummary = summarizeRoutineCompletions(routines, routineCompletions, today);
  const weekly = aiOutputs.find((output) => output.type === "weekly_summary")?.output_json as { summary?: string; risks?: string[] } | undefined;
  return <div className="space-y-6"><PageTitle eyebrow="View-only in v1" title="Reports" /><div className="grid gap-4 md:grid-cols-4"><StatCard label="Execution rate" value={`${percent(done, tasks.length)}%`} /><StatCard label="Completed tasks" value={done} tone="lime" /><StatCard label="Delayed tasks" value={tasks.filter((task) => isOverdue(task, today)).length} tone="danger" /><StatCard label="Routine rate" value={`${routineSummary.completionRate}%`} tone="lime" /></div><div className="grid gap-6 xl:grid-cols-3"><Card><SectionHeader title="Overdue by person" />{users.map((user) => <p key={user.id} className="mb-2 flex justify-between text-sm"><span>{user.name}</span><span>{tasks.filter((task) => task.owner_id === user.id && isOverdue(task, today)).length}</span></p>)}</Card><Card><SectionHeader title="Project progress" />{projects.map((project) => { const pt = tasks.filter((task) => task.project_id === project.id); return <div key={project.id} className="mb-3"><div className="mb-1 flex justify-between text-sm"><span>{project.name}</span><span>{percent(pt.filter((task) => task.status === "done").length, pt.length)}%</span></div><ProgressBar value={percent(pt.filter((task) => task.status === "done").length, pt.length)} /></div>; })}</Card><RoutineProgressWidget title="Routine consistency this week" summary={routineSummary} /></div><Card><SectionHeader title="AI weekly summary draft" /><p className="text-sm text-eventum-muted">{weekly?.summary}</p>{weekly?.risks?.map((risk) => <p key={risk} className="mt-2 text-sm text-red-300">{risk}</p>)}</Card></div>;
}

export function SettingsView() {
  const { currentUser, users, routines, projects, toggleRoutineActive, createRoutine } = useOps();
  const [created, setCreated] = useState(false);
  return <div className="space-y-6"><PageTitle eyebrow="Simple internal configuration" title="Settings" /><div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"><Card><SectionHeader title="Team members" />{users.map((user) => <div key={user.id} className="mb-3 rounded-md bg-eventum-elevated p-3"><p className="font-medium">{user.name}</p><p className="text-sm text-eventum-muted">{user.operationalArea}</p></div>)}<SectionHeader title="Profile" /><p className="text-sm text-eventum-muted">{currentUser.name} - {currentUser.role}</p></Card><Card><SectionHeader title="Routine Tasks" action={currentUser.role === "founder" ? <Button onClick={() => { createRoutine({ title: "Mock routine created in settings", description: "Local-only routine definition.", owner_id: "user-assistant-1", project_id: projects[0].id, frequency: "daily", priority: "normal" }); setCreated(true); }}>Mock-create routine</Button> : null} />{created ? <p className="mb-3 text-sm text-eventum-muted">Routine created locally.</p> : null}{routines.map((routine) => <div key={routine.id} className="mb-3 flex items-center justify-between rounded-md bg-eventum-elevated p-3"><div><p className="font-medium">{routine.title}</p><p className="text-sm text-eventum-muted">{projects.find((project) => project.id === routine.project_id)?.name} | {routine.frequency}</p></div>{currentUser.role === "founder" ? <Button variant={routine.active ? "secondary" : "ghost"} onClick={() => toggleRoutineActive(routine.id)}>{routine.active ? "Active" : "Inactive"}</Button> : <Badge>{routine.active ? "Active" : "Inactive"}</Badge>}</div>)}</Card></div></div>;
}

function PageTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return <div><p className="text-sm text-eventum-muted">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-tight">{title}</h1></div>;
}

function TaskStack({ tasks, onOpen }: { tasks: Task[]; onOpen: (task: Task) => void }) {
  if (tasks.length === 0) return <EmptyState title="No tasks here" description="This section is clear in the current mock state." />;
  return <div className="space-y-3">{tasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}</div>;
}

function MiniNote({ note }: { note: Note }) {
  return <Link href={`/notes/${note.id}`} className="mb-3 block rounded-md bg-eventum-elevated p-3 text-sm hover:bg-eventum-soft"><span className="font-medium">{note.title}</span><br /><span className="text-eventum-muted">{note.type}</span></Link>;
}

function MeetingLine({ meeting }: { meeting: Meeting }) {
  return <Link href={`/meetings/${meeting.id}`} className="mb-3 block rounded-md bg-eventum-elevated p-3 text-sm hover:bg-eventum-soft">{meeting.title}<br /><span className="text-eventum-muted">{formatDate(meeting.date.slice(0, 10))}</span></Link>;
}
