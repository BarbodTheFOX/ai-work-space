"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useOps } from "@/app/providers";
import { ProjectCard } from "@/components/projects";
import { RoutineChecklist, RoutineProgressWidget } from "@/components/routines";
import { CreateTaskModal, TaskCard, TaskDrawer } from "@/components/tasks";
import { Badge, Button, Card, EmptyState, ProgressBar, SectionHeader, StatCard } from "@/components/ui";
import { formatDate, isOverdue, isToday, percent } from "@/lib/utils";
import { summarizeRoutineCompletions } from "@/lib/routine-utils";
import type { Meeting, MeetingActionItem, Note, NoteType, ProjectStatus, Task, TaskStatus } from "@/types/ops";
import type { RoutineFrequency, RoutineTask } from "@/types/routines";

const noteTypes: NoteType[] = ["general", "content_brief", "idea", "decision", "internal_documentation", "meeting_related"];
const routineFrequencies: RoutineFrequency[] = ["daily", "weekly", "monthly"];

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
          <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Task</Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <SectionHeader title="Top tasks" />
          <TaskStack tasks={mine.filter((task) => isToday(task.deadline, today) && task.status !== "done")} onOpen={setSelectedTask} />
        </Card>
        <Card>
          <SectionHeader title="My routine checklist" />
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
          <SectionHeader title="Assistant note" eyebrow="Mock draft" />
          <p className="text-sm leading-6 text-eventum-muted">Focus on overdue or due-today work first, then clear anything waiting for review. This panel is static mock content.</p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><SectionHeader title="This week" /><TaskStack tasks={mine.filter((task) => task.timeframe === "weekly")} onOpen={setSelectedTask} /></Card>
        <Card><SectionHeader title="Overdue" /><TaskStack tasks={mine.filter((task) => isOverdue(task, today))} onOpen={setSelectedTask} /></Card>
        <Card><SectionHeader title="Needs review" /><TaskStack tasks={mine.filter((task) => task.status === "review")} onOpen={setSelectedTask} /></Card>
      </div>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export function TeamTasksView() {
  const { tasks, users, projects, today } = useOps();
  const [view, setView] = useState<"status" | "calendar">("status");
  const [weekOffset, setWeekOffset] = useState(0);
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("all");
  const [project, setProject] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const filtered = tasks.filter(
    (task) =>
      (owner === "all" || task.owner_id === owner) &&
      (status === "all" || task.status === status) &&
      (project === "all" || task.project_id === project) &&
      (priority === "all" || task.priority === priority),
  );
  const statuses: TaskStatus[] = ["todo", "in_progress", "waiting", "review", "done", "blocked"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-eventum-muted">Database view</p><h1 className="text-3xl font-semibold tracking-tight">Tasks</h1></div>
        <div className="flex gap-2"><Button variant={view === "status" ? "primary" : "secondary"} onClick={() => setView("status")}>Status Board</Button><Button variant={view === "calendar" ? "primary" : "secondary"} onClick={() => setView("calendar")}>Calendar Board</Button><Button onClick={() => setCreateOpen(true)}>Create Task</Button></div>
      </div>
      <Card className="flex flex-wrap gap-3 p-3 shadow-none">
        <select value={owner} onChange={(e) => setOwner(e.target.value)} className="rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-1.5 text-sm">
          <option value="all">All owners</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-1.5 text-sm">
          <option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={project} onChange={(e) => setProject(e.target.value)} className="rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-1.5 text-sm">
          <option value="all">All projects</option>{projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-eventum-border bg-eventum-elevated px-3 py-1.5 text-sm">
          <option value="all">All priorities</option>{["low", "normal", "high", "urgent"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <Badge tone="lime">{filtered.filter((task) => isToday(task.deadline, today)).length} due today</Badge>
        <Badge tone="danger">{filtered.filter((task) => isOverdue(task, today)).length} overdue</Badge>
      </Card>
      {view === "status" ? (
        <StatusBoard tasks={filtered} statuses={statuses} onOpen={setSelectedTask} />
      ) : (
        <CalendarBoard tasks={filtered} today={today} weekOffset={weekOffset} setWeekOffset={setWeekOffset} onOpen={setSelectedTask} />
      )}
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export function ProjectsView() {
  const { projects, users, currentUser, createProject } = useOps();
  const [createOpen, setCreateOpen] = useState(false);
  return <div className="space-y-6"><div className="flex items-center justify-between"><PageTitle eyebrow="Project workspace" title="Projects" />{currentUser.role === "founder" ? <Button onClick={() => setCreateOpen(true)}>Create project</Button> : null}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div><ProjectModal open={createOpen} onClose={() => setCreateOpen(false)} users={users} onSave={(project) => { createProject(project); setCreateOpen(false); }} /></div>;
}

export function ProjectDetailView({ id }: { id: string }) {
  const { projects, tasks, meetings, notes, activityLogs, users, today, currentUser, updateProject, createNote, routines } = useOps();
  const project = projects.find((item) => item.id === id);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState(project);
  useEffect(() => {
    setProjectDraft(project);
  }, [project]);
  if (!project) return <EmptyState title="Project not found" description="This mock route does not have a project with that id." />;
  if (!projectDraft) return null;
  const projectTasks = tasks.filter((task) => task.project_id === project.id);
  const done = projectTasks.filter((task) => task.status === "done").length;
  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Project page" title={project.name} />
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Progress" value={`${percent(done, projectTasks.length)}%`} /><StatCard label="Active" value={projectTasks.length - done} /><StatCard label="Done" value={done} tone="lime" /><StatCard label="Overdue" value={projectTasks.filter((task) => isOverdue(task, today)).length} tone="danger" /></div>
      {currentUser.role === "founder" ? (
        <Card>
          <SectionHeader title="Project overview" action={<Button onClick={() => updateProject(project.id, projectDraft)}>Save project</Button>} />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={projectDraft.name} onChange={(e) => setProjectDraft({ ...projectDraft, name: e.target.value })} className="field" />
            <select value={projectDraft.owner_id} onChange={(e) => setProjectDraft({ ...projectDraft, owner_id: e.target.value })} className="field">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
            <select value={projectDraft.status} onChange={(e) => setProjectDraft({ ...projectDraft, status: e.target.value as ProjectStatus })} className="field">{["active", "paused", "completed", "archived"].map((status) => <option key={status} value={status}>{status}</option>)}</select>
            <textarea value={projectDraft.description} onChange={(e) => setProjectDraft({ ...projectDraft, description: e.target.value })} className="field min-h-24 md:col-span-2" />
          </div>
        </Card>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><SectionHeader title="Active tasks" action={<Button variant="secondary" onClick={() => setCreateTaskOpen(true)}>Add task</Button>} /><TaskStack tasks={projectTasks.filter((task) => task.status !== "done")} onOpen={setSelectedTask} /></Card>
        <Card><SectionHeader title="Linked notes" action={<Button variant="secondary" onClick={() => setCreateNoteOpen(true)}>Add note</Button>} />{notes.filter((note) => note.project_id === project.id).map((note) => <MiniNote key={note.id} note={note} />)}</Card>
        <Card><SectionHeader title="Related meetings" />{meetings.filter((meeting) => meeting.project_id === project.id).map((meeting) => <MeetingLine key={meeting.id} meeting={meeting} />)}<SectionHeader title="Routine tasks" />{routines.filter((routine) => routine.project_id === project.id).map((routine) => <p key={routine.id} className="mb-2 rounded-xl bg-eventum-elevated p-3 text-sm">{routine.title}</p>)}<SectionHeader title="Activity" />{activityLogs.map((log) => <p key={log.id} className="text-sm text-eventum-muted">{users.find((user) => user.id === log.user_id)?.name} {log.action}</p>)}</Card>
      </div>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal open={createTaskOpen} onClose={() => setCreateTaskOpen(false)} projectId={project.id} />
      <NoteModal open={createNoteOpen} onClose={() => setCreateNoteOpen(false)} projects={projects} tasks={tasks} meetings={meetings} onSave={(note) => { createNote({ ...note, project_id: project.id }); setCreateNoteOpen(false); }} />
    </div>
  );
}

export function MeetingsView() {
  const { meetings, actionItems, projects, users, createMeeting } = useOps();
  const [createOpen, setCreateOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");
  const filtered = meetings.filter((meeting) => projectFilter === "all" || meeting.project_id === projectFilter);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle eyebrow="Meeting notes database" title="Meetings" />
        <Button onClick={() => setCreateOpen(true)}>Create meeting</Button>
      </div>
      <Card className="flex gap-3 p-3 shadow-none">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="field max-w-xs">
          <option value="all">All projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
      </Card>
      <div className="grid gap-5 xl:grid-cols-3">{filtered.map((meeting) => <Link key={meeting.id} href={`/meetings/${meeting.id}`}><Card className="h-full transition hover:border-eventum-borderStrong"><p className="text-sm text-eventum-muted">{projects.find((project) => project.id === meeting.project_id)?.name}</p><h2 className="mt-2 font-semibold">{meeting.title}</h2><p className="mt-2 text-sm text-eventum-muted">{meeting.summary || "No summary yet."}</p><p className="mt-4 text-sm text-eventum-muted">{actionItems.filter((item) => item.meeting_id === meeting.id).length} action items</p></Card></Link>)}</div>
      <MeetingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projects={projects}
        users={users}
        onSave={(meeting) => {
          createMeeting(meeting);
          setCreateOpen(false);
        }}
      />
    </div>
  );
}

export function MeetingDetailView({ id }: { id: string }) {
  const { meetings, users, projects, actionItems, tasks, aiOutputs, updateMeeting, createActionItem, updateActionItem, deleteActionItem, convertActionItemToTask } = useOps();
  const meeting = meetings.find((item) => item.id === id);
  const [draft, setDraft] = useState(meeting);
  const [newDecision, setNewDecision] = useState("");
  const [newAction, setNewAction] = useState({ title: "", owner_id: users[1]?.id ?? users[0].id, deadline: "2026-05-28", status: "approved" as MeetingActionItem["status"] });

  useEffect(() => {
    setDraft(meeting);
  }, [meeting]);

  if (!meeting) return <EmptyState title="Meeting not found" description="This mock route does not have that meeting." />;
  if (!draft) return null;
  const ai = aiOutputs.find((output) => output.type === "extract_tasks")?.output_json as { tasks?: { title: string; owner_suggestion: string; deadline?: string }[]; risks?: string[] } | undefined;
  const applyMockAiActionItems = () => {
    ai?.tasks?.forEach((task) => {
      const owner = users.find((user) => user.name === task.owner_suggestion) ?? users[0];
      createActionItem({
        meeting_id: meeting.id,
        title: task.title,
        owner_id: owner.id,
        deadline: task.deadline ?? "2026-05-28",
        status: "suggested",
      });
    });
  };
  return (
    <div className="space-y-6"><PageTitle eyebrow={projects.find((project) => project.id === meeting.project_id)?.name} title={meeting.title} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <SectionHeader title="Meeting properties" action={<Button onClick={() => updateMeeting(meeting.id, draft)}>Save</Button>} />
          <div className="space-y-3">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="field" />
            <input type="datetime-local" value={draft.date.slice(0, 16)} onChange={(e) => setDraft({ ...draft, date: new Date(e.target.value).toISOString() })} className="field" />
            <select value={draft.project_id} onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className="field">
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.attendees.includes(user.id)}
                    onChange={(e) => setDraft({ ...draft, attendees: e.target.checked ? [...draft.attendees, user.id] : draft.attendees.filter((entry) => entry !== user.id) })}
                  />
                  {user.name}
                </label>
              ))}
            </div>
            <textarea value={draft.raw_notes} onChange={(e) => setDraft({ ...draft, raw_notes: e.target.value })} className="field min-h-40" />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Summary and decisions" />
          <textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} className="field min-h-24" />
          <div className="mt-4 space-y-2">
            {draft.decisions.map((decision) => <p key={decision} className="flex items-center justify-between rounded-xl bg-eventum-elevated p-3 text-sm"><span>{decision}</span><Button variant="ghost" onClick={() => setDraft({ ...draft, decisions: draft.decisions.filter((item) => item !== decision) })}>Remove</Button></p>)}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={newDecision} onChange={(e) => setNewDecision(e.target.value)} placeholder="Add decision" className="field" />
            <Button onClick={() => { if (!newDecision.trim()) return; setDraft({ ...draft, decisions: [...draft.decisions, newDecision] }); setNewDecision(""); }}>Add</Button>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Action items" />
          {actionItems.filter((item) => item.meeting_id === meeting.id).map((item) => (
            <div key={item.id} className="mb-3 rounded-xl bg-eventum-elevated p-3 text-sm">
              <input value={item.title} onChange={(e) => updateActionItem(item.id, { title: e.target.value })} className="field" />
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <select value={item.owner_id} onChange={(e) => updateActionItem(item.id, { owner_id: e.target.value })} className="field">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
                <input type="date" value={item.deadline} onChange={(e) => updateActionItem(item.id, { deadline: e.target.value })} className="field" />
                <select value={item.status} onChange={(e) => updateActionItem(item.id, { status: e.target.value as MeetingActionItem["status"] })} className="field">{["suggested", "approved", "converted", "dismissed"].map((status) => <option key={status} value={status}>{status}</option>)}</select>
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" disabled={item.status === "converted"} onClick={() => convertActionItemToTask(item.id)}>Convert to task</Button>
                <Button variant="ghost" onClick={() => deleteActionItem(item.id)}>Remove</Button>
              </div>
            </div>
          ))}
          <div className="mt-3 space-y-2 rounded-xl border border-eventum-border bg-eventum-surface p-3">
            <input value={newAction.title} onChange={(e) => setNewAction({ ...newAction, title: e.target.value })} placeholder="New action item" className="field" />
            <div className="grid gap-2 md:grid-cols-3">
              <select value={newAction.owner_id} onChange={(e) => setNewAction({ ...newAction, owner_id: e.target.value })} className="field">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
              <input type="date" value={newAction.deadline} onChange={(e) => setNewAction({ ...newAction, deadline: e.target.value })} className="field" />
              <Button onClick={() => { if (!newAction.title.trim()) return; createActionItem({ meeting_id: meeting.id, ...newAction }); setNewAction({ ...newAction, title: "" }); }}>Add item</Button>
            </div>
          </div>
          <SectionHeader title="AI suggestion block" eyebrow="Mock only" />
          {ai?.tasks?.map((task) => <p key={task.title} className="text-sm text-eventum-muted">{task.title} - {task.owner_suggestion}</p>)}
          {ai?.risks?.map((risk) => <p key={risk} className="mt-2 text-sm text-eventum-cinnabar">{risk}</p>)}
          <Button variant="secondary" className="mt-3" onClick={applyMockAiActionItems}>Add AI suggestions as action items</Button>
          <SectionHeader title="Linked tasks" />
          {tasks.filter((task) => actionItems.some((item) => item.task_id === task.id && item.meeting_id === meeting.id)).map((task) => <p key={task.id} className="text-sm text-eventum-muted">{task.title}</p>)}
        </Card>
      </div>
    </div>
  );
}

export function NotesView() {
  const { notes, projects, tasks, meetings, createNote } = useOps();
  const [createOpen, setCreateOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const filtered = notes.filter((note) => (typeFilter === "all" || note.type === typeFilter) && (projectFilter === "all" || note.project_id === projectFilter));
  return <div className="space-y-6"><div className="flex items-center justify-between"><PageTitle eyebrow="Team knowledge base" title="Notes" /><Button onClick={() => setCreateOpen(true)}>Create note</Button></div><Card className="flex gap-3 p-3 shadow-none"><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field max-w-xs"><option value="all">All types</option>{noteTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="field max-w-xs"><option value="all">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{filtered.map((note) => <Link key={note.id} href={`/notes/${note.id}`}><Card className="h-full transition hover:border-eventum-borderStrong"><Badge tone="neutral">{note.type}</Badge><h2 className="mt-3 font-semibold">{note.title}</h2><p className="mt-2 line-clamp-4 text-sm text-eventum-muted">{note.content}</p><p className="mt-4 text-xs text-eventum-dim">{projects.find((project) => project.id === note.project_id)?.name ?? "Unlinked"}</p></Card></Link>)}</div><NoteModal open={createOpen} onClose={() => setCreateOpen(false)} projects={projects} tasks={tasks} meetings={meetings} onSave={(note) => { createNote(note); setCreateOpen(false); }} /></div>;
}

export function NoteDetailView({ id }: { id: string }) {
  const { notes, projects, tasks, meetings, users, currentUser, updateNote, deleteNote } = useOps();
  const note = notes.find((item) => item.id === id);
  const [draft, setDraft] = useState(note);
  useEffect(() => {
    setDraft(note);
  }, [note]);
  if (!note) return <EmptyState title="Note not found" description="This mock route does not have that note." />;
  if (!draft) return null;
  const canDelete = currentUser.role === "founder" || currentUser.id === note.created_by;
  return <div className="space-y-6"><PageTitle eyebrow={draft.type} title={draft.title} /><div className="grid gap-6 xl:grid-cols-[1fr_0.45fr]"><Card><SectionHeader title="Document" action={<Button onClick={() => updateNote(note.id, draft)}>Save note</Button>} /><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="mb-3 w-full border-none bg-transparent text-2xl font-semibold outline-none" /><textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} className="field min-h-96 leading-7" /></Card><Card><SectionHeader title="Properties" /> <div className="space-y-3"><select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as NoteType })} className="field">{noteTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><select value={draft.project_id ?? ""} onChange={(e) => setDraft({ ...draft, project_id: e.target.value || null })} className="field"><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select><select value={draft.task_id ?? ""} onChange={(e) => setDraft({ ...draft, task_id: e.target.value || null })} className="field"><option value="">No task</option>{tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select><select value={draft.meeting_id ?? ""} onChange={(e) => setDraft({ ...draft, meeting_id: e.target.value || null })} className="field"><option value="">No meeting</option>{meetings.map((meeting) => <option key={meeting.id} value={meeting.id}>{meeting.title}</option>)}</select><p className="text-sm text-eventum-muted">Author: {users.find((user) => user.id === note.created_by)?.name}</p>{canDelete ? <Button variant="danger" onClick={() => deleteNote(note.id)}>Delete note</Button> : null}</div></Card></div></div>;
}

export function AiAssistantView() {
  const { aiOutputs, createTasksFromAiSuggestions } = useOps();
  const [selected, setSelected] = useState(aiOutputs[1]);
  const [sourceText, setSourceText] = useState(aiOutputs[1]?.input_text ?? "");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [createdCount, setCreatedCount] = useState(0);
  const suggestions = (selected?.output_json as { tasks?: Array<{ title: string; description?: string; owner_suggestion?: string; priority?: "low" | "normal" | "high" | "urgent"; deadline?: string; timeframe?: Task["timeframe"] }> } | undefined)?.tasks ?? [];

  useEffect(() => {
    setSourceText(selected?.input_text ?? "");
    setApproved({});
    setCreatedCount(0);
  }, [selected]);

  return <div className="space-y-6"><PageTitle eyebrow="Quiet helper" title="AI Assistant" /><div className="grid gap-6 xl:grid-cols-[0.7fr_1fr_1fr]"><Card><SectionHeader title="Prompt cards" eyebrow="Mock assistant" />{aiOutputs.map((output) => <button key={output.id} onClick={() => setSelected(output)} className="mb-2 w-full rounded-lg bg-eventum-elevated px-3 py-2 text-left text-sm text-eventum-muted transition hover:bg-eventum-soft hover:text-eventum-text">{output.type.replace("_", " ")}</button>)}</Card><Card><SectionHeader title="Source text" /><textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} className="min-h-64 w-full rounded-xl border border-eventum-border bg-eventum-elevated p-3 text-sm outline-none focus:border-eventum-borderStrong" /><Button variant="secondary" className="mt-3" onClick={() => setApproved(Object.fromEntries(suggestions.map((suggestion) => [suggestion.title, true])))}>Mock extract tasks</Button><p className="mt-3 text-sm text-eventum-dim">No real AI call is made. This uses saved mock suggestions only.</p></Card><Card><SectionHeader title="Suggestion review" eyebrow="AI draft" />{suggestions.length === 0 ? <EmptyState title="No task suggestions" description="Pick the task extraction prompt to review mock tasks." /> : <div className="space-y-3">{suggestions.map((suggestion) => <label key={suggestion.title} className="block rounded-xl border border-eventum-border bg-eventum-elevated p-3 text-sm"><div className="flex items-start gap-2"><input type="checkbox" checked={Boolean(approved[suggestion.title])} onChange={(event) => setApproved({ ...approved, [suggestion.title]: event.target.checked })} /><div><p className="font-medium">{suggestion.title}</p><p className="mt-1 text-eventum-muted">{suggestion.owner_suggestion ?? "Unassigned"} | {suggestion.priority ?? "normal"} | {suggestion.deadline ?? "No date"}</p></div></div></label>)}</div>}<pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-eventum-border bg-eventum-elevated p-4 text-xs leading-5 text-eventum-muted">{JSON.stringify(selected?.output_json ?? {}, null, 2)}</pre><div className="mt-4 flex flex-wrap items-center gap-2"><Button disabled={suggestions.every((suggestion) => !approved[suggestion.title])} onClick={() => { const created = createTasksFromAiSuggestions(suggestions.filter((suggestion) => approved[suggestion.title])); setCreatedCount(created.length); setApproved({}); }}>Create approved tasks</Button><Button variant="ghost" onClick={() => setApproved({})}>Reject all</Button>{createdCount ? <Badge tone="lime">{createdCount} created locally</Badge> : null}</div></Card></div></div>;
}

