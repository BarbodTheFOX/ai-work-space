import type { RoutineCompletion, RoutineTask } from "../../types/routines";
import { RoutineCard } from "./RoutineCard";

type RoutineChecklistProps = {
  routines: RoutineTask[];
  completions: RoutineCompletion[];
  ownerNamesById: Record<string, string>;
  projectNamesById: Record<string, string>;
  currentUserId: string;
  canManageTeam?: boolean;
  onMarkDone?: (routineId: string) => void;
  onMarkSkipped?: (routineId: string) => void;
  onClear?: (routineId: string) => void;
};

export function RoutineChecklist({
  routines,
  completions,
  ownerNamesById,
  projectNamesById,
  currentUserId,
  canManageTeam = false,
  onMarkDone,
  onMarkSkipped,
  onClear,
}: RoutineChecklistProps) {
  const completionByRoutineId = new Map(
    completions.map((completion) => [completion.routine_id, completion]),
  );

  return (
    <section className="space-y-3">
      {routines.map((routine) => {
        const canUpdate = canManageTeam || routine.owner_id === currentUserId;

        return (
          <RoutineCard
            key={routine.id}
            routine={routine}
            completion={completionByRoutineId.get(routine.id)}
            ownerName={ownerNamesById[routine.owner_id] ?? "Unassigned"}
            projectName={projectNamesById[routine.project_id] ?? "No project"}
            canUpdate={canUpdate}
            onMarkDone={onMarkDone}
            onMarkSkipped={onMarkSkipped}
            onClear={onClear}
          />
        );
      })}
    </section>
  );
}
