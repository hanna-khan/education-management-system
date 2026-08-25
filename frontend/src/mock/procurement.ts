import type {
  GoodsReceived,
  ProcurementHistoryEntry,
  ProcurementStats,
  PurchaseOrder,
  PurchaseRequest,
  Quotation,
  Vendor,
} from "@/types/procurement";

export const PROCUREMENT_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/procurement" },
  { id: "requests", label: "Purchase Requests", href: "/procurement/requests" },
  { id: "vendors", label: "Vendors", href: "/procurement/vendors" },
  { id: "quotations", label: "Quotations", href: "/procurement/quotations" },
  { id: "orders", label: "Purchase Orders", href: "/procurement/orders" },
  { id: "receiving", label: "Goods Received", href: "/procurement/receiving" },
  { id: "history", label: "History", href: "/procurement/history" },
];

export const PROCUREMENT_WORKFLOW = [
  "Purchase Request",
  "Department Approval",
  "Procurement Review",
  "Quotation",
  "Purchase Order",
  "Receiving",
  "Inventory",
];

export const procurementStats: ProcurementStats = {
  openRequests: 18,
  pendingApproval: 7,
  activeOrders: 12,
  receivedThisMonth: 24,
  totalSpendYtd: 42500000,
  activeVendors: 38,
  avgProcessingDays: 14,
};

export const mockPurchaseRequests: PurchaseRequest[] = [
  { id: "pr-001", requestId: "PR-2026-0088", title: "EE Lab — Digital Multimeters (10 units)", department: "Electrical Engineering", requestedBy: "Prof. Saima Rizvi", items: "Fluke 115 Digital Multimeter × 10", estimatedCost: 285000, urgency: "normal", submittedAt: "2026-02-05", stage: "inventory", status: "received" },
  { id: "pr-002", requestId: "PR-2026-0095", title: "CIS Lab — Arduino Boards (50 units)", department: "Computer & Info Systems", requestedBy: "Dr. Farhan Ahmed", items: "Arduino Uno R3 × 50", estimatedCost: 175000, urgency: "urgent", submittedAt: "2026-02-12", stage: "purchase_order", status: "ordered" },
  { id: "pr-003", requestId: "PR-2026-0098", title: "Admin — A4 Paper (200 reams)", department: "Administration", requestedBy: "Muhammad Rashid", items: "A4 Copy Paper 80gsm × 200 reams", estimatedCost: 170000, urgency: "normal", submittedAt: "2026-02-18", stage: "quotation", status: "quoted" },
  { id: "pr-004", requestId: "PR-2026-0102", title: "IT — Cat6 Cable Boxes (5 units)", department: "IT", requestedBy: "IT Director", items: "Cat6 Ethernet Cable 305m box × 5", estimatedCost: 92500, urgency: "critical", submittedAt: "2026-02-20", stage: "procurement_review", status: "procurement_review" },
  { id: "pr-005", requestId: "PR-2026-0105", title: "ME Workshop — Cutting Fluid (20 cans)", department: "Mechanical Engineering", requestedBy: "Engr. Bilal Sheikh", items: "Soluble Cutting Oil 5L × 20", estimatedCost: 84000, urgency: "normal", submittedAt: "2026-02-22", stage: "department_approval", status: "submitted" },
  { id: "pr-006", requestId: "PR-2026-0108", title: "Chemistry Lab — HCl Reagent", department: "Basic Sciences", requestedBy: "Dr. Saba Noor", items: "HCl 37% 2.5L × 15 bottles", estimatedCost: 42000, urgency: "urgent", submittedAt: "2026-02-23", stage: "purchase_request", status: "draft" },
];

export const mockVendors: Vendor[] = [
  { id: "vnd-001", vendorId: "VND-KHI-001", name: "Al-Habib Scientific Traders", contact: "Muhammad Imran", phone: "+92-21-34567890", email: "sales@alhabibsci.pk", city: "Karachi", categories: ["Lab Equipment", "Chemicals"], taxNumber: "NTN-1234567-8", status: "active", rating: 4.5 },
  { id: "vnd-002", vendorId: "VND-KHI-002", name: "TechZone Pakistan", contact: "Faisal Ahmed", phone: "+92-21-36789012", email: "procurement@techzone.pk", city: "Karachi", categories: ["IT Hardware", "Networking"], taxNumber: "NTN-2345678-9", status: "active", rating: 4.0 },
  { id: "vnd-003", vendorId: "VND-KHI-003", name: "Paper Mart Karachi", contact: "Asadullah Khan", phone: "+92-21-35678901", email: "orders@papermart.pk", city: "Karachi", categories: ["Office Supplies"], taxNumber: "NTN-3456789-0", status: "active", rating: 4.2 },
  { id: "vnd-004", vendorId: "VND-LHR-001", name: "Precision Tools Lahore", contact: "Hassan Raza", phone: "+92-42-37890123", email: "info@precisiontools.pk", city: "Lahore", categories: ["Mechanical Parts", "Workshop"], taxNumber: "NTN-4567890-1", status: "active", rating: 3.8 },
  { id: "vnd-005", vendorId: "VND-KHI-004", name: "New Vendor — Pending Approval", contact: "Ali Hassan", phone: "+92-300-1112233", email: "ali@newvendor.pk", city: "Karachi", categories: ["General"], taxNumber: "Pending", status: "pending", rating: 0 },
];

