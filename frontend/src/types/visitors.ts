export type VisitorStatus = "pending" | "approved" | "rejected" | "checked_in" | "checked_out" | "expired";
export type PassType = "general" | "parent_pickup" | "vendor" | "guest_lecturer" | "official";
export type PickupRequestStatus = "pending" | "approved" | "rejected" | "completed";

export interface VisitorStats {
  visitorsToday: number;
  activePasses: number;
  pendingApprovals: number;
  pickupRequests: number;
  checkedInNow: number;
  securityScansToday: number;
}

export interface VisitorRegistration {
  id: string;
  registrationId: string;
  visitorName: string;
  cnic: string;
  phone: string;
  purpose: string;
  hostName: string;
  hostDepartment: string;
  vehicleNumber?: string;
  registeredAt: string;
  status: VisitorStatus;
}

export interface GatePass {
  id: string;
  passId: string;
  visitorName: string;
  cnic: string;
  passType: PassType;
  hostName: string;
  validFrom: string;
  validUntil: string;
  qrCode: string;
  status: VisitorStatus;
  approvedBy?: string;
  entryTime?: string;
  exitTime?: string;
}

export interface PickupRequest {
  id: string;
  requestId: string;
  parentName: string;
  parentPhone: string;
  studentName: string;
  studentId: string;
  classSection: string;
  pickupTime: string;
  authorizedPerson: string;
  authorizedCnic: string;
  submittedAt: string;
  status: PickupRequestStatus;
}

export interface SecurityScan {
  id: string;
  scanId: string;
  passId: string;
  visitorName: string;
  scanType: "entry" | "exit" | "verify";
  scannedAt: string;
  gate: string;
  guardName: string;
  result: "allowed" | "denied" | "expired";
}
