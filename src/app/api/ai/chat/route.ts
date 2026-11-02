import { NextRequest, NextResponse } from "next/server";
import { processChatMessage } from "@/lib/ai/chat-service";
import { SarvamProvider } from "@/lib/ai/providers/sarvam";
import { MAX_INPUT_LENGTH } from "@/lib/security/input-sanitizer";
import { retryAfterSeconds } from "@/lib/security/rate-limiter";
import type { ConversationMessage } from "@/types/ai";

let cachedProvider: SarvamProvider | null = null;

function getLLMProvider(): SarvamProvider | null {
  const apiKey = process.env.SARVAM_API_KEY;
  const model = process.env.SARVAM_LLM_MODEL;
  if (!apiKey) return null;
  if (!cachedProvider) {
    cachedProvider = new SarvamProvider(apiKey, model);
  }
  return cachedProvider;
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "anonymous";
}

function parseHistory(value: unknown): ConversationMessage[] | null {
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

function errorStatus(error: string | undefined): number {
  switch (error) {
    case "empty_input":
    case "blocked_input":
      return 400;
    case "rate_limited":
      return 429;
    case "llm_unavailable":
    case "validation_failed":
      return 502;
    default:
      return 200;
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a JSON object" },
        { status: 400 }
      );
    }

    const { message, history: rawHistory } = body as {
      message?: unknown;
      history?: unknown;
    };

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty 'message' field is required" },
        { status: 400 }
      );
    }

    if (message.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Message exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const history = parseHistory(rawHistory);
    if (history === null) {
      return NextResponse.json(
        { error: "History must contain valid user/assistant messages" },
        { status: 400 }
      );
    }

    const provider = getLLMProvider();
    if (!provider) {
      return NextResponse.json(
        {
          answer:
            "AI Anand is not configured yet. Please set the SARVAM_API_KEY environment variable.",
          sources: [],
          confidence: "none",
          grounded: false,
          error: "provider_not_configured",
        },
        { status: 503 }
      );
    }

    const result = await processChatMessage(message, {
      llmProvider: provider,
      rateLimitKey: getClientIP(req),
      history,
    });

    const status = errorStatus(result.error);
    const headers: Record<string, string> = {
      "Cache-Control": "no-store",
    };
    if (status === 429 && result.retryAfterMs) {
      headers["Retry-After"] = String(
        retryAfterSeconds(result.retryAfterMs)
      );
    }

    return NextResponse.json(
      {
        answer: result.answer,
        sources: result.sources,
        confidence: result.confidence,
        grounded: result.grounded,
        ...(result.error ? { error: result.error } : {}),
        ...(result.retryAfterMs
          ? { retryAfterMs: result.retryAfterMs }
          : {}),
      },
      { status, headers }
    );
  } catch (err) {
    console.error("[api/ai/chat] Unexpected error:", err);
    return NextResponse.json(
      {
        answer: "An unexpected error occurred. Please try again later.",
        sources: [],
        confidence: "none",
        grounded: false,
        error: "internal_error",
      },
      { status: 500 }
    );
  }
}
