"use client";

import {
  Bell,
  Calendar,
  Mail,
  Megaphone,
  Plus,
  Send,
  Smartphone,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockNotices, mockEvents, COMM_TABS } from "@/mock/communication";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Communication" }];

function noticeStatusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    published: "success",
    draft: "warning",
    expired: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status}
    </Badge>
  );
}

function eventTypeBadge(type: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    Exam: "error",
    Meeting: "info",
    Admissions: "default",
    Holiday: "success",
  };
  return <Badge variant={map[type] ?? "outline"}>{type}</Badge>;
}

export function NoticesPage() {
  const published = mockNotices.filter((n) => n.status === "published").length;
  const drafts = mockNotices.filter((n) => n.status === "draft").length;

  return (
    <ModuleHub
      title="Notices"
      description="Publish and manage institutional notices and announcements."
      breadcrumbs={[...breadcrumbs, { label: "Notices" }]}
      tabs={COMM_TABS}
      actions={
        <MockActionButton
          label="Create notice"
          fields={MOCK_FORMS.notice}
          submitLabel="Publish"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total notices" value={mockNotices.length} icon={Megaphone} />
        <KpiCard label="Published" value={published} changeType="positive" icon={Send} />
        <KpiCard label="Drafts" value={drafts} icon={Mail} />
        <KpiCard label="Active audiences" value={4} description="Students, faculty, staff, parents" icon={Users} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All notices</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Title", "Audience", "Published", "Expiry", "Status"]}
            rows={mockNotices.map((notice) => [
              <span key={notice.id} className="font-medium">{notice.title}</span>,
              notice.audience,
              notice.published,
              notice.expiry,
              noticeStatusBadge(notice.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function NotificationsPage() {
  const notificationLog = mockNotices.map((notice) => ({
    id: notice.id,
    title: notice.title,
    channel: notice.audience === "All" || notice.audience === "All students" ? "Push + Email" : "Email",
    recipients: notice.audience,
    sent: notice.published,
    status: notice.status === "published" ? "delivered" : notice.status === "draft" ? "scheduled" : "expired",
  }));

  return (
    <ModuleHub
      title="Notifications"
      description="Manage notification channels, delivery logs, and scheduled alerts."
      breadcrumbs={[...breadcrumbs, { label: "Notifications" }]}
      tabs={COMM_TABS}
      actions={
        <MockActionButton
          label="Send notification"
          title="Send notification"
          fields={[
            { name: "channel", label: "Channel", type: "select", options: ["In-app", "Email", "SMS"], required: true },
            { name: "audience", label: "Audience", type: "select", options: ["All", "Students", "Teachers", "Parents"], required: true },
            { name: "message", label: "Message", type: "textarea", required: true },
          ]}
          submitLabel="Send"
          icon={<Bell className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Email delivery rate" value="98.4%" sub="Last 30 days" />
        <InfoCard label="Push open rate" value="62.1%" sub="Mobile app users" />
        <InfoCard label="SMS delivered" value="1,842" sub="This month" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Email", icon: Mail, sent: 4280, pending: 12 },
          { label: "Push", icon: Smartphone, sent: 8426, pending: 48 },
          { label: "SMS", icon: Send, sent: 1842, pending: 6 },
        ].map((channel) => (
          <Card key={channel.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="ems-label">{channel.label} notifications</p>
                <p className="mt-1 text-lg font-semibold">{channel.sent.toLocaleString()} sent</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{channel.pending} pending</p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                <channel.icon className="size-[18px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery log</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Notification", "Channel", "Recipients", "Sent", "Status"]}
              rows={notificationLog.map((n) => [
                <span key={n.id} className="font-medium">{n.title}</span>,
                n.channel,
                n.recipients,
                n.sent,
                noticeStatusBadge(n.status === "delivered" ? "published" : n.status === "scheduled" ? "draft" : "expired"),
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Scheduled events</CardTitle>
            <Calendar className="size-4 text-[var(--muted)]" />
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Event", "Type", "Date", "Campus"]}
              rows={mockEvents.map((evt) => [
                evt.title,
                eventTypeBadge(evt.type),
                evt.date,
                evt.campus,
              ])}
            />
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}
