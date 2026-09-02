"use client";

import { useApp } from "@/hooks/use-app";

/** Shows the signed-in role only. */
export function RoleSwitcher() {
  const { isAuthenticated, user, roleLabel } = useApp();

  if (!isAuthenticated || !user) return null;

  return (
    <div className="hidden h-9 items-center rounded-2xl bg-[#F4F2FB] px-3 text-sm font-medium text-[#3D3558] sm:inline-flex">
      <span className="max-w-[160px] truncate">{roleLabel(user.role)}</span>
    </div>
  );
}
