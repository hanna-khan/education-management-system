"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck, MessageSquareHeart, MessageSquareWarning, PenLine, Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockToastButton } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  mockAttendanceRosters,
  mockParentChildren,
  mockTeacherClasses,
  mockTeacherSchedule,
  type AttendanceRosterStudent,
  type TeacherClass,
} from "@/mock/portals";
import { mockMarksEntry } from "@/mock/exams";
import { mockApplications } from "@/mock/applications";
import { mockLeaveRequests } from "@/mock/attendance";
import { mockFeedback } from "@/mock/feedback";
import { TeacherPortalDashboard } from "@/modules/dashboards/teacher-dashboard";

const TEACHER_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/teacher/dashboard" },
  { id: "classes", label: "My Classes", href: "/teacher/classes" },
  { id: "attendance", label: "Attendance", href: "/teacher/attendance" },
  { id: "marks", label: "Marks", href: "/teacher/marks" },
  { id: "timetable", label: "Timetable", href: "/teacher/timetable" },
  { id: "leave", label: "Leave", href: "/teacher/leave" },
  { id: "applications", label: "Applications", href: "/teacher/applications" },
  { id: "feedback", label: "Feedback", href: "/teacher/feedback" },
  { id: "parent-requests", label: "Parent requests", href: "/teacher/parent-requests" },
];

const breadcrumbs = [{ label: "Teacher Portal", href: "/teacher/dashboard" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    pending: "warning", approved: "success", rejected: "error", in_review: "info",
    present: "success", absent: "error", late: "warning", excused: "info",
    submitted: "info", reviewed: "success", acknowledged: "outline",
    scheduled: "info", completed: "success", cancelled: "outline",
  };
  return <Badge variant={map[status] ?? "outline"} className="capitalize">{status.replace(/_/g, " ")}</Badge>;
}

