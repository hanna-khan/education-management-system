export type IncidentCategory =
  | "academic_dishonesty"
  | "misconduct"
  | "bullying"
  | "violence"
  | "property_damage"
  | "attendance"
  | "dress_code"
  | "other";

export type IncidentSeverity = "minor" | "moderate" | "major" | "critical";
export type IncidentWorkflowStatus =
  | "reported"
  | "under_review"
  | "action_pending"
  | "action_taken"
  | "parent_notified"
  | "resolved"
  | "appealed"
  | "closed";

export type DisciplinaryActionType =
  | "verbal_warning"
  | "written_warning"
  | "detention"
  | "suspension"
  | "expulsion"
  | "community_service"
  | "counseling"
  | "fine"
  | "other";

export type WarningLevel = "verbal" | "first_written" | "second_written" | "final";

export interface DisciplineStats {
  totalIncidents: number;
  openIncidents: number;
  pendingReview: number;
  actionsThisMonth: number;
  parentNotificationsSent: number;
  resolvedThisMonth: number;
}

export interface DisciplineIncident {
  id: string;
  incidentId: string;
  studentId: string;
  studentName: string;
  program: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  location: string;
  reportedAt: string;
  reportedBy: string;
  reporterRole: "teacher" | "admin" | "security" | "student";
  status: IncidentWorkflowStatus;
  witnesses?: string[];
  evidence?: string[];
}

export interface DisciplineWarning {
  id: string;
  warningId: string;
  incidentId: string;
  studentId: string;
  studentName: string;
  level: WarningLevel;
  reason: string;
  issuedAt: string;
  issuedBy: string;
  expiresAt?: string;
  status: "active" | "expired" | "revoked";
}

export interface DisciplinaryAction {
  id: string;
  actionId: string;
  incidentId: string;
  studentId: string;
  studentName: string;
  type: DisciplinaryActionType;
  description: string;
  startDate: string;
  endDate?: string;
  issuedBy: string;
  status: "pending" | "active" | "completed" | "cancelled";
}

export interface ParentDisciplineNotification {
  id: string;
  incidentId: string;
  studentName: string;
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
  requiresAcknowledgment: boolean;
  acknowledged: boolean;
}

export interface DisciplineFollowUp {
  id: string;
  incidentId: string;
  studentName: string;
  scheduledAt: string;
  assignedTo: string;
  notes: string;
  status: "scheduled" | "completed" | "missed" | "cancelled";
}

export interface BehaviourHistoryEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: "incident" | "warning" | "action" | "positive";
  summary: string;
  points: number;
}

export interface IncidentTimelineEntry {
  at: string;
  actor: string;
  action: string;
  note?: string;
}
