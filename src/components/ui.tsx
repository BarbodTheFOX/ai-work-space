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
        "rounded-xl border border-eventum-border bg-eventum-surface p-5 shadow-panel",
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
        {eyebrow ? <p className="text-xs font-medium text-eventum-dim">{eyebrow}</p> : null}
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
    neutral: "bg-eventum-soft text-eventum-muted",
    purple: "bg-eventum-tagPurple text-eventum-mocha",
    lime: "bg-eventum-tagGreen text-eventum-mocha",
    danger: "bg-eventum-tagPink text-eventum-cinnabar",
    warning: "bg-eventum-tagYellow text-eventum-mocha",
    info: "bg-eventum-tagBlue text-eventum-mocha",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium leading-4", tones[tone])}>{children}</span>;
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
    primary: "border border-eventum-clay bg-eventum-clay text-white hover:bg-eventum-mocha",
    secondary: "border border-eventum-border bg-eventum-elevated text-eventum-text hover:border-eventum-borderStrong hover:bg-eventum-soft/70",
    ghost: "text-eventum-muted hover:bg-eventum-soft hover:text-eventum-text",
    danger: "border border-eventum-cinnabar/30 bg-eventum-tagPink text-eventum-cinnabar hover:border-eventum-cinnabar/50",
  };
  return (
    <button
      className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)}
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
    <div className="h-1.5 overflow-hidden rounded-full bg-eventum-soft">
      <div className="h-full rounded-full bg-eventum-clay" style={{ width: `${value}%` }} />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-eventum-border bg-eventum-surface p-6 text-center">
      <p className="font-medium text-eventum-text">{title}</p>
      <p className="mt-1 text-sm text-eventum-muted">{description}</p>
    </div>
  );
}
