"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPromptsForContext } from "@/mock/ai";
import { sendAiMessage } from "@/services/ai";
import type { AiContext, AiMessage } from "@/types/ai";
import { cn } from "@/lib/utils";

const CONTEXTS: { id: AiContext; label: string; description: string }[] = [
  { id: "admin", label: "Admin", description: "Institution-wide metrics and operations" },
  { id: "student", label: "Student", description: "Academics, credits, attendance" },
  { id: "parent", label: "Parent", description: "Child progress and fees" },
  { id: "teacher", label: "Teacher", description: "Classes, marks, advising" },
];

function newMessage(role: AiMessage["role"], content: string, status?: AiMessage["status"]): AiMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
    status,
  };
}

export function AiChatPage() {
  const [context, setContext] = useState<AiContext>("admin");
  const [messages, setMessages] = useState<AiMessage[]>([
    newMessage(
      "assistant",
      "Hello! I'm **Zendrock AI**, your institutional assistant for NED University. Select a role context and ask a question, or choose a suggested prompt below.\n\nThis is a demo — responses are static mock data, not real AI.",
    ),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = useMemo(() => getPromptsForContext(context), [context]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const handleSend = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    const userMsg = newMessage("user", trimmed, "sent");
    const loadingMsg = newMessage("assistant", "", "loading");
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setLoading(true);
    scrollToBottom();

    try {
      const response = await sendAiMessage(trimmed, context);
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.status !== "loading");
        return [...withoutLoading, newMessage("assistant", response, "sent")];
      });
    } catch {
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.status !== "loading");
        return [
          ...withoutLoading,
          newMessage(
            "assistant",
            "Sorry, I couldn't process your request. Please try again.",
            "error",
          ),
        ];
      });
      setError("Failed to get response. Demo service unavailable.");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [context, loading, scrollToBottom]);

  const handleClear = () => {
    setMessages([
      newMessage(
        "assistant",
        "Conversation cleared. How can I help you today?",
      ),
    ]);
    setError(null);
  };

  const handleSimulateError = () => {
    setError("Simulated error — AI service temporarily unavailable.");
    setMessages((prev) => [
      ...prev,
      newMessage("user", "Test error state", "sent"),
      newMessage(
        "assistant",
        "Unable to connect to Zendrock AI. Please check your connection or try again later.\n\nError code: DEMO_OFFLINE",
        "error",
      ),
    ]);
  };

  return (
    <ModuleHub
      title="Zendrock AI"
      description="Institutional AI assistant — mock responses only, no real AI backend."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Zendrock AI" }]}
      actions={
        <Button size="sm" variant="outline" onClick={handleClear}>
          <RefreshCw className="mr-2 size-4" />New chat
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4" /> Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CONTEXTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContext(c.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left text-sm transition-colors",
                    context === c.id
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                      : "border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]",
                  )}
                >
                  <p className="font-medium">{c.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{c.description}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4" /> Suggested prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSend(p.prompt)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] p-2.5 text-left text-xs transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-xs text-[var(--muted)]">
              <Badge variant="outline" className="mb-2">Demo mode</Badge>
              <p>Responses are pre-written mock data. No LLM or external API is called.</p>
              <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs" onClick={handleSimulateError}>
                Simulate error
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col lg:col-span-3 lg:min-h-[600px]">
          <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="size-5 text-[var(--brand-primary)]" />
                Zendrock AI Chat
                <Badge variant="info" className="capitalize">{context}</Badge>
              </CardTitle>
              {loading && (
                <Badge variant="warning" className="gap-1">
                  <Loader2 className="size-3 animate-spin" /> Thinking…
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col p-0">
            {error && (
              <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4" style={{ maxHeight: "480px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      msg.role === "user"
                        ? "bg-[var(--brand-primary)] text-white"
                        : msg.status === "error"
                          ? "bg-red-100 text-red-600"
                          : "bg-[var(--surface-muted)] text-[var(--muted)]",
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : msg.status === "loading" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      msg.role === "user"
                        ? "bg-[var(--brand-primary)] text-white"
                        : msg.status === "error"
                          ? "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                          : "border border-[var(--border-subtle)] bg-[var(--surface-muted)]",
                    )}
                  >
                    {msg.status === "loading" ? (
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        <Loader2 className="size-4 animate-spin" />
                        Zendrock AI is thinking…
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                    {msg.timestamp && msg.status !== "loading" && (
                      <p className={cn("mt-1 text-[10px]", msg.role === "user" ? "text-white/70" : "text-[var(--muted)]")}>
                        {msg.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border-subtle)] p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask Zendrock AI as ${context}…`}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] disabled:opacity-50"
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </form>
              <p className="mt-2 text-center text-[10px] text-[var(--muted)]">
                Powered by Zendrock EMS · Demo mode only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}
