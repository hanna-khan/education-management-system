import { api } from "@/lib/api";

export async function getFeeStats() {
  return api<Record<string, number>>("/fees/stats");
}

export async function getInvoices(status?: string) {
  const qs = status ? `?status=${status}` : "";
  const res = await api<{ data: unknown[] }>(`/fees/invoices${qs}`);
  return res.data;
}

export async function getPayments() {
  const res = await api<{ data: unknown[] }>("/fees/payments");
  return res.data;
}

export async function getScholarships() {
  const res = await api<{ data: unknown[] }>("/fees/scholarships");
  return res.data;
}

export async function getScholarshipStats() {
  return api<Record<string, number>>("/fees/scholarships/stats");
}

export async function recordPayment(payload: {
  invoiceId: string;
  amount: number;
  method?: string;
  date?: string;
}) {
  return api("/fees/payments", { method: "POST", body: payload });
}
