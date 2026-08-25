import {
  clubsStats,
  getClubApplication,
  getOrganization,
  mockAchievements,
  mockActivityTypes,
  mockClubApplications,
  mockClubEvents,
  mockClubMembers,
  mockHouseCompetitions,
  mockHousePoints,
  mockHouses,
  mockOrganizations,
  studentClubsSummary,
} from "@/mock/clubs";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getClubsStats() {
  await delay(90);
  return clubsStats;
}

export async function getOrganizations() {
  await delay(100);
  return mockOrganizations;
}

export async function getOrganizationById(id: string) {
  await delay(80);
  return getOrganization(id) ?? null;
}

export async function getClubMembers() {
  await delay(100);
  return mockClubMembers;
}

export async function getClubEvents() {
  await delay(90);
  return mockClubEvents;
}

export async function getClubApplications() {
  await delay(100);
  return mockClubApplications;
}

export async function getClubApplicationById(id: string) {
  await delay(80);
  return getClubApplication(id) ?? null;
}

export async function getClubAchievements() {
  await delay(80);
  return mockAchievements;
}

export async function getHouses() {
  await delay(90);
  return mockHouses;
}

export async function getHousePoints() {
  await delay(80);
  return mockHousePoints;
}

export async function getHouseCompetitions() {
  await delay(80);
  return mockHouseCompetitions;
}

export async function getActivityTypes() {
  await delay(80);
  return mockActivityTypes;
}

export async function getStudentClubs() {
  await delay(100);
  return studentClubsSummary;
}
