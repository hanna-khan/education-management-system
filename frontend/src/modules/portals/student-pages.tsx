"use client";

import Link from "next/link";
import {
  BookOpen, ClipboardCheck, FolderOpen, Inbox, Trophy, Wallet,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/hooks/use-app";
import { mockStudentResults, mockExamSchedule } from "@/mock/exams";
import { mockStudentCourses } from "@/mock/portals";
import { timetableSlots } from "@/mock/academics";
import { mockApplications } from "@/mock/applications";
import { mockNotices } from "@/mock/communication";
import { mockStudents } from "@/mock/students";
import { mockInvoices, feeBreakdown } from "@/mock/fees";
import { mockDailyAttendance } from "@/mock/attendance";
import { mockDocuments } from "@/mock/documents";
import { formatCurrency } from "@/lib/utils";
import { StudentPortalDashboard } from "@/modules/dashboards/student-dashboard";

const STUDENT_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard" },
  { id: "profile", label: "Profile", href: "/student/profile" },
  { id: "attendance", label: "Attendance", href: "/student/attendance" },
  { id: "courses", label: "Courses", href: "/student/courses" },
  { id: "timetable", label: "Timetable", href: "/student/timetable" },
  { id: "exams", label: "Exams", href: "/student/exams" },
  { id: "results", label: "Results", href: "/student/results" },
  { id: "fees", label: "Fees", href: "/student/fees" },
  { id: "applications", label: "Applications", href: "/student/applications" },
  { id: "documents", label: "Documents", href: "/student/documents" },
  { id: "notices", label: "Notices", href: "/student/notices" },
];

const breadcrumbs = [{ label: "Student Portal", href: "/student/dashboard" }];
const CURRENT_STUDENT_ID = "stu-2024-1024";

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    present: "success", absent: "error", late: "warning", excused: "info",
    paid: "success", partial: "warning", overdue: "error", waived: "info",
    pending: "warning", in_review: "info", approved: "success", rejected: "error",
    published: "success", draft: "outline", expired: "outline",
  };
  return <Badge variant={map[status] ?? "outline"} className="capitalize">{status.replace(/_/g, " ")}</Badge>;
}

function getCurrentStudent() {
  return mockStudents.find(s => s.id === CURRENT_STUDENT_ID) ?? mockStudents[0];
}

function getStudentApplications() {
  return mockApplications.filter(a => a.applicantId === CURRENT_STUDENT_ID);
}

function getStudentInvoice() {
  return mockInvoices.find(i => i.student === "Ahmed Khan");
}

export function StudentDashboardPage() {
  return (
    <ModuleHub title="Dashboard" breadcrumbs={breadcrumbs} tabs={STUDENT_TABS} hideHeader>
      <StudentPortalDashboard />
    </ModuleHub>
  );
}