export function ReportsView() {
  const { tasks, users, projects, routines, routineCompletions, today, aiOutputs } = useOps();
  const done = tasks.filter((task) => task.status === "done").length;
  const routineSummary = summarizeRoutineCompletions(routines, routineCompletions, today);
  const weekly = aiOutputs.find((output) => output.type === "weekly_summary")?.output_json as { summary?: string; risks?: string[] } | undefined;
  return <div className="space-y-6"><PageTitle eyebrow="Weekly review page" title="Reports" /><div className="grid gap-4 md:grid-cols-4"><StatCard label="Execution rate" value={`${percent(done, tasks.length)}%`} /><StatCard label="Done" value={done} tone="lime" /><StatCard label="Delayed" value={tasks.filter((task) => isOverdue(task, today)).length} tone="danger" /><StatCard label="Routine rate" value={`${routineSummary.completionRate}%`} tone="lime" /></div><div className="grid gap-6 xl:grid-cols-3"><Card><SectionHeader title="Overdue by person" />{users.map((user) => <p key={user.id} className="mb-2 flex justify-between text-sm"><span>{user.name}</span><span>{tasks.filter((task) => task.owner_id === user.id && isOverdue(task, today)).length}</span></p>)}</Card><Card><SectionHeader title="Project progress" />{projects.map((project) => { const pt = tasks.filter((task) => task.project_id === project.id); return <div key={project.id} className="mb-3"><div className="mb-1 flex justify-between text-sm"><span>{project.name}</span><span>{percent(pt.filter((task) => task.status === "done").length, pt.length)}%</span></div><ProgressBar value={percent(pt.filter((task) => task.status === "done").length, pt.length)} /></div>; })}</Card><RoutineProgressWidget title="Routine consistency" summary={routineSummary} /></div><Card><SectionHeader title="Weekly summary draft" eyebrow="AI draft" /><p className="text-sm text-eventum-muted">{weekly?.summary}</p>{weekly?.risks?.map((risk) => <p key={risk} className="mt-2 text-sm text-eventum-cinnabar">{risk}</p>)}</Card></div>;
}

