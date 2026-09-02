import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarClock,
  CheckSquare,
  LayoutGrid,
  Menu,
  NotebookPen,
  Settings,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { student } from "@/lib/mock-data";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/notes", label: "Notes", icon: NotebookPen },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/timer", label: "Study Timer", icon: Timer },
  { to: "/exams", label: "Exams", icon: CalendarClock },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-aurora via-aurora-2 to-aurora-3 font-display text-lg font-extrabold text-on-aurora">
        M
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-base font-bold leading-none">
          My Study App
        </p>
        <p className="mt-1 text-[11px] text-subtle-foreground">Study smarter, daily</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              active
                ? "bg-input font-semibold text-foreground"
                : "font-medium text-muted-foreground hover:bg-input/70 hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4 shrink-0", active && "text-aurora")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-floaty absolute -left-24 -top-32 size-[480px] rounded-full bg-aurora/20 blur-[130px]" />
        <div className="animate-floaty2 absolute -right-24 top-1/3 size-[440px] rounded-full bg-aurora-2/20 blur-[130px]" />
        <div className="animate-floaty absolute -bottom-40 left-1/3 size-[460px] rounded-full bg-aurora-3/15 blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-inset px-5 py-6 backdrop-blur-xl lg:flex">
          <Brand />
          <div className="mt-8">
            <NavList />
          </div>
          <div className="glass mt-auto rounded-2xl p-4">
            <p className="text-xs font-semibold">Focus streak</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-aurora">
              {student.streakDays} days
            </p>
            <p className="mt-1 text-[11px] text-subtle-foreground">
              Keep the momentum going
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-6 lg:px-10">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-4" />
              </Button>
              <div className="min-w-0">
                {subtitle ? (
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">
                    {subtitle}
                  </p>
                ) : null}
                <h1 className="mt-0.5 truncate font-display text-xl font-bold sm:text-3xl">
                  {title}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {action}
              <div
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-aurora-2 to-aurora-3 font-display font-bold text-on-aurora"
              >
                {student.name.charAt(0)}
              </div>
            </div>
          </header>

          <div className="animate-rise mt-6 pb-8">{children}</div>
        </main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-rise absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col border-r border-border bg-card-strong px-5 py-6 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="mt-8">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
