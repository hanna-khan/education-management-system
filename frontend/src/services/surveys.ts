import {
  getSurvey,
  getSurveyAnalytics,
  getSurveyResponses,
  mockSurveys,
  studentSurveySummary,
  surveysStats,
} from "@/mock/surveys";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSurveysStats() {
  await delay(90);
  return surveysStats;
}

export async function getSurveys() {
  await delay(100);
  return mockSurveys;
}

export async function getSurveyById(id: string) {
  await delay(80);
  return getSurvey(id) ?? null;
}

export async function getSurveyAnalyticsById(id: string) {
  await delay(100);
  return getSurveyAnalytics(id);
}

export async function getSurveyResponsesById(id: string) {
  await delay(90);
  return getSurveyResponses(id);
}

export async function getStudentSurveys() {
  await delay(100);
  return studentSurveySummary;
}
