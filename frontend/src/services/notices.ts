import { api } from "@/lib/api";

export async function getNotices(status?: string) {
  const qs = status ? `?status=${status}` : "";
  const res = await api<{ data: unknown[] }>(`/notices${qs}`);
  return res.data;
}

export async function createNotice(payload: {
  title: string;
  audience?: string;
  body?: string;
  status?: string;
  expiry?: string;
}) {
  return api("/notices", { method: "POST", body: payload });
}
