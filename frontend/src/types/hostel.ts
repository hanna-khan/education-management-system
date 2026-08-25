export type HostelGender = "male" | "female" | "mixed";
export type BedStatus = "available" | "occupied" | "reserved" | "maintenance";
export type RoomStatus = "available" | "full" | "maintenance" | "closed";
export type HostelApplicationStatus = "pending" | "under_review" | "approved" | "rejected" | "waitlisted" | "allocated";
export type HostelFeeStatus = "pending" | "paid" | "partial" | "overdue" | "waived";
export type HostelComplaintStatus = "open" | "in_progress" | "resolved" | "closed";
export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface HostelStats {
  totalHostels: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  pendingApplications: number;
  hostelFeesOutstanding: number;
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  gender: HostelGender;
  warden: string;
  phone: string;
  address: string;
  buildings: number;
  rooms: number;
  beds: number;
  occupied: number;
  status: "active" | "maintenance" | "closed";
}

export interface HostelBuilding {
  id: string;
  hostelId: string;
  hostelName: string;
  name: string;
  code: string;
  floors: number;
  rooms: number;
  beds: number;
  occupied: number;
}

export interface HostelFloor {
  id: string;
  buildingId: string;
  buildingName: string;
  hostelName: string;
  floorNumber: number;
  rooms: number;
  beds: number;
  occupied: number;
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  floorId: string;
  floorNumber: number;
  hostelName: string;
  type: "single" | "double" | "triple" | "quad";
  capacity: number;
  occupied: number;
  status: RoomStatus;
  monthlyFee: number;
}

export interface HostelBed {
  id: string;
  bedNumber: string;
  roomId: string;
  roomNumber: string;
  buildingName: string;
  hostelName: string;
  status: BedStatus;
  studentId?: string;
  studentName?: string;
}

export interface HostelStudent {
  id: string;
  studentId: string;
  name: string;
  program: string;
  semester: number;
  hostelName: string;
  roomNumber: string;
  bedNumber: string;
  checkIn: string;
  checkOut?: string;
  status: "active" | "checked_out" | "suspended";
}

export interface HostelApplication {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  program: string;
  semester: number;
  preferredHostel: string;
  reason: string;
  submittedAt: string;
  status: HostelApplicationStatus;
  guardianPhone: string;
  city: string;
}

export interface HostelAllocation {
  id: string;
  studentId: string;
  studentName: string;
  hostelName: string;
  roomNumber: string;
  bedNumber: string;
  allocatedAt: string;
  allocatedBy: string;
  status: "active" | "ended";
}

export interface HostelWaitingEntry {
  id: string;
  studentId: string;
  studentName: string;
  preferredHostel: string;
  position: number;
  appliedAt: string;
  priority: "normal" | "high" | "emergency";
}

export interface HostelFee {
  id: string;
  studentId: string;
  studentName: string;
  hostelName: string;
  month: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: HostelFeeStatus;
}

export interface HostelComplaint {
  id: string;
  complaintId: string;
  studentId: string;
  studentName: string;
  hostelName: string;
  roomNumber: string;
  category: string;
  description: string;
  submittedAt: string;
  status: HostelComplaintStatus;
}

export interface HostelMaintenance {
  id: string;
  ticketId: string;
  hostelName: string;
  location: string;
  issue: string;
  priority: "low" | "medium" | "high" | "urgent";
  reportedAt: string;
  status: MaintenanceStatus;
  assignedTo?: string;
}

export interface StudentHostelSummary {
  applicationStatus: HostelApplicationStatus | "none";
  allocation?: {
    hostelName: string;
    roomNumber: string;
    bedNumber: string;
    checkIn: string;
  };
  pendingFees: number;
  complaints: number;
}
