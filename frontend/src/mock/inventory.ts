import type {
  DamagedItem,
  InventoryCategory,
  InventoryItem,
  InventoryLocation,
  InventoryStats,
  InventorySupplier,
  StockMovement,
} from "@/types/inventory";

export const INVENTORY_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/inventory" },
  { id: "items", label: "Items", href: "/inventory/items" },
  { id: "categories", label: "Categories", href: "/inventory/categories" },
  { id: "stock", label: "Stock", href: "/inventory/stock" },
  { id: "locations", label: "Locations", href: "/inventory/locations" },
  { id: "suppliers", label: "Suppliers", href: "/inventory/suppliers" },
  { id: "movements", label: "Movements", href: "/inventory/movements" },
  { id: "low-stock", label: "Low Stock", href: "/inventory/low-stock" },
  { id: "damaged", label: "Damaged", href: "/inventory/damaged" },
];

export const inventoryStats: InventoryStats = {
  totalItems: 1248,
  totalCategories: 24,
  totalStockValue: 18500000,
  lowStockItems: 34,
  damagedItems: 12,
  pendingMovements: 8,
  activeSuppliers: 42,
  locations: 18,
};

export const mockInventoryCategories: InventoryCategory[] = [
  { id: "cat-001", code: "LAB-ELEC", name: "Lab — Electrical Components", description: "Resistors, capacitors, breadboards", itemCount: 186, department: "Electrical Engineering" },
  { id: "cat-002", code: "LAB-CHEM", name: "Lab — Chemicals & Reagents", description: "Chemistry lab consumables", itemCount: 94, department: "Basic Sciences" },
  { id: "cat-003", code: "OFF-SUP", name: "Office Supplies", description: "Stationery, paper, toner", itemCount: 245, department: "Administration" },
  { id: "cat-004", code: "IT-HW", name: "IT Hardware", description: "Cables, adapters, peripherals", itemCount: 128, department: "IT" },
  { id: "cat-005", code: "MECH-SP", name: "Mechanical Spare Parts", description: "Workshop and machine parts", itemCount: 156, department: "Mechanical Engineering" },
  { id: "cat-006", code: "CIV-CONST", name: "Civil — Construction Materials", description: "Cement samples, testing materials", itemCount: 72, department: "Civil Engineering" },
];

export const mockInventoryItems: InventoryItem[] = [
  { id: "itm-001", sku: "NED-EE-001", name: "Digital Multimeter — Fluke 115", category: "Lab — Electrical Components", unit: "piece", reorderLevel: 5, currentStock: 18, unitCost: 28500, location: "EE Store — Block 7", department: "Electrical Engineering", status: "in_stock", lastRestocked: "2026-02-10" },
  { id: "itm-002", sku: "NED-CS-042", name: "Arduino Uno R3 Board", category: "Lab — Electrical Components", unit: "piece", reorderLevel: 20, currentStock: 8, unitCost: 3500, location: "CIS Lab Store", department: "Computer & Info Systems", status: "low_stock", lastRestocked: "2026-01-15" },
  { id: "itm-003", sku: "NED-ADM-108", name: "A4 Copy Paper (500 sheets)", category: "Office Supplies", unit: "ream", reorderLevel: 50, currentStock: 120, unitCost: 850, location: "Central Store — Admin Block", department: "Administration", status: "in_stock", lastRestocked: "2026-02-20" },
  { id: "itm-004", sku: "NED-IT-015", name: "Cat6 Ethernet Cable (305m box)", category: "IT Hardware", unit: "box", reorderLevel: 3, currentStock: 0, unitCost: 18500, location: "IT Store", department: "IT", status: "out_of_stock", lastRestocked: "2025-12-01" },
  { id: "itm-005", sku: "NED-ME-033", name: "Cutting Fluid — Soluble Oil 5L", category: "Mechanical Spare Parts", unit: "can", reorderLevel: 10, currentStock: 14, unitCost: 4200, location: "ME Workshop Store", department: "Mechanical Engineering", status: "in_stock", lastRestocked: "2026-02-05" },
  { id: "itm-006", sku: "NED-BS-021", name: "HCl 37% — 2.5L", category: "Lab — Chemicals & Reagents", unit: "bottle", reorderLevel: 8, currentStock: 3, unitCost: 2800, location: "Chemistry Lab Store", department: "Basic Sciences", status: "low_stock", lastRestocked: "2026-01-28" },
];

export const mockInventoryLocations: InventoryLocation[] = [
  { id: "loc-001", code: "CS-01", name: "Central Store — Admin Block", building: "Administration Block", floor: "Ground", department: "Administration", itemCount: 420, capacity: "500 sq ft" },
  { id: "loc-002", code: "EE-01", name: "EE Store — Block 7", building: "Electrical Engineering Block", floor: "Basement", department: "Electrical Engineering", itemCount: 186, capacity: "300 sq ft" },
  { id: "loc-003", code: "CIS-01", name: "CIS Lab Store", building: "Computer Block", floor: "1st", department: "Computer & Info Systems", itemCount: 145, capacity: "200 sq ft" },
  { id: "loc-004", code: "IT-01", name: "IT Store", building: "IT Block", floor: "Ground", department: "IT", itemCount: 128, capacity: "150 sq ft" },
  { id: "loc-005", code: "ME-01", name: "ME Workshop Store", building: "Mechanical Block", floor: "Ground", department: "Mechanical Engineering", itemCount: 156, capacity: "400 sq ft" },
];

