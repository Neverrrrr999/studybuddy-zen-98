import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button, Card, ConfirmDialog, SectionTitle } from "@/components/ui-kit";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — My Study App" },
      {
        name: "description",
        content: "Choose your theme and manage the data stored on this device.",
      },
      { property: "og:title", content: "Settings — My Study App" },
      {
        property: "og:description",
        content: "Theme selection and data management for My Study App.",
      },
    ],
  }),
  component: SettingsPage,
});

const themes: { value: Theme; label: string; hint: string; icon: typeof Sun }[] = [
  { value: "dark", label: "Dark mode", hint: "Easy on the eyes at night", icon: Moon },
  { value: "light", label: "Light mode", hint: "Bright and crisp for daytime", icon: Sun },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cleared, setCleared] = useState(false);

  return (
    <AppShell title="Settings" subtitle="Preferences and data">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Appearance" />
          <p className="mt-1 text-sm text-muted-foreground">
            Pick the theme that's most comfortable for long study sessions.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {themes.map(({ value, label, hint, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  theme === value
                    ? "border-aurora bg-input"
                    : "border-border bg-inset hover:border-aurora/40",
                )}
              >
                <Icon className={cn("size-5", theme === value && "text-aurora")} />
                <span className="mt-3 block text-sm font-semibold">{label}</span>
                <span className="mt-0.5 block text-[11px] text-subtle-foreground">
                  {hint}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Data management" />
          <p className="mt-1 text-sm text-muted-foreground">
            Your subjects, notes, tasks and sessions are stored on this device only.
          </p>
          <div className="mt-5 rounded-2xl border border-border bg-inset p-4">
            <p className="text-sm font-semibold">Clear all app data</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Removes every subject, note, task, exam and study session. This can't be
              undone.
            </p>
            <Button
              variant="danger"
              className="mt-4"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="size-4" /> Clear all data
            </Button>
            {cleared ? (
              <p className="mt-3 text-xs text-aurora">
                All app data has been cleared on this device.
              </p>
            ) : null}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setCleared(true)}
        title="Clear all app data?"
        description="Every subject, note, task, exam and study session will be permanently deleted from this device."
        confirmLabel="Clear everything"
      />
    </AppShell>
  );
}
