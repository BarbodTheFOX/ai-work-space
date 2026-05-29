import type { RoutineSummary } from "../../types/routines";

type RoutineProgressWidgetProps = {
  title?: string;
  summary: RoutineSummary;
};

export function RoutineProgressWidget({
  title = "Today Routine Checklist",
  summary,
}: RoutineProgressWidgetProps) {
  return (
    <section className="rounded-md border border-eventum-border bg-eventum-surface p-5 shadow-panel">
      <header className="flex items-start justify-between gap-4">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <p className="text-sm text-eventum-muted">{summary.completionRate}% completion rate</p>
      </header>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-eventum-dim">Completed today</dt>
          <dd className="text-lg font-semibold">{summary.completedToday}</dd>
        </div>
        <div>
          <dt className="text-eventum-dim">Pending today</dt>
          <dd className="text-lg font-semibold">{summary.pendingToday}</dd>
        </div>
        <div>
          <dt className="text-eventum-dim">Missed today</dt>
          <dd className="text-lg font-semibold text-red-300">{summary.missedToday}</dd>
        </div>
        <div>
          <dt className="text-eventum-dim">Skipped today</dt>
          <dd className="text-lg font-semibold text-amber-300">{summary.skippedToday}</dd>
        </div>
      </dl>
    </section>
  );
}
