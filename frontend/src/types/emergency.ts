export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "resolved" | "scheduled";
export type IncidentType = "fire" | "medical" | "security" | "natural_disaster" | "chemical" | "other";
export type AnnouncementRecipient = "entire_institution" | "campus" | "department" | "students" | "parents" | "staff";

export interface EmergencyStats {
  activeAlerts: number;
  openIncidents: number;
  emergencyContacts: number;
  drillsThisYear: number;
  announcementsSent: number;
  evacuationPlans: number;
}

export interface EmergencyAlert {
  id: string;
  alertId: string;
  title: string;
  severity: AlertSeverity;
  type: IncidentType;
  location: string;
  issuedAt: string;
  issuedBy: string;
  status: AlertStatus;
  recipients: AnnouncementRecipient[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  available24x7: boolean;
  priority: number;
}

export interface SafetyIncident {
  id: string;
  incidentId: string;
  type: IncidentType;
  title: string;
  location: string;
  reportedAt: string;
  reportedBy: string;
  severity: AlertSeverity;
  status: "reported" | "investigating" | "resolved" | "closed";
  injuries: number;
}

export interface EvacuationPlan {
  id: string;
  planId: string;
  building: string;
  assemblyPoint: string;
  routes: string;
  warden: string;
  lastDrill: string;
  nextDrill: string;
  capacity: number;
}

export interface EmergencyAnnouncement {
  id: string;
  announcementId: string;
  title: string;
  message: string;
  recipients: AnnouncementRecipient[];
  sentAt: string;
  sentBy: string;
  deliveryStatus: "sent" | "scheduled" | "failed";
  recipientCount: number;
}
