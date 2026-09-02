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
import { getDefaultEnabledModules } from "@/config/modules";
import {
  getRoleDisplayLabel,
  resolveTerm,
  type TermKey,
} from "@/config/terminology";
import {
  DEFAULT_THEME_PRESET,
  type ColorMode,
  type ThemePresetId,
} from "@/config/themes";
import { ThemeApplier, persistTheme, readStoredColorMode, readStoredTheme } from "@/components/theme/theme-applier";
import { mockParentChildren, type ParentChild } from "@/mock/portals";
import {
  clearAuthStorage,
  getStoredSession,
  getToken,
  setInstitutionHeader,
  setStoredSession,
} from "@/lib/api";
import { me } from "@/services/auth";
import type { Institution, InstitutionType, User, UserRole } from "@/types";

const GUEST_USER: User = {
  id: "guest",
  name: "Guest",
  email: "",
  role: "institution_admin",
  institutionId: "",
};

const GUEST_INSTITUTION: Institution = {
  id: "",
  name: "",
  shortName: "",
  type: "school",
  status: "trial",
  logoInitials: "Z",
  primaryColor: "#1F6B5A",
  secondaryColor: "#185447",
  city: "",
  studentCount: 0,
  staffCount: 0,
};

interface AppContextValue {
  ready: boolean;
  isAuthenticated: boolean;
  user: User;
  institution: Institution;
  institutions: Institution[];
  colorMode: ColorMode;
  themePreset: ThemePresetId;
  sidebarCollapsed: boolean;
  institutionMode: InstitutionType;
  selectedChildId: string;
  selectedChild: ParentChild;
  enabledModules: Record<string, boolean>;
  demoRoleKey: string;
  setSession: (user: User, institution: Institution | null) => void;
  clearSession: () => void;
  setRole: (roleKey: string) => void;
  setInstitution: (institutionId: string) => void;
  setSelectedChildId: (childId: string) => void;
  setThemePreset: (preset: ThemePresetId) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  toggleSidebar: () => void;
  setInstitutionMode: (mode: InstitutionType) => void;
  setModuleEnabled: (moduleId: string, enabled: boolean) => void;
  setEnabledModules: (modules: Record<string, boolean>) => void;
  t: (key: TermKey) => string;
  roleLabel: (role?: UserRole, demoKey?: string) => string;
  theme: ColorMode;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_CHILD: ParentChild = mockParentChildren[0];

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authInstitution, setAuthInstitution] = useState<Institution | null>(null);
  const [themePreset, setThemePresetState] = useState<ThemePresetId>(DEFAULT_THEME_PRESET);
  const [colorMode, setColorModeState] = useState<ColorMode>("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [institutionMode, setInstitutionMode] = useState<InstitutionType>("school");
  const [selectedChildId, setSelectedChildIdState] = useState(EMPTY_CHILD.id);
  const [enabledModules, setEnabledModulesState] = useState<Record<string, boolean>>({});

  const applyInstitution = useCallback((inst: Institution | null) => {
    setAuthInstitution(inst);
    if (!inst) return;
    setInstitutionMode(inst.type);
    setInstitutionHeader(inst.id);
    const defaults = getDefaultEnabledModules(inst.id, inst.type);
    const merged = inst.modules ? { ...defaults, ...inst.modules } : { ...defaults };
    const planModules =
      inst.subscription?.plan?.modules || inst.access?.plan?.modules || {};
    Object.entries(planModules).forEach(([moduleId, allowed]) => {
      if (allowed === false) merged[moduleId] = false;
    });
    setEnabledModulesState(merged);
    if (typeof document !== "undefined" && inst.primaryColor) {
      document.documentElement.style.setProperty("--brand-primary", inst.primaryColor);
      if (inst.secondaryColor) {
        document.documentElement.style.setProperty("--brand-secondary", inst.secondaryColor);
      }
    }
  }, []);

  const setSession = useCallback(
    (nextUser: User, nextInstitution: Institution | null) => {
      setAuthUser(nextUser);
      applyInstitution(nextInstitution);
      setStoredSession({ user: nextUser, institution: nextInstitution });
    },
    [applyInstitution],
  );

  const clearSession = useCallback(() => {
    setAuthUser(null);
    setAuthInstitution(null);
    clearAuthStorage();
  }, []);

  useEffect(() => {
    const storedPreset = readStoredTheme();
    const storedMode = readStoredColorMode();
    if (storedPreset) setThemePresetState(storedPreset);
    if (storedMode) setColorModeState(storedMode);

    let cancelled = false;
    (async () => {
      const cached = getStoredSession<{ user: User; institution: Institution | null }>();
      if (cached?.user && getToken()) {
        setAuthUser(cached.user);
        if (cached.institution) applyInstitution(cached.institution);
      }

      if (getToken()) {
        try {
          const session = await me();
          if (cancelled) return;
          setSession(session.user, session.institution);
        } catch {
          if (!cancelled) clearSession();
        }
      } else if (!cancelled) {
        clearAuthStorage();
        setAuthUser(null);
        setAuthInstitution(null);
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [applyInstitution, clearSession, setSession]);

  const user = authUser ?? GUEST_USER;
  const institution = authInstitution ?? GUEST_INSTITUTION;
  const isAuthenticated = Boolean(authUser && getToken());

  const selectedChild =
    mockParentChildren.find((child) => child.id === selectedChildId) ?? EMPTY_CHILD;

  const setRole = useCallback((_key: string) => {
    /* demo role switching disabled in live mode */
  }, []);

  const setInstitution = useCallback((_id: string) => {
    /* multi-tenant switch only for platform admins later */
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

  const setModuleEnabled = useCallback((moduleId: string, enabled: boolean) => {
    setEnabledModulesState((prev) => ({ ...prev, [moduleId]: enabled }));
  }, []);

  const setEnabledModules = useCallback((modules: Record<string, boolean>) => {
    setEnabledModulesState(modules);
  }, []);

  const t = useCallback(
    (key: TermKey) => resolveTerm(key, institutionMode),
    [institutionMode],
  );

  const roleLabel = useCallback(
    (role?: UserRole, _demoKey?: string) =>
      getRoleDisplayLabel(role ?? user.role, institutionMode),
    [institutionMode, user.role],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      isAuthenticated,
      user,
      institution,
      institutions: isAuthenticated && authInstitution ? [authInstitution] : [],
      colorMode,
      themePreset,
      sidebarCollapsed,
      institutionMode,
      selectedChildId,
      selectedChild,
      enabledModules,
      demoRoleKey: user.role,
      setSession,
      clearSession,
      setRole,
      setInstitution,
      setSelectedChildId,
      setThemePreset,
      setColorMode,
      toggleColorMode,
      toggleSidebar,
      setInstitutionMode,
      setModuleEnabled,
      setEnabledModules,
      t,
      roleLabel,
      theme: colorMode,
      toggleTheme: toggleColorMode,
    }),
    [
      ready,
      isAuthenticated,
      user,
      institution,
      authInstitution,
      colorMode,
      themePreset,
      sidebarCollapsed,
      institutionMode,
      selectedChildId,
      selectedChild,
      enabledModules,
      setSession,
      clearSession,
      setRole,
      setInstitution,
      setSelectedChildId,
      setThemePreset,
      setColorMode,
      toggleColorMode,
      toggleSidebar,
      setModuleEnabled,
      setEnabledModules,
      t,
      roleLabel,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <ThemeApplier preset={themePreset} colorMode={colorMode} />
      <div className={ready ? "theme-transition min-h-full" : "min-h-full"}>{children}</div>
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
