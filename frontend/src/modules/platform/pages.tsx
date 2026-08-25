"use client";

import Link from "next/link";
import { Building2, Users, CreditCard, Activity, HeartPulse, ScrollText, Settings, TrendingUp, Server, Shield } from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  platformStats, mockTenants, mockPlans, PLATFORM_TABS, mockAuditLogs,
} from "@/mock/platform";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PlatformPortalDashboard } from "@/modules/dashboards/platform-dashboard";

const breadcrumbs = [{ label: "Platform", href: "/platform/dashboard" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success", trial: "warning", expired: "error", suspended: "error",
  };
  return <Badge variant={map[status] ?? "outline"} className="capitalize">{status}</Badge>;
}

function planBadge(plan: string) {
  const map: Record<string, "default" | "success" | "info"> = {
    Starter: "default", Professional: "info", Enterprise: "success",
  };
  return <Badge variant={map[plan] ?? "outline"}>{plan}</Badge>;
}

export function PlatformDashboardPage() {
  return (
    <ModuleHub title="Dashboard" breadcrumbs={breadcrumbs} tabs={PLATFORM_TABS} hideHeader>
      <PlatformPortalDashboard />
    </ModuleHub>
  );
}

export function PlatformTenantsPage() {
  return (
    <ModuleHub title="Institutions" description="Manage tenant institutions on the platform." breadcrumbs={[...breadcrumbs, { label: "Institutions" }]} tabs={PLATFORM_TABS}>
      <SimpleTable
        columns={["Institution", "Type", "Plan", "Status", "Students", "Users", "MRR"]}
        rows={mockTenants.map(t => [
          t.name, t.type, planBadge(t.plan), statusBadge(t.status),
          formatNumber(t.students), formatNumber(t.users), t.mrr ? formatCurrency(t.mrr) : "—",
        ])}
      />
    </ModuleHub>
  );
}

export function PlatformSubscriptionsPage() {
  const active = mockTenants.filter(t => t.status === "active");
  const trial = mockTenants.filter(t => t.status === "trial");
  const totalMrr = active.reduce((sum, t) => sum + t.mrr, 0);

  return (
    <ModuleHub title="Subscriptions" description="Overview of active subscriptions and billing." breadcrumbs={[...breadcrumbs, { label: "Subscriptions" }]} tabs={PLATFORM_TABS}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Active subscriptions" value={active.length} sub={`${trial.length} on trial`} />
        <InfoCard label="Total MRR" value={formatCurrency(totalMrr)} sub="From active tenants" />
        <InfoCard label="Avg. revenue / tenant" value={formatCurrency(Math.round(totalMrr / active.length))} sub="Active institutions only" />
      </div>
      <SimpleTable
        columns={["Institution", "Plan", "Status", "Students", "MRR", "Renewal"]}
        rows={mockTenants.map(t => [
          t.name, planBadge(t.plan), statusBadge(t.status), formatNumber(t.students),
          t.mrr ? formatCurrency(t.mrr) : "Trial", t.status === "trial" ? "—" : "2026-09-01",
        ])}
      />
    </ModuleHub>
  );
}

