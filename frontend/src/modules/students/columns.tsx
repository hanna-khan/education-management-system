"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/types/students";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function SortHeader({
  label,
  sorted,
}: {
  label: string;
  sorted: false | "asc" | "desc";
}) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <Icon className={cn("size-3.5", sorted ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]")} />
    </span>
  );
}

function statusVariant(status: Student["status"]) {
  switch (status) {
    case "active":
      return "success";
    case "graduated":
      return "info";
    case "on_leave":
      return "warning";
    case "suspended":
    case "inactive":
      return "error";
    default:
      return "outline";
  }
}

function feeVariant(fee: Student["feeStatus"]) {
  switch (fee) {
    case "paid":
      return "success";
    case "partial":
      return "warning";
    case "overdue":
      return "error";
    case "waived":
      return "info";
    default:
      return "outline";
  }
}

export const studentColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <SortHeader label="Student ID" sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[var(--muted)]">{row.original.studentId}</span>
    ),
  },
  {
    id: "student",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => (
      <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <SortHeader label="Student" sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Link
          href={`/students/${student.id}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-[var(--secondary)] text-[10px] font-semibold text-[var(--brand-primary)]">
              {student.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-[var(--foreground)]">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-[var(--muted)]">{student.email}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.program}</span>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-sm text-[var(--muted)]">{row.original.department}</span>
    ),
  },
  {
    accessorKey: "semester",
    header: ({ column }) => (
      <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <SortHeader label="Semester" sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">Sem {row.original.semester}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)} className="capitalize">
        {row.original.status.replace("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "attendanceRate",
    header: ({ column }) => (
      <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <SortHeader label="Attendance" sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const rate = row.original.attendanceRate;
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div
              className="h-full rounded-full bg-[var(--brand-primary)]"
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-[var(--muted)]">{rate}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "feeStatus",
    header: "Fee status",
    cell: ({ row }) => (
      <Badge variant={feeVariant(row.original.feeStatus)} className="capitalize">
        {row.original.feeStatus}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Open actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/students/${student.id}`}>View profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit student</DropdownMenuItem>
            <DropdownMenuItem>Print ID card</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--error)]">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
