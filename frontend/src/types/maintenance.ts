export type MaintenanceCategory =
  | "electrical"
  | "plumbing"
  | "cleaning"
  | "hvac"
  | "furniture"
  | "classroom"
  | "laboratory"
  | "general";

export type MaintenancePriority = "low" | "medium" | "high" | "urgent";
export type MaintenanceStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "waiting"
  | "resolved"
  | "closed";

export interface MaintenanceStats {
  totalTickets: number;
  openTickets: number;
  inProgress: number;
  resolvedThisMonth: number;
  avgResolutionHours: number;
  slaBreaches: number;
}

export interface MaintenanceStaff {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  specialties: MaintenanceCategory[];
  activeTickets: number;
  phone: string;
}

export interface MaintenanceTimelineEntry {
  at: string;
  action: string;
  actor: string;
  note?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketId: string;
  requester: string;
  requesterRole: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  location: string;
  building: string;
  description: string;
  attachment?: string;
  assignedStaff?: string;
  status: MaintenanceStatus;
  slaDeadline: string;
  slaBreached: boolean;
  submittedAt: string;
  resolvedAt?: string;
}

export interface MaintenanceCategoryInfo {
  id: MaintenanceCategory;
  label: string;
  slaHours: number;
  assignedTeam: string;
  openCount: number;
}
