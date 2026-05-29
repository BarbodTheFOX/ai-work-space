import type { RoutineCompletion, RoutineTask } from "../../types/routines";
import { Button } from "../ui";
import { RoutineCompletionBadge } from "./RoutineCompletionBadge";

type RoutineCardProps = {
  routine: RoutineTask;
  completion?: RoutineCompletion;
  ownerName: string;
  projectName: string;
  canUpdate: boolean;
  onMarkDone?: (routineId: string) => void;
  onMarkSkipped?: (routineId: string) => void;
  onClear?: (routineId: string) => void;
};

export function RoutineCard({
  routine,
  completion,
  ownerName,
  projectName,
  canUpdate,
  onMarkDone,
  onMarkSkipped,
  onClear,
}: RoutineCardProps) {
  const state = completion?.status ?? "pending";

  return (
    <article data-routine-id={routine.id} className="rounded-md border border-eventum-border bg-eventum-elevated/70 p-3.5">
      <header className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-eventum-dim">{routine.frequency}</p>
        <RoutineCompletionBadge state={state} />
      </header>
      <h3 className="mt-3 text-sm font-medium text-eventum-text">{routine.title}</h3>
      <p className="mt-1 text-xs leading-5 text-eventum-muted">{routine.description}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-eventum-muted">
        <div>
          <dt>Owner</dt>
          <dd className="mt-1 text-eventum-text">{ownerName}</dd>
        </div>
        <div>
          <dt>Project</dt>
          <dd className="mt-1 text-eventum-text">{projectName}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd className="mt-1 text-eventum-text">{routine.priority}</dd>
        </div>
      </dl>
      {completion?.note ? <p className="mt-3 text-sm text-eventum-dim">{completion.note}</p> : null}
      {canUpdate ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => onMarkDone?.(routine.id)}>
            Check
          </Button>
          <Button type="button" variant="ghost" onClick={() => onMarkSkipped?.(routine.id)}>
            Skip
          </Button>
          {completion ? (
            <Button type="button" variant="ghost" onClick={() => onClear?.(routine.id)}>
              Uncheck
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
