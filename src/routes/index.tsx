import { createFileRoute, Link } from "@tanstack/react-router";
import { NotebookPen, Play, Plus, Timer as TimerIcon } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui-kit";
import {
  exams,
  formatMinutes,
  notes,
  student,
  subjectName,
  subjects,
  tasks,
  todaySessions,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — My Study App" },
      {
        name: "description",
        content:
          "Your study dashboard: today's study time, tasks, upcoming exams, subject progress and recent notes.",
      },
      { property: "og:title", content: "Dashboard — My Study App" },
      {
        property: "og:description",
        content: "Track study time, tasks, exams and notes in one calm workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const tones = ["aurora", "violet", "pink"] as const;

function Dashboard() {
  const todayTasks = tasks.filter((t) => t.dueDate.startsWith("Today"));
  const completed = tasks.filter((t) => t.completed).length;
  const studyMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <AppShell
      title={`Good afternoon, ${student.name}`}
      subtitle="Tuesday, 17 March"
      action={
        <Button className="hidden sm:inline-flex">
          <Plus className="size-4" /> New Task
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Today's study time"
          value={formatMinutes(studyMinutes)}
          hint="+35m vs yesterday"
        />
        <StatCard
          label="Tasks completed"
          value={
            <>
              {completed}
              <span className="text-lg text-subtle-foreground">/{tasks.length}</span>
            </>
          }
          hint={`${Math.round((completed / tasks.length) * 100)}% done`}
        />
        <StatCard
          label="Next exam"
          value={`${exams[0]!.daysLeft} days`}
          hint={`${subjectName(exams[0]!.subjectId)} · Fri`}
          accent
        />
        <StatCard
          label="Subjects active"
          value={subjects.length}
          hint="2 on track"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle
            title="Today's focus"
            action={
              <Link to="/tasks" className="text-xs font-semibold text-aurora hover:underline">
                View all
              </Link>
            }
          />
          <ul className="mt-4 flex flex-col gap-2">
            {todayTasks.map((task, i) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-inset px-4 py-3"
              >
                <span
                  aria-hidden
                  className={
                    task.completed
                      ? "grid size-5 shrink-0 place-items-center rounded-md bg-aurora/20 text-xs text-aurora"
                      : "grid size-5 shrink-0 place-items-center rounded-md border border-border"
                  }
                >
                  {task.completed ? "✓" : ""}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-sm font-medium ${
                    task.completed ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {task.title}
                </span>
                <Badge tone={tones[i % tones.length]}>{subjectName(task.subjectId)}</Badge>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3">
            {subjects.slice(0, 3).map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{s.name}</span>
                  <span className="tabular-nums">{s.progress}%</span>
                </div>
                <ProgressBar value={s.progress} className="mt-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Study Timer" action={<Badge tone="aurora">Focus</Badge>} />
          <div className="relative mx-auto mt-5 grid size-40 place-items-center sm:size-44">
            <div className="absolute inset-0 rounded-full border-8 border-border" />
            <div
              className="absolute inset-0 rounded-full border-8 border-transparent border-r-aurora-2 border-t-aurora"
              style={{ transform: "rotate(35deg)" }}
            />
            <div className="text-center">
              <p className="font-display text-4xl font-extrabold tabular-nums">24:12</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                of 50 min
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Link to="/timer" className="flex-1">
              <Button className="w-full">
                <Play className="size-4" /> Open timer
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-center text-[11px] text-subtle-foreground">
            {todaySessions.length} sessions today · {formatMinutes(studyMinutes)} total
          </p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-display text-sm font-bold">Upcoming exams</h3>
          <div className="mt-3 flex flex-col gap-3">
            {exams.map((exam, i) => (
              <div key={exam.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-sm">{exam.name}</span>
                <Badge tone={tones[i % tones.length]}>{exam.daysLeft} days</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle
            title="Recent notes"
            action={
              <Link to="/notes" className="text-xs font-semibold text-aurora hover:underline">
                All notes
              </Link>
            }
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {notes
              .filter((n) => n.images.length > 0)
              .slice(0, 2)
              .map((note) => (
                <Link
                  key={note.id}
                  to="/notes"
                  className="rounded-xl border border-border bg-inset p-3 transition hover:-translate-y-0.5 hover:border-aurora/40"
                >
                  <img
                    src={note.images[0]!}
                    alt={`Photo attached to ${note.title}`}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 text-sm font-semibold">{note.title}</p>
                  <p className="mt-0.5 text-[11px] text-subtle-foreground">
                    Updated {note.updatedAt.toLowerCase()} · {note.images.length} photos
                  </p>
                </Link>
              ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="font-display text-sm font-bold">Quick actions</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { to: "/timer", label: "Start timer", hint: "50 min focus", icon: TimerIcon },
            { to: "/tasks", label: "New task", hint: "Set due date", icon: Plus },
            { to: "/notes", label: "Add note", hint: "Attach a photo", icon: NotebookPen },
            { to: "/subjects", label: "Add subject", hint: "Track progress", icon: Plus },
          ].map(({ to, label, hint, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="rounded-xl border border-border bg-inset p-4 transition hover:-translate-y-0.5 hover:border-aurora/40"
            >
              <Icon className="size-4 text-aurora" />
              <span className="mt-2 block text-sm font-semibold">{label}</span>
              <span className="block text-[11px] text-subtle-foreground">{hint}</span>
            </Link>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
