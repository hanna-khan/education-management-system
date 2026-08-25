import {
  AI_SUGGESTED_PROMPTS,
  getMockAiResponse,
  getPromptsForContext,
  mockAiConversations,
} from "@/mock/ai";
import type { AiContext } from "@/types/ai";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAiSuggestedPrompts(context?: AiContext) {
  await delay(80);
  return context ? getPromptsForContext(context) : AI_SUGGESTED_PROMPTS;
}

export async function getAiConversations() {
  await delay(100);
  return mockAiConversations;
}

export async function sendAiMessage(prompt: string, context: AiContext) {
  await delay(110);
  return getMockAiResponse(prompt, context);
}