export function SettingsView() {
  const { currentUser, users, routines, projects, toggleRoutineActive, createRoutine, updateRoutine, deleteRoutine, resetLocalWorkspace } = useOps();
  const [routineEditorOpen, setRoutineEditorOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineTask | null>(null);
  const visibleRoutines = currentUser.role === "founder" ? routines : routines.filter((routine) => routine.owner_id === currentUser.id);

  return <div className="space-y-6"><PageTitle eyebrow="Simple workspace settings" title="Settings" /><div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"><Card><SectionHeader title="Team members" />{users.map((user) => <div key={user.id} className="mb-3 rounded-xl bg-eventum-elevated p-3"><p className="font-medium">{user.name}</p><p className="text-sm text-eventum-muted">{user.operationalArea}</p></div>)}<SectionHeader title="Profile" /><p className="text-sm text-eventum-muted">{currentUser.name} - {currentUser.role}</p><SectionHeader title="Local workspace" /><p className="mb-3 text-sm text-eventum-muted">All edits are saved in this browser with localStorage until Phase 3 adds persistence.</p><Button variant="danger" onClick={resetLocalWorkspace}>Reset local workspace data</Button></Card><Card><SectionHeader title="Routine definitions" action={currentUser.role === "founder" ? <Button onClick={() => { setEditingRoutine(null); setRoutineEditorOpen(true); }}>Create routine</Button> : null} />{visibleRoutines.map((routine) => <div key={routine.id} className="mb-3 rounded-xl bg-eventum-elevated p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{routine.title}</p><p className="text-sm text-eventum-muted">{projects.find((project) => project.id === routine.project_id)?.name} | {routine.frequency} | {users.find((user) => user.id === routine.owner_id)?.name}</p><p className="mt-1 text-xs text-eventum-dim">{routine.description}</p></div>{currentUser.role === "founder" ? <div className="flex gap-2"><Button variant={routine.active ? "secondary" : "ghost"} onClick={() => toggleRoutineActive(routine.id)}>{routine.active ? "Active" : "Inactive"}</Button><Button variant="ghost" onClick={() => { setEditingRoutine(routine); setRoutineEditorOpen(true); }}>Edit</Button></div> : <Badge>{routine.active ? "Active" : "Inactive"}</Badge>}</div></div>)}</Card></div><RoutineModal open={routineEditorOpen} onClose={() => setRoutineEditorOpen(false)} users={users} projects={projects} routine={editingRoutine} onSave={(routine) => { if (editingRoutine) updateRoutine(editingRoutine.id, routine); else createRoutine(routine); setRoutineEditorOpen(false); }} onDelete={editingRoutine ? () => { deleteRoutine(editingRoutine.id); setRoutineEditorOpen(false); } : undefined} /></div>;
}

function PageTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return <div><p className="text-sm text-eventum-muted">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-tight">{title}</h1></div>;
}

function TaskStack({ tasks, onOpen }: { tasks: Task[]; onOpen: (task: Task) => void }) {
  if (tasks.length === 0) return <EmptyState title="No tasks here" description="This section is clear in the current mock state." />;
  return <div className="space-y-3">{tasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}</div>;
}

function StatusBoard({ tasks, statuses, onOpen }: { tasks: Task[]; statuses: TaskStatus[]; onOpen: (task: Task) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-6">
      {statuses.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <Card key={status} className="p-3 shadow-none">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{status.replace("_", " ")}</h2>
              <Badge>{columnTasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {columnTasks.length === 0 ? <p className="text-sm text-eventum-muted">No tasks</p> : columnTasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function CalendarBoard({
  tasks,
  today,
  weekOffset,
  setWeekOffset,
  onOpen,
}: {
  tasks: Task[];
  today: string;
  weekOffset: number;
  setWeekOffset: (value: number) => void;
  onOpen: (task: Task) => void;
}) {
  const base = new Date(`${today}T00:00:00`);
  const monday = new Date(base);
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1 + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const id = date.toISOString().slice(0, 10);
    return {
      id,
      label: date.toLocaleDateString("en", { weekday: "short" }),
      date: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
    };
  });
  const noDateTasks = tasks.filter((task) => !task.deadline);

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between p-3 shadow-none">
        <div>
          <p className="text-sm font-medium">Week of {days[0].date}</p>
          <p className="text-xs text-eventum-muted">Notion-style calendar database view</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setWeekOffset(weekOffset - 1)}>Previous week</Button>
          <Button variant="ghost" onClick={() => setWeekOffset(0)}>Today</Button>
          <Button variant="secondary" onClick={() => setWeekOffset(weekOffset + 1)}>Next week</Button>
        </div>
      </Card>
      <div className="grid gap-3 xl:grid-cols-7">
        {days.map((day) => {
          const dayTasks = tasks.filter((task) => task.deadline === day.id);
          return (
            <Card key={day.id} className="min-h-72 p-3 shadow-none">
              <div className="mb-3">
                <p className="text-sm font-semibold">{day.label}</p>
                <p className="text-xs text-eventum-muted">{day.date}</p>
              </div>
              <div className="space-y-2">
                {dayTasks.length === 0 ? <p className="text-xs text-eventum-muted">No due tasks</p> : dayTasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}
              </div>
            </Card>
          );
        })}
      </div>
      {noDateTasks.length > 0 ? (
        <Card>
          <SectionHeader title="No date" />
          <TaskStack tasks={noDateTasks} onOpen={onOpen} />
        </Card>
      ) : null}
    </div>
  );
}

function MeetingModal({
  open,
  onClose,
  projects,
  users,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  projects: ReturnType<typeof useOps>["projects"];
  users: ReturnType<typeof useOps>["users"];
  onSave: (meeting: Pick<Meeting, "title" | "date" | "attendees" | "raw_notes" | "summary" | "decisions" | "project_id">) => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    date: "2026-05-26T10:00",
    project_id: projects[0]?.id ?? "",
    attendees: [users[0]?.id].filter(Boolean) as string[],
    raw_notes: "",
    summary: "",
    decisions: [] as string[],
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6">
      <Card className="w-full max-w-2xl">
        <SectionHeader title="Create meeting" />
        <div className="grid gap-3 md:grid-cols-2">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Meeting title" className="field" />
          <input type="datetime-local" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="field" />
          <select value={draft.project_id} onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className="field">
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
          <div className="rounded-xl border border-eventum-border bg-eventum-elevated p-3">
            <p className="mb-2 text-xs text-eventum-muted">Attendees</p>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.attendees.includes(user.id)}
                    onChange={(e) => setDraft({ ...draft, attendees: e.target.checked ? [...draft.attendees, user.id] : draft.attendees.filter((id) => id !== user.id) })}
                  />
                  {user.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <textarea value={draft.raw_notes} onChange={(e) => setDraft({ ...draft, raw_notes: e.target.value })} placeholder="Raw notes" className="field mt-3 min-h-28" />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!draft.title.trim()} onClick={() => onSave({ ...draft, date: new Date(draft.date).toISOString() })}>Create meeting</Button>
        </div>
      </Card>
    </div>
  );
}

