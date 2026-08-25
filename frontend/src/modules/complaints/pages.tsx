"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquareWarning,
  Plus,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { mockComplaints, complaintStats } from "@/mock/complaints";
import { mockParentChildren, mockVisitRequests } from "@/mock/portals";
import { useApp } from "@/hooks/use-app";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Complaints" }];

function priorityBadge(priority: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    low: "outline",
    medium: "info",
    high: "warning",
    critical: "error",
  };
  return (
    <Badge variant={map[priority] ?? "outline"} className="capitalize">
      {priority}
    </Badge>
  );
}

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    new: "info",
    assigned: "default",
    in_progress: "warning",
    waiting: "outline",
    resolved: "success",
    pending: "warning",
    scheduled: "info",
    completed: "success",
    cancelled: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function slaBadge(sla: string) {
  if (sla === "Breached") return <Badge variant="error">{sla}</Badge>;
  if (sla.includes("hour")) return <Badge variant="warning">{sla}</Badge>;
  if (sla === "—") return <Badge variant="outline">{sla}</Badge>;
  return <Badge variant="info">{sla}</Badge>;
}

export function ComplaintsDashboardPage() {
  const { user } = useApp();
  const openCases = complaintStats.new + complaintStats.assigned + complaintStats.inProgress + complaintStats.waiting;
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [rows, setRows] = useState(mockComplaints);
  const [visits, setVisits] = useState(mockVisitRequests);

  const [category, setCategory] = useState("Academic");
  const [priority, setPriority] = useState("medium");
  const [reporterStudent, setReporterStudent] = useState(mockParentChildren[0]?.id ?? "");
  const [details, setDetails] = useState("");

  const [visitStudent, setVisitStudent] = useState(mockParentChildren[0]?.id ?? "");
  const [visitReason, setVisitReason] = useState("");
  const [visitDate, setVisitDate] = useState("2026-08-26");

  const submitComplaint = () => {
    const child = mockParentChildren.find((c) => c.id === reporterStudent);
    setRows((list) => [
      {
        id: `cmp-${String(list.length + 1).padStart(3, "0")}`,
        category,
        priority,
        reporter: `${user.name} → ${child?.name ?? "Student"}`,
        assigned: user.role === "principal" ? "Principal Office" : user.name,
        status: "new",
        sla: "2 days left",
        submitted: "2026-08-22",
      },
      ...list,
    ]);
    setDetails("");
    setComplaintOpen(false);
  };

  const submitVisit = () => {
    const child = mockParentChildren.find((c) => c.id === visitStudent);
    if (!child) return;
    setVisits((list) => [
      {
        id: `visit-${list.length + 10}`,
        studentId: child.id,
        student: child.name,
        requestedBy: user.name,
        role: user.role === "principal" ? "principal" : "teacher",
        reason: visitReason,
        preferredDate: visitDate,
        status: "pending",
        createdAt: "2026-08-22",
      },
      ...list,
    ]);
    setVisitReason("");
    setVisitOpen(false);
  };

  return (
    <ModuleHub
      title="Complaints & parent outreach"
      description="Track grievances, file concerns about students, and ask parents to visit the school."
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setVisitOpen(true)}>
            <Users className="size-4" />
            Ask parent to visit
          </Button>
          <Button size="sm" onClick={() => setComplaintOpen(true)}>
            <Plus className="size-4" />
            File complaint
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="New" value={complaintStats.new} icon={MessageSquareWarning} />
        <KpiCard label="Assigned" value={complaintStats.assigned} icon={UserCheck} />
        <KpiCard label="In progress" value={complaintStats.inProgress} icon={Clock} />
        <KpiCard label="Waiting on party" value={complaintStats.waiting} icon={AlertTriangle} />
        <KpiCard label="Resolved" value={complaintStats.resolved} changeType="positive" icon={CheckCircle2} />
        <KpiCard label="Closed" value={complaintStats.closed} icon={ShieldAlert} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Open cases" value={openCases} sub="Require active attention" />
        <InfoCard label="Avg. resolution time" value="2.4 days" sub="Last 30 days" />
        <InfoCard label="SLA compliance" value="91.2%" sub="1 breach this week" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Active complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["ID", "Category", "Priority", "Reporter", "Assigned to", "Status", "SLA", "Submitted"]}
            rows={rows.map((c) => [
              <span key={c.id} className="font-mono text-xs">{c.id}</span>,
              c.category,
              priorityBadge(c.priority),
              c.reporter,
              c.assigned,
              statusBadge(c.status),
              slaBadge(c.sla),
              c.submitted,
            ])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Parent visit requests</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Requested by", "Role", "Reason", "Preferred date", "Status"]}
            rows={visits.map((v) => [
              v.student,
              v.requestedBy,
              <span key={v.id} className="capitalize">{v.role.replace(/_/g, " ")}</span>,
              v.reason,
              v.preferredDate,
              statusBadge(v.status),
            ])}
          />
        </CardContent>
      </Card>

      <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File complaint / concern</DialogTitle>
            <DialogDescription>
              Principals and staff can log a concern about a student. Parents will be notified when appropriate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={reporterStudent} onValueChange={setReporterStudent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockParentChildren.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} · {c.grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Conduct">Conduct</SelectItem>
                  <SelectItem value="Attendance">Attendance</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
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
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe the concern..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setComplaintOpen(false)}>Cancel</Button>
              <Button onClick={submitComplaint} disabled={!details.trim()}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={visitOpen} onOpenChange={setVisitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask parent to visit</DialogTitle>
            <DialogDescription>
              The parent will see this request under Alerts on the parent portal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={visitStudent} onValueChange={setVisitStudent}>
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
              <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea value={visitReason} onChange={(e) => setVisitReason(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setVisitOpen(false)}>Cancel</Button>
              <Button onClick={submitVisit} disabled={!visitReason.trim()}>Send request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleHub>
  );
}
