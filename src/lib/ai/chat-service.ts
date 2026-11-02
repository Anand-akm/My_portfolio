import type {
  ConversationMessage,
  ChatServiceResult,
  KnowledgeEntry,
  ChatServiceOptions,
} from "@/types/ai";
import { retrieveRelevant } from "./knowledge-retriever";
import {
  buildConversationMessages,
  buildNoMatchResponse,
  NO_MATCH_RESPONSE,
} from "./prompt-builder";
import { validateResponse } from "./response-validator";
import {
  sanitizeInput,
  hasInjectionAttempt,
  MAX_INPUT_LENGTH,
} from "../security/input-sanitizer";
import { getRateLimiter } from "../security/rate-limiter";

export type { ChatServiceOptions } from "@/types/ai";

const FALLBACK_RESPONSE =
  "I'm temporarily unable to process your request. Please try again in a moment, or explore Anand's portfolio sections for more information.";

const INJECTION_RESPONSE =
  "I can only answer questions about Anand's verified professional background, skills, experience, and projects. Please ask a recruiter-focused question.";

const RATE_LIMIT_RESPONSE =
  "You've reached the question limit for now. Please wait a moment before trying again.";

const PRIVATE_TOPIC_PATTERNS = [
  /\b(salary|compensation|ctc|annual\s+income|bank\s+account|credit\s+card|social\s+security|aadhaar|aadhar|pan\s+card|date\s+of\s+birth|dob|home\s+address|residential\s+address|password|api\s*key|secret|token)\b/i,
  /\b(religion|caste|marital\s+status|girlfriend|boyfriend|wife|husband)\b/i,
];

function asksForPrivateInformation(message: string): boolean {
  return PRIVATE_TOPIC_PATTERNS.some((pattern) => pattern.test(message));
}

function sanitizeHistory(
  history: ConversationMessage[] | undefined,
  maxMessages: number
): ConversationMessage[] {
  if (!history || history.length === 0) return [];

  return history
    .slice(-maxMessages)
    .flatMap((message) => {
      if (
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string"
      ) {
        return [];
      }

      const sanitized = sanitizeInput(message.content);
      if (!sanitized.clean || hasInjectionAttempt(sanitized)) return [];

      return [
        {
          role: message.role,
          content: sanitized.clean.slice(0, MAX_INPUT_LENGTH),
        },
      ];
    });
}

function getFollowUpQuery(
  history: ConversationMessage[],
  currentMessage: string
): string {
  const lastUserMessage = [...history]
    .reverse()
    .find((message) => message.role === "user");

  return lastUserMessage
    ? `${lastUserMessage.content} ${currentMessage}`
    : currentMessage;
}

/**
 * Core AI chat service.
 *
 * Orchestrates the full pipeline:
 *   Input → Sanitize → Injection check → Rate limit → Retrieve → Prompt
 *     → LLM → Validate → Response
 *
 * Voice transcripts use this same pipeline. The only exception is the rate
 * limit check, which the voice route performs before expensive STT work.
 */
export async function processChatMessage(
  userMessage: string,
  options: ChatServiceOptions
): Promise<ChatServiceResult> {
  const {
    llmProvider,
    rateLimitKey,
    history: rawHistory,
    maxContextEntries = 6,
    maxHistoryMessages = 6,
    skipRateLimit = false,
  } = options;

  const sanitized = sanitizeInput(userMessage);
  if (!sanitized.clean) {
    return {
      answer: buildNoMatchResponse(),
      sources: [],
      confidence: "none",
      grounded: false,
      error: "empty_input",
    };
  }

  if (hasInjectionAttempt(sanitized)) {
    return {
      answer: INJECTION_RESPONSE,
      sources: [],
      confidence: "none",
      grounded: false,
      error: "blocked_input",
    };
  }

  if (asksForPrivateInformation(sanitized.clean)) {
    return {
      answer: NO_MATCH_RESPONSE,
      sources: [],
      confidence: "none",
      grounded: false,
      error: "unsupported_topic",
    };
  }

  const history = sanitizeHistory(rawHistory, maxHistoryMessages);

  if (!skipRateLimit) {
    const limiter = getRateLimiter();
    const key = rateLimitKey || "global";
    const limitResult = limiter.checkLimit(key);
    if (!limitResult.allowed) {
      return {
        answer: RATE_LIMIT_RESPONSE,
        sources: [],
        confidence: "none",
        grounded: false,
        error: "rate_limited",
        retryAfterMs: limitResult.retryAfterMs,
      };
    }
  }

  let retrieval = retrieveRelevant(sanitized.clean, {
    maxResults: maxContextEntries,
  });

  // A follow-up such as "tell me more about that" has little semantic
  // content on its own. Reuse the previous user question as retrieval context,
  // but never mutate the conversation history.
  if (!retrieval.hasMatches && history.length > 0) {
    const followUpQuery = getFollowUpQuery(history, sanitized.clean);
    if (followUpQuery !== sanitized.clean) {
      retrieval = retrieveRelevant(followUpQuery, {
        maxResults: maxContextEntries,
      });
    }
  }

  if (!retrieval.hasMatches || retrieval.entries.length === 0) {
    return {
      answer: NO_MATCH_RESPONSE,
      sources: [],
      confidence: "none",
      grounded: false,
      error: "no_match",
    };
  }

  const messages = buildConversationMessages(
    retrieval.entries,
    sanitized.clean,
    history
  );

  let llmContent: string;
  try {
    const result = await llmProvider.generate(messages);
    llmContent = result.content;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    // Do not expose internal provider details or user text to the client.
    console.error("[chat-service] LLM error:", message);
    return {
      answer: FALLBACK_RESPONSE,
      sources: [],
      confidence: "none",
      grounded: false,
      error: "llm_unavailable",
    };
  }

  const contextEntries: KnowledgeEntry[] = retrieval.entries.map(
    (scoredEntry) => scoredEntry.entry
  );
  const validation = validateResponse(llmContent, contextEntries);

  if (!validation.isValid) {
    console.warn(
      "[chat-service] Response validation failed:",
      validation.issues.map((issue) => issue.type)
    );
    return {
      answer: FALLBACK_RESPONSE,
      sources: retrieval.entries.map((scoredEntry) => ({
        id: scoredEntry.entry.id,
        topic: scoredEntry.entry.topic,
        evidence: scoredEntry.entry.evidence,
      })),
      confidence: "none",
      grounded: false,
      error: "validation_failed",
    };
  }

  const sources = retrieval.entries.map((scoredEntry) => ({
    id: scoredEntry.entry.id,
    topic: scoredEntry.entry.topic,
    evidence: scoredEntry.entry.evidence,
  }));

  return {
    answer: llmContent,
    sources,
    confidence: determineConfidence(retrieval.entries),
    grounded: true,
  };
}

function determineConfidence(
  entries: Array<{ entry: KnowledgeEntry; score: number }>
): string {
  if (entries.length === 0) return "none";
  const hasDemonstrated = entries.some(
    (entry) => entry.entry.confidence === "demonstrated"
  );
  if (hasDemonstrated) return "demonstrated";
  const hasPartial = entries.some(
    (entry) => entry.entry.confidence === "partial"
  );
  if (hasPartial) return "partial";
  return "self-described";
}
