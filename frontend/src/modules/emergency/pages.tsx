"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Megaphone,
  Phone,
  Plus,
  Shield,
  Siren,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  ANNOUNCEMENT_RECIPIENTS,
  EMERGENCY_TABS,
  emergencyStats,
  mockEmergencyAlerts,
  mockEmergencyAnnouncements,
  mockEmergencyContacts,
  mockEvacuationPlans,
  mockSafetyIncidents,
} from "@/mock/emergency";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Emergency & Safety" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "error",
    resolved: "success",
    scheduled: "info",
    info: "info",
    warning: "warning",
    critical: "error",
    fire: "error",
    medical: "warning",
    security: "info",
    natural_disaster: "error",
    chemical: "warning",
    other: "outline",
    reported: "info",
    investigating: "warning",
    closed: "outline",
    sent: "success",
    failed: "error",
    entire_institution: "error",
    campus: "warning",
    department: "info",
    students: "default",
    parents: "warning",
    staff: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function EmergencyDashboardPage() {
  return (
    <ModuleHub
      title="Emergency & Safety"
      description="Campus emergency alerts, incident reports, evacuation plans — NED University, Karachi."
      breadcrumbs={breadcrumbs}
      tabs={EMERGENCY_TABS}
      actions={
        <Button asChild>
          <Link href="/emergency/announce"><Megaphone className="mr-2 size-4" />Broadcast alert</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active alerts" value={emergencyStats.activeAlerts} icon={Siren} changeType="negative" />
        <KpiCard label="Open incidents" value={emergencyStats.openIncidents} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="Emergency contacts" value={emergencyStats.emergencyContacts} icon={Phone} />
        <KpiCard label="Drills this year" value={emergencyStats.drillsThisYear} icon={Shield} changeType="positive" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Announcements sent" value={emergencyStats.announcementsSent} icon={Megaphone} />
        <KpiCard label="Evacuation plans" value={emergencyStats.evacuationPlans} icon={Users} />
        <KpiCard label="24/7 contacts" value={String(mockEmergencyContacts.filter((c) => c.available24x7).length)} icon={Phone} />
      </div>

      {mockEmergencyAlerts.filter((a) => a.status === "active").map((alert) => (
        <Card key={alert.id} className="mt-6 border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Siren className="size-5" /> Active Alert: {alert.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{alert.location} · Issued {alert.issuedAt} by {alert.issuedBy}</p>
            <div className="mt-2 flex gap-2">{alert.recipients.map((r) => statusBadge(r))}</div>
          </CardContent>
        </Card>
      ))}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent incidents</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/emergency/incidents">All incidents</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["ID", "Type", "Title", "Location", "Severity", "Status"]}
              rows={mockSafetyIncidents.slice(0, 4).map((i) => [i.incidentId, statusBadge(i.type), i.title.slice(0, 30) + "…", i.location, statusBadge(i.severity), statusBadge(i.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Priority contacts</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {mockEmergencyContacts.filter((c) => c.priority <= 2).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-[var(--muted)]">{c.role} · {c.phone}</p>
                </div>
                {c.available24x7 ? <Badge variant="success">24/7</Badge> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Emergency procedures quick reference</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border border-[var(--border-subtle)] p-3">
            <p className="font-medium">Fire</p>
            <p className="text-[var(--muted)]">Activate alarm · Evacuate · Assembly point · Call 16</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] p-3">
            <p className="font-medium">Medical</p>
            <p className="text-[var(--muted)]">Campus clinic +92-21-99261250 · Edhi 115</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] p-3">
            <p className="font-medium">Security</p>
            <p className="text-[var(--muted)]">Security control +92-21-99261200</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] p-3">
            <p className="font-medium">Chemical spill</p>
            <p className="text-[var(--muted)]">Evacuate lab · Notify warden · Use spill kit</p>
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function EmergencyAlertsPage() {
  return (
    <ModuleHub title="Emergency Alerts" description="Active and historical campus alerts." breadcrumbs={[...breadcrumbs, { label: "Alerts" }]} tabs={EMERGENCY_TABS}
      actions={
        <MockActionButton label="Issue alert" fields={[
          { name: "title", label: "Alert title", required: true },
          { name: "severity", label: "Severity", type: "select", options: ["info", "warning", "critical"], required: true },
          { name: "location", label: "Location", required: true },
        ]} submitLabel="Issue" icon={<Siren className="size-4" />} />
      }>
      <SimpleTable columns={["Alert ID", "Title", "Severity", "Type", "Location", "Issued", "By", "Recipients", "Status"]}
        rows={mockEmergencyAlerts.map((a) => [a.alertId, a.title, statusBadge(a.severity), statusBadge(a.type), a.location, a.issuedAt, a.issuedBy, a.recipients.map((r) => r.replace(/_/g, " ")).join(", "), statusBadge(a.status)])} />
    </ModuleHub>
  );
}

export function EmergencyContactsPage() {
  return (
    <ModuleHub title="Emergency Contacts" description="Campus and external emergency contacts." breadcrumbs={[...breadcrumbs, { label: "Contacts" }]} tabs={EMERGENCY_TABS}
      actions={<MockActionButton label="Add contact" fields={[{ name: "name", label: "Name", required: true }, { name: "role", label: "Role", required: true }, { name: "phone", label: "Phone", required: true }]} submitLabel="Add" icon={<Plus className="size-4" />} />}>
      <SimpleTable columns={["Name", "Role", "Department", "Phone", "Alt Phone", "Email", "24/7", "Priority"]}
        rows={mockEmergencyContacts.map((c) => [c.name, c.role, c.department, c.phone, c.alternatePhone ?? "—", c.email, c.available24x7 ? "Yes" : "No", String(c.priority)])} />
    </ModuleHub>
  );
}

export function EmergencyIncidentsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? mockSafetyIncidents : mockSafetyIncidents.filter((i) => i.status === filter), [filter]);
  return (
    <ModuleHub title="Safety Incidents" description="Incident reports and investigations." breadcrumbs={[...breadcrumbs, { label: "Incidents" }]} tabs={EMERGENCY_TABS}
      actions={<MockActionButton label="Report incident" fields={[{ name: "type", label: "Type", type: "select", options: ["fire", "medical", "security", "chemical", "other"], required: true }, { name: "title", label: "Title", required: true }, { name: "location", label: "Location", required: true }]} submitLabel="Report" />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "reported", "investigating", "resolved", "closed"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">{s}</Button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon={AlertTriangle} title="No incidents" description="No incidents match filter." /> : (
        <SimpleTable columns={["Incident ID", "Type", "Title", "Location", "Reported", "By", "Severity", "Injuries", "Status"]}
          rows={filtered.map((i) => [i.incidentId, statusBadge(i.type), i.title, i.location, i.reportedAt, i.reportedBy, statusBadge(i.severity), String(i.injuries), statusBadge(i.status)])} />
      )}
    </ModuleHub>
  );
}

export function EmergencyEvacuationPage() {
  return (
    <ModuleHub title="Evacuation Plans" description="Building evacuation routes and assembly points." breadcrumbs={[...breadcrumbs, { label: "Evacuation" }]} tabs={EMERGENCY_TABS}>
      {mockEvacuationPlans.map((p) => (
        <Card key={p.id} className="mb-4">
          <CardHeader><CardTitle>{p.building}</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Assembly point:</strong> {p.assemblyPoint}</p>
            <p><strong>Routes:</strong> {p.routes}</p>
            <p><strong>Warden:</strong> {p.warden}</p>
            <div className="flex gap-4 text-[var(--muted)]">
              <span>Last drill: {p.lastDrill}</span>
              <span>Next drill: {p.nextDrill}</span>
              <span>Capacity: {formatNumber(p.capacity)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </ModuleHub>
  );
}

export function EmergencyAnnouncePage() {
  return (
    <ModuleHub title="Emergency Broadcast" description="Send emergency announcements to selected recipients." breadcrumbs={[...breadcrumbs, { label: "Broadcast" }]} tabs={EMERGENCY_TABS}>
      <Card className="mb-6">
        <CardHeader><CardTitle>New announcement</CardTitle></CardHeader>
        <CardContent>
          <MockActionButton
            label="Send emergency announcement"
            title="Emergency broadcast"
            fields={[
              { name: "title", label: "Title", required: true, placeholder: "Campus emergency notification" },
              { name: "message", label: "Message", type: "textarea", required: true },
              { name: "recipients", label: "Recipients", type: "select", options: ANNOUNCEMENT_RECIPIENTS.map((r) => r.replace(/_/g, " ")), required: true },
              { name: "severity", label: "Severity", type: "select", options: ["info", "warning", "critical"], required: true },
            ]}
            submitLabel="Broadcast"
            successMessage="Emergency announcement sent to selected recipients (demo)."
            icon={<Megaphone className="size-4" />}
          />
          <div className="mt-4 rounded-lg border border-[var(--border-subtle)] p-4 text-sm">
            <p className="font-medium mb-2">Recipient groups</p>
            <div className="flex flex-wrap gap-2">
              {ANNOUNCEMENT_RECIPIENTS.map((r) => (
                <Badge key={r} variant="outline" className="capitalize">{r.replace(/_/g, " ")}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent announcements</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable columns={["ID", "Title", "Recipients", "Sent", "By", "Recipients Count", "Status"]}
            rows={mockEmergencyAnnouncements.map((a) => [a.announcementId, a.title, a.recipients.map((r) => r.replace(/_/g, " ")).join(", "), a.sentAt, a.sentBy, formatNumber(a.recipientCount), statusBadge(a.deliveryStatus)])} />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
