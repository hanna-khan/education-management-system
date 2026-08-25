export type AssetStatus = "active" | "under_maintenance" | "lost" | "damaged" | "disposed";
export type AssetCondition = "excellent" | "good" | "fair" | "poor";

export interface AssetStats {
  totalAssets: number;
  activeAssets: number;
  underMaintenance: number;
  totalValue: number;
  warrantyExpiring: number;
  disposedThisYear: number;
  assignedToStaff: number;
}

export interface AssetCategory {
  id: string;
  code: string;
  name: string;
  depreciationYears: number;
  assetCount: number;
  totalValue: number;
}

export interface Asset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  purchaseDate: string;
  cost: number;
  location: string;
  assignedTo?: string;
  department: string;
  condition: AssetCondition;
  warrantyUntil?: string;
  status: AssetStatus;
  serialNumber: string;
}

export interface AssetMaintenance {
  id: string;
  ticketId: string;
  assetId: string;
  assetName: string;
  type: "preventive" | "corrective" | "calibration";
  scheduledDate: string;
  vendor?: string;
  cost?: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

export interface DisposedAsset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  disposedDate: string;
  disposalMethod: "auction" | "scrap" | "donation" | "transfer";
  originalCost: number;
  recoveredValue: number;
  approvedBy: string;
}
