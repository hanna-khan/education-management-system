import { api } from "@/lib/api";

export async function getAdmissionStats() {
  return api<Record<string, number | string>>("/admissions/stats");
}

export async function getAdmissionCycles() {
  const res = await api<{ data: unknown[] }>("/admissions/cycles");
  return res.data;
}

export async function getApplicants(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await api<{ data: unknown[] }>(`/admissions/applicants${qs ? `?${qs}` : ""}`);
  return res.data;
}

export async function getMeritLists() {
  const res = await api<{ data: unknown[] }>("/admissions/merit-lists");
  return res.data;
}

export async function getInterviews() {
  const res = await api<{ data: unknown[] }>("/admissions/interviews");
  return res.data;
}

export async function getOffers() {
  const res = await api<{ data: unknown[] }>("/admissions/offers");
  return res.data;
}

export async function enrollOffer(offerId: string) {
  return api(`/admissions/offers/${offerId}/enroll`, { method: "POST" });
}
