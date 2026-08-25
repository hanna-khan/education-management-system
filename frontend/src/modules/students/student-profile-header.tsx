"use client";

import Link from "next/link";
import {
  Download,
  Edit,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Printer,
  Share2,
} from "lucide-react";
import type { Student } from "@/types/students";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { useToast } from "@/components/shared/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function statusVariant(status: Student["status"]) {
  switch (status) {
    case "active":
      return "success";
    case "graduated":
      return "info";
    case "on_leave":
      return "warning";
    default:
      return "error";
  }
}

export function StudentProfileHeader({ student }: { student: Student }) {
  const { toast } = useToast();
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#6B58F6] via-[#7c6af8] to-[#8C4AF2]">
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 size-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.25),transparent_40%)]" />
      </div>

      <div className="relative px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex size-[104px] items-center justify-center rounded-[1.5rem] border-4 border-[var(--surface)] bg-gradient-to-br from-[#efeaff] to-[#e6fbf7] text-2xl font-bold text-[#6B58F6] shadow-[0_12px_32px_rgba(107,88,246,0.2)]">
                {student.avatarInitials}
              </div>
              <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-white bg-[#1BD0B4]" />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge variant={statusVariant(student.status)} className="capitalize">
                  {student.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="mt-1 font-mono text-sm font-medium text-[#6B58F6]">{student.studentId}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {student.program} · {student.department} · Semester {student.semester} · Sec{" "}
                {student.section}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
                  <Mail className="size-3.5" />
                  {student.email}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
                  <Phone className="size-3.5" />
                  {student.phone}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
                  <MapPin className="size-3.5" />
                  {student.campus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <MockActionButton
              label="Edit profile"
              title="Edit student profile"
              description="Update student details (demo)."
              fields={MOCK_FORMS.student}
              submitLabel="Save changes"
              className="rounded-xl"
              icon={<Edit className="size-4" />}
            />
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href={`/students/${student.id}?tab=documents`}>
                <Printer className="size-4" />
                Print ID
              </Link>
            </Button>
            <MockToastButton
              label="Export"
              message="Student profile exported (demo)."
              className="rounded-xl"
              icon={<Download className="size-4" />}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" className="rounded-xl">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast("Profile link copied (demo).")}>
                  <Share2 className="mr-2 size-4" />
                  Share profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Notice queued (demo).")}>
                  Send notice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Payment form opened (demo).")}>
                  Record payment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Application draft created (demo).")}>
                  Submit application
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-[var(--error)]"
                  onClick={() => toast("Student archived (demo).")}
                >
                  Archive student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "CGPA",
              value: student.cgpa.toFixed(2),
              hint: "Cumulative",
              tone: "from-[#efeaff] to-white text-[#6B58F6]",
            },
            {
              label: "Attendance",
              value: `${student.attendanceRate}%`,
              hint: "This term",
              tone: "from-[#e6fbf7] to-white text-[#1BD0B4]",
            },
            {
              label: "Fee status",
              value: student.feeStatus,
              hint: "Fall 2026",
              tone: "from-[#fff6eb] to-white text-[#F4901F]",
              capitalize: true,
            },
            {
              label: "Campus",
              value: student.campus,
              hint: "Primary",
              tone: "from-[#eff6ff] to-white text-[#3B82F6]",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br p-4",
                item.tone,
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                {item.label}
              </p>
              <p className={cn("mt-1 text-xl font-bold", item.capitalize && "capitalize")}>
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">{item.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
