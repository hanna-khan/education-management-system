export type AiContext = "admin" | "student" | "parent" | "teacher";
export type AiMessageRole = "user" | "assistant" | "system";
export type AiMessageStatus = "sent" | "loading" | "error";

export interface AiSuggestedPrompt {
  id: string;
  context: AiContext;
  label: string;
  prompt: string;
}

export interface AiMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  timestamp: string;
  status?: AiMessageStatus;
}

export interface AiConversation {
  id: string;
  title: string;
  context: AiContext;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AiMockResponse {
  promptPattern: string;
  context: AiContext;
  response: string;
}
