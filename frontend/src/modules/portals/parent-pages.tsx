"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ClipboardCheck, Inbox, MessageSquareHeart, MessageSquareWarning, Trophy, Users, Wallet,
} from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/hooks/use-app";
import {
  mockParentAlerts,
  mockParentChildren,
  mockParentFeeInstallments,
  mockVisitRequests,
  type ParentChild,
  type ParentFeeInstallment,
} from "@/mock/portals";
import { mockStudentResults } from "@/mock/exams";
import { mockApplications, type ApplicationType } from "@/mock/applications";
import { mockNotices } from "@/mock/communication";
import { mockComplaints } from "@/mock/complaints";
import { mockFeedback } from "@/mock/feedback";
import { cn, formatCurrency } from "@/lib/utils";
import { ParentPortalDashboard } from "@/modules/dashboards/parent-dashboard";

const PARENT_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/parent/dashboard" },
  { id: "children", label: "My Children", href: "/parent/children" },
  { id: "attendance", label: "Attendance", href: "/parent/attendance" },
  { id: "results", label: "Results", href: "/parent/results" },
  { id: "timetable", label: "Timetable", href: "/parent/timetable" },
  { id: "fees", label: "Fees", href: "/parent/fees" },
  { id: "alerts", label: "Alerts", href: "/parent/alerts" },
  { id: "applications", label: "Applications", href: "/parent/applications" },
  { id: "complaints", label: "Complaints", href: "/parent/complaints" },
  { id: "feedback", label: "Feedback", href: "/parent/feedback" },
  { id: "notices", label: "Notices", href: "/parent/notices" },
];

const breadcrumbs = [{ label: "Parent Portal", href: "/parent/dashboard" }];

function attendanceBadge(status: ParentChild["attendanceToday"]) {
  const map: Record<ParentChild["attendanceToday"], "success" | "error" | "warning"> = {
    present: "success", absent: "error", late: "warning",
  };
  return <Badge variant={map[status]} className="capitalize">{status}</Badge>;
}

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    paid: "success", partial: "warning", overdue: "error", due: "warning", upcoming: "outline",
    pending: "warning", in_review: "info", approved: "success", rejected: "error",
    published: "success", new: "info", assigned: "info", in_progress: "warning", resolved: "success",
    submitted: "info", reviewed: "success", acknowledged: "outline",
    scheduled: "info", completed: "success", cancelled: "outline",
  };
  return <Badge variant={map[status] ?? "outline"} className="capitalize">{status.replace(/_/g, " ")}</Badge>;
}