function NoteModal({
  open,
  onClose,
  projects,
  tasks,
  meetings,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  projects: ReturnType<typeof useOps>["projects"];
  tasks: ReturnType<typeof useOps>["tasks"];
  meetings: ReturnType<typeof useOps>["meetings"];
  onSave: (note: Pick<Note, "title" | "content" | "type" | "project_id" | "task_id" | "meeting_id">) => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    content: "",
    type: "general" as NoteType,
    project_id: "",
    task_id: "",
    meeting_id: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6">
      <Card className="w-full max-w-2xl">
        <SectionHeader title="Create note" />
        <div className="grid gap-3 md:grid-cols-2">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Note title" className="field" />
          <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as NoteType })} className="field">{noteTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>
          <select value={draft.project_id} onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className="field"><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
          <select value={draft.task_id} onChange={(e) => setDraft({ ...draft, task_id: e.target.value })} className="field"><option value="">No task</option>{tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select>
          <select value={draft.meeting_id} onChange={(e) => setDraft({ ...draft, meeting_id: e.target.value })} className="field"><option value="">No meeting</option>{meetings.map((meeting) => <option key={meeting.id} value={meeting.id}>{meeting.title}</option>)}</select>
        </div>
        <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="Write note content..." className="field mt-3 min-h-40" />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!draft.title.trim()} onClick={() => onSave({ ...draft, project_id: draft.project_id || null, task_id: draft.task_id || null, meeting_id: draft.meeting_id || null })}>Create note</Button>
        </div>
      </Card>
    </div>
  );
}

