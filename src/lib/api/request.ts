import type { NextRequest } from "next/server";
import type { ConversationMessage } from "@/types/ai";

/** Extract the best available client IP for rate limiting. */
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
}

/** Validate and normalize a conversation history payload. */
export function parseHistory(value: unknown): ConversationMessage[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 20) return null;

  const history: ConversationMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    ) {
      return null;
    }
    history.push({ role, content });
  }
  return history;
}
