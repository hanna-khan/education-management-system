import type { AdminAuditLog, AdminAuditStats } from "@/types/admin-audit";

export const adminAuditStats: AdminAuditStats = {
  totalLogs: 2846,
  logsToday: 47,
  uniqueUsers: 128,
  modulesTracked: 32,
};

export const mockAdminAuditLogs: AdminAuditLog[] = [
  { id: "al-001", logId: "AUD-2026-0142", user: "Dr. Samina Khursheed", userRole: "qec_officer", action: "UPDATE", module: "Quality Assurance", record: "KPI QEC-02", timestamp: "2026-02-23 09:15:32", ipAddress: "192.168.10.45", device: "Chrome 122 / Windows 11", oldValue: "Response Rate: 65%", newValue: "Response Rate: 68%" },
  { id: "al-002", logId: "AUD-2026-0141", user: "Prof. Saima Rizvi", userRole: "hod", action: "CREATE", module: "Procurement", record: "PR-2026-0088", timestamp: "2026-02-23 08:42:18", ipAddress: "192.168.20.12", device: "Firefox 123 / macOS", oldValue: undefined, newValue: "Purchase Request: EE Lab Multimeters" },
  { id: "al-003", logId: "AUD-2026-0140", user: "Capt. Javed Iqbal", userRole: "security", action: "CREATE", module: "Emergency", record: "EA-2026-001", timestamp: "2026-02-23 09:00:05", ipAddress: "192.168.5.88", device: "Chrome 122 / Windows 10", oldValue: undefined, newValue: "Alert: Heatwave Advisory" },
  { id: "al-004", logId: "AUD-2026-0139", user: "Store Keeper — Rashid Ali", userRole: "facility_manager", action: "UPDATE", module: "Inventory", record: "NED-EE-001", timestamp: "2026-02-22 16:30:44", ipAddress: "192.168.15.22", device: "Edge 122 / Windows 11", oldValue: "Stock: 8", newValue: "Stock: 18 (+10 receipt)" },
  { id: "al-005", logId: "AUD-2026-0138", user: "Dr. Farhan Ahmed", userRole: "hod", action: "APPROVE", module: "Visitors", record: "GP-2026-0092", timestamp: "2026-02-22 15:20:11", ipAddress: "192.168.20.45", device: "Safari 17 / iOS", oldValue: "Status: pending", newValue: "Status: approved" },
  { id: "al-006", logId: "AUD-2026-0137", user: "Institution Admin", userRole: "institution_admin", action: "UPDATE", module: "Settings", record: "Module: surveys", timestamp: "2026-02-22 14:05:33", ipAddress: "192.168.1.100", device: "Chrome 122 / Windows 11", oldValue: "enabled: false", newValue: "enabled: true" },
  { id: "al-007", logId: "AUD-2026-0136", user: "Accountant — Faisal Mehmood", userRole: "accountant", action: "CREATE", module: "Procurement", record: "PO-2026-0095", timestamp: "2026-02-22 11:18:27", ipAddress: "192.168.30.15", device: "Chrome 122 / Windows 11", oldValue: undefined, newValue: "PO issued: PKR 172,000 to TechZone" },
  { id: "al-008", logId: "AUD-2026-0135", user: "Dr. Asif Raza", userRole: "principal", action: "DELETE", module: "Assets", record: "NED-AST-2015-0044", timestamp: "2026-02-21 10:45:00", ipAddress: "192.168.1.50", device: "Chrome 121 / Windows 11", oldValue: "Status: damaged", newValue: "Status: disposed (scrap)" },
  { id: "al-009", logId: "AUD-2026-0134", user: "Engr. Bilal Sheikh", userRole: "hod", action: "UPDATE", module: "Accreditation", record: "CYC-ME-2026", timestamp: "2026-02-21 09:30:18", ipAddress: "192.168.25.8", device: "Firefox 122 / Linux", oldValue: "Stage: preparation (30%)", newValue: "Stage: preparation (35%)" },
  { id: "al-010", logId: "AUD-2026-0133", user: "Ali Hassan", userRole: "security", action: "SCAN", module: "Visitors", record: "GP-2026-0088", timestamp: "2026-02-23 09:05:12", ipAddress: "192.168.5.10", device: "Gate Scanner / Android", oldValue: undefined, newValue: "Entry allowed — Main Gate" },
];

export function getAdminAuditLog(id: string) {
  return mockAdminAuditLogs.find((l) => l.id === id || l.logId === id) ?? null;
}
