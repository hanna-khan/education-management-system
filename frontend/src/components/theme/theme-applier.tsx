"use client";

import { useEffect } from "react";
import type { ColorMode, ThemePresetId } from "@/config/themes";

interface ThemeApplierProps {
  preset: ThemePresetId;
  colorMode: ColorMode;
}

/** Applies theme preset + light/dark mode to the document root for app-wide styling. */
export function ThemeApplier({ preset, colorMode }: ThemeApplierProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme-preset", preset);
    root.setAttribute("data-theme", colorMode);
  }, [preset, colorMode]);

  return null;
}

export function readStoredTheme(): ThemePresetId | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ems-theme-preset") as ThemePresetId | null;
}

export function readStoredColorMode(): ColorMode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("ems-color-mode");
  return stored === "dark" || stored === "light" ? stored : null;
}

export function persistTheme(preset: ThemePresetId, colorMode: ColorMode) {
  localStorage.setItem("ems-theme-preset", preset);
  localStorage.setItem("ems-color-mode", colorMode);
}
