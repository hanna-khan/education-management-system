"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  CreditCard,
  Crown,
  Palette,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SETTINGS_TABS, mockRoles, mockPermissions } from "@/mock/portals";
import { MODULE_CATALOG } from "@/config/modules";
import { useApp } from "@/hooks/use-app";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }];

const subscriptionPlans = [
  {
    name: "Starter",
    price: "PKR 49,000",
    period: "/ month",
    description: "For small schools getting started with digital management.",
    features: ["Up to 500 students", "Core modules", "Email support", "5 GB storage"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "PKR 149,000",
    period: "/ month",
    description: "Full-featured plan for universities and large institutions.",
    features: ["Up to 10,000 students", "All modules", "Priority support", "50 GB storage", "Custom branding"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure and SLA for multi-campus groups.",
    features: ["Unlimited students", "Multi-campus", "Dedicated account manager", "Unlimited storage", "SSO & API access"],
    highlighted: false,
  },
];

const usageMetrics = [
  { label: "Students", used: 8426, limit: 10000 },
  { label: "Staff users", used: 412, limit: 500 },
  { label: "Storage", used: 28, limit: 50, unit: "GB" },
];

function permissionCell(value: boolean) {
  return value ? (
    <Check className="size-4 text-[var(--success)]" />
  ) : (
    <span className="text-[var(--muted)]">—</span>
  );
}

export function SettingsGeneralPage() {
  const { institution } = useApp();

  return (
    <ModuleHub
      title="General Settings"
      description="Institution profile, contact details, and regional preferences."
      breadcrumbs={breadcrumbs}
      tabs={SETTINGS_TABS}
      actions={<MockToastButton label="Save changes" message="Settings saved (demo)." size="sm" variant="default" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Institution profile</CardTitle>
          <CardDescription>Basic information visible across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="ems-label">Institution name</label>
            <Input defaultValue={institution.name} />
          </div>
          <div className="space-y-2">
            <label className="ems-label">Short name</label>
            <Input defaultValue={institution.shortName} />
          </div>
          <div className="space-y-2">
            <label className="ems-label">City</label>
            <Input defaultValue={institution.city} />
          </div>
          <div className="space-y-2">
            <label className="ems-label">Institution type</label>
            <Input defaultValue={institution.type} className="capitalize" readOnly />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="ems-label">Official email domain</label>
            <Input defaultValue="neddemo.edu.pk" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Students enrolled" value={formatNumber(institution.studentCount)} sub="Active records" />
        <InfoCard label="Staff members" value={formatNumber(institution.staffCount)} sub="Across all departments" />
        <InfoCard label="Account status" value={institution.status} sub="Current subscription state" />
      </div>
    </ModuleHub>
  );
}

export function SettingsBrandingPage() {
  const { institution } = useApp();
  const [primaryColor, setPrimaryColor] = useState(institution.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(institution.secondaryColor);

  return (
    <ModuleHub
      title="Branding"
      description="Customize your institution's visual identity and theme colors."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Settings", href: "/settings" }, { label: "Branding" }]}
      tabs={SETTINGS_TABS}
      actions={<MockToastButton label="Apply branding" message="Branding applied (demo)." size="sm" variant="default" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-4" />
              Brand colors
            </CardTitle>
            <CardDescription>Set primary and secondary colors for navigation, buttons, and accents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="ems-label">Primary color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="size-10 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="ems-label">Secondary color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="size-10 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
            <CardDescription>How your branding appears across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="overflow-hidden rounded-lg border border-[var(--border)]"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              <div className="flex items-center gap-3 p-5 text-white">
                <div className="flex size-12 items-center justify-center rounded-lg bg-white/20 text-lg font-bold backdrop-blur-sm">
                  {institution.logoInitials}
                </div>
                <div>
                  <p className="font-semibold">{institution.name}</p>
                  <p className="text-sm text-white/80">Education Management System</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" style={{ backgroundColor: primaryColor }}>
                Primary action
              </Button>
              <Button size="sm" variant="outline" style={{ borderColor: secondaryColor, color: secondaryColor }}>
                Secondary action
              </Button>
              <Badge style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                Brand badge
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] p-3">
                <div className="h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                <p className="mt-2 text-xs text-[var(--muted)]">Navigation accent</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] p-3">
                <div className="h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                <p className="mt-2 text-xs text-[var(--muted)]">Secondary accent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function SettingsAcademicPage() {
  return (
    <ModuleHub
      title="Academic Settings"
      description="Configure semesters, grading scales, and academic calendar."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Settings", href: "/settings" }, { label: "Academic" }]}
      tabs={SETTINGS_TABS}
      actions={<MockToastButton label="Save changes" message="Settings saved (demo)." size="sm" variant="default" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Current academic session</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="ems-label">Active semester</label>
            <Input defaultValue="Fall 2026" />
          </div>
          <div className="space-y-2">
            <label className="ems-label">Grading scale</label>
            <Input defaultValue="4.0 GPA (Letter grades)" />
          </div>
          <div className="space-y-2">
            <label className="ems-label">Semester start</label>
            <Input type="date" defaultValue="2026-09-01" />
          </div>
          <div className="space-y-2">
            <label className="ems-label">Semester end</label>
            <Input type="date" defaultValue="2026-12-20" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Programs" value={24} sub="Active degree programs" />
        <InfoCard label="Departments" value={8} sub="Academic departments" />
        <InfoCard label="Credit hours" value="16–18" sub="Default load per semester" />
      </div>
    </ModuleHub>
  );
}

export function SettingsUsersPage() {
  const mockUsers = [
    { name: "Ayesha Malik", email: "ayesha.malik@neddemo.edu.pk", role: "Institution Admin", status: "active" },
    { name: "Dr. Hassan Raza", email: "hassan.raza@neddemo.edu.pk", role: "Principal", status: "active" },
    { name: "Sana Iqbal", email: "sana.iqbal@neddemo.edu.pk", role: "Teacher", status: "active" },
    { name: "Ahmed Khan", email: "ahmed.khan@student.neddemo.edu.pk", role: "Student", status: "active" },
  ];

  return (
    <ModuleHub
      title="Users"
      description="Manage user accounts, invitations, and access."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Settings", href: "/settings" }, { label: "Users" }]}
      tabs={SETTINGS_TABS}
      actions={
        <MockActionButton
          label="Invite user"
          fields={MOCK_FORMS.userInvite}
          submitLabel="Send invite"
          icon={<Users className="size-4" />}
        />
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Total users" value={412} sub="Across all roles" />
        <InfoCard label="Active today" value={286} sub="Logged in last 24h" />
        <InfoCard label="Pending invites" value={8} sub="Awaiting acceptance" />
      </div>
      <SimpleTable
        columns={["Name", "Email", "Role", "Status"]}
        rows={mockUsers.map((u) => [
          u.name,
          u.email,
          u.role,
          <Badge key={u.email} variant="success">{u.status}</Badge>,
        ])}
      />
    </ModuleHub>
  );
}

export function SettingsRolesPage() {
  return (
    <ModuleHub
      title="Roles & Permissions"
      description="Define roles and configure module-level access controls."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Settings", href: "/settings" }, { label: "Roles" }]}
      tabs={SETTINGS_TABS}
      actions={
        <MockActionButton
          label="Create role"
          fields={[
            { name: "name", label: "Role name", required: true },
            { name: "permissions", label: "Permissions summary", type: "textarea", placeholder: "e.g. manage students, view fees" },
          ]}
          submitLabel="Create"
          icon={<Shield className="size-4" />}
        />
      }
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available roles</CardTitle>
          <CardDescription>{mockRoles.length} predefined roles in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockRoles.map((role) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission matrix — Institution Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Module", "View", "Create", "Edit", "Delete", "Approve", "Export"]}
            rows={mockPermissions.map((p) => [
              p.module,
              permissionCell(p.view),
              permissionCell(p.create),
              permissionCell(p.edit),
              permissionCell(p.delete),
              permissionCell(p.approve),
              permissionCell(p.export),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function SettingsSubscriptionPage() {
  const { institution } = useApp();
  const isTrial = institution.status === "trial";

  return (
    <ModuleHub
      title="Subscription"
      description="Manage your plan, billing, and resource usage."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Settings", href: "/settings" }, { label: "Subscription" }]}
      tabs={SETTINGS_TABS}
    >
      {isTrial ? (
        <div className="rounded-lg border border-[var(--warning)]/20 bg-[var(--warning-muted)] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--warning)]" />
                <p className="font-semibold">Free trial active</p>
                <Badge variant="warning">18 days remaining</Badge>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                12 days used · 18 days remaining · All core modules enabled for {institution.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden h-2 w-32 overflow-hidden rounded-full bg-[var(--surface)] sm:block">
                <div className="h-full w-[40%] rounded-full bg-[var(--warning)]" />
              </div>
              <MockToastButton
                label="Choose plan"
                message="Scrolled to plans (demo)."
                size="sm"
                variant="default"
                icon={<ArrowUpRight className="size-4" />}
              >
                Choose plan
                <ArrowUpRight className="size-4" />
              </MockToastButton>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {usageMetrics.map((metric) => {
          const pct = Math.round((metric.used / metric.limit) * 100);
          const displayUsed = metric.unit ? `${metric.used} ${metric.unit}` : formatNumber(metric.used);
          const displayLimit = metric.unit ? `${metric.limit} ${metric.unit}` : formatNumber(metric.limit);
          return (
            <Card key={metric.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="ems-label">{metric.label}</p>
                <span className="text-xs font-medium text-[var(--muted)]">{pct}%</span>
              </div>
              <p className="mt-1 text-lg font-semibold">
                {displayUsed}
                <span className="text-sm font-normal text-[var(--muted)]"> / {displayLimit}</span>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--brand-primary)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? "border-[var(--brand-primary)] shadow-[var(--shadow-sm)]" : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {plan.name === "Enterprise" ? (
                    <Crown className="size-4 text-[var(--warning)]" />
                  ) : plan.name === "Professional" ? (
                    <Zap className="size-4 text-[var(--brand-primary)]" />
                  ) : (
                    <Building2 className="size-4 text-[var(--muted)]" />
                  )}
                  {plan.name}
                </CardTitle>
                {plan.highlighted ? <Badge>Current trial tier</Badge> : null}
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-sm text-[var(--muted)]">{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-[var(--success)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <MockToastButton
                className="mt-5 w-full"
                label={
                  plan.highlighted
                    ? "Upgrade now"
                    : plan.name === "Enterprise"
                      ? "Contact sales"
                      : "Select plan"
                }
                message={`${plan.name} plan selected (demo).`}
                variant={plan.highlighted ? "default" : "outline"}
                size="default"
                icon={plan.highlighted ? <CreditCard className="size-4" /> : undefined}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function SettingsModulesPage() {
  const { institution, institutionMode, enabledModules, setModuleEnabled, t } = useApp();

  const visible = MODULE_CATALOG.filter((m) =>
    institutionMode === "university" ? m.university : m.school,
  );

  return (
    <ModuleHub
      title="Enabled Modules"
      description={`Toggle modules for ${institution.name}. Disabled modules disappear from the sidebar immediately (demo).`}
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Settings", href: "/settings" }, { label: "Modules" }]}
      tabs={SETTINGS_TABS}
      actions={
        <MockToastButton
          label="Save module configuration"
          message="Module configuration saved for this demo session."
          size="sm"
          variant="default"
        />
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="info" className="capitalize">
          {institutionMode} · {t("institution")}
        </Badge>
        <Badge variant="outline">{visible.filter((m) => enabledModules[m.id]).length} enabled</Badge>
        <Badge variant="outline">{visible.length} available for this type</Badge>
      </div>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Switching institution resets modules to that tenant&apos;s defaults. Try Crescent (school) vs NED (university).
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((mod) => (
          <Card key={mod.id} className="border-[var(--border-subtle)]">
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium tracking-tight">{mod.name}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{mod.category}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabledModules[mod.id]}
                aria-label={`Toggle ${mod.name}`}
                onClick={() => setModuleEnabled(mod.id, !enabledModules[mod.id])}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  enabledModules[mod.id] ? "bg-[var(--brand-primary)]" : "bg-[var(--border)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                    enabledModules[mod.id] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}
