import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { resetGlobalRateLimiter } from "@/lib/security/rate-limiter";

const mocks = vi.hoisted(() => ({
  transcribe: vi.fn(),
  synthesize: vi.fn(),
  processChatMessage: vi.fn(),
  generate: vi.fn(),
}));

vi.mock("@/lib/ai/chat-service", () => ({
  processChatMessage: mocks.processChatMessage,
}));

vi.mock("@/lib/ai/providers/sarvam", () => ({
  SarvamProvider: class {
    name = "sarvam";
    generate = mocks.generate;
  },
}));

vi.mock("@/lib/ai/providers/sarvam-stt", () => ({
  SarvamSTTProvider: class {
    name = "sarvam-stt";
    transcribe = mocks.transcribe;
  },
}));

vi.mock("@/lib/ai/providers/sarvam-tts", () => ({
  SarvamTTSProvider: class {
    name = "sarvam-tts";
    synthesize = mocks.synthesize;
  },
}));

import { POST } from "./route";

const groundedResult = {
  answer: "Anand has built production GenAI and data engineering systems.",
  sources: [{ id: "proj-1", topic: "GenAI Projects" }],
  confidence: "demonstrated",
  grounded: true,
};

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/ai/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    audio: "YXVkaW8=",
    mimeType: "audio/webm",
    history: [],
    ...overrides,
  };
}

describe("POST /api/ai/voice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SARVAM_API_KEY = "test-key";
    delete process.env.RATE_LIMIT_VOICE;
    resetGlobalRateLimiter();
    mocks.transcribe.mockResolvedValue({
      transcript: "What projects has Anand worked on?",
      languageCode: "en-IN",
      languageProbability: 0.95,
    });
    mocks.synthesize.mockResolvedValue({
      audioBase64: "dGVzdC1hdWRpbw==",
      mimeType: "audio/wav",
    });
    mocks.processChatMessage.mockResolvedValue(groundedResult);
  });

  afterEach(() => {
    resetGlobalRateLimiter();
    delete process.env.RATE_LIMIT_VOICE;
  });

  it("returns a grounded transcript, answer, and complete WAV", async () => {
    const response = await POST(makeRequest(validBody()));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transcript).toBe("What projects has Anand worked on?");
    expect(data.grounded).toBe(true);
    expect(data.audioMimeType).toBe("audio/wav");
    expect(data.audioBase64).toBe("dGVzdC1hdWRpbw==");
    expect(mocks.transcribe).toHaveBeenCalledOnce();
    expect(mocks.processChatMessage).toHaveBeenCalledWith(
      "What projects has Anand worked on?",
      expect.objectContaining({ skipRateLimit: true })
    );
  });

  it("rejects malformed requests before provider work", async () => {
    const invalidJson = await POST(
      new NextRequest("http://localhost/api/ai/voice", {
        method: "POST",
        body: "{",
      })
    );
    expect(invalidJson.status).toBe(400);

    const noAudio = await POST(makeRequest({ mimeType: "audio/webm" }));
    expect(noAudio.status).toBe(400);

    const noMime = await POST(makeRequest({ audio: "YXVkaW8=" }));
    expect(noMime.status).toBe(400);

    const badHistory = await POST(
      makeRequest(validBody({ history: [{ role: "system", content: "x" }] }))
    );
    expect(badHistory.status).toBe(400);

    const badBase64 = await POST(
      makeRequest(validBody({ audio: "not-base64!" }))
    );
    expect(badBase64.status).toBe(400);

    expect(mocks.transcribe).not.toHaveBeenCalled();
    expect(mocks.processChatMessage).not.toHaveBeenCalled();
  });

  it("returns 422 when STT detects no speech", async () => {
    mocks.transcribe.mockResolvedValueOnce({
      transcript: "",
      languageCode: "en-IN",
      languageProbability: 0,
    });

    const response = await POST(makeRequest(validBody()));
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.transcript).toBe("");
    expect(mocks.processChatMessage).not.toHaveBeenCalled();
    expect(mocks.synthesize).not.toHaveBeenCalled();
  });

  it("returns 502 when STT fails", async () => {
    mocks.transcribe.mockRejectedValueOnce(new Error("provider timeout"));

    const response = await POST(makeRequest(validBody()));
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.code).toBe("stt_failed");
    expect(mocks.processChatMessage).not.toHaveBeenCalled();
  });

  it("returns the text answer when TTS fails", async () => {
    mocks.synthesize.mockRejectedValueOnce(new Error("provider timeout"));

    const response = await POST(makeRequest(validBody()));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.answer).toBe(groundedResult.answer);
    expect(data.audioBase64).toBeNull();
    expect(data.error).toBe("tts_failed");
  });

  it("returns 429 with retry guidance and no provider work", async () => {
    process.env.RATE_LIMIT_VOICE = "1";
    resetGlobalRateLimiter();

    const first = await POST(makeRequest(validBody()));
    const second = await POST(makeRequest(validBody()));
    const data = await second.json();

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
    expect(second.headers.get("Retry-After")).toBeTruthy();
    expect(data.code).toBe("rate_limited");
    expect(data.retryAfterMs).toBeGreaterThan(0);
    expect(mocks.transcribe).toHaveBeenCalledOnce();
  });
});
