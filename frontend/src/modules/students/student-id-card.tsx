"use client";

import { Download, Printer, QrCode, Share2 } from "lucide-react";
import type { Student } from "@/types/students";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/use-app";

export function StudentIdCard({ student }: { student: Student }) {
  const { institution } = useApp();
  const validUntil = "Aug 2027";

  return (
    <div className="mx-auto max-w-sm">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
        <div
          className="px-6 py-4 text-white"
          style={{
            background: `linear-gradient(135deg, ${institution.primaryColor}, ${institution.secondaryColor})`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
                Student Identity Card
              </p>
              <p className="mt-1 text-sm font-semibold">{institution.name}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/15 text-xs font-bold">
              {institution.logoInitials}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[var(--secondary)] text-lg font-bold text-[var(--brand-primary)]">
              {student.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold leading-tight">
                {student.firstName} {student.lastName}
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">{student.studentId}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{student.program}</p>
              <p className="text-sm text-[var(--muted)]">{student.department}</p>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-[var(--border-subtle)] pt-4">
            <div>
              <p className="ems-label">Valid until</p>
              <p className="mt-0.5 text-sm font-medium">{validUntil}</p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]">
              <QrCode className="size-8 text-[var(--muted)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="size-4" />
          Download
        </Button>
        <Button variant="outline" size="sm">
          <Printer className="size-4" />
          Print
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="size-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
