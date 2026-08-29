"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CircleHelp,
  Menu,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { mockNotifications, mockParentNotifications } from "@/mock/navigation-data";
import { getNavigationForRole } from "@/config/navigation";
import { getNavIcon } from "@/components/navigation/nav-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch, useGlobalSearchShortcut } from "@/components/navigation/global-search";
import { RoleSwitcher } from "@/components/navigation/role-switcher";
import { InstitutionSwitcher } from "@/components/navigation/institution-switcher";
import { getThemePreset } from "@/config/themes";

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const {
    user,
    institution,
    colorMode,
    toggleColorMode,
    toggleSidebar,
    sidebarCollapsed,
    themePreset,
    roleLabel,
    demoRoleKey,
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const notifications =
    user.role === "parent" ? mockParentNotifications : mockNotifications;
  const unreadCount = notifications.filter((item) => !item.read).length;
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  useGlobalSearchShortcut(() => setSearchOpen(true));

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-2 bg-[var(--background)]/85 px-4 backdrop-blur-md lg:gap-3 lg:px-6">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6] lg:hidden"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        <button
          type="button"
          className="hidden size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6] lg:inline-flex"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-[#F4F2FB] px-4 py-2.5 text-left text-sm text-[#8B86A3] transition-colors hover:bg-[#EFEAFF] md:flex md:max-w-lg"
        >
          <Search className="size-4 shrink-0 text-[#6B58F6]" />
          <span className="truncate">Search students, courses, applications...</span>
          <kbd className="ml-auto hidden rounded-lg bg-white px-2 py-0.5 text-[10px] font-semibold text-[#6B58F6] shadow-sm lg:inline">
            Ctrl K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6] md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>

          <RoleSwitcher />

          <Link
            href="/ai"
            className="inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6]"
            aria-label="Zendrock AI"
            title="Zendrock AI"
          >
            <Sparkles className="size-4" />
          </Link>

          <Link
            href="/settings/theme"
            className="inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6]"
            aria-label="Theme settings"
          >
            <Palette className="size-4" />
          </Link>

          <button
            type="button"
            onClick={toggleColorMode}
            className="inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6]"
            aria-label="Toggle color mode"
          >
            {colorMode === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6]"
            aria-label="Help"
          >
            <CircleHelp className="size-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative inline-flex size-9 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-[#EFEAFF] hover:text-[#6B58F6]"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 ? (
                  <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#FF394B] text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 py-3"
                  asChild
                >
                  <Link href={notification.href ?? "#"} className="flex flex-col items-start gap-1">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-medium">{notification.title}</span>
                      {!notification.read ? <Badge variant="info">New</Badge> : null}
                    </div>
                    <span className="text-xs text-[var(--muted)]">{notification.message}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-1 flex items-center gap-2.5 rounded-2xl bg-[#F4F2FB] py-1.5 pl-1.5 pr-3 transition-colors hover:bg-[#EFEAFF]"
              >
                <Avatar className="size-8 ring-2 ring-white">
                  <AvatarFallback className="bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-xs font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-none text-[#3D3558]">{user.name}</p>
                  <p className="mt-1 text-[11px] text-[#8B86A3]">{roleLabel(user.role, demoRoleKey)}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl">
              <DropdownMenuLabel>
                <div>
                  <p>{user.name}</p>
                  <p className="mt-1 text-xs font-normal text-[var(--muted)]">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{institution.name}</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/profile">Profile settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/notifications">Notification preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/settings">Account settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export function MobileSidebarOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, themePreset, institutionMode, enabledModules } = useApp();
  const pathname = usePathname();
  const navigation = getNavigationForRole(user.role, institutionMode, enabledModules);
  const coloredSidebar = Boolean(getThemePreset(themePreset).coloredSidebar);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-[#3D3558]/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 flex-col bg-[var(--sidebar)] shadow-[var(--shadow-md)] transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className={cn("p-4", !coloredSidebar && "border-b border-[var(--sidebar-border)]")}>
          <InstitutionSwitcher tone={coloredSidebar ? "onBrand" : "default"} />
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {navigation.map((group) => (
            <div key={group.id} className="mb-4">
              <p
                className={cn(
                  "mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide",
                  coloredSidebar ? "text-white/45" : "text-[var(--sidebar-muted)]",
                )}
              >
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = getNavIcon(item.icon);
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? coloredSidebar
                            ? "bg-white/20 text-white"
                            : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                          : coloredSidebar
                            ? "text-white/75 hover:bg-white/10 hover:text-white"
                            : "text-[var(--sidebar-foreground)] hover:bg-[var(--surface-muted)]",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
