"use client";

import Link from "next/link";
import { useOps } from "@/app/providers";
import { Card, ProgressBar } from "@/components/ui";
import { isOverdue, percent } from "@/lib/utils";
import type { Project } from "@/types/ops";

export function ProjectCard({ project }: { project: Project }) {
  const { users, tasks, today } = useOps();
  const owner = users.find((user) => user.id === project.owner_id);
  const projectTasks = tasks.filter((task) => task.project_id === project.id);
  const done = projectTasks.filter((task) => task.status === "done").length;
  const active = projectTasks.filter((task) => task.status !== "done").length;
  const overdue = projectTasks.filter((task) => isOverdue(task, today)).length;
  const progress = percent(done, projectTasks.length);

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full transition hover:border-eventum-borderStrong">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold tracking-tight">{project.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-eventum-muted">{project.description}</p>
          </div>
          <span className="rounded-full border border-eventum-border bg-eventum-elevated px-2 py-0.5 text-[11px] text-eventum-muted">{project.status}</span>
        </div>
        <div className="mt-5">
          <ProgressBar value={progress} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div><p className="text-eventum-dim">Active</p><p>{active}</p></div>
          <div><p className="text-eventum-dim">Done</p><p>{done}</p></div>
          <div><p className="text-eventum-dim">Overdue</p><p className="text-eventum-cinnabar">{overdue}</p></div>
        </div>
        <p className="mt-4 text-sm text-eventum-muted">Owner: {owner?.name}</p>
      </Card>
    </Link>
  );
}
