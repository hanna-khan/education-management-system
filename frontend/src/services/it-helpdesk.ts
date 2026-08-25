import {
  getItComments,
  getItTicket,
  getItTimeline,
  itCategories,
  itHelpdeskStats,
  mockItTickets,
  mockTechnicians,
} from "@/mock/it-helpdesk";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getItHelpdeskStats() {
  await delay(90);
  return itHelpdeskStats;
}

export async function getItTickets() {
  await delay(100);
  return mockItTickets;
}

export async function getItTicketById(id: string) {
  await delay(80);
  return getItTicket(id) ?? null;
}

export async function getItTimelineById(ticketId: string) {
  await delay(80);
  return getItTimeline(ticketId);
}

export async function getItCommentsById(ticketId: string) {
  await delay(80);
  return getItComments(ticketId);
}

export async function getItCategories() {
  await delay(80);
  return itCategories;
}

export async function getItTechnicians() {
  await delay(90);
  return mockTechnicians;
}
