import { adminAuditStats, mockAdminAuditLogs } from "@/mock/admin-audit";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAdminAuditStats() {
  await delay(85);
  return adminAuditStats;
}

export async function getAdminAuditLogs() {
  await delay(100);
  return mockAdminAuditLogs;
}

export async function getAdminAuditLog(id: string) {
  await delay(80);
  return mockAdminAuditLogs.find((l) => l.id === id || l.logId === id) ?? null;
}
