import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, Field, SectionTitle, TextInput } from "@/components/ui-kit";
import { formatMinutes, subjectName, todaySessions } from "@/lib/mock-data";

export const Route = createFileRoute("/timer")({
  head: () => ({
    meta: [
      { title: "Study Timer — My Study App" },
      {
        name: "description",
        content:
          "A focus timer with study and break modes, session history and daily study statistics.",
      },
      { property: "og:title", content: "Study Timer — My Study App" },
      {
        property: "og:description",
        content: "Focus timer with study and break modes plus daily statistics.",
      },
    ],
  }),
  component: TimerPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

function TimerPage() {
  const [mode, setMode] = useState<"study" | "break">("study");
  const [studyMinutes, setStudyMinutes] = useState(50);
  const [breakMinutes, setBreakMinutes] = useState(10);
  const [remaining, setRemaining] = useState(50 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = (mode === "study" ? studyMinutes : breakMinutes) * 60;

  useEffect(() => {
    setRemaining(total);
    setRunning(false);
  }, [total]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(
      () => setRemaining((r) => (r <= 1 ? 0 : r - 1)),
      1000,
    );
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const pct = total ? ((total - remaining) / total) * 100 : 0;
  const sessionMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <AppShell title="Study Timer" subtitle="Stay in the zone">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-xl border border-border bg-inset p-1">
              <Button
                variant={mode === "study" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setMode("study")}
              >
                Study mode
              </Button>
              <Button
                variant={mode === "break" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setMode("break")}
              >
                <Coffee className="size-3.5" /> Break mode
              </Button>
            </div>
            <Badge tone={mode === "study" ? "aurora" : "pink"}>
              {running ? "Running" : "Paused"}
            </Badge>
          </div>

          <div className="relative mx-auto mt-8 grid size-56 place-items-center sm:size-72">
            <div className="absolute inset-0 rounded-full border-8 border-border" />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--aurora) ${pct}%, transparent ${pct}%)`,
                mask: "radial-gradient(circle, transparent 62%, black 63%)",
                WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
              }}
            />
            <div className="text-center">
              <p className="font-display text-5xl font-extrabold tabular-nums sm:text-6xl">
                {pad(Math.floor(remaining / 60))}:{pad(remaining % 60)}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                of {mode === "study" ? studyMinutes : breakMinutes} min
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-2">
            {running ? (
              <Button onClick={() => setRunning(false)} className="min-w-32">
                <Pause className="size-4" /> Pause
              </Button>
            ) : (
              <Button onClick={() => setRunning(true)} className="min-w-32">
                <Play className="size-4" /> {remaining === total ? "Start" : "Resume"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setRunning(false);
                setRemaining(total);
              }}
            >
              <RotateCcw className="size-4" /> Reset
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Field label="Study duration (minutes)">
              <TextInput
                type="number"
                min={5}
                max={120}
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(Number(e.target.value) || 5)}
              />
            </Field>
            <Field label="Break duration (minutes)">
              <TextInput
                type="number"
                min={3}
                max={60}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value) || 3)}
              />
            </Field>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <SectionTitle title="Today's sessions" />
            <ul className="mt-4 flex flex-col gap-2">
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
                      Started {session.startedAt}
                    </p>
                  </div>
                  <Badge tone="aurora">{session.minutes}m</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle title="Study statistics" />
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Today", formatMinutes(sessionMinutes)],
                ["Sessions", `${todaySessions.length}`],
                ["Avg. session", formatMinutes(Math.round(sessionMinutes / todaySessions.length))],
                ["This week", "13h 15m"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-inset p-4">
                  <dt className="text-[11px] text-subtle-foreground">{label}</dt>
                  <dd className="mt-1 font-display text-xl font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
