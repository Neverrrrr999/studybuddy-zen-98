import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  ProgressBar,
  Select,
  TextInput,
} from "@/components/ui-kit";
import { exams as seedExams, subjectName, subjects, type Exam } from "@/lib/mock-data";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [
      { title: "Exams — My Study App" },
      {
        name: "description",
        content:
          "Track upcoming exams with countdowns, dates and the subject each one belongs to.",
      },
      { property: "og:title", content: "Exams — My Study App" },
      {
        property: "og:description",
        content: "Upcoming exams with countdowns and subject details.",
      },
    ],
  }),
  component: ExamsPage,
});

function ExamsPage() {
  const [items, setItems] = useState<Exam[]>(seedExams);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <AppShell
      title="Exams"
      subtitle={`${items.length} exams scheduled`}
      action={
        <Button onClick={openNew}>
          <Plus className="size-4" /> <span className="hidden sm:inline">Add Exam</span>
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<CalendarClock className="size-5" />}
          title="No exams scheduled"
          description="Add your exam dates and we'll count down the days left so nothing sneaks up on you."
          action={
            <Button onClick={openNew}>
              <Plus className="size-4" /> Add Exam
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((exam) => (
            <Card key={exam.id} className="transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <Badge tone="violet">{subjectName(exam.subjectId)}</Badge>
                  <h2 className="mt-2 text-base font-bold">{exam.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{exam.date}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${exam.name}`}
                    onClick={() => {
                      setEditing(exam);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${exam.name}`}
                    onClick={() => setDeleteId(exam.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-inset p-4 text-center">
                <p className="font-display text-3xl font-extrabold text-aurora-3">
                  {exam.daysLeft}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  days remaining
                </p>
              </div>
              <ProgressBar
                value={Math.max(5, 100 - exam.daysLeft * 5)}
                className="mt-4"
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit exam" : "Add exam"}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setFormOpen(false)}>
              {editing ? "Save exam" : "Add exam"}
            </Button>
          </>
        }
      >
        <Field label="Exam name">
          <TextInput
            defaultValue={editing?.name ?? ""}
            placeholder="e.g. Calculus II Midterm"
          />
        </Field>
        <Field label="Subject">
          <Select defaultValue={editing?.subjectId ?? subjects[0]!.id}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Exam date">
          <TextInput type="date" />
        </Field>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setItems((prev) => prev.filter((e) => e.id !== deleteId))}
        title="Delete exam?"
        description="The exam and its countdown will be removed."
      />
    </AppShell>
  );
}