export const mockQuotations: Quotation[] = [
  { id: "qt-001", quoteId: "QT-2026-0042", requestId: "PR-2026-0098", vendor: "Paper Mart Karachi", amount: 165000, validUntil: "2026-03-15", submittedAt: "2026-02-20", status: "selected" },
  { id: "qt-002", quoteId: "QT-2026-0043", requestId: "PR-2026-0098", vendor: "Al-Habib Scientific Traders", amount: 178000, validUntil: "2026-03-10", submittedAt: "2026-02-19", status: "rejected" },
  { id: "qt-003", quoteId: "QT-2026-0045", requestId: "PR-2026-0095", vendor: "TechZone Pakistan", amount: 172000, validUntil: "2026-03-01", submittedAt: "2026-02-15", status: "selected" },
  { id: "qt-004", quoteId: "QT-2026-0048", requestId: "PR-2026-0102", vendor: "TechZone Pakistan", amount: 89000, validUntil: "2026-03-20", submittedAt: "2026-02-22", status: "pending" },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po-001", poId: "PO-2026-0088", requestId: "PR-2026-0088", vendor: "Al-Habib Scientific Traders", amount: 280000, issuedAt: "2026-02-08", expectedDelivery: "2026-02-15", status: "delivered" },
  { id: "po-002", poId: "PO-2026-0095", requestId: "PR-2026-0095", vendor: "TechZone Pakistan", amount: 172000, issuedAt: "2026-02-18", expectedDelivery: "2026-02-28", status: "issued" },
  { id: "po-003", poId: "PO-2026-0098", requestId: "PR-2026-0098", vendor: "Paper Mart Karachi", amount: 165000, issuedAt: "2026-02-22", expectedDelivery: "2026-03-05", status: "issued" },
];

export const mockGoodsReceived: GoodsReceived[] = [
  { id: "gr-001", grnId: "GRN-2026-0088", poId: "PO-2026-0088", vendor: "Al-Habib Scientific Traders", receivedAt: "2026-02-12", receivedBy: "Store Keeper — Rashid Ali", items: "Fluke 115 Digital Multimeter × 10", condition: "good", status: "accepted" },
  { id: "gr-002", grnId: "GRN-2026-0092", poId: "PO-2026-0092", vendor: "Precision Tools Lahore", receivedAt: "2026-02-20", receivedBy: "ME Workshop Supervisor", items: "Cutting Fluid 5L × 10", condition: "partial", status: "pending_inspection" },
];

export const mockProcurementHistory: ProcurementHistoryEntry[] = [
  { id: "ph-001", requestId: "PR-2026-0088", title: "EE Lab — Digital Multimeters", department: "Electrical Engineering", finalAmount: 280000, completedAt: "2026-02-15", vendor: "Al-Habib Scientific Traders", durationDays: 10 },
  { id: "ph-002", requestId: "PR-2026-0075", title: "IT — Network Switches", department: "IT", finalAmount: 450000, completedAt: "2026-01-28", vendor: "TechZone Pakistan", durationDays: 18 },
  { id: "ph-003", requestId: "PR-2026-0068", title: "Admin — Toner Cartridges", department: "Administration", finalAmount: 85000, completedAt: "2026-01-15", vendor: "Paper Mart Karachi", durationDays: 8 },
  { id: "ph-004", requestId: "PR-2025-0420", title: "ME — Lathe Machine Spare Parts", department: "Mechanical Engineering", finalAmount: 125000, completedAt: "2025-12-20", vendor: "Precision Tools Lahore", durationDays: 22 },
];

export function getPurchaseRequest(id: string) {
  return mockPurchaseRequests.find((r) => r.id === id || r.requestId === id) ?? null;
}

export function getProcurementTimeline(requestId: string) {
  const req = getPurchaseRequest(requestId);
  if (!req) return [];
  const stages = PROCUREMENT_WORKFLOW;
  const stageIndex = stages.findIndex((s) => s.toLowerCase().replace(/ /g, "_") === req.stage || s === req.stage);
  return stages.map((stage, i) => ({
    stage,
    completed: i <= stageIndex,
    current: i === stageIndex,
  }));
}
