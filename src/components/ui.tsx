import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-md border border-eventum-border bg-eventum-surface p-5 shadow-panel",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eventum-dim">{eyebrow}</p> : null}
        <h2 className="text-[15px] font-semibold text-eventum-text">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "purple" | "lime" | "danger" | "warning" | "info";
}) {
  const tones = {
    neutral: "border-transparent bg-white/[0.055] text-eventum-muted",
    purple: "border-transparent bg-eventum-purple/12 text-zinc-200",
    lime: "border-transparent bg-eventum-lime/10 text-eventum-lime",
    danger: "border-transparent bg-eventum-danger/12 text-red-300",
    warning: "border-transparent bg-eventum-warning/12 text-amber-300",
    info: "border-transparent bg-eventum-info/12 text-sky-300",
  };
  return <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-4", tones[tone])}>{children}</span>;
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants = {
    primary: "border border-eventum-purple/35 bg-eventum-purple/18 text-white hover:bg-eventum-purple/24",
    secondary: "border border-eventum-border bg-eventum-elevated text-eventum-text hover:border-eventum-borderStrong hover:bg-eventum-soft/80",
    ghost: "text-eventum-muted hover:bg-white/[0.04] hover:text-eventum-text",
    danger: "border border-eventum-danger/30 bg-eventum-danger/10 text-red-200 hover:bg-eventum-danger/15",
  };
  return (
    <button
      className={cn("rounded px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatCard({
  label,
  value,
  helper,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "purple" | "lime" | "danger" | "warning" | "info" | "neutral";
}) {
  return (
    <Card className="p-4 shadow-none">
      <div className="flex items-center justify-between">
        <p className="text-sm text-eventum-muted">{label}</p>
        {tone !== "neutral" ? <Badge tone={tone}>{tone}</Badge> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {helper ? <p className="mt-1 text-sm text-eventum-dim">{helper}</p> : null}
    </Card>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
      <div className="h-full rounded-full bg-eventum-purple" style={{ width: `${value}%` }} />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-md border border-dashed border-eventum-border bg-eventum-elevated/70 p-6 text-center">
      <p className="font-medium text-eventum-text">{title}</p>
      <p className="mt-1 text-sm text-eventum-muted">{description}</p>
    </div>
  );
}
