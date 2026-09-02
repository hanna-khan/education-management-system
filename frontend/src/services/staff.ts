import { api } from "@/lib/api";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  status: string;
  campuses: Array<{ id: string; name?: string; role: string }>;
}

export interface InvitationRow {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  roleLabel: string;
  campusIds: string[];
  status: string;
  expiresAt?: string;
  createdAt?: string;
  inviteUrl?: string | null;
}

export async function listStaff() {
  const res = await api<{ data: StaffMember[] }>("/staff");
  return res.data;
}

export async function listInvitations() {
  const res = await api<{ data: InvitationRow[] }>("/invitations");
  return res.data;
}

export async function createInvitation(payload: {
  email: string;
  name?: string;
  role: string;
  campusIds: string[];
}) {
  return api<{
    invitation: InvitationRow;
    inviteUrl: string;
    message: string;
    mailSent?: boolean;
    mailInboxHint?: string;
  }>("/invitations", {
    method: "POST",
    body: payload,
  });
}

export async function resendInvitation(id: string) {
  return api<{ invitation: InvitationRow; inviteUrl: string; message: string }>(
    `/invitations/${id}/resend`,
    { method: "POST" },
  );
}

export async function cancelInvitation(id: string) {
  return api(`/invitations/${id}`, { method: "DELETE" });
}

export async function getInviteByToken(token: string) {
  return api<{
    valid: boolean;
    email?: string;
    name?: string;
    role?: string;
    roleLabel?: string;
    institutionName?: string;
    institutionType?: string;
    campuses?: Array<{ id: string; name: string; city?: string }>;
    expiresAt?: string;
    message?: string;
  }>(`/invitations/accept/${token}`, { auth: false });
}

export async function acceptInvitation(payload: {
  token: string;
  name: string;
  password: string;
  password_confirmation: string;
}) {
  return api<{
    token: string;
    user: import("@/types").User;
    institution: import("@/types").Institution;
    message: string;
  }>("/invitations/accept", { method: "POST", auth: false, body: payload });
}
