"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DEMO_USERS } from "@/mock/users";
import { useApp, formatRoleLabel } from "@/hooks/use-app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const ROLE_LABELS: Record<keyof typeof DEMO_USERS, string> = {
  admin: "Institution Admin",
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
  platform: "Platform Admin",
};

const ROLE_HOME: Record<keyof typeof DEMO_USERS, string> = {
  admin: "/dashboard",
  principal: "/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent: "/parent/dashboard",
  platform: "/platform/dashboard",
};

export function RoleSwitcher() {
  const router = useRouter();
  const { user, setRole } = useApp();

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
          <span className="max-w-[140px] truncate">{formatRoleLabel(user.role)}</span>
          <ChevronDown className="size-3.5 text-[#8B86A3]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
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
              <span>{ROLE_LABELS[key]}</span>
              {DEMO_USERS[key].role === user.role ? (
                <Badge variant="info">Active</Badge>
              ) : null}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
