import {
  mockGoodsReceived,
  mockProcurementHistory,
  mockPurchaseOrders,
  mockPurchaseRequests,
  mockQuotations,
  mockVendors,
  procurementStats,
} from "@/mock/procurement";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProcurementStats() {
  await delay(95);
  return procurementStats;
}

export async function getPurchaseRequests() {
  await delay(100);
  return mockPurchaseRequests;
}

export async function getPurchaseRequest(id: string) {
  await delay(85);
  return mockPurchaseRequests.find((r) => r.id === id || r.requestId === id) ?? null;
}

export async function getVendors() {
  await delay(90);
  return mockVendors;
}

export async function getQuotations() {
  await delay(85);
  return mockQuotations;
}

export async function getPurchaseOrders() {
  await delay(100);
  return mockPurchaseOrders;
}

export async function getGoodsReceived() {
  await delay(80);
  return mockGoodsReceived;
}

export async function getProcurementHistory() {
  await delay(90);
  return mockProcurementHistory;
}