function ProjectModal({
  open,
  onClose,
  users,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  users: ReturnType<typeof useOps>["users"];
  onSave: (project: { name: string; description: string; status: ProjectStatus; owner_id: string }) => void;
}) {
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    status: "active" as ProjectStatus,
    owner_id: users[0]?.id ?? "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6">
      <Card className="w-full max-w-xl">
        <SectionHeader title="Create project" />
        <div className="space-y-3">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Project name" className="field" />
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Description" className="field min-h-24" />
          <select value={draft.owner_id} onChange={(e) => setDraft({ ...draft, owner_id: e.target.value })} className="field">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
          <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ProjectStatus })} className="field">{["active", "paused", "completed", "archived"].map((status) => <option key={status} value={status}>{status}</option>)}</select>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!draft.name.trim()} onClick={() => onSave(draft)}>Create project</Button>
        </div>
      </Card>
    </div>
  );
}

function RoutineModal({
  open,
  onClose,
  users,
  projects,
  routine,
  onSave,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  users: ReturnType<typeof useOps>["users"];
  projects: ReturnType<typeof useOps>["projects"];
  routine: RoutineTask | null;
  onSave: (routine: Pick<RoutineTask, "title" | "description" | "owner_id" | "project_id" | "frequency" | "priority">) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    owner_id: users[1]?.id ?? users[0]?.id ?? "",
    project_id: projects[0]?.id ?? "",
    frequency: "daily" as RoutineFrequency,
    priority: "normal" as RoutineTask["priority"],
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      title: routine?.title ?? "",
      description: routine?.description ?? "",
      owner_id: routine?.owner_id ?? users[1]?.id ?? users[0]?.id ?? "",
      project_id: routine?.project_id ?? projects[0]?.id ?? "",
      frequency: routine?.frequency ?? "daily",
      priority: routine?.priority ?? "normal",
    });
  }, [open, projects, routine, users]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6">
      <Card className="w-full max-w-2xl">
        <SectionHeader title={routine ? "Edit routine" : "Create routine"} />
        <div className="grid gap-3 md:grid-cols-2">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Routine title" className="field" />
          <select value={draft.owner_id} onChange={(e) => setDraft({ ...draft, owner_id: e.target.value })} className="field">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
          <select value={draft.project_id} onChange={(e) => setDraft({ ...draft, project_id: e.target.value })} className="field">{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
          <select value={draft.frequency} onChange={(e) => setDraft({ ...draft, frequency: e.target.value as RoutineFrequency })} className="field">{routineFrequencies.map((frequency) => <option key={frequency} value={frequency}>{frequency}</option>)}</select>
          <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as RoutineTask["priority"] })} className="field">{["low", "normal", "high", "urgent"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
        </div>
        <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Operational checklist description" className="field mt-3 min-h-28" />
        <div className="mt-5 flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button disabled={!draft.title.trim()} onClick={() => onSave(draft)}>{routine ? "Save routine" : "Create routine"}</Button>
          </div>
          {onDelete ? <Button variant="danger" onClick={onDelete}>Delete routine</Button> : null}
        </div>
      </Card>
    </div>
  );
}

function MiniNote({ note }: { note: Note }) {
  return <Link href={`/notes/${note.id}`} className="mb-3 block rounded-xl bg-eventum-elevated p-3 text-sm hover:bg-eventum-soft"><span className="font-medium">{note.title}</span><br /><span className="text-eventum-muted">{note.type}</span></Link>;
}

function MeetingLine({ meeting }: { meeting: Meeting }) {
  return <Link href={`/meetings/${meeting.id}`} className="mb-3 block rounded-xl bg-eventum-elevated p-3 text-sm hover:bg-eventum-soft">{meeting.title}<br /><span className="text-eventum-muted">{formatDate(meeting.date.slice(0, 10))}</span></Link>;
}
