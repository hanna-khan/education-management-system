import { api } from "@/lib/api";

export async function getExamStats() {
  return api<Record<string, number>>("/exams/stats");
}

export async function getExamSchedules() {
  const res = await api<{ data: unknown[] }>("/exams/schedules");
  return res.data;
}

export async function getExamMarks() {
  const res = await api<{ data: unknown[] }>("/exams/marks");
  return res.data;
}

export async function getExamResults(studentId?: string) {
  const qs = studentId ? `?studentId=${studentId}` : "";
  const res = await api<{ data: unknown[] }>(`/exams/results${qs}`);
  return res.data;
}

export async function saveExamMarks(entries: unknown[]) {
  return api("/exams/marks", { method: "PUT", body: { entries } });
}
