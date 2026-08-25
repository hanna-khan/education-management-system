import type {
  GatePass,
  PickupRequest,
  SecurityScan,
  VisitorRegistration,
  VisitorStats,
} from "@/types/visitors";

export const VISITORS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/visitors" },
  { id: "register", label: "Register", href: "/visitors/register" },
  { id: "passes", label: "Gate Passes", href: "/visitors/passes" },
  { id: "pickup", label: "Pickup Requests", href: "/visitors/pickup-requests" },
  { id: "approval", label: "Approval", href: "/visitors/approval" },
  { id: "security", label: "Security", href: "/visitors/security" },
];

export const VISITOR_WORKFLOW = [
  "Request",
  "Approval",
  "QR Generated",
  "Security Scan",
  "Entry",
  "Exit",
];

export const visitorStats: VisitorStats = {
  visitorsToday: 47,
  activePasses: 12,
  pendingApprovals: 8,
  pickupRequests: 5,
  checkedInNow: 12,
  securityScansToday: 94,
};

export const mockVisitorRegistrations: VisitorRegistration[] = [
  { id: "vr-001", registrationId: "VR-2026-0142", visitorName: "Engr. Ahmed Khan", cnic: "42101-1234567-1", phone: "+92-300-1234567", purpose: "Guest lecture — Power Systems", hostName: "Prof. Saima Rizvi", hostDepartment: "Electrical Engineering", vehicleNumber: "KHI-1234", registeredAt: "2026-02-23 08:30", status: "checked_in" },
  { id: "vr-002", registrationId: "VR-2026-0145", visitorName: "Mrs. Farah Siddiqui", cnic: "42101-9876543-2", phone: "+92-321-9876543", purpose: "Parent meeting — Academic progress", hostName: "Dr. Farhan Ahmed", hostDepartment: "Computer & Info Systems", registeredAt: "2026-02-23 09:15", status: "approved" },
  { id: "vr-003", registrationId: "VR-2026-0148", visitorName: "Muhammad Imran (Vendor)", cnic: "42101-5551234-3", phone: "+92-333-5551234", purpose: "Lab equipment delivery", hostName: "Store Keeper — Rashid Ali", hostDepartment: "Administration", vehicleNumber: "KHI-5678", registeredAt: "2026-02-23 10:00", status: "pending" },
  { id: "vr-004", registrationId: "VR-2026-0150", visitorName: "Dr. Hassan Raza (Alumni)", cnic: "42101-7778899-4", phone: "+92-345-7778899", purpose: "Alumni networking event", hostName: "Alumni Office", hostDepartment: "Alumni Affairs", registeredAt: "2026-02-22 14:00", status: "checked_out" },
];

export const mockGatePasses: GatePass[] = [
  { id: "gp-001", passId: "GP-2026-0088", visitorName: "Engr. Ahmed Khan", cnic: "42101-1234567-1", passType: "guest_lecturer", hostName: "Prof. Saima Rizvi", validFrom: "2026-02-23 09:00", validUntil: "2026-02-23 17:00", qrCode: "NED-GP-2026-0088-AK", status: "checked_in", approvedBy: "Prof. Saima Rizvi", entryTime: "2026-02-23 09:05" },
  { id: "gp-002", passId: "GP-2026-0092", visitorName: "Mrs. Farah Siddiqui", cnic: "42101-9876543-2", passType: "general", hostName: "Dr. Farhan Ahmed", validFrom: "2026-02-23 10:00", validUntil: "2026-02-23 12:00", qrCode: "NED-GP-2026-0092-FS", status: "approved", approvedBy: "Dr. Farhan Ahmed" },
  { id: "gp-003", passId: "GP-2026-0095", visitorName: "Muhammad Imran", cnic: "42101-5551234-3", passType: "vendor", hostName: "Store Keeper — Rashid Ali", validFrom: "2026-02-23 10:30", validUntil: "2026-02-23 14:00", qrCode: "NED-GP-2026-0095-MI", status: "pending" },
  { id: "gp-004", passId: "GP-2026-0098", visitorName: "Mr. Tariq Mehmood", cnic: "42101-3334455-5", passType: "parent_pickup", hostName: "Parent Portal", validFrom: "2026-02-23 14:00", validUntil: "2026-02-23 15:30", qrCode: "NED-GP-2026-0098-TM", status: "approved", approvedBy: "Security — Auto" },
  { id: "gp-005", passId: "GP-2026-0085", visitorName: "Dr. Hassan Raza", cnic: "42101-7778899-4", passType: "official", hostName: "Alumni Office", validFrom: "2026-02-22 14:00", validUntil: "2026-02-22 18:00", qrCode: "NED-GP-2026-0085-HR", status: "checked_out", approvedBy: "Alumni Officer", entryTime: "2026-02-22 14:10", exitTime: "2026-02-22 17:45" },
];

