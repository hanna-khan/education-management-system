export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown";
export type VisitStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
export type IncidentSeverity = "minor" | "moderate" | "serious" | "critical";
export type IncidentStatus = "reported" | "under_review" | "treated" | "referred" | "closed";
export type VaccinationStatus = "completed" | "due" | "overdue" | "exempt";
export type MedicalDocumentType = "report" | "prescription" | "certificate" | "lab_result" | "xray" | "other";
export type AccessLevel = "public" | "staff_only" | "clinical_staff" | "restricted";

export interface HealthStats {
  totalStudentProfiles: number;
  totalStaffProfiles: number;
  visitsThisMonth: number;
  openIncidents: number;
  studentsWithAllergies: number;
  vaccinationsDue: number;
  pendingDocuments: number;
}

export interface MedicalProfile {
  id: string;
  personId: string;
  name: string;
  type: "student" | "staff";
  department: string;
  bloodGroup: BloodGroup;
  heightCm?: number;
  weightKg?: number;
  chronicConditions: string[];
  lastVisit?: string;
  emergencyContact: string;
  emergencyPhone: string;
  accessLevel: AccessLevel;
}

export interface ClinicVisit {
  id: string;
  visitId: string;
  studentId: string;
  studentName: string;
  visitDate: string;
  reason: string;
  symptoms: string;
  diagnosis?: string;
  treatment: string;
  notes: string;
  followUp?: string;
  nurseName: string;
  status: VisitStatus;
  parentNotified: boolean;
}

export interface MedicalIncident {
  id: string;
  incidentId: string;
  studentId: string;
  studentName: string;
  reportedAt: string;
  location: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  treatment?: string;
  parentNotified: boolean;
}

export interface AllergyRecord {
  id: string;
  personId: string;
  name: string;
  type: "student" | "staff";
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  reaction: string;
  notes?: string;
  accessLevel: AccessLevel;
}

export interface VaccinationRecord {
  id: string;
  personId: string;
  name: string;
  type: "student" | "staff";
  vaccine: string;
  dose: string;
  administeredAt?: string;
  dueDate?: string;
  status: VaccinationStatus;
  provider?: string;
}

export interface MedicalDocument {
  id: string;
  documentId: string;
  personId: string;
  name: string;
  type: MedicalDocumentType;
  title: string;
  uploadedAt: string;
  uploadedBy: string;
  accessLevel: AccessLevel;
  fileSize: string;
}

export interface EmergencyContact {
  id: string;
  personId: string;
  name: string;
  relation: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  isPrimary: boolean;
}

export interface StudentHealthSummary {
  bloodGroup: BloodGroup;
  allergies: string[];
  lastVisit?: string;
  vaccinationsDue: number;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface ParentHealthNotification {
  id: string;
  childName: string;
  type: "visit" | "incident" | "vaccination_due" | "allergy_alert";
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
}
