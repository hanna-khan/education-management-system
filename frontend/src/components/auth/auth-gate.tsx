"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useApp } from "@/hooks/use-app";

/** Ensures app shell only renders with a live authenticated tenant session. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, isAuthenticated, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="size-7 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="size-7 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  return <>{children}</>;
}