export const mockPickupRequests: PickupRequest[] = [
  { id: "pk-001", requestId: "PK-2026-0042", parentName: "Mr. Tariq Mehmood", parentPhone: "+92-300-9988776", studentName: "Ahmed Hassan Siddiqui", studentId: "CS-2022-0421", classSection: "BS CS — Sem 7", pickupTime: "2026-02-23 14:30", authorizedPerson: "Mr. Tariq Mehmood", authorizedCnic: "42101-3334455-5", submittedAt: "2026-02-23 08:00", status: "approved" },
  { id: "pk-002", requestId: "PK-2026-0045", parentName: "Mrs. Ayesha Malik", parentPhone: "+92-321-1122334", studentName: "Fatima Zahra Ali", studentId: "CS-2023-0112", classSection: "BS CS — Sem 5", pickupTime: "2026-02-23 16:00", authorizedPerson: "Mrs. Ayesha Malik", authorizedCnic: "42101-4445566-6", submittedAt: "2026-02-23 10:30", status: "pending" },
  { id: "pk-003", requestId: "PK-2026-0038", parentName: "Engr. Bilal Qureshi", parentPhone: "+92-333-5566778", studentName: "Bilal Ahmed Qureshi", studentId: "EE-2024-0156", classSection: "BS EE — Sem 3", pickupTime: "2026-02-22 15:00", authorizedPerson: "Uncle — Hassan Raza", authorizedCnic: "42101-6667788-7", submittedAt: "2026-02-22 09:00", status: "completed" },
];

export const mockSecurityScans: SecurityScan[] = [
  { id: "ss-001", scanId: "SC-2026-0142", passId: "GP-2026-0088", visitorName: "Engr. Ahmed Khan", scanType: "entry", scannedAt: "2026-02-23 09:05", gate: "Main Gate — University Road", guardName: "Ali Hassan", result: "allowed" },
  { id: "ss-002", scanId: "SC-2026-0145", passId: "GP-2026-0085", visitorName: "Dr. Hassan Raza", scanType: "exit", scannedAt: "2026-02-22 17:45", gate: "Main Gate — University Road", guardName: "Usman Khan", result: "allowed" },
  { id: "ss-003", scanId: "SC-2026-0148", passId: "GP-2026-0080", visitorName: "Unknown Visitor", scanType: "verify", scannedAt: "2026-02-22 11:20", gate: "North Gate", guardName: "Rashid Ali", result: "expired" },
  { id: "ss-004", scanId: "SC-2026-0150", passId: "GP-2026-0075", visitorName: "Rejected Applicant", scanType: "entry", scannedAt: "2026-02-21 15:30", gate: "Main Gate — University Road", guardName: "Ali Hassan", result: "denied" },
];

export function getGatePass(id: string) {
  return mockGatePasses.find((p) => p.id === id || p.passId === id) ?? null;
}

export function getVisitorWorkflow(passId: string) {
  const pass = getGatePass(passId);
  if (!pass) return VISITOR_WORKFLOW.map((stage, i) => ({ stage, completed: false, current: i === 0 }));
  const statusMap: Record<string, number> = {
    pending: 0,
    approved: 2,
    checked_in: 4,
    checked_out: 5,
    rejected: 0,
    expired: 3,
  };
  const idx = statusMap[pass.status] ?? 0;
  return VISITOR_WORKFLOW.map((stage, i) => ({
    stage,
    completed: i <= idx,
    current: i === idx,
  }));
}
