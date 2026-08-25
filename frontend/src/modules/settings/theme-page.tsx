"use client";

import { Check, Moon, Palette, RotateCcw, Sun } from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  THEME_PRESETS,
  DEFAULT_THEME_PRESET,
  type ThemePreset,
  type ThemePresetId,
} from "@/config/themes";
import { useApp } from "@/hooks/use-app";
import { SETTINGS_TABS } from "@/mock/portals";
import { cn } from "@/lib/utils";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
  { label: "Appearance" },
];

function ThemePreviewCard({
  preset,
  active,
  onSelect,
}: {
  preset: ThemePreset;
  active: boolean;
  onSelect: () => void;
}) {
  const { preview } = preset;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border-2 text-left transition-all duration-200",
        active
          ? "border-[var(--brand-primary)] shadow-[var(--shadow-md)] ring-2 ring-[var(--brand-primary)]/20"
          : "border-[var(--border)] hover:border-[var(--muted-foreground)] hover:shadow-[var(--shadow-sm)]",
      )}
    >
      {active ? (
        <div className="absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </div>
      ) : null}

      {/* Mini UI preview — mirrors Edu-Center soft purple layout */}
      <div className="p-3" style={{ backgroundColor: preview.background }}>
        <div className="flex gap-2 overflow-hidden rounded-xl" style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
          <div
            className="flex w-7 shrink-0 flex-col gap-1 rounded-l-xl p-1.5"
            style={{ backgroundColor: preview.sidebar ?? preview.primary }}
          >
            <div className="mb-1 h-1.5 w-full rounded-sm bg-white/90" />
            <div className="h-1 w-full rounded-sm bg-white/35" />
            <div className="h-1 w-full rounded-sm bg-white/25" />
            <div className="h-1 w-3/4 rounded-sm bg-white/20" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5 bg-white/60 p-2">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: preview.surface, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div className="mb-1 flex gap-1">
                <div className="h-2 w-6 rounded-sm" style={{ backgroundColor: preview.primary }} />
                <div className="h-2 w-4 rounded-sm opacity-40" style={{ backgroundColor: preview.accent }} />
              </div>
              <div className="h-1 w-full rounded opacity-15" style={{ backgroundColor: preview.primary }} />
            </div>
            <div className="flex gap-1">
              <div className="h-3.5 flex-1 rounded-md" style={{ backgroundColor: preview.primary, opacity: 0.9 }} />
              <div className="h-3.5 w-3.5 rounded-md" style={{ backgroundColor: preview.accent, opacity: 0.7 }} />
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          {[preview.primary, preview.secondary, preview.accent, preview.sidebar ?? preview.primary, preview.background].map(
            (color, i) => (
              <div
                key={i}
                className="size-3 rounded-full border border-black/5"
                style={{ backgroundColor: color }}
              />
            ),
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{preset.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{preset.description}</p>
          </div>
          {preset.featured ? (
            <Badge variant="info" className="shrink-0 text-[10px]">Popular</Badge>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function SettingsThemePage() {
  const { themePreset, setThemePreset, colorMode, setColorMode } = useApp();

  const categories = [
    { id: "featured", label: "Recommended", filter: (t: ThemePreset) => t.featured },
    { id: "professional", label: "Professional", filter: (t: ThemePreset) => t.category === "professional" },
    { id: "academic", label: "Academic", filter: (t: ThemePreset) => t.category === "academic" },
    { id: "modern", label: "Modern", filter: (t: ThemePreset) => t.category === "modern" || t.category === "warm" },
  ];

  return (
    <ModuleHub
      title="Appearance & Theme"
      description="Choose a premium theme for the entire application. Changes apply instantly across all modules and portals."
      breadcrumbs={breadcrumbs}
      tabs={SETTINGS_TABS}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setThemePreset(DEFAULT_THEME_PRESET);
            setColorMode("light");
          }}
        >
          <RotateCcw className="size-4" />
          Reset default
        </Button>
      }
    >
      {/* Color mode */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Color mode</p>
            <p className="text-xs text-[var(--muted)]">
              Switch between light and dark. Works with every theme preset.
            </p>
          </div>
          <div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-1">
            <button
              type="button"
              onClick={() => setColorMode("light")}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                colorMode === "light"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-xs)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              <Sun className="size-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setColorMode("dark")}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                colorMode === "dark"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-xs)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              <Moon className="size-4" />
              Dark
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Active theme indicator */}
      <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--brand-primary)] text-white">
          <Palette className="size-4" />
        </div>
        <div>
          <p className="text-xs text-[var(--muted)]">Active theme</p>
          <p className="text-sm font-semibold">
            {THEME_PRESETS.find((t) => t.id === themePreset)?.name ?? themePreset}
            <span className="ml-2 font-normal text-[var(--muted)]">
              · {colorMode === "light" ? "Light" : "Dark"} mode
            </span>
          </p>
        </div>
      </div>

      {/* Theme grid by category */}
      {categories.map((cat) => {
        const themes = THEME_PRESETS.filter(cat.filter);
        if (themes.length === 0) return null;
        return (
          <div key={cat.id}>
            <h3 className="ems-label mb-3">{cat.label}</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {themes.map((preset) => (
                <ThemePreviewCard
                  key={preset.id}
                  preset={preset}
                  active={themePreset === preset.id}
                  onSelect={() => setThemePreset(preset.id as ThemePresetId)}
                />
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-[var(--muted-foreground)]">
        Theme preferences are saved locally and apply across admin, student, parent, teacher, and platform portals.
      </p>
    </ModuleHub>
  );
}
