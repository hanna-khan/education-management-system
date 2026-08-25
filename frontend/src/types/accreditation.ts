export type AccreditationCycleStage =
  | "preparation"
  | "submission"
  | "review"
  | "visit"
  | "findings"
  | "corrective_action"
  | "approved";

export type FindingSeverity = "minor" | "major" | "critical";
export type CorrectiveActionStatus = "open" | "in_progress" | "verified" | "closed";

export interface AccreditationStats {
  accreditedPrograms: number;
  activeCycles: number;
  pendingRequirements: number;
  openFindings: number;
  overdueActions: number;
  evidenceDocuments: number;
  upcomingVisits: number;
}

export interface AccreditationBody {
  id: string;
  code: string;
  name: string;
  country: string;
  website: string;
  contactPerson: string;
  programsCovered: number;
  status: "active" | "inactive";
}

export interface AccreditedProgram {
  id: string;
  programCode: string;
  programName: string;
  department: string;
  body: string;
  accreditationLevel: string;
  validUntil: string;
  status: "accredited" | "provisional" | "expired" | "in_review";
}

export interface AccreditationRequirement {
  id: string;
  reqId: string;
  standard: string;
  title: string;
  body: string;
  program: string;
  mandatory: boolean;
  status: "met" | "partial" | "not_met" | "pending";
  evidenceCount: number;
}

export interface AccreditationStandard {
  id: string;
  code: string;
  title: string;
  body: string;
  category: string;
  description: string;
  requirementsCount: number;
}

export interface AccreditationEvidence {
  id: string;
  evidenceId: string;
  title: string;
  standard: string;
  program: string;
  uploadedBy: string;
  uploadedAt: string;
  verified: boolean;
}

export interface AccreditationDocument {
  id: string;
  docId: string;
  title: string;
  type: "policy" | "sar" | "ssr" | "checklist" | "report";
  program: string;
  version: string;
  updatedAt: string;
  status: "draft" | "approved" | "submitted";
}

export interface AccreditationCycle {
  id: string;
  cycleId: string;
  program: string;
  body: string;
  stage: AccreditationCycleStage;
  startDate: string;
  visitDate?: string;
  coordinator: string;
  progress: number;
}

export interface AccreditationAudit {
  id: string;
  auditId: string;
  program: string;
  body: string;
  auditType: "internal" | "external" | "desk_review";
  scheduledDate: string;
  auditor: string;
  status: "scheduled" | "in_progress" | "completed";
}

export interface AccreditationFinding {
  id: string;
  findingId: string;
  auditId: string;
  standard: string;
  description: string;
  severity: FindingSeverity;
  program: string;
  dueDate: string;
  status: "open" | "addressed" | "closed";
}

export interface CorrectiveAction {
  id: string;
  actionId: string;
  findingId: string;
  title: string;
  owner: string;
  department: string;
  dueDate: string;
  status: CorrectiveActionStatus;
  progress: number;
}
