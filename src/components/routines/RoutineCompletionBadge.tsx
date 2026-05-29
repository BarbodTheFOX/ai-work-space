import type { RoutineTodayState } from "../../types/routines";
import { Badge } from "../ui";

type RoutineCompletionBadgeProps = {
  state: RoutineTodayState;
};

const labels: Record<RoutineTodayState, string> = {
  pending: "Pending",
  done: "Done",
  skipped: "Skipped",
  missed: "Missed",
};

export function RoutineCompletionBadge({ state }: RoutineCompletionBadgeProps) {
  const tone =
    state === "done" ? "lime" : state === "missed" ? "danger" : state === "skipped" ? "warning" : "neutral";

  return (
    <span data-routine-state={state}>
      <Badge tone={tone}>{labels[state]}</Badge>
    </span>
  );
}
