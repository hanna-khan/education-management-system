import type {
  Asset,
  AssetCategory,
  AssetMaintenance,
  AssetStats,
  DisposedAsset,
} from "@/types/assets";

export const ASSETS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/assets" },
  { id: "register", label: "Asset Register", href: "/assets/register" },
  { id: "categories", label: "Categories", href: "/assets/categories" },
  { id: "maintenance", label: "Maintenance", href: "/assets/maintenance" },
  { id: "disposed", label: "Disposed", href: "/assets/disposed" },
  { id: "reports", label: "Reports", href: "/assets/reports" },
];

export const assetStats: AssetStats = {
  totalAssets: 2846,
  activeAssets: 2654,
  underMaintenance: 48,
  totalValue: 425000000,
  warrantyExpiring: 86,
  disposedThisYear: 24,
  assignedToStaff: 1892,
};

export const mockAssetCategories: AssetCategory[] = [
  { id: "ac-001", code: "COMP", name: "Computers & Laptops", depreciationYears: 4, assetCount: 1240, totalValue: 185000000 },
  { id: "ac-002", code: "LAB-EQ", name: "Lab Equipment", depreciationYears: 10, assetCount: 486, totalValue: 98000000 },
  { id: "ac-003", code: "FURN", name: "Furniture", depreciationYears: 8, assetCount: 620, totalValue: 42000000 },
  { id: "ac-004", code: "VEH", name: "Vehicles", depreciationYears: 8, assetCount: 18, totalValue: 45000000 },
  { id: "ac-005", code: "PROJ", name: "Projectors & AV", depreciationYears: 5, assetCount: 156, totalValue: 28000000 },
  { id: "ac-006", code: "GEN", name: "Generators & UPS", depreciationYears: 10, assetCount: 42, totalValue: 27000000 },
];

export const mockAssets: Asset[] = [
  { id: "ast-001", assetId: "NED-AST-2024-0142", name: "Dell OptiPlex 7090 — Faculty Workstation", category: "Computers & Laptops", purchaseDate: "2024-03-15", cost: 185000, location: "EE Dept — Room 502", assignedTo: "Prof. Saima Rizvi", department: "Electrical Engineering", condition: "good", warrantyUntil: "2027-03-15", status: "active", serialNumber: "DL7090-EE-502-001" },
  { id: "ast-002", assetId: "NED-AST-2023-0088", name: "Oscilloscope — Tektronix TBS1102", category: "Lab Equipment", purchaseDate: "2023-08-20", cost: 425000, location: "EE Lab — Room 701", assignedTo: "Lab Incharge — Engr. Usman", department: "Electrical Engineering", condition: "excellent", warrantyUntil: "2026-08-20", status: "active", serialNumber: "TEK-TBS1102-088" },
  { id: "ast-003", assetId: "NED-AST-2022-0201", name: "HP LaserJet Pro M404dn", category: "Computers & Laptops", purchaseDate: "2022-11-10", cost: 65000, location: "Registrar Office", assignedTo: "Muhammad Rashid", department: "Administration", condition: "fair", status: "under_maintenance", serialNumber: "HP-M404-REG-001" },
  { id: "ast-004", assetId: "NED-AST-2021-0056", name: "Toyota Coaster — Campus Bus", category: "Vehicles", purchaseDate: "2021-06-01", cost: 8500000, location: "Transport Yard", department: "Transport", condition: "good", warrantyUntil: "2024-06-01", status: "active", serialNumber: "KHI-2021-TC-056" },
  { id: "ast-005", assetId: "NED-AST-2020-0312", name: "Epson EB-2250U Projector", category: "Projectors & AV", purchaseDate: "2020-09-15", cost: 320000, location: "Main Auditorium", department: "Administration", condition: "poor", status: "damaged", serialNumber: "EPS-EB2250U-312" },
  { id: "ast-006", assetId: "NED-AST-2019-0099", name: "Lenovo ThinkPad T14 — Missing", category: "Computers & Laptops", purchaseDate: "2019-04-22", cost: 165000, location: "Unknown", assignedTo: "Former Employee", department: "IT", condition: "poor", status: "lost", serialNumber: "LN-T14-IT-099" },
];

export const mockAssetMaintenance: AssetMaintenance[] = [
  { id: "am-001", ticketId: "AM-2026-0042", assetId: "NED-AST-2023-0088", assetName: "Oscilloscope — Tektronix TBS1102", type: "calibration", scheduledDate: "2026-03-15", vendor: "Tektronix Service Karachi", cost: 15000, status: "scheduled" },
  { id: "am-002", ticketId: "AM-2026-0038", assetId: "NED-AST-2022-0201", assetName: "HP LaserJet Pro M404dn", type: "corrective", scheduledDate: "2026-02-25", vendor: "HP Authorized — Saddar", cost: 8500, status: "in_progress" },
  { id: "am-003", ticketId: "AM-2026-0035", assetId: "NED-AST-2021-0056", assetName: "Toyota Coaster — Campus Bus", type: "preventive", scheduledDate: "2026-02-10", vendor: "Toyota Indus Motors", cost: 45000, status: "completed" },
  { id: "am-004", ticketId: "AM-2026-0040", assetId: "NED-AST-2020-0312", assetName: "Epson EB-2250U Projector", type: "corrective", scheduledDate: "2026-02-28", vendor: "Epson Service Center", cost: 22000, status: "scheduled" },
];

export const mockDisposedAssets: DisposedAsset[] = [
  { id: "da-001", assetId: "NED-AST-2015-0044", name: "CRT Monitor — Samsung 19\"", category: "Computers & Laptops", disposedDate: "2026-01-15", disposalMethod: "scrap", originalCost: 25000, recoveredValue: 500, approvedBy: "Dr. Asif Raza" },
  { id: "da-002", assetId: "NED-AST-2016-0088", name: "Office Desk — Wooden", category: "Furniture", disposedDate: "2026-02-01", disposalMethod: "donation", originalCost: 18000, recoveredValue: 0, approvedBy: "Registrar" },
  { id: "da-003", assetId: "NED-AST-2014-0120", name: "Old Server — Dell PowerEdge R710", category: "Computers & Laptops", disposedDate: "2025-12-20", disposalMethod: "auction", originalCost: 450000, recoveredValue: 35000, approvedBy: "IT Director" },
];

export function getAsset(id: string) {
  return mockAssets.find((a) => a.id === id || a.assetId === id) ?? null;
}
