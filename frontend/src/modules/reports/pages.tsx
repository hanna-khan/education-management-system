"use client";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Download,
  GraduationCap,
  Inbox,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reportCategories } from "@/mock/documents";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Reports" }];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  academic: BookOpen,
  attendance: ClipboardCheck,
  finance: Wallet,
  students: GraduationCap,
  faculty: Users,
  applications: Inbox,
  hr: BarChart3,
};

export function ReportsPage() {
  return (
    <ModuleHub
      title="Reports & Analytics"
      description="Generate and export institutional reports across all modules."
      breadcrumbs={breadcrumbs}
      actions={
        <MockToastButton label="Export all" message="Reports export started (demo)." icon={<Download className="size-4" />} />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportCategories.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] ?? BarChart3;
          return (
            <Card
              key={category.id}
              className="group transition-shadow hover:shadow-[var(--shadow-sm)]"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline">{category.reports} reports</Badge>
                </div>
                <CardTitle className="mt-4">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:text-[var(--brand-primary)]"
                >
                  View reports
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ModuleHub>
  );
}
