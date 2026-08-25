export type ThemePresetId =
  | "edu-center"
  | "slate-professional"
  | "indigo-enterprise"
  | "executive-navy"
  | "ocean-blue"
  | "forest-academic"
  | "royal-burgundy"
  | "warm-linen"
  | "graphite-pro";

export type ColorMode = "light" | "dark";

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  category: "professional" | "academic" | "modern" | "warm";
  preview: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    sidebar?: string;
  };
  featured?: boolean;
  /** Solid colored sidebar (Edu-Center style) */
  coloredSidebar?: boolean;
}

/** Default: Edu-Center — matches Behance Edu-Center soft purple SaaS look */
export const DEFAULT_THEME_PRESET: ThemePresetId = "edu-center";

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "edu-center",
    name: "Edu Center",
    description:
      "Soft purple Soft-UI dashboard inspired by premium education SaaS. Colored sidebar, rounded cards, Poppins + Open Sans.",
    category: "modern",
    featured: true,
    coloredSidebar: true,
    preview: {
      background: "#F8F9FD",
      surface: "#ffffff",
      primary: "#6B58F6",
      secondary: "#8C4AF2",
      accent: "#1BD0B4",
      sidebar: "#6B58F6",
    },
  },
  {
    id: "slate-professional",
    name: "Slate Professional",
    description: "Clean, minimal cool grays with subtle contrast. Ideal for modern enterprise dashboards.",
    category: "professional",
    preview: { background: "#f1f5f9", surface: "#ffffff", primary: "#0f172a", secondary: "#334155", accent: "#64748b" },
  },
  {
    id: "indigo-enterprise",
    name: "Indigo Enterprise",
    description: "Rich indigo accents on crisp white surfaces. Premium SaaS aesthetic.",
    category: "modern",
    preview: { background: "#f5f7ff", surface: "#ffffff", primary: "#3730a3", secondary: "#6366f1", accent: "#818cf8" },
  },
  {
    id: "executive-navy",
    name: "Executive Navy",
    description: "Deep navy authority with refined borders. Built for university administration.",
    category: "academic",
    preview: { background: "#f4f6f9", surface: "#ffffff", primary: "#152238", secondary: "#2c4270", accent: "#5c6578" },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Trustworthy blue tones with excellent readability for data-heavy interfaces.",
    category: "professional",
    preview: { background: "#f0f7ff", surface: "#ffffff", primary: "#0c4a6e", secondary: "#0369a1", accent: "#0ea5e9" },
  },
  {
    id: "forest-academic",
    name: "Forest Academic",
    description: "Institutional green palette conveying stability, growth, and academic tradition.",
    category: "academic",
    preview: { background: "#f3f6f4", surface: "#ffffff", primary: "#14532d", secondary: "#166534", accent: "#059669" },
  },
  {
    id: "royal-burgundy",
    name: "Royal Burgundy",
    description: "Classic university burgundy with warm neutrals. Distinguished and formal.",
    category: "academic",
    preview: { background: "#faf8f8", surface: "#ffffff", primary: "#6b1d36", secondary: "#9f1239", accent: "#be123c" },
  },
  {
    id: "warm-linen",
    name: "Warm Linen",
    description: "Soft warm neutrals that reduce eye strain. Approachable yet professional.",
    category: "warm",
    preview: { background: "#faf8f5", surface: "#fffdfa", primary: "#44403c", secondary: "#78716c", accent: "#a8a29e" },
  },
  {
    id: "graphite-pro",
    name: "Graphite Pro",
    description: "Sophisticated charcoal surfaces with sharp contrast. Best in dark mode.",
    category: "modern",
    featured: true,
    preview: { background: "#18181b", surface: "#27272a", primary: "#fafafa", secondary: "#a1a1aa", accent: "#71717a" },
  },
];

export const THEME_STORAGE_KEY = "ems-theme-preset";
export const COLOR_MODE_STORAGE_KEY = "ems-color-mode";

export function getThemePreset(id: ThemePresetId): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}