function ChildSwitcher({ compact = false }: { compact?: boolean }) {
  const { selectedChildId, setSelectedChildId } = useApp();

  return (
    <div className={cn("grid gap-3", compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3")}>
      {mockParentChildren.map(child => {
        const selected = child.id === selectedChildId;
        return (
          <button
            key={child.id}
            type="button"
            onClick={() => setSelectedChildId(child.id)}
            className={cn(
              "group rounded-xl border px-4 py-3 text-left transition-all",
              selected
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 shadow-[var(--shadow-xs)] ring-1 ring-[var(--brand-primary)]/20"
                : "border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--border)] hover:shadow-[var(--shadow-xs)]",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{child.name}</p>
                <p className="truncate text-xs text-[var(--muted)]">{child.grade} · {child.program}</p>
              </div>
              {attendanceBadge(child.attendanceToday)}
            </div>
            {!compact ? (
              <div className="mt-3 flex gap-4 text-xs text-[var(--muted)]">
                <span>GPA <strong className="text-[var(--foreground)]">{child.gpa.toFixed(2)}</strong></span>
                <span>Fees <strong className="text-[var(--foreground)] capitalize">{child.feeStatus}</strong></span>
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function ParentDashboardPage() {
  return (
    <ModuleHub title="Dashboard" breadcrumbs={breadcrumbs} tabs={PARENT_TABS} hideHeader>
      <ParentPortalDashboard />
    </ModuleHub>
  );
}

export function ParentChildrenPage() {
  const { selectedChildId, setSelectedChildId } = useApp();

  return (
    <ModuleHub title="My Children" description="Profiles and class teacher contacts for each child." breadcrumbs={[...breadcrumbs, { label: "My Children" }]} tabs={PARENT_TABS}>
      <ChildSwitcher />
      <div className="mt-6">
        <SimpleTable
          columns={["Name", "Grade", "Section", "Class teacher", "Attendance", "GPA", "Fee status", ""]}
          rows={mockParentChildren.map(c => [
            c.name, c.grade, c.section,
            <div key={`${c.id}-ct`} className="min-w-[140px]">
              <p className="text-sm font-medium">{c.classTeacher}</p>
              <p className="text-xs text-[var(--muted)]">{c.classTeacherTitle}</p>
            </div>,
            attendanceBadge(c.attendanceToday),
            c.gpa.toFixed(2), statusBadge(c.feeStatus),
            c.id === selectedChildId ? <Badge variant="info">Selected</Badge> : (
              <Button key={c.id} size="sm" variant="outline" onClick={() => setSelectedChildId(c.id)}>Select</Button>
            ),
          ])}
        />
      </div>
    </ModuleHub>
  );
}

export function ParentAttendancePage() {
  const { selectedChild } = useApp();
  const child = selectedChild ?? mockParentChildren[0];

  return (
    <ModuleHub title="Attendance" description={`Attendance records for ${child.name}.`} breadcrumbs={[...breadcrumbs, { label: "Attendance" }]} tabs={PARENT_TABS}>
      <div className="mb-6">
        <ChildSwitcher compact />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Today's status" value={child.attendanceToday} changeType={child.attendanceToday === "present" ? "positive" : "negative"} icon={ClipboardCheck} />
        <KpiCard label="Weekly average" value="94%" icon={ClipboardCheck} />
        <KpiCard label="Absences (month)" value={child.attendanceToday === "absent" ? 1 : 0} icon={ClipboardCheck} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent attendance</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Date", "Status", "Remarks"]}
            rows={[
              ["2026-08-22", attendanceBadge(child.attendanceToday), child.attendanceToday === "absent" ? "Not marked present" : "On time"],
              ["2026-08-21", attendanceBadge("present"), "—"],
              ["2026-08-20", attendanceBadge("present"), "—"],
              ["2026-08-19", attendanceBadge("late"), "Arrived 10 min late"],
            ]}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ParentResultsPage() {
  const { selectedChild } = useApp();
  const child = selectedChild ?? mockParentChildren[0];

  return (
    <ModuleHub title="Results" description={`Academic results for ${child.name}.`} breadcrumbs={[...breadcrumbs, { label: "Results" }]} tabs={PARENT_TABS}>
      <div className="mb-6">
        <ChildSwitcher compact />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Semester GPA" value={mockStudentResults.gpa.toFixed(2)} icon={Trophy} />
        <KpiCard label="CGPA" value={mockStudentResults.cgpa.toFixed(2)} icon={Trophy} />
        <KpiCard label="Child GPA" value={child.gpa.toFixed(2)} icon={Trophy} />
      </div>
      <SimpleTable
        columns={["Code", "Course", "Credits", "Marks", "Grade", "Points"]}
        rows={mockStudentResults.courses.map(c => [c.code, c.name, c.credits, c.marks, c.grade, c.points.toFixed(1)])}
      />
    </ModuleHub>
  );
}

export function ParentFeesPage() {
  const { selectedChild } = useApp();
  const child = selectedChild ?? mockParentChildren[0];
  const [payOpen, setPayOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [method, setMethod] = useState("Online Payment");
  const [paidMessage, setPaidMessage] = useState<string | null>(null);
  const [installments, setInstallments] = useState(mockParentFeeInstallments);

  const childFees = useMemo(
    () => installments.filter((f) => f.studentId === child.id),
    [installments, child.id],
  );
  const payable = childFees.filter((f) => f.status === "due" || f.status === "overdue" || (f.status === "upcoming" && f.paid < f.amount));
  const outstanding = childFees.reduce((sum, f) => sum + Math.max(f.amount - f.paid, 0), 0);
  const selectedTotal = childFees
    .filter((f) => selectedIds.includes(f.id))
    .reduce((sum, f) => sum + Math.max(f.amount - f.paid, 0), 0);

  const toggleFee = (fee: ParentFeeInstallment) => {
    if (fee.status === "paid") return;
    setSelectedIds((ids) =>
      ids.includes(fee.id) ? ids.filter((id) => id !== fee.id) : [...ids, fee.id],
    );
  };

  const openPay = (ids?: string[]) => {
    setSelectedIds(ids ?? payable.map((f) => f.id).filter((id) => childFees.find((f) => f.id === id && (f.status === "due" || f.status === "overdue"))));
    setPaidMessage(null);
    setPayOpen(true);
  };

  const confirmPay = () => {
    if (selectedIds.length === 0) return;
    setInstallments((rows) =>
      rows.map((row) =>
        selectedIds.includes(row.id)
          ? { ...row, paid: row.amount, status: "paid" as const }
          : row,
      ),
    );
    setPaidMessage(`Payment of ${formatCurrency(selectedTotal)} via ${method} recorded successfully.`);
    setSelectedIds([]);
    setTimeout(() => setPayOpen(false), 900);
  };

  return (
    <ModuleHub
      title="Fees"
      description="Monthly and yearly fee schedule — pay due months, select several months, or clear overdue balances."
      breadcrumbs={[...breadcrumbs, { label: "Fees" }]}
      tabs={PARENT_TABS}
      actions={
        <Button size="sm" onClick={() => openPay()} disabled={outstanding === 0}>
          <Wallet className="size-4" />
          Pay fees
        </Button>
      }
    >
      <div className="mb-6">
        <ChildSwitcher compact />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label={`${child.name.split(" ")[0]}'s fees`} value={outstanding === 0 ? "Clear" : "Due"} changeType={outstanding === 0 ? "positive" : "negative"} icon={Wallet} />
        <KpiCard label="Outstanding" value={formatCurrency(outstanding)} icon={Wallet} />
        <KpiCard label="Months tracked" value={childFees.length} icon={Wallet} />
      </div>

      {outstanding > 0 ? (
        <Card className="mb-6 border-[var(--warning)]/30 bg-[var(--warning)]/5">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Fees due or overdue</p>
              <p className="text-xs text-[var(--muted)]">
                Select one month, a few months, or pay all outstanding installments.
              </p>
            </div>
            <Button size="sm" onClick={() => openPay(payable.filter((f) => f.status !== "upcoming").map((f) => f.id))}>
              Pay outstanding
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <SimpleTable
        columns={["", "Month", "Due date", "Amount", "Paid", "Balance", "Status", ""]}
        rows={childFees.map((f) => {
          const balance = Math.max(f.amount - f.paid, 0);
          return [
            <Checkbox
              key={`${f.id}-cb`}
              checked={selectedIds.includes(f.id)}
              disabled={f.status === "paid"}
              onCheckedChange={() => toggleFee(f)}
              aria-label={`Select ${f.month}`}
            />,
            f.month,
            f.dueDate,
            formatCurrency(f.amount),
            formatCurrency(f.paid),
            formatCurrency(balance),
            statusBadge(f.status),
            balance > 0 ? (
              <Button key={`${f.id}-pay`} size="sm" variant="outline" onClick={() => openPay([f.id])}>
                Pay
              </Button>
            ) : (
              "—"
            ),
          ];
        })}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {selectedIds.length > 0
            ? `${selectedIds.length} month(s) selected · ${formatCurrency(selectedTotal)}`
            : "Tip: select months above, then pay — or use Pay fees for all due/overdue."}
        </p>
        <Button size="sm" disabled={selectedIds.length === 0} onClick={() => setPayOpen(true)}>
          Pay selected ({formatCurrency(selectedTotal)})
        </Button>
      </div>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay fees — {child.name}</DialogTitle>
            <DialogDescription>
              Demo payment flow. In production this connects to your payment gateway.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-sm">
              <p className="font-medium">{selectedIds.length} installment(s)</p>
              <p className="mt-1 text-[var(--muted)]">Total due: <strong className="text-[var(--foreground)]">{formatCurrency(selectedTotal)}</strong></p>
            </div>
            <div className="space-y-2">
              <Label>Payment method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online Payment">Online Payment</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Cash at office">Cash at office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paidMessage ? <p className="text-sm text-[var(--success)]">{paidMessage}</p> : null}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
              <Button onClick={confirmPay} disabled={selectedTotal <= 0}>Confirm payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleHub>
  );
}

export function ParentAlertsPage() {
  return (
    <ModuleHub title="Alerts & notifications" description="Fee dues, school visit requests, and teacher concerns for your children." breadcrumbs={[...breadcrumbs, { label: "Alerts" }]} tabs={PARENT_TABS}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Unread alerts" value={mockParentAlerts.filter((a) => !a.read).length} icon={Bell} />
        <KpiCard label="Visit requests" value={mockVisitRequests.filter((v) => v.status === "pending" || v.status === "scheduled").length} icon={Users} />
        <KpiCard label="Fee alerts" value={mockParentAlerts.filter((a) => a.type.startsWith("fee")).length} icon={Wallet} />
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Active alerts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockParentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "rounded-xl border p-4",
                alert.read ? "border-[var(--border-subtle)]" : "border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{alert.message}</p>
                </div>
                {!alert.read ? <Badge variant="info">New</Badge> : statusBadge(alert.type)}
              </div>
              <p className="mt-2 text-[11px] text-[var(--muted)]">{alert.createdAt.replace("T", " · ").slice(0, 16)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>School visit requests</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Requested by", "Reason", "Preferred date", "Status"]}
            rows={mockVisitRequests.map((v) => [
              v.student,
              <div key={v.id}>
                <p className="text-sm font-medium">{v.requestedBy}</p>
                <p className="text-xs capitalize text-[var(--muted)]">{v.role.replace(/_/g, " ")}</p>
              </div>,
              v.reason,
              v.preferredDate,
              statusBadge(v.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ParentApplicationsPage() {
  const { selectedChild } = useApp();
  const child = selectedChild ?? mockParentChildren[0];
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ApplicationType>("leave");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [localApps, setLocalApps] = useState(
    mockApplications.filter((a) => a.applicant === child.name || a.applicantId === child.id),
  );

  const childApps = useMemo(() => {
    const base = mockApplications.filter((a) => a.applicant === child.name || a.applicantId === child.id);
    const extras = localApps.filter((a) => !base.some((b) => b.id === a.id) && (a.applicant === child.name || a.applicantId === child.id));
    return [...extras, ...base];
  }, [child, localApps]);

  const submit = () => {
    const id = `APP-2026-${1800 + localApps.length + 1}`;
    setLocalApps((apps) => [
      {
        id,
        applicant: child.name,
        applicantId: child.id,
        type,
        submitted: "2026-08-22",
        stage: "Submitted",
        assignedTo: "Admin Office",
        sla: "5 days left",
        slaBreached: false,
        status: "pending",
      },
      ...apps,
    ]);
    setSubmitted(true);
    setNotes("");
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
    }, 800);
  };

  return (
    <ModuleHub
      title="Applications"
      description="Track applications submitted for your children."
      breadcrumbs={[...breadcrumbs, { label: "Applications" }]}
      tabs={PARENT_TABS}
      actions={
        <Button size="sm" onClick={() => { setOpen(true); setSubmitted(false); }}>
          <Inbox className="size-4" />
          New application
        </Button>
      }
    >
      <div className="mb-6">
        <ChildSwitcher compact />
      </div>
      <SimpleTable
        columns={["ID", "Applicant", "Type", "Submitted", "Stage", "Status"]}
        rows={childApps.length > 0 ? childApps.map(a => [
          a.id, a.applicant, a.type.replace(/_/g, " "), a.submitted, a.stage, statusBadge(a.status),
        ]) : [["—", child.name, "No applications", "—", "—", statusBadge("pending")]]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New application</DialogTitle>
            <DialogDescription>Submit an application on behalf of {child.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Child</Label>
              <Input value={child.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ApplicationType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="fee_concession">Fee concession</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe your request..." />
            </div>
            {submitted ? <p className="text-sm text-[var(--success)]">Application submitted.</p> : null}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleHub>
  );
}

export function ParentComplaintsPage() {
  const { selectedChild } = useApp();
  const child = selectedChild ?? mockParentChildren[0];
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("Academic");
  const [priority, setPriority] = useState("medium");
  const [details, setDetails] = useState("");
  const [rows, setRows] = useState(mockComplaints);

  const submit = () => {
    setRows((list) => [
      {
        id: `cmp-${String(list.length + 1).padStart(3, "0")}`,
        category,
        priority,
        reporter: `Parent · ${child.name}`,
        assigned: "Admin Office",
        status: "new",
        sla: "3 days left",
        submitted: "2026-08-22",
      },
      ...list,
    ]);
    setDetails("");
    setOpen(false);
  };

  return (
    <ModuleHub
      title="Complaints"
      description="Submit and track complaints on behalf of your children. School visit requests appear under Alerts."
      breadcrumbs={[...breadcrumbs, { label: "Complaints" }]}
      tabs={PARENT_TABS}
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <MessageSquareWarning className="size-4" />
          File complaint
        </Button>
      }
    >
      <div className="mb-6">
        <ChildSwitcher compact />
      </div>
      <SimpleTable
        columns={["ID", "Category", "Priority", "Reporter", "Assigned", "Status", "Submitted"]}
        rows={rows.map(c => [
          c.id, c.category,
          <Badge key={c.id} variant={c.priority === "critical" ? "error" : c.priority === "high" ? "warning" : "outline"} className="capitalize">{c.priority}</Badge>,
          c.reporter, c.assigned, statusBadge(c.status), c.submitted,
        ])}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File complaint</DialogTitle>
            <DialogDescription>File a complaint related to {child.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe the issue..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={!details.trim()}>Submit complaint</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleHub>
  );
}

export function ParentFeedbackPage() {
  const { selectedChild, user } = useApp();
  const child = selectedChild ?? mockParentChildren[0];
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState("school");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("4");
  const [rows, setRows] = useState(mockFeedback.filter((f) => f.role === "parent"));

  const submit = () => {
    setRows((list) => [
      {
        id: `fb-${String(list.length + 10).padStart(3, "0")}`,
        from: user.name,
        role: "parent",
        audience: audience as "school",
        subject,
        message,
        rating: Number(rating),
        status: "submitted",
        submitted: "2026-08-22",
        relatedChild: child.name,
      },
      ...list,
    ]);
    setSubject("");
    setMessage("");
    setOpen(false);
  };

  return (
    <ModuleHub
      title="Feedback"
      description="Share feedback about the school, teachers, or facilities."
      breadcrumbs={[...breadcrumbs, { label: "Feedback" }]}
      tabs={PARENT_TABS}
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <MessageSquareHeart className="size-4" />
          Give feedback
        </Button>
      }
    >
      <SimpleTable
        columns={["Subject", "About", "Child", "Rating", "Status", "Submitted"]}
        rows={rows.map((f) => [
          f.subject,
          f.audience,
          f.relatedChild ?? "—",
          `${f.rating}/5`,
          statusBadge(f.status),
          f.submitted,
        ])}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give feedback</DialogTitle>
            <DialogDescription>Your feedback helps the school improve.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Related child</Label>
              <Input value={child.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>About</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School overall</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="academic">Academics</SelectItem>
                  <SelectItem value="facility">Facilities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} / 5</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share your feedback..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={!subject.trim() || !message.trim()}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleHub>
  );
}

export function ParentNoticesPage() {
  return (
    <ModuleHub title="Notices" description="School and campus announcements." breadcrumbs={[...breadcrumbs, { label: "Notices" }]} tabs={PARENT_TABS}>
      <SimpleTable
        columns={["Title", "Audience", "Published", "Expiry", "Status"]}
        rows={mockNotices.map(n => [n.title, n.audience, n.published, n.expiry, statusBadge(n.status)])}
      />
    </ModuleHub>
  );
}

const PARENT_TIMETABLE = [
  { day: "Monday", slots: [
    { time: "08:30–09:20", course: "Data Structures", room: "CS-Lab 2", teacher: "Sana Iqbal" },
    { time: "10:30–11:20", course: "Discrete Mathematics", room: "A-204", teacher: "Dr. Imran Qureshi" },
  ]},
  { day: "Tuesday", slots: [
    { time: "09:30–10:20", course: "Database Systems", room: "CS-301", teacher: "Farah Siddiqui" },
    { time: "11:30–12:20", course: "Pakistan Studies", room: "H-110", teacher: "Prof. Nadia Rizvi" },
  ]},
  { day: "Wednesday", slots: [
    { time: "08:30–09:20", course: "Data Structures", room: "CS-Lab 2", teacher: "Sana Iqbal" },
    { time: "13:00–13:50", course: "Software Engineering", room: "CS-205", teacher: "Bilal Ahmed" },
  ]},
  { day: "Thursday", slots: [
    { time: "10:30–11:20", course: "Database Systems", room: "CS-301", teacher: "Farah Siddiqui" },
  ]},
  { day: "Friday", slots: [
    { time: "09:30–10:20", course: "Software Engineering", room: "CS-205", teacher: "Bilal Ahmed" },
    { time: "11:30–12:20", course: "Discrete Mathematics", room: "A-204", teacher: "Dr. Imran Qureshi" },
  ]},
];

export function ParentTimetablePage() {
  const { selectedChild } = useApp();

  return (
    <ModuleHub
      title="Timetable"
      description={`Weekly class schedule for ${selectedChild.name}.`}
      breadcrumbs={[...breadcrumbs, { label: "Timetable" }]}
      tabs={PARENT_TABS}
    >
      <ChildSwitcher compact />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PARENT_TIMETABLE.map((day) => (
          <div key={day.day} className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="text-sm font-semibold">{day.day}</h3>
              <Badge variant="outline" className="text-xs">{day.slots.length}</Badge>
            </div>
            {day.slots.map((slot) => (
              <Card key={`${day.day}-${slot.time}`} className="shadow-[var(--shadow-xs)]">
                <CardContent className="space-y-1 p-3">
                  <p className="text-xs font-medium text-[var(--brand-primary)]">{slot.time}</p>
                  <p className="text-sm font-medium">{slot.course}</p>
                  <p className="text-xs text-[var(--muted)]">{slot.teacher}</p>
                  <p className="text-xs text-[var(--muted)]">{slot.room}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </ModuleHub>
  );
}
