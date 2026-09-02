"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, Copy, Loader2, Mail, RefreshCw, UserPlus, X } from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SETTINGS_TABS } from "@/mock/portals";
import { ApiError } from "@/lib/api";
import { getCampuses } from "@/services/tenancy";
import {
  cancelInvitation,
  createInvitation,
  listInvitations,
  listStaff,
  resendInvitation,
  type InvitationRow,
  type StaffMember,
} from "@/services/staff";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";

const INVITE_ROLES = [
  { id: "principal", label: "Principal", needsCampus: "one" as const },
  { id: "vice_principal", label: "Vice Principal", needsCampus: "one" as const },
  { id: "teacher", label: "Teacher", needsCampus: "many" as const },
  { id: "registrar", label: "Registrar", needsCampus: "none" as const },
  { id: "accountant", label: "Accountant", needsCampus: "none" as const },
  { id: "hr", label: "HR", needsCampus: "none" as const },
  { id: "admission_officer", label: "Admissions Officer", needsCampus: "none" as const },
  { id: "exam_officer", label: "Exam Officer", needsCampus: "none" as const },
];

export default function SettingsStaffPage() {
  const { t, user, roleLabel, clearSession } = useApp();
  const canInvite = [
    "platform_admin",
    "super_admin",
    "institution_admin",
    "principal",
    "vice_principal",
    "registrar",
  ].includes(user.role);

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [invites, setInvites] = useState<InvitationRow[]>([]);
  const [campuses, setCampuses] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
  const [mailHint, setMailHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("teacher");
  const [campusIds, setCampusIds] = useState<string[]>([]);

  const roleMeta = useMemo(() => INVITE_ROLES.find((r) => r.id === role), [role]);

  async function refresh() {
    if (!canInvite) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [staffRows, inviteRows, campusRows] = await Promise.all([
        listStaff(),
        listInvitations(),
        getCampuses(),
      ]);
      setStaff(staffRows);
      setInvites(inviteRows);
      setCampuses(
        (campusRows as Array<{ id: string; name: string }>).map((c) => ({
          id: c.id,
          name: c.name,
        })),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load staff.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInvite]);

  useEffect(() => {
    setCampusIds([]);
  }, [role]);

  function toggleCampus(id: string) {
    if (roleMeta?.needsCampus === "one") {
      setCampusIds([id]);
      return;
    }
    setCampusIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setLastInviteUrl(null);
    try {
      const res = await createInvitation({
        email,
        name: name || undefined,
        role,
        campusIds: roleMeta?.needsCampus === "none" ? [] : campusIds,
      });
      setLastInviteUrl(res.inviteUrl);
      setMailHint(res.mailInboxHint || "http://127.0.0.1:8025");
      setEmail("");
      setName("");
      setCampusIds([]);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send invitation.");
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <ModuleHub
      title="Staff & invites"
      description="Invite principals, vice principals, and teachers. They set their own password from the invite link."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Staff & invites" },
      ]}
      tabs={SETTINGS_TABS}
    >
      {!canInvite ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Wrong account for invitations</p>
          <p className="mt-1 text-amber-900/80">
            You’re signed in as <strong>{roleLabel(user.role)}</strong>. Only the institution admin
            (or a principal) can invite staff. Sign out, then sign in with your admin email.
          </p>
          <Button
            className="mt-4 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
            onClick={() => {
              clearSession();
              window.location.href = "/login";
            }}
          >
            Sign in as admin
          </Button>
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form
          onSubmit={onInvite}
          className="rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#EFEAFF] text-[#6B58F6]">
              <UserPlus className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#3D3558]">Send invitation</h2>
              <p className="text-xs text-[#8B86A3]">We email them a premium invite. You can also copy the link.</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name (optional)">
                <Input
                  className="h-11 rounded-xl border-[#E8E4F4]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ayesha Khan"
                />
              </Field>
              <Field label="Work email">
                <Input
                  type="email"
                  required
                  className="h-11 rounded-xl border-[#E8E4F4]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                />
              </Field>
            </div>

            <Field label="Role">
              <div className="grid gap-2 sm:grid-cols-2">
                {INVITE_ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                      role === r.id
                        ? "border-[#6B58F6] bg-[#EFEAFF] font-medium text-[#3D3558]"
                        : "border-[#E8E4F4] text-[#8B86A3] hover:border-[#6B58F6]/40",
                    )}
                  >
                    {r.id === "principal" ? t("campus_head") : r.label}
                  </button>
                ))}
              </div>
            </Field>

            {roleMeta?.needsCampus !== "none" ? (
              <Field
                label={
                  roleMeta?.needsCampus === "one"
                    ? "Campus"
                    : "Campuses (teachers can work on more than one)"
                }
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  {campuses.map((c) => {
                    const active = campusIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCampus(c.id)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-left text-sm",
                          active
                            ? "border-[#6B58F6] bg-[#EFEAFF] text-[#3D3558]"
                            : "border-[#E8E4F4] text-[#8B86A3]",
                        )}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
            ) : null}

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            {lastInviteUrl ? (
              <div className="rounded-2xl border border-[#C9C0EF] bg-[#F8F7FC] p-3">
                <p className="text-xs font-medium text-[#3D3558]">Invitation ready</p>
                <p className="mt-1 text-xs text-[#8B86A3]">
                  Open your local mail inbox to view the email:{" "}
                  <a
                    href={mailHint || "http://127.0.0.1:8025"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#6B58F6] underline"
                  >
                    {mailHint || "http://127.0.0.1:8025"}
                  </a>
                </p>
                <p className="mt-2 break-all text-xs text-[#8B86A3]">{lastInviteUrl}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 h-9 rounded-xl border-[#E8E4F4]"
                  onClick={() => copyUrl(lastInviteUrl)}
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              Create invite
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#3D3558]">Pending invites</h3>
              <button type="button" onClick={refresh} className="text-[#6B58F6]">
                <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              </button>
            </div>
            {loading ? (
              <Loader2 className="mx-auto my-6 size-5 animate-spin text-[#6B58F6]" />
            ) : invites.filter((i) => i.status === "pending").length === 0 ? (
              <p className="py-6 text-center text-sm text-[#8B86A3]">No pending invitations</p>
            ) : (
              <ul className="space-y-2">
                {invites
                  .filter((i) => i.status === "pending")
                  .map((inv) => (
                    <li
                      key={inv.id}
                      className="flex items-start justify-between gap-2 rounded-2xl border border-[#E8E4F4] px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#3D3558]">{inv.email}</p>
                        <p className="text-xs text-[#8B86A3]">{inv.roleLabel}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {inv.inviteUrl ? (
                          <button
                            type="button"
                            className="rounded-lg p-1.5 text-[#6B58F6] hover:bg-[#EFEAFF]"
                            onClick={() => copyUrl(inv.inviteUrl!)}
                            title="Copy link"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-[#8B86A3] hover:bg-[#F4F2FB]"
                          onClick={async () => {
                            await resendInvitation(inv.id).then((r) => setLastInviteUrl(r.inviteUrl));
                            await refresh();
                          }}
                          title="Resend"
                        >
                          <RefreshCw className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                          onClick={async () => {
                            await cancelInvitation(inv.id);
                            await refresh();
                          }}
                          title="Cancel"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-[#3D3558]">Team members</h3>
            {staff.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#8B86A3]">No staff yet besides you</p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {staff.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-2xl border border-[#E8E4F4] px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-[#3D3558]">{s.name}</p>
                    <p className="text-xs text-[#8B86A3]">
                      {s.roleLabel} · {s.email}
                    </p>
                    {s.campuses.length > 0 ? (
                      <p className="mt-1 text-[11px] text-[#6B58F6]">
                        {s.campuses.map((c) => c.name).filter(Boolean).join(", ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}
    </ModuleHub>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#3D3558]">{label}</label>
      {children}
    </div>
  );
}
