"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { Sidebar } from "@/components/navigation/sidebar";
import { TopBar, MobileSidebarOverlay } from "@/components/navigation/top-bar";
import { TrialBanner } from "@/components/layout/trial-banner";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <MobileSidebarOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-200",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64",
        )}
      >
        <TrialBanner />
        <TopBar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
