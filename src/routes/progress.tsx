import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import {
  Badge,
  Card,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui-kit";
import {
  formatMinutes,
  subjectName,
  subjects,
  tasks,
  todaySessions,
  weeklyStudy,
} from "@/lib/mock-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — My Study App" },
      {
        name: "description",
        content:
          "See weekly study time, task completion rate, subject progress and study sessions.",
      },
      { property: "og:title", content: "Progress — My Study App" },
      {
        property: "og:description",
        content: "Weekly study time, completion rate and subject progress.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const completed = tasks.filter((t) => t.completed).length;
  const rate = Math.round((completed / tasks.length) * 100);
  const weekTotal = weeklyStudy.reduce((sum, d) => sum + d.minutes, 0);
  const peak = Math.max(...weeklyStudy.map((d) => d.minutes));
  const overall = Math.round(
    subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length,
  );

  return (
    <AppShell title="Progress" subtitle="Your last 7 days">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Overall progress" value={`${overall}%`} hint="Across all subjects" />
        <StatCard label="Weekly study time" value={formatMinutes(weekTotal)} hint="7 day total" />
        <StatCard
          label="Completed tasks"
          value={`${completed}/${tasks.length}`}
          hint="This week"
        />
        <StatCard label="Completion rate" value={`${rate}%`} hint="Tasks finished" accent />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Weekly study time" action={<Badge tone="aurora">minutes</Badge>} />
          <div className="mt-6 flex h-52 items-end gap-2 sm:gap-4">
            {weeklyStudy.map((day) => (
              <div key={day.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-[11px] tabular-nums text-subtle-foreground">
                  {day.minutes}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-aurora-2 to-aurora transition-[height] duration-700"
                  style={{ height: `${(day.minutes / peak) * 100}%` }}
                />
                <span className="text-[11px] text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Overall progress" />
          <div className="mt-6 flex flex-col items-center">
            <div className="relative grid size-40 place-items-center">
              <div className="absolute inset-0 rounded-full border-8 border-border" />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--aurora) ${overall}%, transparent ${overall}%)`,
                  mask: "radial-gradient(circle, transparent 62%, black 63%)",
                  WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
                }}
              />
              <p className="font-display text-3xl font-extrabold">{overall}%</p>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Average completion across {subjects.length} subjects
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Subject progress" />
          <div className="mt-5 space-y-4">
            {subjects.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium">{s.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatMinutes(s.studyMinutes)} · {s.progress}%
                  </span>
                </div>
                <ProgressBar value={s.progress} className="mt-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Study sessions" />
          <ul className="mt-5 flex flex-col gap-2">
            {todaySessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-inset px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {subjectName(session.subjectId)}
                  </p>
                  <p className="text-[11px] text-subtle-foreground">
                    Today · started {session.startedAt}
                  </p>
                </div>
                <Badge tone="violet">{session.minutes}m</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