export const mockInventorySuppliers: InventorySupplier[] = [
  { id: "sup-001", code: "SUP-KHI-001", name: "Al-Habib Scientific Traders", contact: "Muhammad Imran", phone: "+92-21-34567890", email: "sales@alhabibsci.pk", city: "Karachi", categories: ["Lab — Electrical Components", "Lab — Chemicals & Reagents"], status: "active", rating: 4.5 },
  { id: "sup-002", code: "SUP-KHI-002", name: "Paper Mart Karachi", contact: "Asadullah Khan", phone: "+92-21-35678901", email: "orders@papermart.pk", city: "Karachi", categories: ["Office Supplies"], status: "active", rating: 4.2 },
  { id: "sup-003", code: "SUP-KHI-003", name: "TechZone Pakistan", contact: "Faisal Ahmed", phone: "+92-21-36789012", email: "procurement@techzone.pk", city: "Karachi", categories: ["IT Hardware"], status: "active", rating: 4.0 },
  { id: "sup-004", code: "SUP-LHR-001", name: "Precision Tools Lahore", contact: "Hassan Raza", phone: "+92-42-37890123", email: "info@precisiontools.pk", city: "Lahore", categories: ["Mechanical Spare Parts"], status: "active", rating: 3.8 },
  { id: "sup-005", code: "SUP-KHI-004", name: "Defective Supplies Co.", contact: "Unknown", phone: "+92-21-30000000", email: "bad@example.pk", city: "Karachi", categories: ["Office Supplies"], status: "blacklisted", rating: 1.5 },
];

export const mockStockMovements: StockMovement[] = [
  { id: "mov-001", movementId: "MOV-2026-0142", type: "receipt", itemName: "Digital Multimeter — Fluke 115", sku: "NED-EE-001", quantity: 10, toLocation: "EE Store — Block 7", department: "Electrical Engineering", performedBy: "Engr. Tariq Mehmood", date: "2026-02-10", reference: "PO-2026-0088" },
  { id: "mov-002", movementId: "MOV-2026-0145", type: "issue", itemName: "Arduino Uno R3 Board", sku: "NED-CS-042", quantity: 15, fromLocation: "CIS Lab Store", department: "Computer & Info Systems", performedBy: "Lab Assistant — Ali Raza", date: "2026-02-18", reference: "ISS-CS-LAB-042" },
  { id: "mov-003", movementId: "MOV-2026-0148", type: "transfer", itemName: "A4 Copy Paper (500 sheets)", sku: "NED-ADM-108", quantity: 20, fromLocation: "Central Store — Admin Block", toLocation: "Registrar Office", department: "Administration", performedBy: "Store Keeper — Rashid Ali", date: "2026-02-20", reference: "TRF-ADM-020" },
  { id: "mov-004", movementId: "MOV-2026-0150", type: "damage", itemName: "HCl 37% — 2.5L", sku: "NED-BS-021", quantity: 2, fromLocation: "Chemistry Lab Store", department: "Basic Sciences", performedBy: "Lab Incharge — Dr. Saba Noor", date: "2026-02-22", reference: "DMG-BS-003" },
  { id: "mov-005", movementId: "MOV-2026-0152", type: "return", itemName: "Cutting Fluid — Soluble Oil 5L", sku: "NED-ME-033", quantity: 1, toLocation: "ME Workshop Store", department: "Mechanical Engineering", performedBy: "Workshop Supervisor", date: "2026-02-23", reference: "RET-ME-007" },
];

export const mockDamagedItems: DamagedItem[] = [
  { id: "dmg-001", reportId: "DMG-2026-003", itemName: "HCl 37% — 2.5L", sku: "NED-BS-021", quantity: 2, condition: "damaged", location: "Chemistry Lab Store", reportedBy: "Dr. Saba Noor", reportedAt: "2026-02-22", status: "pending" },
  { id: "dmg-002", reportId: "DMG-2026-002", itemName: "Digital Multimeter — Fluke 115", sku: "NED-EE-001", quantity: 1, condition: "damaged", location: "EE Lab — Room 701", reportedBy: "Lab Assistant — Usman", reportedAt: "2026-02-15", status: "written_off" },
  { id: "dmg-003", reportId: "DMG-2026-001", itemName: "Arduino Uno R3 Board", sku: "NED-CS-042", quantity: 3, condition: "damaged", location: "CIS Lab — Room 204", reportedBy: "Dr. Farhan Ahmed", reportedAt: "2026-02-08", status: "repaired" },
];

export function getInventoryItem(id: string) {
  return mockInventoryItems.find((i) => i.id === id) ?? null;
}

export const lowStockItems = mockInventoryItems.filter((i) => i.status === "low_stock" || i.status === "out_of_stock");
