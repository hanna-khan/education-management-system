"use client";

import Link from "next/link";
import {
  Building2,
  CreditCard,
  HeartPulse,
  TrendingUp,
  Users,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColorStatCard } from "@/components/dashboard/color-stat-card";
import {
  ChartCard,
  PerformanceAreaChart,
  FinanceLineChart,
} from "@/components/dashboard/charts";
import { MiniMonthCalendar } from "@/components/dashboard/widgets";
import { platformGrowth, financeWeekly } from "@/mock/dashboard";
import { platformStats, mockTenants, mockAuditLogs } from "@/mock/platform";

export function PlatformPortalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Institutions, subscriptions, usage, and system health across Zendrock EMS.
          </p>
        </div>
        <Button size="sm" className="rounded-xl" asChild>
          <Link href="/platform/tenants">Add institution</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorStatCard label="Institutions" value={platformStats.totalInstitutions} icon={Building2} tone="purple" />
        <ColorStatCard label="Active tenants" value={platformStats.activeInstitutions} change="+2" changeType="up" icon={TrendingUp} tone="teal" />
        <ColorStatCard label="MRR" value={formatCurrency(platformStats.mrr)} change="+8%" changeType="up" icon={CreditCard} tone="orange" />
        <ColorStatCard label="System health" value={`${platformStats.systemHealth}%`} changeType="up" icon={HeartPulse} tone="mint" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorStatCard label="Active students" value={formatNumber(platformStats.activeStudents)} icon={Users} tone="blue" />
        <ColorStatCard label="Active users" value={formatNumber(platformStats.activeUsers)} icon={Users} tone="indigo" />
        <ColorStatCard label="Trials" value={platformStats.trialInstitutions} icon={Building2} tone="pink" />
        <ColorStatCard label="Expired trials" value={platformStats.expiredTrials} changeType="down" icon={Building2} tone="coral" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ChartCard className="xl:col-span-3" title="Platform growth" subtitle="Students & faculty across tenants">
          <PerformanceAreaChart data={platformGrowth} />
        </ChartCard>
        <ChartCard className="xl:col-span-2" title="Revenue pulse" subtitle="Weekly collection index">
          <FinanceLineChart data={financeWeekly} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="mb-4 text-base font-semibold">Recent institutions</h3>
          <div className="space-y-3">
            {mockTenants.slice(0, 5).map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{tenant.name}</p>
                  <p className="text-xs text-[var(--muted)]">{tenant.plan}</p>
                </div>
                <Badge variant={tenant.status === "active" ? "success" : "warning"}>{tenant.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="mb-4 text-base font-semibold">Audit activity</h3>
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="rounded-xl border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-medium">{log.action}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{log.user} · {log.time}</p>
              </div>
            ))}
          </div>
        </div>
        <MiniMonthCalendar monthLabel="Platform calendar" />
      </div>
    </div>
  );
}
