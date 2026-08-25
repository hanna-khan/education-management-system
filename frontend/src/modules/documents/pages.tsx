"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  FileText,
  FolderOpen,
  GraduationCap,
  Plus,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDocuments, documentFolders } from "@/mock/documents";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Documents" }];

const FOLDER_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  BarChart3,
};

export function DocumentsPage() {
  return (
    <ModuleHub
      title="Documents"
      description="Centralized document vault for students, staff, and institutional records."
      breadcrumbs={breadcrumbs}
      actions={
        <MockActionButton
          label="Upload document"
          fields={MOCK_FORMS.document}
          submitLabel="Upload"
          icon={<Upload className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {documentFolders.map((folder) => {
          const Icon = FOLDER_ICONS[folder.icon] ?? FolderOpen;
          return (
            <Card
              key={folder.name}
              className="group cursor-pointer transition-shadow hover:shadow-[var(--shadow-sm)]"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--brand-primary)] transition-colors group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline">{formatNumber(folder.count)}</Badge>
                </div>
                <p className="mt-4 font-semibold tracking-tight">{folder.name}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {folder.count.toLocaleString()} files
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent documents</CardTitle>
          <MockActionButton
            label="New folder"
            title="New folder"
            fields={[{ name: "name", label: "Folder name", required: true }]}
            submitLabel="Create"
            variant="outline"
            icon={<Plus className="size-4" />}
          />
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Document", "Folder", "Type", "Uploaded", "Verified", "Expiry"]}
            rows={mockDocuments.map((doc) => [
              <span key={doc.id} className="flex items-center gap-2 font-medium">
                <FileText className="size-4 text-[var(--muted)]" />
                {doc.name}
              </span>,
              doc.folder,
              doc.type,
              doc.uploaded,
              doc.verified ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Badge variant="warning">Pending</Badge>
              ),
              doc.expiry || "—",
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
