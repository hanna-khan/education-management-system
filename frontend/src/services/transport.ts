import {
  liveTrackingMock,
  mockAssignments,
  mockConductors,
  mockDrivers,
  mockRoutes,
  mockStops,
  mockTransportFees,
  mockTransportMaintenance,
  mockTransportStudents,
  mockVehicles,
  parentTransportSummary,
  transportStats,
} from "@/mock/transport";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTransportStats() {
  await delay(90);
  return transportStats;
}

export async function getVehicles() {
  await delay(100);
  return mockVehicles;
}

export async function getRoutes() {
  await delay(100);
  return mockRoutes;
}

export async function getStops() {
  await delay(80);
  return mockStops;
}

export async function getDrivers() {
  await delay(80);
  return mockDrivers;
}

export async function getConductors() {
  await delay(80);
  return mockConductors;
}

export async function getTransportStudents() {
  await delay(100);
  return mockTransportStudents;
}

export async function getTransportAssignments() {
  await delay(80);
  return mockAssignments;
}

export async function getTransportFees() {
  await delay(100);
  return mockTransportFees;
}

export async function getTransportMaintenance() {
  await delay(80);
  return mockTransportMaintenance;
}

export async function getLiveTracking() {
  await delay(120);
  return liveTrackingMock;
}

export async function getParentTransport() {
  await delay(100);
  return parentTransportSummary;
}
