export type ProcurementStage =
  | "purchase_request"
  | "department_approval"
  | "procurement_review"
  | "quotation"
  | "purchase_order"
  | "receiving"
  | "inventory";

export type PurchaseRequestStatus =
  | "draft"
  | "submitted"
  | "dept_approved"
  | "procurement_review"
  | "quoted"
  | "ordered"
  | "received"
  | "rejected"
  | "cancelled";

export interface ProcurementStats {
  openRequests: number;
  pendingApproval: number;
  activeOrders: number;
  receivedThisMonth: number;
  totalSpendYtd: number;
  activeVendors: number;
  avgProcessingDays: number;
}

export interface PurchaseRequest {
  id: string;
  requestId: string;
  title: string;
  department: string;
  requestedBy: string;
  items: string;
  estimatedCost: number;
  urgency: "normal" | "urgent" | "critical";
  submittedAt: string;
  stage: ProcurementStage;
  status: PurchaseRequestStatus;
}

export interface Vendor {
  id: string;
  vendorId: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  categories: string[];
  taxNumber: string;
  status: "active" | "inactive" | "pending";
  rating: number;
}

export interface Quotation {
  id: string;
  quoteId: string;
  requestId: string;
  vendor: string;
  amount: number;
  validUntil: string;
  submittedAt: string;
  status: "pending" | "selected" | "rejected";
}

export interface PurchaseOrder {
  id: string;
  poId: string;
  requestId: string;
  vendor: string;
  amount: number;
  issuedAt: string;
  expectedDelivery: string;
  status: "issued" | "partial" | "delivered" | "cancelled";
}

export interface GoodsReceived {
  id: string;
  grnId: string;
  poId: string;
  vendor: string;
  receivedAt: string;
  receivedBy: string;
  items: string;
  condition: "good" | "partial" | "damaged";
  status: "pending_inspection" | "accepted" | "rejected";
}

export interface ProcurementHistoryEntry {
  id: string;
  requestId: string;
  title: string;
  department: string;
  finalAmount: number;
  completedAt: string;
  vendor: string;
  durationDays: number;
}
