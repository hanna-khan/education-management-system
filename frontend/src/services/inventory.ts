import {
  inventoryStats,
  lowStockItems,
  mockDamagedItems,
  mockInventoryCategories,
  mockInventoryItems,
  mockInventoryLocations,
  mockInventorySuppliers,
  mockStockMovements,
} from "@/mock/inventory";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getInventoryStats() {
  await delay(90);
  return inventoryStats;
}

export async function getInventoryItems() {
  await delay(100);
  return mockInventoryItems;
}

export async function getInventoryCategories() {
  await delay(80);
  return mockInventoryCategories;
}

export async function getInventoryLocations() {
  await delay(85);
  return mockInventoryLocations;
}

export async function getInventorySuppliers() {
  await delay(90);
  return mockInventorySuppliers;
}

export async function getStockMovements() {
  await delay(100);
  return mockStockMovements;
}

export async function getLowStockItems() {
  await delay(85);
  return lowStockItems;
}

export async function getDamagedItems() {
  await delay(80);
  return mockDamagedItems;
}
