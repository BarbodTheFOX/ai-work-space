"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckSquare,
  FileText,
  FolderKanban,
  Home,
  ListTodo,
  Settings,
} from "lucide-react";
import { useOps } from "@/app/providers";
import { cn } from "@/lib/utils";
import { UserSwitcherMock } from "./UserSwitcherMock";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/my-tasks", label: "Today", icon: CheckSquare },
  { href: "/team-tasks", label: "Tasks", icon: ListTodo },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useOps();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-eventum-border bg-eventum-bg px-3 py-4">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-eventum-elevated text-xs font-semibold text-eventum-clay shadow-panel">
          E
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Eventum Workspace</p>
          <p className="text-xs text-eventum-dim">Team OS</p>
        </div>
      </Link>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-eventum-muted transition hover:bg-eventum-soft/70 hover:text-eventum-text",
                active && "bg-eventum-soft text-eventum-text",
              )}
            >
              {active ? <span className="absolute left-0 h-4 w-0.5 rounded bg-eventum-clay" /> : null}
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3 rounded-xl border border-eventum-border bg-eventum-surface p-3">
        <UserSwitcherMock />
        <div className="flex items-center gap-3 border-t border-eventum-border pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eventum-soft text-xs font-semibold text-eventum-muted">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-eventum-text">{currentUser.name}</p>
            <p className="truncate text-xs text-eventum-muted">{currentUser.operationalArea}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
