import {
  getMaintenanceTicket,
  getMaintenanceTimeline,
  maintenanceCategories,
  maintenanceStats,
  mockMaintenanceStaff,
  mockMaintenanceTickets,
} from "@/mock/maintenance";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMaintenanceStats() {
  await delay(90);
  return maintenanceStats;
}

export async function getMaintenanceTickets() {
  await delay(100);
  return mockMaintenanceTickets;
}

export async function getMaintenanceTicketById(id: string) {
  await delay(80);
  return getMaintenanceTicket(id) ?? null;
}

export async function getMaintenanceTimelineById(ticketId: string) {
  await delay(80);
  return getMaintenanceTimeline(ticketId);
}

export async function getMaintenanceCategories() {
  await delay(80);
  return maintenanceCategories;
}

export async function getMaintenanceStaff() {
  await delay(90);
  return mockMaintenanceStaff;
}
