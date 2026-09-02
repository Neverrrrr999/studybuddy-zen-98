import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, NotebookPen, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import {
  notes as seedNotes,
  subjectName,
  subjects,
  type Note,
} from "@/lib/mock-data";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — My Study App" },
      {
        name: "description",
        content:
          "Write study notes, attach photos of textbook pages and diagrams, and search by subject.",
      },
      { property: "og:title", content: "Notes — My Study App" },
      {
        property: "og:description",
        content: "Notes with photo attachments for textbook pages and diagrams.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [items, setItems] = useState<Note[]>(seedNotes);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ note: Note; index: number } | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (n) =>
          (subject === "all" || n.subjectId === subject) &&
          (n.title + n.content).toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query, subject],
  );

  const openEditor = (note: Note | null) => {
    setEditing(note);
    setEditorOpen(true);
  };

  return (
    <AppShell
      title="Notes"
      subtitle={`${items.length} notes saved`}
      action={
        <Button onClick={() => openEditor(null)}>
          <Plus className="size-4" /> <span className="hidden sm:inline">Add Note</span>
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
            aria-label="Search notes"
            className="pl-10"
          />
        </div>
        <Select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="Filter by subject"
          className="sm:w-52"
        >
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="size-5" />}
            title="No notes found"
            description="Write your first note, or attach a photo of a textbook page, diagram or handwritten sheet."
            action={
              <Button onClick={() => openEditor(null)}>
                <Plus className="size-4" /> Add Note
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((note) => (
              <Card key={note.id} className="flex flex-col p-4 sm:p-5">
                {note.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {note.images.slice(0, 3).map((src, i) => (
                      <button
                        key={src + i}
                        onClick={() => setLightbox({ note, index: i })}
                        className="overflow-hidden rounded-lg border border-border"
                        aria-label={`Open photo ${i + 1} of ${note.title}`}
                      >
                        <img
                          src={src}
                          alt={`Attachment ${i + 1} for ${note.title}`}
                          loading="lazy"
                          width={1024}
                          height={576}
                          className="aspect-square w-full object-cover transition duration-200 hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 flex items-start justify-between gap-2">
                  <h2 className="min-w-0 flex-1 text-base font-bold">{note.title}</h2>
                  <Badge tone="violet">{subjectName(note.subjectId)}</Badge>
                </div>
                <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">
                  {note.content}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <p className="text-[11px] text-subtle-foreground">
                    Updated {note.updatedAt.toLowerCase()}
                    {note.images.length ? ` · ${note.images.length} photos` : ""}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${note.title}`}
                      onClick={() => openEditor(note)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${note.title}`}
                      onClick={() => setDeleteId(note.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Note editor with photo attachment UI */}
      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? "Edit note" : "New note"}
        description="Attach photos of textbook pages, diagrams or handwritten notes."
        wide
        footer={
          <>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditorOpen(false)}>
              {editing ? "Save note" : "Create note"}
            </Button>
          </>
        }
      >
        <Field label="Title">
          <TextInput defaultValue={editing?.title ?? ""} placeholder="Note title" />
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
        <Field label="Content">
          <TextArea
            defaultValue={editing?.content ?? ""}
            placeholder="Write your note…"
            className="min-h-40"
          />
        </Field>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Photos</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {(editing?.images ?? []).map((src, i) => (
              <div
                key={src + i}
                className="relative overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={src}
                  alt={`Attachment ${i + 1}`}
                  loading="lazy"
                  width={1024}
                  height={576}
                  className="aspect-square w-full object-cover"
                />
                <button
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/80 text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-inset text-center text-[11px] text-muted-foreground transition hover:border-aurora/50 hover:text-foreground">
              <ImagePlus className="size-5 text-aurora" />
              Add photo
              <input type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-subtle-foreground">
            Take a photo of a page or pick several images at once.
          </p>
        </div>
      </Modal>

      {/* Responsive photo viewer */}
      {lightbox ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-semibold">{lightbox.note.title}</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close photo viewer"
              onClick={() => setLightbox(null)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            <img
              src={lightbox.note.images[lightbox.index]}
              alt={`Attachment ${lightbox.index + 1} for ${lightbox.note.title}`}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>
          <div className="flex justify-center gap-2">
            {lightbox.note.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setLightbox({ note: lightbox.note, index: i })}
                aria-label={`Show photo ${i + 1}`}
                className={`size-14 overflow-hidden rounded-lg border ${
                  i === lightbox.index ? "border-aurora" : "border-border opacity-60"
                }`}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setItems((prev) => prev.filter((n) => n.id !== deleteId))}
        title="Delete note?"
        description="The note and its attached photos will be removed."
      />
    </AppShell>
  );
}
