export type ItCategory =
  | "hardware"
  | "software"
  | "network"
  | "wifi"
  | "account"
  | "password"
  | "email"
  | "lms"
  | "other";

export type ItPriority = "low" | "medium" | "high" | "critical";
export type ItStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "waiting_for_user"
  | "resolved"
  | "closed";

export interface ItHelpdeskStats {
  totalTickets: number;
  openTickets: number;
  inProgress: number;
  resolvedToday: number;
  avgResponseMinutes: number;
  slaCompliance: number;
}

export interface ItTechnician {
  id: string;
  name: string;
  employeeId: string;
  specialties: ItCategory[];
  activeTickets: number;
  resolvedThisMonth: number;
  phone: string;
  shift: string;
}

export interface ItComment {
  id: string;
  author: string;
  message: string;
  at: string;
  internal?: boolean;
}

export interface ItTimelineEntry {
  at: string;
  action: string;
  actor: string;
  note?: string;
}

export interface ItTicket {
  id: string;
  ticketId: string;
  requester: string;
  requesterRole: string;
  category: ItCategory;
  priority: ItPriority;
  subject: string;
  description: string;
  attachment?: string;
  assignedTechnician?: string;
  status: ItStatus;
  slaDeadline: string;
  slaBreached: boolean;
  submittedAt: string;
  resolvedAt?: string;
  deviceInfo?: string;
}

export interface ItCategoryInfo {
  id: ItCategory;
  label: string;
  slaHours: number;
  openCount: number;
}
