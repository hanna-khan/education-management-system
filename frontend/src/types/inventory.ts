export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
export type MovementType = "receipt" | "issue" | "transfer" | "adjustment" | "return" | "damage";
export type ItemCondition = "good" | "fair" | "damaged" | "expired";

export interface InventoryStats {
  totalItems: number;
  totalCategories: number;
  totalStockValue: number;
  lowStockItems: number;
  damagedItems: number;
  pendingMovements: number;
  activeSuppliers: number;
  locations: number;
}

export interface InventoryCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  itemCount: number;
  department: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  reorderLevel: number;
  currentStock: number;
  unitCost: number;
  location: string;
  department: string;
  status: StockStatus;
  lastRestocked: string;
}

export interface InventoryLocation {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: string;
  department: string;
  itemCount: number;
  capacity: string;
}

export interface InventorySupplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  categories: string[];
  status: "active" | "inactive" | "blacklisted";
  rating: number;
}

export interface StockMovement {
  id: string;
  movementId: string;
  type: MovementType;
  itemName: string;
  sku: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  department: string;
  performedBy: string;
  date: string;
  reference: string;
}

export interface DamagedItem {
  id: string;
  reportId: string;
  itemName: string;
  sku: string;
  quantity: number;
  condition: ItemCondition;
  location: string;
  reportedBy: string;
  reportedAt: string;
  status: "pending" | "written_off" | "repaired";
}
