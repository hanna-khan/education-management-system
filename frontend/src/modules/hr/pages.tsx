"use client";

import {
  Banknote,
  CalendarOff,
  ClipboardCheck,
  Clock,
  Plus,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockEmployees,
  mockPayroll,
  payrollStats,
  HR_TABS,
} from "@/mock/hr";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "HR" }];

const mockAttendance = [
  { employee: "Dr. Kamran Hussain", department: "Computer Science", checkIn: "08:42", checkOut: "17:15", hours: "8.5", status: "present" },
  { employee: "Sana Iqbal", department: "Computer Science", checkIn: "09:05", checkOut: "—", hours: "—", status: "late" },
  { employee: "Dr. Farah Naz", department: "Electrical Engineering", checkIn: "08:30", checkOut: "16:45", hours: "8.2", status: "present" },
  { employee: "Ayesha Malik", department: "Administration", checkIn: "—", checkOut: "—", hours: "—", status: "on_leave" },
];

const mockLeave = [
  { employee: "Ayesha Malik", type: "Annual Leave", from: "2026-08-22", to: "2026-08-24", days: 3, status: "approved" },
  { employee: "Dr. Imran Malik", type: "Sick Leave", from: "2026-08-25", to: "2026-08-26", days: 2, status: "pending" },
  { employee: "Sana Iqbal", type: "Conference Leave", from: "2026-09-02", to: "2026-09-05", days: 4, status: "approved" },
  { employee: "Dr. Farah Naz", type: "Casual Leave", from: "2026-08-28", to: "2026-08-28", days: 1, status: "rejected" },
];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    present: "success",
    late: "warning",
    on_leave: "info",
    absent: "error",
    approved: "success",
    pending: "warning",
    rejected: "error",
    processed: "success",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function HRDashboardPage() {
  return (
    <ModuleHub
      title="Human Resources"
      description="Manage employees, attendance, leave, and payroll."
      breadcrumbs={breadcrumbs}
      tabs={HR_TABS}
      actions={
        <MockActionButton
          label="Add employee"
          fields={MOCK_FORMS.employee}
          submitLabel="Create employee"
          icon={<UserPlus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total employees" value={payrollStats.employees} icon={Users} />
        <KpiCard label="Present today" value={372} change="96.4% attendance" changeType="positive" icon={ClipboardCheck} />
        <KpiCard label="On leave" value={14} icon={CalendarOff} />
        <KpiCard label="Monthly payroll" value={formatCurrency(payrollStats.total)} icon={Wallet} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent employees</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Name", "Department", "Designation", "Status"]}
              rows={mockEmployees.slice(0, 4).map((e) => [
                e.name,
                e.department,
                e.designation,
                statusBadge(e.status),
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard label="Processed" value={payrollStats.processed} sub="This cycle" />
              <InfoCard label="Pending" value={payrollStats.pending} sub="Awaiting approval" />
            </div>
            <SimpleTable
              columns={["Employee", "Net pay", "Status"]}
              rows={mockPayroll.slice(0, 3).map((p) => [
                p.employee,
                formatCurrency(p.net),
                statusBadge(p.status),
              ])}
            />
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function HREmployeesPage() {
  return (
    <ModuleHub
      title="Employees"
      description="Employee directory and employment records."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "HR", href: "/hr" }, { label: "Employees" }]}
      tabs={HR_TABS}
      actions={
        <MockActionButton
          label="Add employee"
          fields={MOCK_FORMS.employee}
          submitLabel="Create employee"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Employee ID", "Name", "Department", "Designation", "Join date", "Status"]}
        rows={mockEmployees.map((e) => [
          <span key={e.id} className="font-mono text-xs">{e.id}</span>,
          e.name,
          e.department,
          e.designation,
          e.joinDate,
          statusBadge(e.status),
        ])}
      />
    </ModuleHub>
  );
}

export function HRAttendancePage() {
  const present = mockAttendance.filter((a) => a.status === "present").length;

  return (
    <ModuleHub
      title="Attendance"
      description="Daily staff attendance and time tracking."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "HR", href: "/hr" }, { label: "Attendance" }]}
      tabs={HR_TABS}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <KpiCard label="Present" value={present} changeType="positive" icon={ClipboardCheck} />
        <KpiCard label="Late" value={mockAttendance.filter((a) => a.status === "late").length} changeType="negative" icon={Clock} />
        <KpiCard label="On leave" value={mockAttendance.filter((a) => a.status === "on_leave").length} icon={CalendarOff} />
        <KpiCard label="Avg. hours" value="8.1" description="Per employee today" icon={Clock} />
      </div>
      <SimpleTable
        columns={["Employee", "Department", "Check in", "Check out", "Hours", "Status"]}
        rows={mockAttendance.map((a) => [
          a.employee,
          a.department,
          a.checkIn,
          a.checkOut,
          a.hours,
          statusBadge(a.status),
        ])}
      />
    </ModuleHub>
  );
}

export function HRLeavePage() {
  return (
    <ModuleHub
      title="Leave Management"
      description="Review and approve employee leave requests."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "HR", href: "/hr" }, { label: "Leave" }]}
      tabs={HR_TABS}
      actions={
        <MockActionButton
          label="Apply leave"
          fields={MOCK_FORMS.leave}
          submitLabel="Submit leave"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Pending approval" value={mockLeave.filter((l) => l.status === "pending").length} sub="Requests" />
        <InfoCard label="Approved this month" value={12} sub="Leave requests" />
        <InfoCard label="Leave balance avg." value="18 days" sub="Annual leave remaining" />
      </div>
      <SimpleTable
        columns={["Employee", "Type", "From", "To", "Days", "Status"]}
        rows={mockLeave.map((l) => [
          l.employee,
          l.type,
          l.from,
          l.to,
          l.days,
          statusBadge(l.status),
        ])}
      />
    </ModuleHub>
  );
}

export function HRPayrollPage() {
  return (
    <ModuleHub
      title="Payroll"
      description="Process salaries, allowances, and deductions."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "HR", href: "/hr" }, { label: "Payroll" }]}
      tabs={HR_TABS}
      actions={
        <MockActionButton
          label="Run payroll"
          title="Run payroll"
          description="Process payroll for the current period (demo)."
          confirmOnly
          submitLabel="Run payroll"
          icon={<Banknote className="size-4" />}
          successMessage="Payroll run started (demo)."
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total payroll" value={formatCurrency(payrollStats.total)} icon={Wallet} />
        <KpiCard label="Employees" value={formatNumber(payrollStats.employees)} icon={Users} />
        <KpiCard label="Processed" value={payrollStats.processed} changeType="positive" icon={ClipboardCheck} />
        <KpiCard label="Pending" value={payrollStats.pending} changeType="negative" icon={Clock} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payroll register — August 2026</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Employee", "Basic", "Allowances", "Deductions", "Net pay", "Status"]}
            rows={mockPayroll.map((p) => [
              p.employee,
              formatCurrency(p.basic),
              formatCurrency(p.allowances),
              formatCurrency(p.deductions),
              formatCurrency(p.net),
              statusBadge(p.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
