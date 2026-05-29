import { isOverdue, percent } from "@/lib/utils";
import type { Project, Task, User } from "@/types/ops";
import type { RoutineCompletion, RoutineTask } from "@/types/routines";

export function calculateReportsFromData({
  tasks,
  users,
  projects,
  routines,
  routineCompletions,
  today,
}: {
  tasks: Task[];
  users: User[];
  projects: Project[];
  routines: RoutineTask[];
  routineCompletions: RoutineCompletion[];
  today: string;
}) {
  const completedTasks = tasks.filter((task) => task.status === "done").length;

  return {
    executionRate: percent(completedTasks, tasks.length),
    completedTasks,
    overdueTasks: tasks.filter((task) => isOverdue(task, today)).length,
    reviewQueue: tasks.filter((task) => task.status === "review").length,
    blockedTasks: tasks.filter((task) => task.status === "blocked").length,
    workloadByUser: users.map((user) => ({
      userId: user.id,
      count: tasks.filter((task) => task.owner_id === user.id && task.status !== "done").length,
    })),
    projectProgress: projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.project_id === project.id);
      return {
        projectId: project.id,
        progress: percent(projectTasks.filter((task) => task.status === "done").length, projectTasks.length),
      };
    }),
    routineCompletionCount: routineCompletions.length,
    routineCount: routines.length,
  };
}
