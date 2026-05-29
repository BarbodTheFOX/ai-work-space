"use client";

import { useState } from "react";
import { useOps } from "@/app/providers";
import { RoutineChecklist } from "@/components/routines";
import { CreateTaskModal, TaskCard, TaskDrawer } from "@/components/tasks";
import { Button, Card, SectionHeader, StatCard } from "@/components/ui";
import { isOverdue, isToday, percent } from "@/lib/utils";
import { summarizeRoutineCompletions } from "@/lib/routine-utils";
import type { Task } from "@/types/ops";

export default function DashboardPage() {
  const { tasks, projects, users, meetings, activityLogs, aiOutputs, routines, routineCompletions, today, currentUser, markRoutine, clearRoutine } = useOps();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const active = tasks.filter((task) => task.status !== "done");
  const overdue = tasks.filter((task) => isOverdue(task, today));
  const review = tasks.filter((task) => task.status === "review");
  const blocked = tasks.filter((task) => task.status === "blocked");
  const dueToday = tasks.filter((task) => isToday(task.deadline, today) && task.status !== "done");
  const routineSummary = summarizeRoutineCompletions(routines, routineCompletions, today);
  const owners = Object.fromEntries(users.map((user) => [user.id, user.name]));
  const projectNames = Object.fromEntries(projects.map((project) => [project.id, project.name]));
  const founderBriefing = aiOutputs.find((output) => output.type === "founder_briefing")?.output_json as { briefing?: string; recommended_actions?: string[] } | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-eventum-muted">Workspace overview</p>
          <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Task</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <StatCard label="Open tasks" value={active.length} helper="Work still moving" />
        <StatCard label="Due today" value={dueToday.length} tone="info" />
        <StatCard label="Overdue" value={overdue.length} tone="danger" />
        <StatCard label="Needs review" value={review.length} tone="warning" />
        <StatCard label="Blocked" value={blocked.length} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr_0.9fr]">
        <Card>
          <SectionHeader title="Top tasks" eyebrow="Due, late, or waiting" />
          <div className="space-y-3">
            {[...overdue, ...dueToday, ...review].slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} onOpen={setSelectedTask} />
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Routine checklist" eyebrow="Today" />
          <RoutineChecklist
            routines={routines.filter((routine) => routine.active)}
            completions={routineCompletions.filter((completion) => completion.date === today)}
            ownerNamesById={owners}
            projectNamesById={projectNames}
            currentUserId={currentUser.id}
            canManageTeam={currentUser.role === "founder"}
            onMarkDone={(id) => markRoutine(id, "done")}
            onMarkSkipped={(id) => markRoutine(id, "skipped")}
            onClear={clearRoutine}
          />
        </Card>
        <Card>
          <SectionHeader title="Assistant note" eyebrow="Mock draft" />
          <p className="text-sm leading-6 text-eventum-muted">{founderBriefing?.briefing}</p>
          <ul className="mt-4 space-y-2 text-sm text-eventum-text">
            {founderBriefing?.recommended_actions?.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <SectionHeader title="Team workload" />
          <div className="space-y-3">
            {users.map((user) => {
              const owned = active.filter((task) => task.owner_id === user.id).length;
              return (
                <div key={user.id}>
                  <div className="mb-1 flex justify-between text-sm"><span>{user.name}</span><span>{owned} active</span></div>
                  <div className="h-1.5 rounded-full bg-eventum-soft"><div className="h-full rounded-full bg-eventum-clay" style={{ width: `${Math.min(owned * 12, 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Project progress" />
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => {
              const projectTasks = tasks.filter((task) => task.project_id === project.id);
              return <div key={project.id} className="flex justify-between text-sm"><span>{project.name}</span><span>{percent(projectTasks.filter((task) => task.status === "done").length, projectTasks.length)}%</span></div>;
            })}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Recent decisions" />
          <div className="space-y-3 text-sm text-eventum-muted">
            {meetings.flatMap((meeting) => meeting.decisions.map((decision) => ({ meeting: meeting.title, decision }))).slice(0, 4).map((item) => (
              <p key={item.decision}><span className="text-eventum-text">{item.meeting}:</span> {item.decision}</p>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Activity feed" />
        <div className="grid gap-3 md:grid-cols-3">
          {activityLogs.map((log) => <p key={log.id} className="rounded-md bg-eventum-elevated p-3 text-sm text-eventum-muted">{users.find((user) => user.id === log.user_id)?.name} {log.action}</p>)}
        </div>
      </Card>
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
