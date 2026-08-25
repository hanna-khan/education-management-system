"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_INSTITUTION_ID, DEMO_INSTITUTIONS } from "@/config/institutions";
import {
  DEFAULT_THEME_PRESET,
  type ColorMode,
  type ThemePresetId,
} from "@/config/themes";
import { ThemeApplier, persistTheme, readStoredColorMode, readStoredTheme } from "@/components/theme/theme-applier";
import { mockParentChildren, type ParentChild } from "@/mock/portals";
import { DEMO_USERS, DEFAULT_DEMO_USER_KEY } from "@/mock/users";
import type { Institution, InstitutionType, User, UserRole } from "@/types";

interface AppContextValue {
  user: User;
  institution: Institution;
  institutions: Institution[];
  colorMode: ColorMode;
  themePreset: ThemePresetId;
  sidebarCollapsed: boolean;
  institutionMode: InstitutionType;
  selectedChildId: string;
  selectedChild: ParentChild;
  setRole: (roleKey: keyof typeof DEMO_USERS) => void;
  setInstitution: (institutionId: string) => void;
  setSelectedChildId: (childId: string) => void;
  setThemePreset: (preset: ThemePresetId) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  toggleSidebar: () => void;
  setInstitutionMode: (mode: InstitutionType) => void;
  /** @deprecated Use colorMode */
  theme: ColorMode;
  /** @deprecated Use toggleColorMode */
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [roleKey, setRoleKey] = useState<keyof typeof DEMO_USERS>(DEFAULT_DEMO_USER_KEY);
  const [institutionId, setInstitutionId] = useState(DEFAULT_INSTITUTION_ID);
  const [themePreset, setThemePresetState] = useState<ThemePresetId>(DEFAULT_THEME_PRESET);
  const [colorMode, setColorModeState] = useState<ColorMode>("light");
  const [hydrated, setHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [institutionMode, setInstitutionMode] = useState<InstitutionType>("university");
  const [selectedChildId, setSelectedChildIdState] = useState(mockParentChildren[0].id);

  useEffect(() => {
    const storedPreset = readStoredTheme();
    const storedMode = readStoredColorMode();
    if (storedPreset) setThemePresetState(storedPreset);
    if (storedMode) setColorModeState(storedMode);
    setHydrated(true);
  }, []);

  const user = DEMO_USERS[roleKey];
  const institution =
    DEMO_INSTITUTIONS.find((item) => item.id === institutionId) ?? DEMO_INSTITUTIONS[0];
  const selectedChild =
    mockParentChildren.find((child) => child.id === selectedChildId) ?? mockParentChildren[0];

  const setRole = useCallback((key: keyof typeof DEMO_USERS) => {
    setRoleKey(key);
  }, []);

  const setInstitution = useCallback((id: string) => {
    setInstitutionId(id);
    const next = DEMO_INSTITUTIONS.find((item) => item.id === id);
    if (next) setInstitutionMode(next.type);
  }, []);

  const setSelectedChildId = useCallback((childId: string) => {
    setSelectedChildIdState(childId);
  }, []);

  const setThemePreset = useCallback(
    (preset: ThemePresetId) => {
      setThemePresetState(preset);
      persistTheme(preset, colorMode);
    },
    [colorMode],
  );

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setColorModeState(mode);
      persistTheme(themePreset, mode);
    },
    [themePreset],
  );

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  }, [colorMode, setColorMode]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      institution,
      institutions: DEMO_INSTITUTIONS,
      colorMode,
      themePreset,
      sidebarCollapsed,
      institutionMode,
      selectedChildId,
      selectedChild,
      setRole,
      setInstitution,
      setSelectedChildId,
      setThemePreset,
      setColorMode,
      toggleColorMode,
      toggleSidebar,
      setInstitutionMode,
      theme: colorMode,
      toggleTheme: toggleColorMode,
    }),
    [
      user,
      institution,
      colorMode,
      themePreset,
      sidebarCollapsed,
      institutionMode,
      selectedChildId,
      selectedChild,
      setRole,
      setInstitution,
      setSelectedChildId,
      setThemePreset,
      setColorMode,
      toggleColorMode,
      toggleSidebar,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <ThemeApplier preset={themePreset} colorMode={colorMode} />
      <div className={hydrated ? "theme-transition min-h-full" : "min-h-full"}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export function formatRoleLabel(role: UserRole) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
