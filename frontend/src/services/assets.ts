import {
  assetStats,
  mockAssetCategories,
  mockAssetMaintenance,
  mockAssets,
  mockDisposedAssets,
} from "@/mock/assets";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAssetStats() {
  await delay(90);
  return assetStats;
}

export async function getAssets() {
  await delay(100);
  return mockAssets;
}

export async function getAssetCategories() {
  await delay(80);
  return mockAssetCategories;
}

export async function getAssetMaintenance() {
  await delay(85);
  return mockAssetMaintenance;
}

export async function getDisposedAssets() {
  await delay(90);
  return mockDisposedAssets;
}
