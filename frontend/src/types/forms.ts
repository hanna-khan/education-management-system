export type FormCampaignStatus = "draft" | "open" | "closed" | "archived";
export type FormSubmissionStatus =
  | "draft"
  | "submitted"
  | "needs_correction"
  | "under_review"
  | "approved"
  | "rejected";

export type FormFieldType = "text" | "cnic" | "date" | "select" | "textarea" | "file" | "photo";

export interface FormRequiredDocument {
  id: string;
  label: string;
  description: string;
  required: boolean;
  accept: string;
  /** Soft validation hints for demo */
  validationHints?: string[];
}

export interface FormFieldDef {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface FormApprovalStep {
  id: string;
  label: string;
  role: string;
}

export interface FormCampaign {
  id: string;
  code: string;
  title: string;
  category: "convocation" | "degree" | "transport" | "certificate" | "clearance" | "other";
  description: string;
  status: FormCampaignStatus;
  opensAt: string;
  closesAt: string;
  institutionTypes: ("university" | "school")[];
  fields: FormFieldDef[];
  documents: FormRequiredDocument[];
  approvalSteps: FormApprovalStep[];
  /** When approved, generate a pass artifact */
  issuesPass?: boolean;
  passType?: "convocation" | "transport_monthly" | "generic";
  submissionsCount: number;
  pendingCount: number;
}

export interface FormGuest {
  name: string;
  cnic: string;
  relationship: string;
  photoUrl?: string;
  photoStatus: "ok" | "missing" | "unclear";
}

export interface FormDocumentUpload {
  documentId: string;
  fileName: string;
  status: "ok" | "missing" | "unclear" | "wrong_type";
  note?: string;
}

export interface FormSubmission {
  id: string;
  campaignId: string;
  campaignTitle: string;
  studentId: string;
  studentName: string;
  program: string;
  status: FormSubmissionStatus;
  submittedAt?: string;
  currentStep?: string;
  fieldValues: Record<string, string>;
  documents: FormDocumentUpload[];
  guests?: FormGuest[];
  validationErrors: string[];
  passId?: string;
  reviewerNote?: string;
}

export interface ConvocationPass {
  id: string;
  submissionId: string;
  passCode: string;
  qrCode: string;
  studentName: string;
  studentId: string;
  program: string;
  ceremonyDate: string;
  venue: string;
  seat?: string;
  guests: FormGuest[];
  issuedAt: string;
  status: "active" | "revoked" | "used";
}
