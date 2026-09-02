import { api } from "@/lib/api";

export async function getAttendanceStats(date?: string) {
  const qs = date ? `?date=${date}` : "";
  return api<Record<string, number>>(`/attendance/stats${qs}`);
}

export async function getDailyAttendance(date?: string) {
  const qs = date ? `?date=${date}` : "";
  const res = await api<{ data: unknown[] }>(`/attendance/daily${qs}`);
  return res.data;
}

export async function getCorrections() {
  const res = await api<{ data: unknown[] }>("/attendance/corrections");
  return res.data;
}

export async function getLeaves() {
  const res = await api<{ data: unknown[] }>("/attendance/leaves");
  return res.data;
}

export async function markAttendance(payload: {
  date: string;
  course?: string;
  entries: Array<{
    studentId?: string;
    studentNumber?: string;
    status: string;
    method?: string;
    remarks?: string;
    time?: string;
  }>;
}) {
  return api("/attendance/mark", { method: "POST", body: payload });
}
