import {
  careerStats,
  mockCareerApplications,
  mockCareerEvents,
  mockCareerFairs,
  mockCompanies,
  mockInternships,
  mockInterviews,
  mockJobs,
  mockPlacements,
  studentCareerSummary,
} from "@/mock/career";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCareerStats() {
  await delay(90);
  return careerStats;
}

export async function getCareerJobs() {
  await delay(100);
  return mockJobs;
}

export async function getCareerInternships() {
  await delay(100);
  return mockInternships;
}

export async function getCareerCompanies() {
  await delay(80);
  return mockCompanies;
}

export async function getCareerApplications() {
  await delay(100);
  return mockCareerApplications;
}

export async function getCareerInterviews() {
  await delay(80);
  return mockInterviews;
}

export async function getCareerEvents() {
  await delay(80);
  return mockCareerEvents;
}

export async function getCareerFairs() {
  await delay(60);
  return mockCareerFairs;
}

export async function getCareerPlacements() {
  await delay(80);
  return mockPlacements;
}

export async function getStudentCareer() {
  await delay(100);
  return studentCareerSummary;
}
