import {
  hostelStats,
  mockAllocations,
  mockApplications,
  mockBeds,
  mockBuildings,
  mockFloors,
  mockHostelComplaints,
  mockHostelFees,
  mockHostelMaintenance,
  mockHostels,
  mockHostelStudents,
  mockRooms,
  mockWaitingList,
  studentHostelSummary,
} from "@/mock/hostel";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHostelStats() {
  await delay(90);
  return hostelStats;
}

export async function getHostels() {
  await delay(100);
  return mockHostels;
}

export async function getHostelBuildings() {
  await delay(80);
  return mockBuildings;
}

export async function getHostelFloors() {
  await delay(80);
  return mockFloors;
}

export async function getHostelRooms() {
  await delay(100);
  return mockRooms;
}

export async function getHostelBeds() {
  await delay(80);
  return mockBeds;
}

export async function getHostelStudents() {
  await delay(100);
  return mockHostelStudents;
}

export async function getHostelApplications() {
  await delay(100);
  return mockApplications;
}

export async function getHostelApplication(id: string) {
  await delay(80);
  return mockApplications.find((a) => a.id === id) ?? null;
}

export async function getHostelAllocations() {
  await delay(80);
  return mockAllocations;
}

export async function getHostelWaitingList() {
  await delay(80);
  return mockWaitingList;
}

export async function getHostelFees() {
  await delay(100);
  return mockHostelFees;
}

export async function getHostelComplaints() {
  await delay(80);
  return mockHostelComplaints;
}

export async function getHostelMaintenance() {
  await delay(80);
  return mockHostelMaintenance;
}

export async function getStudentHostel() {
  await delay(100);
  return studentHostelSummary;
}
