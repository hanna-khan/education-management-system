import {
  libraryStats,
  mockAuthors,
  mockBooks,
  mockCategories,
  mockCopies,
  mockDigitalResources,
  mockFines,
  mockIssues,
  mockMembers,
  mockPublishers,
  mockRacks,
  mockReservations,
  mockShelves,
  studentLibrarySummary,
} from "@/mock/library";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getLibraryStats() {
  await delay(80);
  return libraryStats;
}

export async function getBooks() {
  await delay(100);
  return mockBooks;
}

export async function getBook(id: string) {
  await delay(60);
  return mockBooks.find((b) => b.id === id) ?? null;
}

export async function getAuthors() {
  await delay(60);
  return mockAuthors;
}

export async function getPublishers() {
  await delay(60);
  return mockPublishers;
}

export async function getCategories() {
  await delay(60);
  return mockCategories;
}

export async function getShelves() {
  await delay(60);
  return mockShelves;
}

export async function getRacks() {
  await delay(60);
  return mockRacks;
}

export async function getCopies() {
  await delay(80);
  return mockCopies;
}

export async function getMembers() {
  await delay(80);
  return mockMembers;
}

export async function getIssues() {
  await delay(80);
  return mockIssues;
}

export async function getOverdueIssues() {
  await delay(80);
  return mockIssues.filter((i) => i.status === "overdue");
}

export async function getReservations() {
  await delay(80);
  return mockReservations;
}

export async function getFines() {
  await delay(80);
  return mockFines;
}

export async function getDigitalResources() {
  await delay(60);
  return mockDigitalResources;
}

export async function getStudentLibrary() {
  await delay(80);
  return studentLibrarySummary;
}

export async function calcFine(daysOverdue: number, ratePerDay = 50) {
  await delay(40);
  return Math.max(0, daysOverdue) * ratePerDay;
}