function MarkAttendanceDialog({
  open,
  onOpenChange,
  initialClassId,
  classes,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialClassId?: string;
  classes: TeacherClass[];
  onSaved: (classId: string) => void;
}) {
  const [classId, setClassId] = useState(initialClassId ?? classes[0]?.id ?? "");
  const [date, setDate] = useState("2026-08-22");
  const [roster, setRoster] = useState<AttendanceRosterStudent[]>([]);
  const [saved, setSaved] = useState(false);

  const selectedClass = classes.find((c) => c.id === classId);

  const loadRoster = (id: string) => {
    const source = mockAttendanceRosters[id] ?? [];
    setRoster(source.map((s) => ({ ...s })));
    setSaved(false);
  };

  useEffect(() => {
    if (!open) return;
    const id = initialClassId ?? (classId || classes[0]?.id || "");
    if (id) {
      setClassId(id);
      const source = mockAttendanceRosters[id] ?? [];
      setRoster(source.map((s) => ({ ...s })));
      setSaved(false);
    }
  }, [open, initialClassId]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = (studentId: string, status: AttendanceRosterStudent["status"]) => {
    setRoster((rows) => rows.map((r) => (r.id === studentId ? { ...r, status } : r)));
  };

  const markAll = (status: AttendanceRosterStudent["status"]) => {
    setRoster((rows) => rows.map((r) => ({ ...r, status })));
  };

  const save = () => {
    if (!classId) return;
    onSaved(classId);
    setSaved(true);
    setTimeout(() => onOpenChange(false), 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark attendance</DialogTitle>
          <DialogDescription>
            Choose the class/section you teach, then mark each student. Use this when you teach multiple subjects or sections.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Class / section</Label>
              <Select
                value={classId}
                onValueChange={(id) => {
                  setClassId(id);
                  loadRoster(id);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.subject} · Sec {c.section} {c.isClassTeacher ? "(Class teacher)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          {selectedClass ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-sm">
              <p className="font-medium">{selectedClass.course}</p>
              <p className="text-xs text-[var(--muted)]">
                {selectedClass.cohort} · {selectedClass.time} · {selectedClass.room}
                {selectedClass.isClassTeacher ? " · You are the class adviser for this cohort" : ""}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => markAll("present")}>Mark all present</Button>
            <Button size="sm" variant="outline" onClick={() => markAll("absent")}>Mark all absent</Button>
          </div>

          <div className="space-y-2">
            {roster.map((student) => (
              <div
                key={student.id}
                className="flex flex-col gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-[var(--muted)]">{student.id}</p>
                </div>
                <Select
                  value={student.status}
                  onValueChange={(v) => setStatus(student.id, v as AttendanceRosterStudent["status"])}
                >
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            {roster.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No roster loaded for this class.</p>
            ) : null}
          </div>

          {saved ? <p className="text-sm text-[var(--success)]">Attendance saved.</p> : null}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={save} disabled={roster.length === 0}>Save attendance</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TeacherDashboardPage() {
  return (
    <ModuleHub title="Dashboard" breadcrumbs={breadcrumbs} tabs={TEACHER_TABS} hideHeader>
      <TeacherPortalDashboard />
    </ModuleHub>
  );
}

export function TeacherClassesPage() {
  const [markOpen, setMarkOpen] = useState(false);
  const [markClassId, setMarkClassId] = useState<string | undefined>();
  const [classes, setClasses] = useState(mockTeacherClasses);

  return (
    <ModuleHub title="My Classes" description="Courses and sections assigned to you. Class teacher / adviser roles are marked." breadcrumbs={[...breadcrumbs, { label: "My Classes" }]} tabs={TEACHER_TABS}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.map(cls => (
          <Card key={cls.id} className="transition-shadow hover:shadow-[var(--shadow-sm)]">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{cls.course}</CardTitle>
                  <p className="text-sm text-[var(--muted)]">{cls.subject} · Section {cls.section}</p>
                </div>
                {cls.isClassTeacher ? <Badge variant="info">Class teacher</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Students</span><span className="font-medium">{cls.students}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Schedule</span><span className="font-medium">{cls.time}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Room</span><span className="font-medium">{cls.room}</span></div>
              <div className="flex justify-between pt-1">
                <span className="text-[var(--muted)]">Attendance</span>
                {cls.attendancePending ? <Badge variant="warning">Pending</Badge> : <Badge variant="success">Marked</Badge>}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => {
                  setMarkClassId(cls.id);
                  setMarkOpen(true);
                }}
              >
                Mark attendance
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <MarkAttendanceDialog
        open={markOpen}
        onOpenChange={setMarkOpen}
        initialClassId={markClassId}
        classes={classes}
        onSaved={(id) =>
          setClasses((list) =>
            list.map((c) => (c.id === id ? { ...c, attendancePending: false } : c)),
          )
        }
      />
    </ModuleHub>
  );
}

export function TeacherAttendancePage() {
  const [markOpen, setMarkOpen] = useState(false);
  const [markClassId, setMarkClassId] = useState<string | undefined>();
  const [classes, setClasses] = useState(mockTeacherClasses);
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filtered = classes.filter(
    (c) => subjectFilter === "all" || c.subject === subjectFilter,
  );
  const subjects = Array.from(new Set(classes.map((c) => c.subject)));

  return (
    <ModuleHub
      title="Attendance"
      description="Select a class/section to mark attendance. Teachers with multiple subjects and sections pick the right roster first."
      breadcrumbs={[...breadcrumbs, { label: "Attendance" }]}
      tabs={TEACHER_TABS}
      actions={
        <Button
          size="sm"
          onClick={() => {
            setMarkClassId(filtered.find((c) => c.attendancePending)?.id ?? filtered[0]?.id);
            setMarkOpen(true);
          }}
        >
          <ClipboardCheck className="size-4" />
          Mark attendance
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-48 space-y-1.5">
          <Label>Subject filter</Label>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SimpleTable
        columns={["Course", "Subject", "Section", "Students", "Schedule", "Role", "Status", ""]}
        rows={filtered.map(c => [
          c.course,
          c.subject,
          c.section,
          c.students,
          c.time,
          c.isClassTeacher ? <Badge variant="info">Class teacher</Badge> : <span className="text-xs text-[var(--muted)]">Subject teacher</span>,
          c.attendancePending ? <Badge variant="warning">Pending</Badge> : <Badge variant="success">Completed</Badge>,
          <Button
            key={c.id}
            size="sm"
            variant="outline"
            onClick={() => {
              setMarkClassId(c.id);
              setMarkOpen(true);
            }}
          >
            Mark
          </Button>,
        ])}
      />

      <MarkAttendanceDialog
        open={markOpen}
        onOpenChange={setMarkOpen}
        initialClassId={markClassId}
        classes={classes}
        onSaved={(id) =>
          setClasses((list) =>
            list.map((c) => (c.id === id ? { ...c, attendancePending: false } : c)),
          )
        }
      />
    </ModuleHub>
  );
}

export function TeacherMarksPage() {
  return (
    <ModuleHub title="Marks Entry" description="Enter and review student marks for CS-301." breadcrumbs={[...breadcrumbs, { label: "Marks" }]} tabs={TEACHER_TABS}
      actions={
        <MockToastButton
          label="Save marks"
          message="Marks saved successfully (demo)."
          size="sm"
          variant="default"
          icon={<PenLine className="size-4" />}
        />
      }>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Course" value="CS-301 Data Structures" sub="Section A" />
        <InfoCard label="Students" value={mockMarksEntry.length} sub="Marks partially entered" />
        <InfoCard label="Assessment weight" value="Assignment 20 · Midterm 30 · Final 50" />
      </div>
      <SimpleTable
        columns={["Student", "ID", "Assignment /20", "Midterm /40", "Final /40", "Total", "Grade"]}
        rows={mockMarksEntry.map(m => [m.student, m.id, m.assignment, m.midterm, m.final || "—", m.total, m.grade])}
      />
    </ModuleHub>
  );
}

export function TeacherTimetablePage() {
  return (
    <ModuleHub title="Timetable" description="Weekly teaching schedule." breadcrumbs={[...breadcrumbs, { label: "Timetable" }]} tabs={TEACHER_TABS}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockTeacherSchedule.map(day => (
          <Card key={day.day}>
            <CardHeader><CardTitle className="text-base">{day.day}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {day.slots.map(slot => (
                <div key={`${day.day}-${slot.time}`} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2">
                  <p className="text-xs font-medium text-[var(--brand-primary)]">{slot.time}</p>
                  <p className="text-sm font-medium">{slot.course}</p>
                  <p className="text-xs text-[var(--muted)]">{slot.room}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function TeacherLeavePage() {
  return (
    <ModuleHub title="Leave" description="Student leave requests assigned for review." breadcrumbs={[...breadcrumbs, { label: "Leave" }]} tabs={TEACHER_TABS}>
      <SimpleTable
        columns={["Student", "Type", "Start", "End", "Balance", "Status"]}
        rows={mockLeaveRequests.map(l => [l.name, l.type, l.start, l.end, l.balance, statusBadge(l.status)])}
      />
    </ModuleHub>
  );
}

export function TeacherApplicationsPage() {
  const { user } = useApp();
  const assigned = mockApplications.filter(a => a.assignedTo === user.name);

  return (
    <ModuleHub title="Applications" description="Applications assigned to you for review." breadcrumbs={[...breadcrumbs, { label: "Applications" }]} tabs={TEACHER_TABS}>
      <SimpleTable
        columns={["ID", "Applicant", "Type", "Submitted", "Stage", "SLA", "Status"]}
        rows={assigned.length > 0 ? assigned.map(a => [
          a.id, a.applicant, a.type.replace(/_/g, " "), a.submitted, a.stage,
          <span key={a.id} className={a.slaBreached ? "text-[var(--error)]" : ""}>{a.sla}</span>,
          statusBadge(a.status),
        ]) : [["—", "No applications assigned", "—", "—", "—", "—", statusBadge("pending")]]}
      />
    </ModuleHub>
  );
}

export function TeacherFeedbackPage() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState("school");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("4");
  const [isComplaint, setIsComplaint] = useState(false);
  const [rows, setRows] = useState(mockFeedback.filter((f) => f.role === "teacher"));

  const submit = () => {
    setRows((list) => [
      {
        id: `fb-t-${list.length + 1}`,
        from: user.name,
        role: "teacher",
        audience: audience as "school",
        subject: isComplaint ? `[Concern] ${subject}` : subject,
        message,
        rating: Number(rating),
        status: "submitted",
        submitted: "2026-08-22",
      },
      ...list,
    ]);
    setSubject("");
    setMessage("");
    setOpen(false);
  };

  return (
    <ModuleHub
      title="Feedback & concerns"
      description="Share feedback about the school, or raise an internal concern for leadership."
      breadcrumbs={[...breadcrumbs, { label: "Feedback" }]}
      tabs={TEACHER_TABS}
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <MessageSquareHeart className="size-4" />
          Submit feedback
        </Button>
      }
    >
      <SimpleTable
        columns={["Subject", "About", "Rating", "Status", "Submitted"]}
        rows={rows.map((f) => [f.subject, f.audience, `${f.rating}/5`, statusBadge(f.status), f.submitted])}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher feedback</DialogTitle>
            <DialogDescription>Feedback goes to school leadership. Mark as concern if this needs follow-up.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={isComplaint ? "complaint" : "feedback"} onValueChange={(v) => setIsComplaint(v === "complaint")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="feedback">General feedback</SelectItem>
                  <SelectItem value="complaint">Internal concern / complaint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>About</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School overall</SelectItem>
                  <SelectItem value="facility">Facilities</SelectItem>
                  <SelectItem value="academic">Academics / curriculum</SelectItem>
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
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
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

export function TeacherParentRequestsPage() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState(mockParentChildren[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("2026-08-26");
  const [rows, setRows] = useState([
    {
      id: "visit-t-1",
      student: "Ali Khan",
      reason: "Discuss repeated absences",
      preferredDate: "2026-08-25",
      status: "pending",
      requestedBy: user.name,
    },
  ]);

  const submit = () => {
    const child = mockParentChildren.find((c) => c.id === studentId);
    if (!child) return;
    setRows((list) => [
      {
        id: `visit-t-${list.length + 1}`,
        student: child.name,
        reason,
        preferredDate: date,
        status: "pending",
        requestedBy: user.name,
      },
      ...list,
    ]);
    setReason("");
    setOpen(false);
  };

  const classTeacherCohorts = mockTeacherClasses.filter((c) => c.isClassTeacher);

  return (
    <ModuleHub
      title="Parent visit requests"
      description="Ask parents to visit the school. Class teachers / advisers can request meetings for their cohort."
      breadcrumbs={[...breadcrumbs, { label: "Parent requests" }]}
      tabs={TEACHER_TABS}
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <MessageSquareWarning className="size-4" />
          Request parent visit
        </Button>
      }
    >
      {classTeacherCohorts.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-4" />
              Your class adviser cohorts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {classTeacherCohorts.map((c) => (
              <div key={c.id} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2">
                <p className="font-medium">{c.cohort}</p>
                <p className="text-xs text-[var(--muted)]">{c.course} · Section {c.section}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <SimpleTable
        columns={["Student", "Reason", "Preferred date", "Requested by", "Status"]}
        rows={rows.map((r) => [r.student, r.reason, r.preferredDate, r.requestedBy, statusBadge(r.status)])}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request parent visit</DialogTitle>
            <DialogDescription>Parents will see this under Alerts on the parent portal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockParentChildren.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} · {c.grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why should the parent visit?" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={!reason.trim()}>Send request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleHub>
  );
}
