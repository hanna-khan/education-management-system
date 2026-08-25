import {
  certificateStats,
  mockCertificateRequests,
  mockTemplates,
  verifyCode,
} from "@/mock/certificates";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCertificateStats() {
  await delay(60);
  return certificateStats;
}

export async function getCertificateTemplates() {
  await delay(60);
  return mockTemplates;
}

export async function getCertificateRequests() {
  await delay(80);
  return mockCertificateRequests;
}

export async function verifyCertificate(code: string) {
  await delay(120);
  return verifyCode(code);
}
