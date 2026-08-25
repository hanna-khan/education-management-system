"use client";

import { useMemo, useState } from "react";
import { FileText, ScrollText, Shield } from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { MockToastButton } from "@/components/shared/mock-action";
import { adminAuditStats, mockAdminAuditLogs } from "@/mock/admin-audit";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Audit Logs" }];

function actionBadge(action: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
    APPROVE: "success",
    SCAN: "warning",
    LOGIN: "outline",
    LOGOUT: "outline",
  };
  return <Badge variant={map[action] ?? "default"}>{action}</Badge>;
}

export function AdminAuditLogsPage() {
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const modules = useMemo(() => [...new Set(mockAdminAuditLogs.map((l) => l.module))], []);
  const actions = useMemo(() => [...new Set(mockAdminAuditLogs.map((l) => l.action))], []);

  const filtered = useMemo(() => {
    return mockAdminAuditLogs.filter((l) => {
      if (moduleFilter !== "all" && l.module !== moduleFilter) return false;
      if (actionFilter !== "all" && l.action !== actionFilter) return false;
      return true;
    });
  }, [moduleFilter, actionFilter]);

  return (
    <ModuleHub
      title="Institution Audit Logs"
      description="Activity and change history for NED University — separate from platform audit logs."
      breadcrumbs={breadcrumbs}
      actions={
        <MockToastButton label="Export logs" message="Audit logs exported to CSV (demo)." icon={<FileText className="size-4" />} />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total logs" value={formatNumber(adminAuditStats.totalLogs)} icon={ScrollText} />
        <KpiCard label="Logs today" value={adminAuditStats.logsToday} icon={Shield} />
        <KpiCard label="Unique users" value={adminAuditStats.uniqueUsers} icon={Shield} />
        <KpiCard label="Modules tracked" value={adminAuditStats.modulesTracked} icon={ScrollText} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Institution" value="NED University" />
        <InfoCard label="Retention" value="7 years" />
        <InfoCard label="Platform logs" value="See /platform/audit-logs" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="self-center text-sm text-[var(--muted)]">Module:</span>
        <Button size="sm" variant={moduleFilter === "all" ? "default" : "outline"} onClick={() => setModuleFilter("all")}>All</Button>
        {modules.map((m) => (
          <Button key={m} size="sm" variant={moduleFilter === m ? "default" : "outline"} onClick={() => setModuleFilter(m)}>{m}</Button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="self-center text-sm text-[var(--muted)]">Action:</span>
        <Button size="sm" variant={actionFilter === "all" ? "default" : "outline"} onClick={() => setActionFilter("all")}>All</Button>
        {actions.map((a) => (
          <Button key={a} size="sm" variant={actionFilter === a ? "default" : "outline"} onClick={() => setActionFilter(a)}>{a}</Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ScrollText} title="No logs" description="No audit logs match the selected filters." />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <SimpleTable
            columns={["Log ID", "User", "Role", "Action", "Module", "Record", "Date/Time", "IP", "Device", "Old Value", "New Value"]}
            rows={filtered.map((l) => [
              l.logId,
              l.user,
              l.userRole.replace(/_/g, " "),
              actionBadge(l.action),
              l.module,
              l.record,
              l.timestamp,
              l.ipAddress,
              l.device,
              l.oldValue ?? "—",
              l.newValue ?? "—",
            ])}
          />
        </div>
      )}
    </ModuleHub>
  );
}
