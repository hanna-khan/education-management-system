"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavigationForRole } from "@/config/navigation";
import { useApp } from "@/hooks/use-app";
import { getThemePreset } from "@/config/themes";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNavIcon } from "@/components/navigation/nav-icons";
import { InstitutionSwitcher } from "@/components/navigation/institution-switcher";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, sidebarCollapsed, themePreset, institutionMode, enabledModules } = useApp();
  const navigation = getNavigationForRole(user.role, institutionMode, enabledModules);
  const coloredSidebar = getThemePreset(themePreset).coloredSidebar;
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    academics: true,
  });

  const toggleGroup = (id: string) => {
    setExpandedGroups((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-[var(--sidebar)] transition-all duration-200",
        sidebarCollapsed ? "w-[72px]" : "w-64",
        coloredSidebar
          ? "shadow-[var(--shadow-md)]"
          : "border-r border-[var(--sidebar-border)]",
      )}
    >
      {/* Brand — no divider line */}
      <div className={cn("flex items-center px-4", coloredSidebar ? "pt-5 pb-2" : "h-16")}>
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold",
              coloredSidebar
                ? "bg-white text-[#6B58F6] shadow-sm"
                : "text-white",
            )}
            style={coloredSidebar ? undefined : { backgroundColor: "var(--brand-primary)" }}
          >
            {coloredSidebar ? <GraduationCap className="size-5" /> : "Z"}
          </div>
          {!sidebarCollapsed ? (
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-sm font-bold tracking-tight",
                  coloredSidebar ? "text-white" : "text-[var(--foreground)]",
                )}
              >
                Zendrock EMS
              </p>
              <p
                className={cn(
                  "truncate text-xs",
                  coloredSidebar ? "text-white/65" : "text-[var(--sidebar-muted)]",
                )}
              >
                Education Platform
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Institution — glass chip, no black logo, no border line */}
      {!sidebarCollapsed && user.role !== "platform_admin" ? (
        <div className={cn(coloredSidebar ? "px-3 pb-3 pt-2" : "border-b border-[var(--sidebar-border)] p-3")}>
          <InstitutionSwitcher compact tone={coloredSidebar ? "onBrand" : "default"} />
        </div>
      ) : null}

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-5">
          {navigation.map((group) => (
            <div key={group.id}>
              {!sidebarCollapsed ? (
                <p
                  className={cn(
                    "mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em]",
                    coloredSidebar ? "text-white/45" : "text-[var(--sidebar-muted)]",
                  )}
                >
                  {group.label}
                </p>
              ) : null}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = getNavIcon(item.icon);
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedGroups[item.id] ?? isActive;

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={
                          hasChildren
                            ? (event) => {
                                event.preventDefault();
                                toggleGroup(item.id);
                              }
                            : undefined
                        }
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                          isActive
                            ? coloredSidebar
                              ? "bg-white/20 text-white shadow-sm"
                              : "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] shadow-[var(--shadow-xs)]"
                            : coloredSidebar
                              ? "text-white/75 hover:bg-white/10 hover:text-white"
                              : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
                          sidebarCollapsed && "justify-center px-2",
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <Icon className="size-4 shrink-0" />
                        {!sidebarCollapsed ? (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge ? (
                              <Badge
                                variant="info"
                                className={cn(
                                  "h-5 min-w-5 justify-center px-1.5",
                                  coloredSidebar && "border-0 bg-white/25 text-white",
                                )}
                              >
                                {item.badge}
                              </Badge>
                            ) : null}
                            {hasChildren ? (
                              <ChevronDown
                                className={cn(
                                  "size-4 transition-transform",
                                  isExpanded && "rotate-180",
                                )}
                              />
                            ) : null}
                          </>
                        ) : null}
                      </Link>

                      {hasChildren && isExpanded && !sidebarCollapsed ? (
                        <ul className="mt-1 space-y-1 pl-4">
                          {item.children!.map((child) => {
                            const ChildIcon = getNavIcon(child.icon);
                            const childActive =
                              pathname === child.href ||
                              pathname.startsWith(`${child.href}/`);
                            return (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-colors",
                                    childActive
                                      ? coloredSidebar
                                        ? "bg-white/15 font-medium text-white"
                                        : "bg-[var(--sidebar-active)] font-medium text-[var(--sidebar-active-text)]"
                                      : coloredSidebar
                                        ? "text-white/65 hover:bg-white/10 hover:text-white"
                                        : "text-[var(--sidebar-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
                                  )}
                                >
                                  <ChildIcon className="size-3.5" />
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
