import { api } from "@/lib/api";

export async function getApplicationStats() {
  return api<Record<string, number>>("/applications/stats");
}

export async function getApplications(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await api<{ data: unknown[] }>(`/applications${qs ? `?${qs}` : ""}`);
  return res.data;
}

export async function getApplication(id: string) {
  return api(`/applications/${id}`);
}

export async function getWorkflows() {
  const res = await api<{ data: unknown[] }>("/workflows");
  return res.data;
}

export async function getWorkflow(id: string) {
  return api(`/workflows/${id}`);
}

export async function decideApplication(
  id: string,
  payload: { status: string; stage?: string; assignedTo?: string },
) {
  return api(`/applications/${id}/decide`, { method: "POST", body: payload });
}