export function StudentProfilePage() {
  const student = getCurrentStudent();

  return (
    <ModuleHub title="My Profile" description="Personal and academic information." breadcrumbs={[...breadcrumbs, { label: "Profile" }]} tabs={STUDENT_TABS}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[var(--brand-primary)] text-2xl font-bold text-white">
              {student.avatarInitials}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{student.firstName} {student.lastName}</h3>
            <p className="text-sm text-[var(--muted)]">{student.studentId}</p>
            <Badge variant="success" className="mt-2 capitalize">{student.status}</Badge>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Personal details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard label="Email" value={student.email} />
              <InfoCard label="Phone" value={student.phone} />
              <InfoCard label="Date of birth" value={student.dateOfBirth} />
              <InfoCard label="CNIC" value={student.cnic} />
              <InfoCard label="Address" value={`${student.address}, ${student.city}`} />
              <InfoCard label="Campus" value={student.campus} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Academic information</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard label="Program" value={student.program} />
            <InfoCard label="Department" value={student.department} />
            <InfoCard label="Semester" value={student.semester} />
            <InfoCard label="Section" value={student.section} />
            <InfoCard label="CGPA" value={student.cgpa.toFixed(2)} />
            <InfoCard label="Enrollment date" value={student.enrollmentDate} />
            <InfoCard label="Guardian" value={student.guardianName} />
            <InfoCard label="Guardian phone" value={student.guardianPhone} />
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentAttendancePage() {
  const studentRecord = mockDailyAttendance.find(a => a.id === "STU-2024-1024");

  return (
    <ModuleHub title="Attendance" description="Daily and course-wise attendance records." breadcrumbs={[...breadcrumbs, { label: "Attendance" }]} tabs={STUDENT_TABS}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Overall rate" value={`${getCurrentStudent().attendanceRate}%`} icon={ClipboardCheck} />
        <KpiCard label="Today's status" value={studentRecord?.status ?? "—"} changeType={studentRecord?.status === "present" ? "positive" : "neutral"} icon={ClipboardCheck} />
        <KpiCard label="Courses tracked" value={mockStudentCourses.length} icon={BookOpen} />
      </div>
      <Card className="mb-6">
        <CardHeader><CardTitle>Today's attendance</CardTitle></CardHeader>
        <CardContent>
          {studentRecord ? (
            <SimpleTable
              columns={["Status", "Time", "Method", "Remarks"]}
              rows={[[statusBadge(studentRecord.status), studentRecord.time, studentRecord.method, studentRecord.remarks || "—"]]}
            />
          ) : null}
        </CardContent>
      </Card>
      <SimpleTable
        columns={["Course", "Instructor", "Credits", "Attendance %"]}
        rows={mockStudentCourses.map(c => [c.name, c.instructor, c.credits, `${c.attendance}%`])}
      />
    </ModuleHub>
  );
}

export function StudentCoursesPage() {
  return (
    <ModuleHub title="My Courses" description="Enrolled courses for the current semester." breadcrumbs={[...breadcrumbs, { label: "Courses" }]} tabs={STUDENT_TABS}>
      <SimpleTable
        columns={["Code", "Course", "Instructor", "Credits", "Attendance"]}
        rows={mockStudentCourses.map(c => [c.code, c.name, c.instructor, c.credits, `${c.attendance}%`])}
      />
    </ModuleHub>
  );
}

export function StudentTimetablePage() {
  const days = [...new Set(timetableSlots.map(s => s.day))];

  return (
    <ModuleHub title="Timetable" description="Weekly class schedule." breadcrumbs={[...breadcrumbs, { label: "Timetable" }]} tabs={STUDENT_TABS}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {days.map(day => (
          <Card key={day}>
            <CardHeader><CardTitle className="text-base">{day}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {timetableSlots.filter(s => s.day === day).map(slot => (
                <div key={`${slot.day}-${slot.time}`} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2">
                  <p className="text-xs font-medium text-[var(--brand-primary)]">{slot.time}</p>
                  <p className="text-sm font-medium">{slot.course}</p>
                  <p className="text-xs text-[var(--muted)]">{slot.room} · Sec {slot.section}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function StudentExamsPage() {
  return (
    <ModuleHub title="Exams" description="Upcoming examination schedule." breadcrumbs={[...breadcrumbs, { label: "Exams" }]} tabs={STUDENT_TABS}>
      <SimpleTable
        columns={["Course", "Type", "Date", "Time", "Room", "Invigilator"]}
        rows={mockExamSchedule.map(e => [e.course, e.type, e.date, e.time, e.room, e.invigilator])}
      />
    </ModuleHub>
  );
}

export function StudentResultsPage() {
  return (
    <ModuleHub title="Results" description={`${mockStudentResults.semester} semester results.`} breadcrumbs={[...breadcrumbs, { label: "Results" }]} tabs={STUDENT_TABS}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Semester GPA" value={mockStudentResults.gpa.toFixed(2)} icon={Trophy} />
        <KpiCard label="CGPA" value={mockStudentResults.cgpa.toFixed(2)} icon={Trophy} />
        <KpiCard label="Courses" value={mockStudentResults.courses.length} icon={BookOpen} />
      </div>
      <SimpleTable
        columns={["Code", "Course", "Credits", "Marks", "Grade", "Points"]}
        rows={mockStudentResults.courses.map(c => [c.code, c.name, c.credits, c.marks, c.grade, c.points.toFixed(1)])}
      />
    </ModuleHub>
  );
}

export function StudentFeesPage() {
  const invoice = getStudentInvoice();

  return (
    <ModuleHub title="Fees" description="Fee invoices, payments, and breakdown." breadcrumbs={[...breadcrumbs, { label: "Fees" }]} tabs={STUDENT_TABS}>
      {invoice ? (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <KpiCard label="Total billed" value={formatCurrency(invoice.total)} icon={Wallet} />
            <KpiCard label="Paid" value={formatCurrency(invoice.paid)} changeType="positive" icon={Wallet} />
            <KpiCard label="Outstanding" value={formatCurrency(invoice.outstanding)} changeType={invoice.outstanding > 0 ? "negative" : "positive"} icon={Wallet} />
            <KpiCard label="Status" value={invoice.status} changeType={invoice.status === "paid" ? "positive" : "negative"} icon={Wallet} />
          </div>
          <Card className="mb-6">
            <CardHeader><CardTitle>Fee breakdown — {invoice.semester}</CardTitle></CardHeader>
            <CardContent>
              <SimpleTable
                columns={["Fee head", "Amount"]}
                rows={feeBreakdown.map(f => [f.head, formatCurrency(f.amount)])}
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </ModuleHub>
  );
}

export function StudentApplicationsPage() {
  const apps = getStudentApplications();

  return (
    <ModuleHub title="Applications" description="Track submitted applications and approvals." breadcrumbs={[...breadcrumbs, { label: "Applications" }]} tabs={STUDENT_TABS}
      actions={
        <MockActionButton
          label="New application"
          title="New application"
          description="Submit a student service request (demo)."
          fields={MOCK_FORMS.application}
          submitLabel="Submit"
          icon={<Inbox className="size-4" />}
        />
      }>
      <SimpleTable
        columns={["ID", "Type", "Submitted", "Stage", "SLA", "Status"]}
        rows={apps.length > 0 ? apps.map(a => [
          a.id, a.type.replace(/_/g, " "), a.submitted, a.stage,
          <span key={a.id} className={a.slaBreached ? "text-[var(--error)]" : ""}>{a.sla}</span>,
          statusBadge(a.status),
        ]) : [["—", "No applications yet", "—", "—", "—", statusBadge("pending")]]}
      />
    </ModuleHub>
  );
}

export function StudentDocumentsPage() {
  const docs = mockDocuments.filter(d => d.name.includes("Ahmed Khan"));

  return (
    <ModuleHub title="Documents" description="Uploaded and verified documents." breadcrumbs={[...breadcrumbs, { label: "Documents" }]} tabs={STUDENT_TABS}
      actions={
        <MockActionButton
          label="Upload document"
          title="Upload document"
          description="Upload a document for verification (demo)."
          fields={MOCK_FORMS.document}
          submitLabel="Upload"
          variant="outline"
          icon={<FolderOpen className="size-4" />}
        />
      }>
      <SimpleTable
        columns={["Document", "Type", "Uploaded", "Verified", "Expiry"]}
        rows={docs.map(d => [
          d.name, d.type, d.uploaded,
          d.verified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Pending</Badge>,
          d.expiry || "—",
        ])}
      />
    </ModuleHub>
  );
}

export function StudentNoticesPage() {
  return (
    <ModuleHub title="Notices" description="Campus announcements and circulars." breadcrumbs={[...breadcrumbs, { label: "Notices" }]} tabs={STUDENT_TABS}>
      <SimpleTable
        columns={["Title", "Audience", "Published", "Expiry", "Status"]}
        rows={mockNotices.map(n => [n.title, n.audience, n.published, n.expiry, statusBadge(n.status)])}
      />
    </ModuleHub>
  );
}
