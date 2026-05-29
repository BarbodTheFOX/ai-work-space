"use client";

import { usePathname } from "next/navigation";
import { Command, Plus, Radio } from "lucide-react";
import { useOps } from "@/app/providers";
import { Badge, Button } from "@/components/ui";

function titleFromPath(pathname: string) {
  if (pathname === "/") return "Eventum Ops Cockpit";
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  return segment
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function TopBar() {
  const pathname = usePathname();
  const { currentUser, today } = useOps();

  return (
    <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between border-b border-eventum-border bg-eventum-bg/95 px-7 backdrop-blur-sm">
      <div>
        <p className="text-[11px] text-eventum-dim">{today}</p>
        <h1 className="text-base font-semibold tracking-tight">{titleFromPath(pathname)}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden min-w-64 items-center gap-2 rounded border border-eventum-border bg-eventum-surface px-3 py-1.5 text-sm text-eventum-dim md:flex">
          <Command size={15} />
          Search or command
        </div>
        <Badge tone="lime">
          <span className="inline-flex items-center gap-1.5">
            <Radio size={13} />
            Live
          </span>
        </Badge>
        <Badge tone={currentUser.role === "founder" ? "purple" : "neutral"}>{currentUser.role}</Badge>
        <Button className="hidden md:inline-flex">
          <span className="inline-flex items-center gap-1.5">
            <Plus size={15} />
            New task
          </span>
        </Button>
      </div>
    </header>
  );
}
