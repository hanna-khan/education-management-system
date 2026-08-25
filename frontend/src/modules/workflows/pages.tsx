"use client";

import Link from "next/link";
import { GitBranch, Layers, Plus, Timer } from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockWorkflows, workflowDetail } from "@/mock/applications";
import { cn } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Workflows" }];

function workflowStatusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    draft: "warning",
    archived: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status}
    </Badge>
  );
}

export function WorkflowsListPage() {
  return (
    <ModuleHub
      title="Workflows"
      description="Configure and monitor multi-step approval workflows for institutional requests."
      breadcrumbs={breadcrumbs}
      actions={
        <MockActionButton
          label="New workflow"
          title="New workflow"
          description="Configure a multi-step approval workflow (demo)."
          fields={MOCK_FORMS.workflow}
          submitLabel="Create workflow"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockWorkflows.map((wf) => (
          <Link key={wf.id} href={`/workflows/${wf.id}`} className="group block">
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-sm)]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                    <GitBranch className="size-[18px]" />
                  </div>
                  {workflowStatusBadge(wf.status)}
                </div>
                <CardTitle className="mt-3 group-hover:text-[var(--brand-primary)]">{wf.name}</CardTitle>
                <CardDescription>{wf.trigger}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <Layers className="size-3.5" />
                    {wf.steps} steps
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="size-3.5" />
                    SLA {wf.sla}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Name", "Trigger", "Steps", "SLA", "Status", ""]}
            rows={mockWorkflows.map((wf) => [
              <Link
                key={wf.id}
                href={`/workflows/${wf.id}`}
                className="font-medium text-[var(--brand-primary)] hover:underline"
              >
                {wf.name}
              </Link>,
              wf.trigger,
              wf.steps,
              wf.sla,
              workflowStatusBadge(wf.status),
              <Link key={`${wf.id}-view`} href={`/workflows/${wf.id}`} className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
                View
              </Link>,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function WorkflowDetailPage({ id }: { id: string }) {
  const workflow = mockWorkflows.find((w) => w.id === id);
  const detail = id === workflowDetail.id ? workflowDetail : {
    ...workflowDetail,
    id,
    name: workflow?.name ?? "Workflow",
    description: `Approval workflow for ${workflow?.name ?? "institutional requests"}.`,
    status: workflow?.status ?? "active",
    steps: workflowDetail.steps,
  };

  return (
    <ModuleHub
      title={detail.name}
      description={detail.description}
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Workflows", href: "/workflows" },
        { label: detail.name },
      ]}
      actions={
        <div className="flex gap-2">
          <MockToastButton label="Duplicate" message="Workflow duplicated (demo)." />
          <MockActionButton
            label="Edit workflow"
            title="Edit workflow"
            description="Update workflow configuration (demo)."
            fields={MOCK_FORMS.workflow}
            submitLabel="Save workflow"
          />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Approval steps</h2>
          <div className="space-y-3">
            {detail.steps.map((step) => (
              <Card key={step.order} className="overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                        "bg-[var(--brand-primary)] text-white",
                      )}
                    >
                      {step.order}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{step.name}</p>
                      <p className="mt-0.5 text-sm text-[var(--muted)]">Assigned role: {step.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Badge variant="info" className="gap-1">
                      <Timer className="size-3" />
                      SLA {step.sla}
                    </Badge>
                    <Badge variant={step.required ? "default" : "outline"}>
                      {step.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow label="Status" value={workflowStatusBadge(detail.status)} />
              <DetailRow label="Trigger" value={detail.trigger} />
              <DetailRow label="Form" value={detail.form} />
              <DetailRow label="Total steps" value={String(detail.steps.length)} />
              <DetailRow
                label="Required steps"
                value={String(detail.steps.filter((s) => s.required).length)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step summary</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleTable
                columns={["#", "Role", "SLA", "Type"]}
                rows={detail.steps.map((step) => [
                  step.order,
                  step.role,
                  step.sla,
                  step.required ? (
                    <Badge key={`req-${step.order}`} variant="default">
                      Required
                    </Badge>
                  ) : (
                    <Badge key={`opt-${step.order}`} variant="outline">
                      Optional
                    </Badge>
                  ),
                ])}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleHub>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="text-right text-sm">{typeof value === "string" ? value : value}</span>
    </div>
  );
}
