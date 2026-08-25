"use client";

import { ModuleHub } from "@/components/shared/module-hub";
import { MockToastButton } from "@/components/shared/mock-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApp } from "@/hooks/use-app";

export function AccountProfilePage() {
  const { user } = useApp();

  return (
    <ModuleHub
      title="Account profile"
      description="Your personal account details for this institution."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Account" },
        { label: "Profile" },
      ]}
      actions={
        <MockToastButton label="Save profile" message="Profile saved (demo)." size="sm" variant="default" />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Visible to institutional administrators and workflow approvers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="ems-label" htmlFor="name">
              Full name
            </label>
            <Input id="name" defaultValue={user.name} />
          </div>
          <div className="space-y-2">
            <label className="ems-label" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" defaultValue={user.email} />
          </div>
          <div className="space-y-2">
            <label className="ems-label" htmlFor="title">
              Title
            </label>
            <Input id="title" defaultValue={user.title ?? ""} />
          </div>
          <div className="space-y-2">
            <label className="ems-label" htmlFor="department">
              Department
            </label>
            <Input id="department" defaultValue={user.department ?? ""} />
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AccountSettingsPage() {
  return (
    <ModuleHub
      title="Account settings"
      description="Security and session preferences for your Zendrock account."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Account" },
        { label: "Settings" },
      ]}
      actions={
        <MockToastButton label="Save settings" message="Account settings saved (demo)." size="sm" variant="default" />
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password using the secure reset flow.</CardDescription>
          </CardHeader>
          <CardContent>
            <MockToastButton
              label="Send password reset email"
              message="Reset link sent (demo)."
              variant="outline"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>Active devices signed into your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2">
              <span>Chrome · Windows · Karachi</span>
              <span className="text-xs text-[var(--success)]">This device</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2">
              <span>Safari · iPhone · Clifton</span>
              <MockToastButton label="Revoke" message="Session revoked (demo)." size="sm" variant="ghost" />
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function NotificationPreferencesPage() {
  const channels = [
    { id: "in_app", label: "In-app", description: "Bell notifications inside Zendrock" },
    { id: "email", label: "Email", description: "Institutional and personal email" },
    { id: "sms", label: "SMS", description: "Critical alerts only" },
    { id: "push", label: "Push", description: "Mobile push (when app is available)" },
  ];
  const categories = [
    "Academic",
    "Attendance",
    "Fees",
    "Applications",
    "Exams",
    "Assignments",
    "Library",
    "Emergency",
    "System",
  ];

  return (
    <ModuleHub
      title="Notification preferences"
      description="Choose how Zendrock notifies you across channels and categories."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Account" },
        { label: "Notifications" },
      ]}
      actions={
        <MockToastButton
          label="Save preferences"
          message="Notification preferences saved (demo)."
          size="sm"
          variant="default"
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {channels.map((ch) => (
              <label
                key={ch.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border-subtle)] p-3"
              >
                <input type="checkbox" defaultChecked={ch.id !== "sms"} className="mt-1" />
                <span>
                  <span className="block font-medium">{ch.label}</span>
                  <span className="text-xs text-[var(--muted)]">{ch.description}</span>
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm"
              >
                <input type="checkbox" defaultChecked />
                {cat}
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}
