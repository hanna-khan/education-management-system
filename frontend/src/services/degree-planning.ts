import {
  creditBreakdown,
  degreeStats,
  mockDegreeProgress,
  mockPlannerCourses,
  mockRequirements,
} from "@/mock/degree-planning";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDegreeStats() {
  await delay(60);
  return degreeStats;
}

export async function getDegreeProgress() {
  await delay(80);
  return mockDegreeProgress;
}

export async function getRequirements() {
  await delay(80);
  return mockRequirements;
}

export async function getPlannerCourses() {
  await delay(80);
  return mockPlannerCourses;
}

export async function getCreditBreakdown() {
  await delay(40);
  return creditBreakdown;
}
