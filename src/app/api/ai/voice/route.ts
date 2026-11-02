import { NextRequest, NextResponse } from "next/server";
import { processChatMessage } from "@/lib/ai/chat-service";
import { SarvamProvider } from "@/lib/ai/providers/sarvam";
import { SarvamSTTProvider } from "@/lib/ai/providers/sarvam-stt";
import { SarvamTTSProvider } from "@/lib/ai/providers/sarvam-tts";
import {
  getVoiceRateLimiter,
  retryAfterSeconds,
} from "@/lib/security/rate-limiter";
import type { ConversationMessage } from "@/types/ai";

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

let cachedLLM: SarvamProvider | null = null;
let cachedSTT: SarvamSTTProvider | null = null;
let cachedTTS: SarvamTTSProvider | null = null;

function getProviders() {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) return null;

  if (!cachedLLM) cachedLLM = new SarvamProvider(apiKey, process.env.SARVAM_LLM_MODEL);
  if (!cachedSTT) cachedSTT = new SarvamSTTProvider(apiKey);
  if (!cachedTTS) cachedTTS = new SarvamTTSProvider(apiKey);

  return { llm: cachedLLM, stt: cachedSTT, tts: cachedTTS };
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
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

/**
 * POST /api/ai/voice
 *
 * Reliable batch voice pipeline:
 *   1. Rate-limit the request before any paid provider work.
 *   2. STT transcript (Sarvam Saaras v3).
 *   3. Grounded AI answer using the shared chat pipeline.
 *   4. English TTS (Sarvam Bulbul v3) returned as a complete WAV payload.
 */
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

    const {
      audio,
      mimeType,
      history: rawHistory,
    } = body as {
      audio?: unknown;
      mimeType?: unknown;
      history?: unknown;
    };

    if (typeof audio !== "string" || !audio.trim()) {
      return NextResponse.json(
        { error: "A non-empty 'audio' field (base64-encoded) is required" },
        { status: 400 }
      );
    }

    if (typeof mimeType !== "string" || !mimeType.trim()) {
      return NextResponse.json(
        { error: "A 'mimeType' field is required" },
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

    const providers = getProviders();
    if (!providers) {
      return NextResponse.json(
        {
          error:
            "Voice AI is not configured. Please set the SARVAM_API_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    // Voice has a separate budget because one turn can include STT + LLM + TTS.
    const rateLimitKey = getClientIP(req);
    const limit = getVoiceRateLimiter().checkLimit(rateLimitKey);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Voice rate limit reached. Please wait before trying again.",
          code: "rate_limited",
          retryAfterMs: limit.retryAfterMs,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds(limit.retryAfterMs)),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    let audioBuffer: ArrayBuffer;
    try {
      const binaryString = atob(audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      audioBuffer = bytes.buffer;
    } catch {
      return NextResponse.json(
        { error: "Invalid base64 audio data" },
        { status: 400 }
      );
    }

    if (audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: "Audio payload is empty" },
        { status: 400 }
      );
    }

    if (audioBuffer.byteLength > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Audio file too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    let sttResult;
    try {
      sttResult = await providers.stt.transcribe(audioBuffer, mimeType, {
        mode: "transcribe",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown STT error";
      console.error("[api/ai/voice] STT error:", message);
      return NextResponse.json(
        {
          error: "Failed to transcribe audio. Please try again or use text chat.",
          code: "stt_failed",
        },
        { status: 502 }
      );
    }

    const { transcript, languageCode } = sttResult;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        {
          error: "No speech detected in the audio. Please try speaking again.",
          transcript: "",
          languageCode,
        },
        { status: 422 }
      );
    }

    const chatResult = await processChatMessage(transcript, {
      llmProvider: providers.llm,
      rateLimitKey,
      history,
      skipRateLimit: true,
    });

    if (
      chatResult.error === "llm_unavailable" ||
      chatResult.error === "validation_failed"
    ) {
      return NextResponse.json(
        {
          transcript,
          languageCode,
          answer: chatResult.answer,
          audioBase64: null,
          audioMimeType: null,
          sources: [],
          confidence: "none",
          grounded: false,
          error: chatResult.error,
        },
        { status: 502 }
      );
    }

    let ttsResult;
    try {
      ttsResult = await providers.tts.synthesize(chatResult.answer, {
        languageCode: "en-IN",
        speaker: "anand",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown TTS error";
      console.error("[api/ai/voice] TTS error:", message);
      return NextResponse.json({
        transcript,
        languageCode,
        answer: chatResult.answer,
        audioBase64: null,
        audioMimeType: null,
        sources: chatResult.sources,
        confidence: chatResult.confidence,
        grounded: chatResult.grounded,
        error: "tts_failed",
      });
    }

    return NextResponse.json(
      {
        transcript,
        languageCode,
        answer: chatResult.answer,
        audioBase64: ttsResult.audioBase64,
        audioMimeType: ttsResult.mimeType,
        sources: chatResult.sources,
        confidence: chatResult.confidence,
        grounded: chatResult.grounded,
        ...(chatResult.error ? { error: chatResult.error } : {}),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[api/ai/voice] Unexpected error:", err);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again or use text chat.",
      },
      { status: 500 }
    );
  }
}
