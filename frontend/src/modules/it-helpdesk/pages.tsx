"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Headphones,
  Monitor,
  Users,
  Wifi,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  IT_HELPDESK_TABS,
  getItComments,
  getItTicket,
  getItTimeline,
  itCategories,
  itHelpdeskStats,
  mockItTickets,
  mockTechnicians,
} from "@/mock/it-helpdesk";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "IT Helpdesk" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    submitted: "info",
    assigned: "warning",
    in_progress: "info",
    waiting_for_user: "warning",
    resolved: "success",
    closed: "outline",
    low: "outline",
    medium: "warning",
    high: "error",
    critical: "error",
    hardware: "info",
    software: "default",
    network: "warning",
    wifi: "success",
    account: "info",
    password: "error",
    email: "outline",
    lms: "default",
    other: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function ItHelpdeskDashboardPage() {
  return (
    <ModuleHub
      title="IT Helpdesk"
      description="NED University IT support — hardware, software, network, WiFi, accounts, and LMS issues."
      breadcrumbs={breadcrumbs}
      tabs={IT_HELPDESK_TABS}
      actions={
        <MockActionButton
          label="Create ticket"
          fields={[
            { name: "category", label: "Category", type: "select", options: itCategories.map((c) => c.label), required: true },
            { name: "subject", label: "Subject", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "critical"], required: true },
          ]}
          submitLabel="Submit"
          icon={<Headphones className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total tickets" value={formatNumber(itHelpdeskStats.totalTickets)} icon={Monitor} />
        <KpiCard label="Open tickets" value={itHelpdeskStats.openTickets} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="In progress" value={itHelpdeskStats.inProgress} icon={Clock} />
        <KpiCard label="Resolved today" value={itHelpdeskStats.resolvedToday} icon={CheckCircle} changeType="positive" />
        <KpiCard label="Avg response" value={`${itHelpdeskStats.avgResponseMinutes} min`} icon={BarChart3} />
        <KpiCard label="SLA compliance" value={`${itHelpdeskStats.slaCompliance}%`} icon={Wifi} changeType="positive" />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Support workflow</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {["Submitted", "Assigned", "In Progress", "Waiting for User", "Resolved", "Closed"].map((step, i) => (
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
            <Button asChild size="sm" variant="outline"><Link href="/it-helpdesk/tickets">All tickets</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Ticket", "Requester", "Category", "Priority", "Status"]}
              rows={mockItTickets.filter((t) => !["resolved", "closed"].includes(t.status)).map((t) => [
                <Link key={t.id} href={`/it-helpdesk/tickets/${t.id}`} className="font-medium hover:underline">{t.ticketId}</Link>,
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
              columns={["Category", "SLA", "Open"]}
              rows={itCategories.map((c) => [c.label, `${c.slaHours}h`, String(c.openCount)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Technician workload</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Technician", "Shift", "Active", "Resolved (month)"]}
            rows={mockTechnicians.map((t) => [t.name, t.shift, String(t.activeTickets), String(t.resolvedThisMonth)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ItHelpdeskTicketsPage() {
  return (
    <ModuleHub title="IT Tickets" description="All IT support tickets." breadcrumbs={[...breadcrumbs, { label: "Tickets" }]} tabs={IT_HELPDESK_TABS}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["submitted", "assigned", "in_progress", "waiting_for_user", "resolved", "closed"].map((s) => (
          <Badge key={s} variant="outline" className="capitalize">
            {s.replace(/_/g, " ")}: {mockItTickets.filter((t) => t.status === s).length}
          </Badge>
        ))}
      </div>
      <SimpleTable
        columns={["Ticket", "Subject", "Requester", "Category", "Priority", "Technician", "SLA", "Status", ""]}
        rows={mockItTickets.map((t) => [
          <Link key={t.id} href={`/it-helpdesk/tickets/${t.id}`} className="font-medium hover:underline">{t.ticketId}</Link>,
          t.subject.slice(0, 35) + "…",
          t.requester,
          statusBadge(t.category),
          statusBadge(t.priority),
          t.assignedTechnician ?? "—",
          t.slaBreached ? <Badge variant="error">Breached</Badge> : "On track",
          statusBadge(t.status),
          <Button key={t.id} asChild size="sm" variant="outline"><Link href={`/it-helpdesk/tickets/${t.id}`}>View</Link></Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function ItHelpdeskTicketDetailPage({ id }: { id: string }) {
  const ticket = getItTicket(id) ?? mockItTickets[0];
  const timeline = getItTimeline(ticket.id);
  const comments = getItComments(ticket.id);

  return (
    <ModuleHub
      title={ticket.ticketId}
      description={ticket.subject}
      breadcrumbs={[...breadcrumbs, { label: "Tickets", href: "/it-helpdesk/tickets" }, { label: ticket.ticketId }]}
      tabs={IT_HELPDESK_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <MockActionButton label="Assign technician" fields={[{ name: "technician", label: "Technician", type: "select", options: mockTechnicians.map((t) => t.name), required: true }]} submitLabel="Assign" />
          <MockActionButton label="Update status" fields={[{ name: "status", label: "Status", type: "select", options: ["assigned", "in_progress", "waiting_for_user", "resolved", "closed"], required: true }]} submitLabel="Update" />
          <MockToastButton label="Add comment" message="Comment added (demo)." variant="outline" />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Status" value={ticket.status.replace(/_/g, " ")} />
        <InfoCard label="Priority" value={ticket.priority} />
        <InfoCard label="Requester" value={ticket.requester} sub={ticket.requesterRole} />
        <InfoCard label="Technician" value={ticket.assignedTechnician ?? "Unassigned"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Ticket details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-[var(--muted)]">Category: </span>{ticket.category.replace(/_/g, " ")}</p>
            <p><span className="text-[var(--muted)]">Submitted: </span>{ticket.submittedAt}</p>
            <p><span className="text-[var(--muted)]">SLA deadline: </span>{ticket.slaDeadline}</p>
            {ticket.deviceInfo ? <p><span className="text-[var(--muted)]">Device: </span>{ticket.deviceInfo}</p> : null}
            {ticket.attachment ? <p><span className="text-[var(--muted)]">Attachment: </span>{ticket.attachment}</p> : null}
            <p className="pt-2">{ticket.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ticket history</CardTitle></CardHeader>
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

      {comments.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.author}</p>
                  <p className="text-xs text-[var(--muted)]">{c.at}{c.internal ? " · Internal" : ""}</p>
                </div>
                <p className="mt-1">{c.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}

export function ItHelpdeskCategoriesPage() {
  return (
    <ModuleHub title="Categories" description="IT support categories and SLA targets." breadcrumbs={[...breadcrumbs, { label: "Categories" }]} tabs={IT_HELPDESK_TABS}>
      <SimpleTable
        columns={["Category", "SLA (hours)", "Open tickets"]}
        rows={itCategories.map((c) => [c.label, String(c.slaHours), String(c.openCount)])}
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {itCategories.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <p className="font-medium">{c.label}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">SLA: {c.slaHours}h · {c.openCount} open tickets</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function ItHelpdeskTechniciansPage() {
  return (
    <ModuleHub title="Technicians" description="IT support team — shifts, specialties, workload." breadcrumbs={[...breadcrumbs, { label: "Technicians" }]} tabs={IT_HELPDESK_TABS}
      actions={<MockActionButton label="Add technician" fields={[{ name: "name", label: "Name", required: true }, { name: "shift", label: "Shift", type: "select", options: ["Morning (08:00–16:00)", "Evening (14:00–22:00)"], required: true }]} submitLabel="Add" icon={<Users className="size-4" />} />}
    >
      <SimpleTable
        columns={["Name", "Employee ID", "Specialties", "Shift", "Active", "Resolved (month)", "Phone"]}
        rows={mockTechnicians.map((t) => [t.name, t.employeeId, t.specialties.join(", "), t.shift, String(t.activeTickets), String(t.resolvedThisMonth), t.phone])}
      />
    </ModuleHub>
  );
}

export function ItHelpdeskReportsPage() {
  return (
    <ModuleHub title="Reports" description="IT helpdesk analytics and SLA metrics." breadcrumbs={[...breadcrumbs, { label: "Reports" }]} tabs={IT_HELPDESK_TABS}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Open tickets" value={String(itHelpdeskStats.openTickets)} />
        <InfoCard label="Resolved today" value={String(itHelpdeskStats.resolvedToday)} />
        <InfoCard label="Avg response" value={`${itHelpdeskStats.avgResponseMinutes} min`} />
        <InfoCard label="SLA compliance" value={`${itHelpdeskStats.slaCompliance}%`} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Tickets by category</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Category", "Open", "SLA"]}
            rows={itCategories.map((c) => [c.label, String(c.openCount), `${c.slaHours}h`])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Technician performance</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Technician", "Active", "Resolved (month)", "Shift"]}
            rows={mockTechnicians.map((t) => [t.name, String(t.activeTickets), String(t.resolvedThisMonth), t.shift])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentItHelpdeskPage() {
  return (
    <ModuleHub
      title="IT Support"
      description="Get help with WiFi, portal, LMS, email, and device issues."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "IT Helpdesk" }]}
      actions={
        <MockActionButton
          label="Submit ticket"
          title="IT support request"
          fields={[
            { name: "category", label: "Category", type: "select", options: ["WiFi", "Password", "LMS", "Software", "Hardware", "Account", "Other"], required: true },
            { name: "subject", label: "Subject", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "device", label: "Device info", placeholder: "Dell Inspiron 15, Windows 11" },
          ]}
          submitLabel="Submit"
          successMessage="IT support ticket submitted. Average response time: 45 minutes."
          icon={<Headphones className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Ticket", "Subject", "Category", "Submitted", "Status"]}
        rows={mockItTickets.filter((t) => t.requesterRole === "Student").map((t) => [
          t.ticketId,
          t.subject.slice(0, 40) + "…",
          t.category.replace(/_/g, " "),
          t.submittedAt.slice(0, 10),
          statusBadge(t.status),
        ])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Common issues & quick fixes</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          {[
            ["WiFi", "Forget NED-Student network and reconnect with portal credentials"],
            ["Password", "Use self-service reset at portal.neduet.edu.pk/reset"],
            ["LMS", "Clear browser cache; try Chrome or Firefox"],
            ["Email", "Check quota at webmail.neduet.edu.pk — default 2GB limit"],
          ].map(([cat, tip]) => (
            <div key={cat} className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium">{cat}</p>
              <p className="mt-1 text-[var(--muted)]">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>IT support hours</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Helpdesk counter — Block 16</span><span className="font-medium">Mon–Fri 08:00–17:00</span></div>
          <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Online ticket portal</span><span className="font-medium">24/7 submission</span></div>
          <div className="flex justify-between py-2"><span>Emergency (network outage)</span><span className="font-medium">+92-21-99261299</span></div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TeacherItHelpdeskPage() {
  return (
    <ModuleHub
      title="IT Support"
      description="Faculty IT support — smart boards, lab software, email, and network."
      breadcrumbs={[{ label: "Teacher", href: "/teacher/dashboard" }, { label: "IT Helpdesk" }]}
      actions={
        <MockActionButton
          label="Submit ticket"
          fields={[
            { name: "category", label: "Category", type: "select", options: itCategories.map((c) => c.label), required: true },
            { name: "subject", label: "Subject", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "priority", label: "Priority", type: "select", options: ["medium", "high", "critical"], required: true },
          ]}
          submitLabel="Submit"
          successMessage="IT ticket submitted (demo)."
        />
      }
    >
      <SimpleTable
        columns={["Ticket", "Subject", "Category", "Priority", "Status"]}
        rows={mockItTickets.filter((t) => t.requesterRole === "Faculty").map((t) => [
          <Link key={t.id} href={`/it-helpdesk/tickets/${t.id}`} className="font-medium hover:underline">{t.ticketId}</Link>,
          t.subject.slice(0, 40) + "…",
          statusBadge(t.category),
          statusBadge(t.priority),
          statusBadge(t.status),
        ])}
      />
    </ModuleHub>
  );
}
