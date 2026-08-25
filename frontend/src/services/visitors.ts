import {
  mockGatePasses,
  mockPickupRequests,
  mockSecurityScans,
  mockVisitorRegistrations,
  visitorStats,
} from "@/mock/visitors";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getVisitorStats() {
  await delay(90);
  return visitorStats;
}

export async function getVisitorRegistrations() {
  await delay(85);
  return mockVisitorRegistrations;
}

export async function getGatePasses() {
  await delay(100);
  return mockGatePasses;
}

export async function getGatePass(id: string) {
  await delay(80);
  return mockGatePasses.find((p) => p.id === id || p.passId === id) ?? null;
}

export async function getPickupRequests() {
  await delay(85);
  return mockPickupRequests;
}

export async function getSecurityScans() {
  await delay(90);
  return mockSecurityScans;
}
