"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  MinusCircle,
  Search,
} from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PHASE1_AUDIT,
  PHASE1_AUDIT_SUMMARY,
  PHASE1_FINDINGS,
  type AuditStatus,
} from "@/mock/phase1-audit";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "System Audit" },
];

function statusBadge(status: AuditStatus) {
  const map: Record<AuditStatus, "success" | "warning" | "error" | "info"> = {
    COMPLETE: "success",
    PARTIAL: "warning",
    MISSING: "error",
    NEEDS_IMPROVEMENT: "info",
  };
  return (
    <Badge variant={map[status]} className="whitespace-nowrap">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

const STATUS_FILTERS: Array<"ALL" | AuditStatus> = [
  "ALL",
  "COMPLETE",
  "PARTIAL",
  "MISSING",
  "NEEDS_IMPROVEMENT",
];

export function SystemAuditPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  const modules = useMemo(
    () => ["ALL", ...Array.from(new Set(PHASE1_AUDIT.map((f) => f.module)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PHASE1_AUDIT.filter((item) => {
      if (status !== "ALL" && item.status !== status) return false;
      if (moduleFilter !== "ALL" && item.module !== moduleFilter) return false;
      if (!q) return true;
      return (
        item.module.toLowerCase().includes(q) ||
        item.feature.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
      );
    });
  }, [query, status, moduleFilter]);

  return (
    <ModuleHub
      title="Phase 1 System Audit"
      description="Developer/admin checklist of Phase 1 feature completeness. Status is based on UI functionality, not route presence alone."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Phase 1 completion"
          value={`${PHASE1_AUDIT_SUMMARY.completionPercent}%`}
          change={`Audited ${PHASE1_AUDIT_SUMMARY.generatedAt}`}
          changeType="neutral"
          icon={ClipboardList}
        />
        <KpiCard
          label="Complete"
          value={PHASE1_AUDIT_SUMMARY.complete}
          change={`${PHASE1_AUDIT_SUMMARY.total} total features`}
          changeType="positive"
          icon={CheckCircle2}
        />
        <KpiCard
          label="Partial"
          value={PHASE1_AUDIT_SUMMARY.partial}
          changeType="neutral"
          icon={CircleDashed}
        />
        <KpiCard
          label="Missing"
          value={PHASE1_AUDIT_SUMMARY.missing}
          changeType="negative"
          icon={MinusCircle}
        />
        <KpiCard
          label="Needs improvement"
          value={PHASE1_AUDIT_SUMMARY.needsImprovement}
          changeType="neutral"
          icon={AlertTriangle}
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Feature checklist</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input
                className="pl-9"
                placeholder="Search module or feature…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search audit features"
              />
            </div>
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              aria-label="Filter by module"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m === "ALL" ? "All modules" : m}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              aria-label="Filter by status"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Module", "Feature", "Status", "Notes"]}
            rows={filtered.map((item) => [
              item.module,
              item.feature,
              statusBadge(item.status),
              <span key={`${item.module}-${item.feature}`} className="text-[var(--muted)]">
                {item.notes}
              </span>,
            ])}
          />
          {filtered.length === 0 ? (
            <p className="mt-4 text-center text-sm text-[var(--muted)]">No features match this filter.</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FindingCard title="Missing features" items={PHASE1_FINDINGS.missingFeatures} />
        <FindingCard title="Partially implemented" items={PHASE1_FINDINGS.partialFeatures.slice(0, 12)} />
        <FindingCard title="UI inconsistencies" items={PHASE1_FINDINGS.uiInconsistencies} />
        <FindingCard title="Navigation inconsistencies" items={PHASE1_FINDINGS.navigationInconsistencies} />
        <FindingCard title="Missing routes" items={PHASE1_FINDINGS.missingRoutes} />
        <FindingCard title="Missing components" items={PHASE1_FINDINGS.missingComponents} />
        <FindingCard title="Missing mock data" items={PHASE1_FINDINGS.missingMockData} />
        <FindingCard title="Permission gaps" items={PHASE1_FINDINGS.permissionGaps} />
        <FindingCard title="Responsive UI issues" items={PHASE1_FINDINGS.responsiveIssues} />
      </div>
    </ModuleHub>
  );
}

function FindingCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
