"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  ClipboardList,
  Users,
  Wrench,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  MAINTENANCE_TABS,
  getMaintenanceTicket,
  getMaintenanceTimeline,
  maintenanceCategories,
  maintenanceStats,
  mockMaintenanceStaff,
  mockMaintenanceTickets,
} from "@/mock/maintenance";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Maintenance" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    submitted: "info",
    assigned: "warning",
    in_progress: "info",
    waiting: "warning",
    resolved: "success",
    closed: "outline",
    low: "outline",
    medium: "warning",
    high: "error",
    urgent: "error",
    electrical: "info",
    plumbing: "default",
    cleaning: "outline",
    hvac: "warning",
    furniture: "default",
    classroom: "info",
    laboratory: "success",
    general: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function MaintenanceDashboardPage() {
  return (
    <ModuleHub
      title="Maintenance & Service Requests"
      description="Facilities service request system — electrical, plumbing, HVAC, labs, and general maintenance across NED campus."
      breadcrumbs={breadcrumbs}
      tabs={MAINTENANCE_TABS}
      actions={
        <MockActionButton
          label="Create ticket"
          fields={[
            { name: "category", label: "Category", type: "select", options: maintenanceCategories.map((c) => c.label), required: true },
            { name: "location", label: "Location", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "urgent"], required: true },
          ]}
          submitLabel="Submit"
          icon={<Wrench className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total tickets" value={formatNumber(maintenanceStats.totalTickets)} icon={ClipboardList} />
        <KpiCard label="Open tickets" value={maintenanceStats.openTickets} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="In progress" value={maintenanceStats.inProgress} icon={Clock} />
        <KpiCard label="Resolved this month" value={maintenanceStats.resolvedThisMonth} icon={CheckCircle} changeType="positive" />
        <KpiCard label="Avg resolution" value={`${maintenanceStats.avgResolutionHours}h`} icon={BarChart3} />
        <KpiCard label="SLA breaches" value={maintenanceStats.slaBreaches} icon={AlertTriangle} changeType="negative" />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Support workflow</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {["Submitted", "Assigned", "In Progress", "Waiting", "Resolved", "Closed"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 ? <span className="text-[var(--muted)]">→</span> : null}
                <Badge variant="outline">{step}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Open tickets</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/maintenance/tickets">All tickets</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Ticket", "Requester", "Category", "Priority", "Status"]}
              rows={mockMaintenanceTickets.filter((t) => !["resolved", "closed"].includes(t.status)).map((t) => [
                <Link key={t.id} href={`/maintenance/tickets/${t.id}`} className="font-medium hover:underline">{t.ticketId}</Link>,
                t.requester,
                statusBadge(t.category),
                statusBadge(t.priority),
                statusBadge(t.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>By category</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Category", "SLA", "Team", "Open"]}
              rows={maintenanceCategories.map((c) => [c.label, `${c.slaHours}h`, c.assignedTeam, String(c.openCount)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>SLA breaches — urgent attention</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockMaintenanceTickets.filter((t) => t.slaBreached).map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
              <div>
                <p className="font-medium">{t.ticketId} · {t.category.replace(/_/g, " ")}</p>
                <p className="text-[var(--muted)]">{t.location}</p>
              </div>
              <Badge variant="error">SLA breached</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function MaintenanceTicketsPage() {
  return (
    <ModuleHub title="Tickets" description="All maintenance service requests." breadcrumbs={[...breadcrumbs, { label: "Tickets" }]} tabs={MAINTENANCE_TABS}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["submitted", "assigned", "in_progress", "waiting", "resolved", "closed"].map((s) => (
          <Badge key={s} variant="outline" className="capitalize">
            {s.replace(/_/g, " ")}: {mockMaintenanceTickets.filter((t) => t.status === s).length}
          </Badge>
        ))}
      </div>
      <SimpleTable
        columns={["Ticket", "Requester", "Category", "Priority", "Location", "Assigned", "SLA", "Status", ""]}
        rows={mockMaintenanceTickets.map((t) => [
          <Link key={t.id} href={`/maintenance/tickets/${t.id}`} className="font-medium hover:underline">{t.ticketId}</Link>,
          t.requester,
          statusBadge(t.category),
          statusBadge(t.priority),
          t.location.slice(0, 25) + "…",
          t.assignedStaff ?? "—",
          t.slaBreached ? <Badge variant="error">Breached</Badge> : "On track",
          statusBadge(t.status),
          <Button key={t.id} asChild size="sm" variant="outline"><Link href={`/maintenance/tickets/${t.id}`}>View</Link></Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function MaintenanceTicketDetailPage({ id }: { id: string }) {
  const ticket = getMaintenanceTicket(id) ?? mockMaintenanceTickets[0];
  const timeline = getMaintenanceTimeline(ticket.id);

  return (
    <ModuleHub
      title={ticket.ticketId}
      description={`${ticket.category.replace(/_/g, " ")} · ${ticket.location}`}
      breadcrumbs={[...breadcrumbs, { label: "Tickets", href: "/maintenance/tickets" }, { label: ticket.ticketId }]}
      tabs={MAINTENANCE_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <MockActionButton label="Assign staff" fields={[{ name: "staff", label: "Staff", type: "select", options: mockMaintenanceStaff.map((s) => s.name), required: true }]} submitLabel="Assign" />
          <MockActionButton label="Update status" fields={[{ name: "status", label: "Status", type: "select", options: ["assigned", "in_progress", "waiting", "resolved", "closed"], required: true }]} submitLabel="Update" />
          <MockToastButton label="Add comment" message="Comment added (demo)." variant="outline" />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Status" value={ticket.status.replace(/_/g, " ")} />
        <InfoCard label="Priority" value={ticket.priority} />
        <InfoCard label="Requester" value={ticket.requester} sub={ticket.requesterRole} />
        <InfoCard label="Assigned" value={ticket.assignedStaff ?? "Unassigned"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Ticket details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-[var(--muted)]">Category: </span>{ticket.category.replace(/_/g, " ")}</p>
            <p><span className="text-[var(--muted)]">Location: </span>{ticket.location}</p>
            <p><span className="text-[var(--muted)]">Building: </span>{ticket.building}</p>
            <p><span className="text-[var(--muted)]">Submitted: </span>{ticket.submittedAt}</p>
            <p><span className="text-[var(--muted)]">SLA deadline: </span>{ticket.slaDeadline}{ticket.slaBreached ? " (breached)" : ""}</p>
            {ticket.attachment ? <p><span className="text-[var(--muted)]">Attachment: </span>{ticket.attachment}</p> : null}
            <p className="pt-2">{ticket.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((t, i) => (
              <div key={`${t.at}-${i}`} className="relative border-l-2 border-[var(--border)] pl-4">
                <p className="text-sm font-medium">{t.action}</p>
                <p className="text-xs text-[var(--muted)]">{t.actor} · {t.at}</p>
                {t.note ? <p className="mt-1 text-xs text-[var(--muted)]">{t.note}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function MaintenanceCategoriesPage() {
  return (
    <ModuleHub title="Categories" description="Maintenance categories with SLA targets and assigned teams." breadcrumbs={[...breadcrumbs, { label: "Categories" }]} tabs={MAINTENANCE_TABS}>
      <SimpleTable
        columns={["Category", "SLA (hours)", "Assigned team", "Open tickets"]}
        rows={maintenanceCategories.map((c) => [c.label, String(c.slaHours), c.assignedTeam, String(c.openCount)])}
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {maintenanceCategories.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <p className="font-medium">{c.label}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">SLA: {c.slaHours}h · {c.openCount} open</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{c.assignedTeam}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function MaintenanceStaffPage() {
  return (
    <ModuleHub title="Maintenance Staff" description="Assigned technicians and specialists." breadcrumbs={[...breadcrumbs, { label: "Staff" }]} tabs={MAINTENANCE_TABS}
      actions={<MockActionButton label="Add staff" fields={[{ name: "name", label: "Name", required: true }, { name: "department", label: "Department", required: true }, { name: "phone", label: "Phone", required: true }]} submitLabel="Add" icon={<Users className="size-4" />} />}
    >
      <SimpleTable
        columns={["Name", "Employee ID", "Department", "Specialties", "Active tickets", "Phone"]}
        rows={mockMaintenanceStaff.map((s) => [s.name, s.employeeId, s.department, s.specialties.join(", "), String(s.activeTickets), s.phone])}
      />
    </ModuleHub>
  );
}

export function MaintenanceReportsPage() {
  return (
    <ModuleHub title="Reports" description="Maintenance analytics and SLA compliance." breadcrumbs={[...breadcrumbs, { label: "Reports" }]} tabs={MAINTENANCE_TABS}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Tickets this month" value={String(maintenanceStats.resolvedThisMonth + maintenanceStats.openTickets)} />
        <InfoCard label="Resolution rate" value={`${Math.round((maintenanceStats.resolvedThisMonth / (maintenanceStats.resolvedThisMonth + maintenanceStats.openTickets)) * 100)}%`} />
        <InfoCard label="Avg resolution time" value={`${maintenanceStats.avgResolutionHours} hours`} />
        <InfoCard label="SLA compliance" value={`${Math.round(((maintenanceStats.totalTickets - maintenanceStats.slaBreaches) / maintenanceStats.totalTickets) * 100)}%`} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Tickets by category (open)</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Category", "Open", "SLA target", "Team"]}
            rows={maintenanceCategories.map((c) => [c.label, String(c.openCount), `${c.slaHours}h`, c.assignedTeam])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Staff workload</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Staff", "Department", "Active tickets"]}
            rows={mockMaintenanceStaff.map((s) => [s.name, s.department, String(s.activeTickets)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentMaintenancePage() {
  return (
    <ModuleHub
      title="Submit Maintenance Request"
      description="Report facility issues — electrical, plumbing, cleaning, and more."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Maintenance" }]}
      actions={
        <MockActionButton
          label="Submit request"
          title="Maintenance service request"
          fields={[
            { name: "category", label: "Category", type: "select", options: maintenanceCategories.map((c) => c.label), required: true },
            { name: "location", label: "Location (building, room)", required: true, placeholder: "Hostel Block A, Room 101" },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high"], required: true },
          ]}
          submitLabel="Submit"
          successMessage="Maintenance request submitted. You will receive updates via portal notifications."
          icon={<Wrench className="size-4" />}
        />
      }
    >
      <Card>
        <CardHeader><CardTitle>Your recent requests</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Ticket", "Category", "Location", "Submitted", "Status"]}
            rows={mockMaintenanceTickets.filter((t) => t.requesterRole === "Student").map((t) => [
              t.ticketId,
              t.category.replace(/_/g, " "),
              t.location.slice(0, 30) + "…",
              t.submittedAt.slice(0, 10),
              statusBadge(t.status),
            ])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Guidelines</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Include exact location — building name, floor, and room number</p>
          <p>• For urgent safety issues (electrical sparks, gas leaks), call campus security: +92-21-99261200</p>
          <p>• Attach photos when possible to speed up resolution</p>
          <p>• Hostel issues are routed to Hostel Maintenance; academic blocks to Facilities</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Category quick reference</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          {maintenanceCategories.map((c) => (
            <div key={c.id} className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium">{c.label}</p>
              <p className="mt-1 text-[var(--muted)]">SLA: {c.slaHours}h · Team: {c.assignedTeam}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{c.openCount} open ticket{c.openCount !== 1 ? "s" : ""}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TeacherMaintenancePage() {
  return (
    <ModuleHub
      title="Maintenance Requests"
      description="Report classroom, lab, and office facility issues."
      breadcrumbs={[{ label: "Teacher", href: "/teacher/dashboard" }, { label: "Maintenance" }]}
      actions={
        <MockActionButton
          label="Submit request"
          title="Faculty maintenance request"
          fields={[
            { name: "category", label: "Category", type: "select", options: ["Electrical", "Plumbing", "HVAC", "Classroom", "Laboratory", "Furniture", "General"], required: true },
            { name: "location", label: "Location", required: true, placeholder: "EEB-204, Electrical Engineering Block" },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "priority", label: "Priority", type: "select", options: ["medium", "high", "urgent"], required: true },
          ]}
          submitLabel="Submit"
          successMessage="Maintenance request submitted (demo)."
          icon={<Wrench className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Ticket", "Category", "Location", "Priority", "Status"]}
        rows={mockMaintenanceTickets.filter((t) => t.requesterRole === "Faculty").map((t) => [
          <Link key={t.id} href={`/maintenance/tickets/${t.id}`} className="font-medium hover:underline">{t.ticketId}</Link>,
          t.category.replace(/_/g, " "),
          t.location.slice(0, 30) + "…",
          statusBadge(t.priority),
          statusBadge(t.status),
        ])}
      />
    </ModuleHub>
  );
}
