import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  ProgressBar,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import { formatMinutes, subjects as seedSubjects, type Subject } from "@/lib/mock-data";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — My Study App" },
      {
        name: "description",
        content: "Manage your subjects, their descriptions, progress and study time.",
      },
      { property: "og:title", content: "Subjects — My Study App" },
      {
        property: "og:description",
        content: "Manage subjects with progress and logged study time.",
      },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const [items, setItems] = useState<Subject[]>(seedSubjects);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <AppShell
      title="Subjects"
      subtitle={`${items.length} active this term`}
      action={
        <Button onClick={openNew}>
          <Plus className="size-4" /> <span className="hidden sm:inline">Add Subject</span>
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-5" />}
          title="No subjects yet"
          description="Add the courses you're studying to track progress and study time for each one."
          action={
            <Button onClick={openNew}>
              <Plus className="size-4" /> Add Subject
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((subject) => (
            <Card
              key={subject.id}
              className="transition duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold">{subject.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subject.description}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${subject.name}`}
                    onClick={() => {
                      setEditing(subject);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${subject.name}`}
                    onClick={() => setDeleteId(subject.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="tabular-nums">{subject.progress}%</span>
                </div>
                <ProgressBar value={subject.progress} className="mt-2" />
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-subtle-foreground">
                <Clock className="size-3.5" /> {formatMinutes(subject.studyMinutes)} studied
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit subject" : "Add subject"}
        description="Subjects group your notes, tasks and study sessions."
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setFormOpen(false)}>
              {editing ? "Save changes" : "Add subject"}
            </Button>
          </>
        }
      >
        <Field label="Subject name">
          <TextInput defaultValue={editing?.name ?? ""} placeholder="e.g. Calculus II" />
        </Field>
        <Field label="Description">
          <TextArea
            defaultValue={editing?.description ?? ""}
            placeholder="What does this subject cover?"
          />
        </Field>
        <Field label="Progress (%)">
          <TextInput
            type="number"
            min={0}
            max={100}
            defaultValue={editing?.progress ?? 0}
          />
        </Field>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setItems((prev) => prev.filter((s) => s.id !== deleteId))}
        title="Delete subject?"
        description="This removes the subject card. Notes and tasks stay, but lose their subject label."
      />
    </AppShell>
  );
}
