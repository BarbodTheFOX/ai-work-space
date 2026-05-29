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
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/my-tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/team-tasks", label: "Team Tasks", icon: ListTodo },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useOps();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-eventum-border bg-eventum-bg px-3 py-4">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-eventum-elevated text-[11px] font-semibold text-eventum-text">
          E
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Eventum Ops</p>
          <p className="text-xs text-eventum-dim">Private workspace</p>
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
                "relative flex items-center gap-2.5 rounded px-2.5 py-2 text-sm text-eventum-muted transition hover:bg-white/[0.045] hover:text-eventum-text",
                active && "bg-white/[0.06] text-eventum-text",
              )}
            >
              {active ? <span className="absolute left-0 h-4 w-0.5 rounded bg-eventum-purple" /> : null}
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3 rounded-md border border-eventum-border bg-eventum-surface p-3">
        <UserSwitcherMock />
        <div className="flex items-center gap-3 border-t border-eventum-border pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-eventum-elevated text-xs font-semibold text-eventum-muted">
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
