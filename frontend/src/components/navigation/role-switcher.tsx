"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DEMO_USERS } from "@/mock/users";
import { useApp } from "@/hooks/use-app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const ROLE_HOME: Record<keyof typeof DEMO_USERS, string> = {
  admin: "/dashboard",
  principal: "/dashboard",
  registrar: "/forms",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent: "/parent/dashboard",
  platform: "/platform/dashboard",
};

export function RoleSwitcher() {
  const router = useRouter();
  const { user, setRole, roleLabel, demoRoleKey, institutionMode } = useApp();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-2xl bg-[#F4F2FB] px-3 text-sm font-medium text-[#3D3558] transition-colors hover:bg-[#EFEAFF] sm:inline-flex"
        >
          <span className="rounded-lg bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-1.5 py-0.5 text-[10px] font-bold text-white">
            Demo
          </span>
          <span className="max-w-[140px] truncate">{roleLabel(user.role, demoRoleKey)}</span>
          <ChevronDown className="size-3.5 text-[#8B86A3]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel>
          Switch demo role
          <span className="mt-0.5 block text-[10px] font-normal text-[var(--muted)] capitalize">
            Labels follow {institutionMode} terminology
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(DEMO_USERS) as Array<keyof typeof DEMO_USERS>).map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => {
              setRole(key);
              router.push(ROLE_HOME[key]);
            }}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span>{roleLabel(DEMO_USERS[key].role, key)}</span>
              {DEMO_USERS[key].role === user.role && demoRoleKey === key ? (
                <Badge variant="info">Active</Badge>
              ) : null}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
