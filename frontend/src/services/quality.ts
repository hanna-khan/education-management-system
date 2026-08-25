import {
  mockCourseEvaluations,
  mockImprovementPlans,
  mockProgramReviews,
  mockQualityEvidence,
  mockQualityKpis,
  mockQualityReports,
  programPerformance,
  qualityStats,
} from "@/mock/quality";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getQualityStats() {
  await delay(95);
  return qualityStats;
}

export async function getQualityKpis() {
  await delay(100);
  return mockQualityKpis;
}

export async function getProgramReviews() {
  await delay(85);
  return mockProgramReviews;
}

export async function getCourseEvaluations() {
  await delay(90);
  return mockCourseEvaluations;
}

export async function getImprovementPlans() {
  await delay(80);
  return mockImprovementPlans;
}

export async function getQualityEvidence() {
  await delay(85);
  return mockQualityEvidence;
}

export async function getQualityReports() {
  await delay(100);
  return mockQualityReports;
}

export async function getProgramPerformance() {
  await delay(80);
  return programPerformance;
}
