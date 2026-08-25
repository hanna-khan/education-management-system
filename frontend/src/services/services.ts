import {
  getServiceRequest,
  mockServiceRequests,
  serviceCatalog,
  serviceStats,
} from "@/mock/services";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getServiceStats() {
  await delay(60);
  return serviceStats;
}

export async function getServiceCatalog() {
  await delay(60);
  return serviceCatalog;
}

export async function getServiceRequests() {
  await delay(80);
  return mockServiceRequests;
}

export async function getServiceRequestById(id: string) {
  await delay(60);
  return getServiceRequest(id);
}
