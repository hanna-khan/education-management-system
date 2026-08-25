import {
  disciplineStats,
  getIncidentTimeline as getIncidentTimelineData,
  mockActions,
  mockBehaviourHistory,
  mockFollowUps,
  mockIncidents,
  mockParentNotifications,
  mockWarnings,
} from "@/mock/discipline";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDisciplineStats() {
  await delay(90);
  return disciplineStats;
}

export async function getIncidents() {
  await delay(100);
  return mockIncidents;
}

export async function getIncident(id: string) {
  await delay(80);
  return mockIncidents.find((i) => i.id === id) ?? null;
}

export async function getIncidentTimeline(id: string) {
  await delay(60);
  return getIncidentTimelineData(id);
}

export async function getWarnings() {
  await delay(80);
  return mockWarnings;
}

export async function getDisciplinaryActions() {
  await delay(80);
  return mockActions;
}

export async function getParentDisciplineNotifications() {
  await delay(80);
  return mockParentNotifications;
}

export async function getFollowUps() {
  await delay(80);
  return mockFollowUps;
}

export async function getBehaviourHistory() {
  await delay(80);
  return mockBehaviourHistory;
}
