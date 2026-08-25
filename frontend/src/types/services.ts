export type ServiceRequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "completed";

export type ServiceCategory =
  | "transcript"
  | "bonafide"
  | "degree"
  | "id_card"
  | "profile_change"
  | "fee_concession"
  | "scholarship"
  | "course_add_drop"
  | "withdrawal"
  | "attendance_correction"
  | "leave"
  | "hostel"
  | "transport"
  | "complaint"
  | "feedback";

export interface ServiceCatalogItem {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  department: string;
  avgDays: number;
  icon: string;
  fee?: number;
}

export interface ServiceRequestTimeline {
  at: string;
  actor: string;
  action: string;
  note?: string;
}

export interface ServiceRequest {
  id: string;
  requestId: string;
  category: ServiceCategory;
  title: string;
  studentId: string;
  studentName: string;
  status: ServiceRequestStatus;
  stage: string;
  department: string;
  submittedAt?: string;
  updatedAt: string;
  comments: { author: string; at: string; body: string }[];
  attachments: string[];
  timeline: ServiceRequestTimeline[];
  details: Record<string, string>;
}

export interface ServiceStats {
  totalRequests: number;
  pending: number;
  completedThisMonth: number;
  avgProcessingDays: number;
  rejectionRate: number;
}
