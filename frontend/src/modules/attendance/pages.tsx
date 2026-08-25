"use client";

import { useMemo, useState } from "react";
import {
  CalendarOff,
  Clock,
  ClipboardCheck,
  FileEdit,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  attendanceStats,
  mockDailyAttendance,
  mockCorrections,
  mockLeaveRequests,
  ATTENDANCE_TABS,
} from "@/mock/attendance";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Attendance" }];

const mockTeacherAttendance = [
  { teacher: "Dr. Kamran Hussain", id: "TCH-0042", department: "Computer Science", status: "present", time: "08:45", method: "Biometric" },
  { teacher: "Dr. Farah Naz", id: "TCH-0038", department: "Electrical Engineering", status: "present", time: "08:52", method: "RFID" },
  { teacher: "Sana Iqbal", id: "TCH-0056", department: "Computer Science", status: "late", time: "09:12", method: "Manual" },
  { teacher: "Dr. Asma Siddiqui", id: "TCH-0029", department: "Mathematics", status: "present", time: "08:40", method: "Biometric" },
  { teacher: "Dr. Imran Malik", id: "TCH-0015", department: "Computer Science", status: "on_leave", time: "—", method: "—" },
];

function attendanceStatusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    present: "success",
    absent: "error",
    late: "warning",
    excused: "info",
    on_leave: "outline",
    pending: "warning",
    approved: "success",
    rejected: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function AttendanceFilters({
  program,
  setProgram,
  grade,
  setGrade,
  section,
  setSection,
  status,
  setStatus,
  search,
  setSearch,
  programs,
  grades,
  sections,
}: {
  program: string;
  setProgram: (v: string) => void;
  grade: string;
  setGrade: (v: string) => void;
  section: string;
  setSection: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  programs: string[];
  grades: string[];
  sections: string[];
}) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-1.5">
        <Label>Search</Label>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Student name or ID" />
      </div>
      <div className="space-y-1.5">
        <Label>Program / school</Label>
        <Select value={program} onValueChange={setProgram}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All programs</SelectItem>
            {programs.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Grade / year</Label>
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All grades</SelectItem>
            {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Section</Label>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function AttendanceDashboardPage() {
  const [program, setProgram] = useState("all");
  const [grade, setGrade] = useState("all");
  const [section, setSection] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const programs = useMemo(() => Array.from(new Set(mockDailyAttendance.map((r) => r.program))), []);
  const grades = useMemo(() => Array.from(new Set(mockDailyAttendance.map((r) => r.grade))), []);
  const sections = useMemo(() => Array.from(new Set(mockDailyAttendance.map((r) => r.section))), []);

  const filtered = mockDailyAttendance.filter((row) => {
    if (program !== "all" && row.program !== program) return false;
    if (grade !== "all" && row.grade !== grade) return false;
    if (section !== "all" && row.section !== section) return false;
    if (status !== "all" && row.status !== status) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!row.student.toLowerCase().includes(q) && !row.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <ModuleHub
      title="Attendance"
      description="Monitor daily attendance with filters for program, grade/year, and section — built for large campuses."
      breadcrumbs={breadcrumbs}
      tabs={ATTENDANCE_TABS}
      actions={
        <Button size="sm" asChild>
          <a href="/attendance/students">
            <Plus className="size-4" />
            View all students
          </a>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Present today" value={formatNumber(attendanceStats.present)} icon={UserCheck} changeType="positive" />
        <KpiCard label="Absent" value={formatNumber(attendanceStats.absent)} icon={CalendarOff} changeType="negative" />
        <KpiCard label="Late arrivals" value={attendanceStats.late} icon={Clock} />
        <KpiCard label="Excused" value={attendanceStats.excused} icon={FileEdit} />
        <KpiCard label="Attendance rate" value={`${attendanceStats.rate}%`} icon={ClipboardCheck} changeType="positive" />
        <KpiCard label="Total tracked" value={formatNumber(attendanceStats.total)} icon={Users} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today&apos;s student attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceFilters
            program={program} setProgram={setProgram}
            grade={grade} setGrade={setGrade}
            section={section} setSection={setSection}
            status={status} setStatus={setStatus}
            search={search} setSearch={setSearch}
            programs={programs} grades={grades} sections={sections}
          />
          <p className="mb-3 text-xs text-[var(--muted)]">Showing {filtered.length} of {mockDailyAttendance.length} records</p>
          <SimpleTable
            columns={["Student", "ID", "Program", "Grade", "Sec", "Status", "Time", "Method"]}
            rows={filtered.slice(0, 8).map((row) => [
              row.student,
              row.id,
              row.program,
              row.grade,
              row.section,
              attendanceStatusBadge(row.status),
              row.time,
              row.method,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AttendanceStudentsPage() {
  const [program, setProgram] = useState("all");
  const [grade, setGrade] = useState("all");
  const [section, setSection] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const programs = useMemo(() => Array.from(new Set(mockDailyAttendance.map((r) => r.program))), []);
  const grades = useMemo(() => Array.from(new Set(mockDailyAttendance.map((r) => r.grade))), []);
  const sections = useMemo(() => Array.from(new Set(mockDailyAttendance.map((r) => r.section))), []);

  const filtered = mockDailyAttendance.filter((row) => {
    if (program !== "all" && row.program !== program) return false;
    if (grade !== "all" && row.grade !== grade) return false;
    if (section !== "all" && row.section !== section) return false;
    if (status !== "all" && row.status !== status) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!row.student.toLowerCase().includes(q) && !row.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <ModuleHub
      title="Student Attendance"
      description="Filter by program, grade/year, section, and status — essential when thousands of students are enrolled."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Attendance", href: "/attendance" }, { label: "Students" }]}
      tabs={ATTENDANCE_TABS}
    >
      <AttendanceFilters
        program={program} setProgram={setProgram}
        grade={grade} setGrade={setGrade}
        section={section} setSection={setSection}
        status={status} setStatus={setStatus}
        search={search} setSearch={setSearch}
        programs={programs} grades={grades} sections={sections}
      />
      <p className="mb-3 text-xs text-[var(--muted)]">Showing {filtered.length} of {mockDailyAttendance.length} records</p>
      <SimpleTable
        columns={["Student", "ID", "Program", "Grade", "Section", "Course", "Status", "Time", "Method", "Remarks"]}
        rows={filtered.map((row) => [
          row.student,
          row.id,
          row.program,
          row.grade,
          row.section,
          row.course,
          attendanceStatusBadge(row.status),
          row.time,
          row.method,
          row.remarks || "—",
        ])}
      />
    </ModuleHub>
  );
}

export function AttendanceTeachersPage() {
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(mockTeacherAttendance.map((r) => r.department))),
    [],
  );

  const filtered = mockTeacherAttendance.filter((row) => {
    if (department !== "all" && row.department !== department) return false;
    if (status !== "all" && row.status !== status) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!row.teacher.toLowerCase().includes(q) && !row.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <ModuleHub
      title="Teacher Attendance"
      description="Track faculty attendance across departments with search and filters."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Attendance", href: "/attendance" }, { label: "Teachers" }]}
      tabs={ATTENDANCE_TABS}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Search</Label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Teacher name or ID" />
        </div>
        <div className="space-y-1.5">
          <Label>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="on_leave">On leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">Showing {filtered.length} of {mockTeacherAttendance.length} records</p>
      <SimpleTable
        columns={["Teacher", "ID", "Department", "Status", "Time", "Method"]}
        rows={filtered.map((row) => [
          row.teacher,
          row.id,
          row.department,
          attendanceStatusBadge(row.status),
          row.time,
          row.method,
        ])}
      />
    </ModuleHub>
  );
}

export function AttendanceCorrectionsPage() {
  return (
    <ModuleHub
      title="Attendance Corrections"
      description="Review and process attendance correction requests."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Attendance", href: "/attendance" }, { label: "Corrections" }]}
      tabs={ATTENDANCE_TABS}
    >
      <SimpleTable
        columns={["ID", "Student", "Date", "Course", "Current", "Requested", "Status", "Reason"]}
        rows={mockCorrections.map((c) => [
          c.id,
          c.student,
          c.date,
          c.course,
          attendanceStatusBadge(c.current),
          attendanceStatusBadge(c.requested),
          attendanceStatusBadge(c.status),
          c.reason,
        ])}
      />
    </ModuleHub>
  );
}

export function AttendanceLeavePage() {
  return (
    <ModuleHub
      title="Leave Requests"
      description="Student leave requests linked to attendance."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Attendance", href: "/attendance" }, { label: "Leave" }]}
      tabs={ATTENDANCE_TABS}
    >
      <SimpleTable
        columns={["Student", "Type", "Start", "End", "Balance", "Status"]}
        rows={mockLeaveRequests.map((l) => [
          l.name,
          l.type,
          l.start,
          l.end,
          l.balance,
          attendanceStatusBadge(l.status),
        ])}
      />
    </ModuleHub>
  );
}
