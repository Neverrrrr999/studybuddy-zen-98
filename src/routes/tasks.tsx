import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
  TextInput,
} from "@/components/ui-kit";
import { subjectName, subjects, tasks as seedTasks, type Task } from "@/lib/mock-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — My Study App" },
      {
        name: "description",
        content:
          "Plan today's and upcoming study tasks with priorities, due dates and subjects.",
      },
      { property: "og:title", content: "Tasks — My Study App" },
      {
        property: "og:description",
        content: "Study tasks with priorities, due dates and subject filters.",
      },
    ],
  }),
  component: TasksPage,
});

const priorityTone = { high: "danger", medium: "violet", low: "neutral" } as const;

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-inset px-3 py-3 sm:px-4">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
        className="size-4 shrink-0 accent-[var(--aurora)]"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            task.completed ? "text-muted-foreground line-through" : ""
          }`}
        >
          {task.title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-subtle-foreground">
          {subjectName(task.subjectId)} · {task.dueDate}
        </p>
      </div>
      <Badge tone={priorityTone[task.priority]} className="capitalize">
        {task.priority}
      </Badge>
      <div className="hidden shrink-0 gap-1 sm:flex">
        <Button variant="ghost" size="icon" aria-label={`Edit ${task.title}`} onClick={onEdit}>
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${task.title}`}
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}

function TasksPage() {
  const [items, setItems] = useState<Task[]>(seedTasks);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [priority, setPriority] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (t) =>
          (subject === "all" || t.subjectId === subject) &&
          (priority === "all" || t.priority === priority) &&
          t.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query, subject, priority],
  );

  const groups = [
    {
      title: "Today",
      list: filtered.filter((t) => !t.completed && t.dueDate.startsWith("Today")),
    },
    {
      title: "Upcoming",
      list: filtered.filter((t) => !t.completed && !t.dueDate.startsWith("Today")),
    },
    { title: "Completed", list: filtered.filter((t) => t.completed) },
  ];

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  return (
    <AppShell
      title="Tasks"
      subtitle={`${items.filter((t) => !t.completed).length} open tasks`}
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" /> <span className="hidden sm:inline">Add Task</span>
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
            className="pl-10"
          />
        </div>
        <Select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="Filter by subject"
          className="sm:w-48"
        >
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Filter by priority"
          className="sm:w-40"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<CheckSquare className="size-5" />}
            title="Nothing here"
            description="No tasks match your filters. Add a task or clear the search to see everything."
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Add Task
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.title}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">{group.title}</h2>
                <Badge tone="aurora">{group.list.length}</Badge>
              </div>
              {group.list.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-subtle-foreground">
                  No {group.title.toLowerCase()} tasks
                </p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2">
                  {group.list.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggle(task.id)}
                      onEdit={() => {
                        setEditing(task);
                        setFormOpen(true);
                      }}
                      onDelete={() => setDeleteId(task.id)}
                    />
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit task" : "Add task"}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setFormOpen(false)}>
              {editing ? "Save task" : "Add task"}
            </Button>
          </>
        }
      >
        <Field label="Task">
          <TextInput defaultValue={editing?.title ?? ""} placeholder="What needs doing?" />
        </Field>
        <Field label="Subject">
          <Select defaultValue={editing?.subjectId ?? subjects[0].id}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Due date">
            <TextInput type="date" />
          </Field>
          <Field label="Priority">
            <Select defaultValue={editing?.priority ?? "medium"}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setItems((prev) => prev.filter((t) => t.id !== deleteId))}
        title="Delete task?"
        description="This task will be removed from your list."
      />
    </AppShell>
  );
}
