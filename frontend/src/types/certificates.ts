export type CertificateType =
  | "transcript"
  | "bonafide"
  | "degree"
  | "provisional"
  | "character"
  | "id_card"
  | "migration"
  | "experience";

export type CertificateRequestStatus =
  | "draft"
  | "submitted"
  | "processing"
  | "ready"
  | "issued"
  | "rejected"
  | "verified";

export interface CertificateTemplate {
  id: string;
  name: string;
  type: CertificateType;
  version: string;
  lastUpdated: string;
  active: boolean;
  fields: string[];
  description: string;
}

export interface CertificateRequest {
  id: string;
  requestId: string;
  type: CertificateType;
  studentId: string;
  studentName: string;
  program: string;
  status: CertificateRequestStatus;
  verificationCode: string;
  submittedAt: string;
  issuedAt?: string;
  copies: number;
  fee: number;
  purpose: string;
}

export interface VerificationRecord {
  code: string;
  valid: boolean;
  type: CertificateType;
  studentName: string;
  program: string;
  issuedAt: string;
  institution: string;
  serialNo: string;
  message: string;
}

export interface CertificateStats {
  templates: number;
  requestsOpen: number;
  issuedThisMonth: number;
  verificationsToday: number;
  pendingPrint: number;
}