export function PlatformPlansPage() {
  return (
    <ModuleHub title="Plans" description="Subscription plans available on the platform." breadcrumbs={[...breadcrumbs, { label: "Plans" }]} tabs={PLATFORM_TABS}>
      <div className="grid gap-4 sm:grid-cols-3">
        {mockPlans.map(plan => (
          <Card key={plan.id} className="transition-shadow hover:shadow-[var(--shadow-sm)]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                <Badge variant="info">{plan.id}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-2xl font-semibold tracking-tight">{plan.price}</p>
              <div className="space-y-1 text-sm text-[var(--muted)]">
                <p>Students: {plan.students}</p>
                <p>Modules: {plan.modules}</p>
              </div>
              <MockActionButton
                label="Configure plan"
                title="Configure plan"
                description="Update plan limits and pricing (demo)."
                fields={[
                  { name: "name", label: "Plan name", required: true },
                  { name: "price", label: "Monthly price", type: "number", required: true },
                  { name: "students", label: "Student limit", type: "number" },
                ]}
                submitLabel="Save plan"
                variant="outline"
                className="w-full"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <SimpleTable
          columns={["Institution", "Current plan", "Students", "Status"]}
          rows={mockTenants.map(t => [t.name, planBadge(t.plan), formatNumber(t.students), statusBadge(t.status)])}
        />
      </div>
    </ModuleHub>
  );
}

export function PlatformUsagePage() {
  return (
    <ModuleHub title="Usage" description="Platform-wide usage metrics and resource consumption." breadcrumbs={[...breadcrumbs, { label: "Usage" }]} tabs={PLATFORM_TABS}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total active students" value={formatNumber(platformStats.activeStudents)} icon={Users} />
        <KpiCard label="Total active users" value={formatNumber(platformStats.activeUsers)} icon={Users} />
        <KpiCard label="API requests (24h)" value="2.4M" icon={Activity} />
        <KpiCard label="Storage used" value="1.8 TB" icon={Server} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Usage by institution</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Institution", "Students", "Users", "Storage", "API calls (24h)"]}
            rows={mockTenants.map(t => [
              t.name, formatNumber(t.students), formatNumber(t.users),
              `${Math.round(t.students * 0.12)} GB`, formatNumber(t.students * 48),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function PlatformUsersPage() {
  const platformUsers = mockTenants.flatMap(t => [
    { name: "Institution Admin", email: `admin@${t.id.replace("inst-", "")}.edu.pk`, tenant: t.name, role: "Institution Admin", lastActive: "2026-08-22" },
    { name: "Super User", email: `super@${t.id.replace("inst-", "")}.edu.pk`, tenant: t.name, role: "Campus Admin", lastActive: "2026-08-21" },
  ]).slice(0, 8);

  return (
    <ModuleHub title="Platform Users" description="Cross-tenant user management and access overview." breadcrumbs={[...breadcrumbs, { label: "Users" }]} tabs={PLATFORM_TABS}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Total platform users" value={formatNumber(platformStats.activeUsers)} />
        <InfoCard label="Institution admins" value={mockTenants.length} sub="One per tenant minimum" />
        <InfoCard label="Active today" value={formatNumber(Math.round(platformStats.activeUsers * 0.34))} sub="Last 24 hours" />
      </div>
      <SimpleTable
        columns={["Name", "Email", "Institution", "Role", "Last active"]}
        rows={platformUsers.map(u => [u.name, u.email, u.tenant, u.role, u.lastActive])}
      />
    </ModuleHub>
  );
}

export function PlatformSystemHealthPage() {
  const services = [
    { name: "API Gateway", status: "operational", uptime: "99.99%", latency: "42ms" },
    { name: "Database Cluster", status: "operational", uptime: "99.95%", latency: "8ms" },
    { name: "Authentication Service", status: "operational", uptime: "99.98%", latency: "24ms" },
    { name: "File Storage", status: "degraded", uptime: "99.82%", latency: "156ms" },
    { name: "Email Service", status: "operational", uptime: "99.90%", latency: "312ms" },
    { name: "Background Jobs", status: "operational", uptime: "99.97%", latency: "—" },
  ];

  return (
    <ModuleHub title="System Health" description="Real-time platform infrastructure status." breadcrumbs={[...breadcrumbs, { label: "System Health" }]} tabs={PLATFORM_TABS}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Overall health" value={`${platformStats.systemHealth}%`} changeType="positive" icon={HeartPulse} />
        <KpiCard label="Incidents (30d)" value={2} changeType="neutral" icon={Shield} />
        <KpiCard label="Avg. response time" value="48ms" icon={Activity} />
      </div>
      <SimpleTable
        columns={["Service", "Status", "Uptime (30d)", "Latency"]}
        rows={services.map(s => [
          s.name,
          <Badge key={s.name} variant={s.status === "operational" ? "success" : "warning"} className="capitalize">{s.status}</Badge>,
          s.uptime, s.latency,
        ])}
      />
    </ModuleHub>
  );
}

export function PlatformAuditLogsPage() {
  return (
    <ModuleHub title="Audit Logs" description="Platform-wide activity and change history." breadcrumbs={[...breadcrumbs, { label: "Audit Logs" }]} tabs={PLATFORM_TABS}
      actions={<MockToastButton label="Export logs" message="Audit logs exported (demo)." />}>
      <SimpleTable
        columns={["ID", "Action", "User", "Institution", "Timestamp"]}
        rows={mockAuditLogs.map(l => [l.id, l.action, l.user, l.tenant, l.time])}
      />
    </ModuleHub>
  );
}

export function PlatformSettingsPage() {
  const settings = [
    { key: "Platform name", value: "Zendrock EMS" },
    { key: "Default trial period", value: "30 days" },
    { key: "Support email", value: "support@zendrock.com" },
    { key: "Maintenance mode", value: "Disabled" },
    { key: "Two-factor auth", value: "Required for admins" },
    { key: "Data retention", value: "7 years" },
  ];

  return (
    <ModuleHub title="Platform Settings" description="Global platform configuration and policies." breadcrumbs={[...breadcrumbs, { label: "Settings" }]} tabs={PLATFORM_TABS}
      actions={<MockToastButton label="Save changes" message="Platform settings saved (demo)." size="sm" variant="default" icon={<Settings className="size-4" />} />}>
      <Card>
        <CardHeader><CardTitle>General settings</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-[var(--border-subtle)]">
            {settings.map(s => (
              <div key={s.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-sm font-medium">{s.key}</span>
                <span className="text-sm text-[var(--muted)]">{s.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
