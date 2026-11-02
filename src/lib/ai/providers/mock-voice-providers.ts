import { describe, it, expect, vi, beforeEach } from "vitest";
import type { STTProvider, TTSProvider, STTTranscribeResult, TTSSynthesizeResult, STTTranscribeOptions, TTSSynthesizeOptions } from "@/types/ai";

// ─── Mock STT Provider ──────────────────────────────────────────

export class MockSTTProvider implements STTProvider {
  name = "mock-stt";
  private result: STTTranscribeResult;
  private shouldFail = false;
  private errorMessage = "Mock STT error";

  constructor(result?: Partial<STTTranscribeResult>) {
    this.result = {
      transcript: result?.transcript ?? "What projects has Anand worked on?",
      languageCode: result?.languageCode ?? "en-IN",
      languageProbability: result?.languageProbability ?? 0.95,
    };
  }

  setShouldFail(fail: boolean, message?: string) {
    this.shouldFail = fail;
    if (message) this.errorMessage = message;
  }

  async transcribe(_audioBuffer: ArrayBuffer, _mimeType: string, _options?: STTTranscribeOptions): Promise<STTTranscribeResult> {
    if (this.shouldFail) throw new Error(this.errorMessage);
    return this.result;
  }
}

// ─── Mock TTS Provider ──────────────────────────────────────────

export class MockTTSProvider implements TTSProvider {
  name = "mock-tts";
  private result: TTSSynthesizeResult;
  private shouldFail = false;
  private errorMessage = "Mock TTS error";
  private streamChunks: Uint8Array[] = [
    new Uint8Array([0x01, 0x02, 0x03]),
    new Uint8Array([0x04, 0x05, 0x06]),
  ];

  constructor(result?: Partial<TTSSynthesizeResult>) {
    this.result = {
      audioBase64: result?.audioBase64 ?? "dGVzdC1hdWRpby1kYXRh", // "test-audio-data" in base64
      mimeType: result?.mimeType ?? "audio/wav",
    };
  }

  setShouldFail(fail: boolean, message?: string) {
    this.shouldFail = fail;
    if (message) this.errorMessage = message;
  }

  setStreamChunks(chunks: Uint8Array[]) {
    this.streamChunks = chunks;
  }

  async synthesize(_text: string, _options?: TTSSynthesizeOptions): Promise<TTSSynthesizeResult> {
    if (this.shouldFail) throw new Error(this.errorMessage);
    return this.result;
  }

  async synthesizeStream(_text: string, _options?: TTSSynthesizeOptions): Promise<ReadableStream<Uint8Array>> {
    if (this.shouldFail) throw new Error(this.errorMessage);
    const chunks = this.streamChunks;
    return new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });
  }
}

describe("Mock STT Provider", () => {
  it("should return transcript on success", async () => {
    const stt = new MockSTTProvider({ transcript: "Hello world" });
    const result = await stt.transcribe(new ArrayBuffer(100), "audio/webm");
    expect(result.transcript).toBe("Hello world");
  });

  it("should throw on failure", async () => {
    const stt = new MockSTTProvider();
    stt.setShouldFail(true, "API down");
    await expect(stt.transcribe(new ArrayBuffer(100), "audio/webm")).rejects.toThrow(
      "API down"
    );
  });
});

describe("Mock TTS Provider", () => {
  it("should return audio on success", async () => {
    const tts = new MockTTSProvider();
    const result = await tts.synthesize("Hello");
    expect(result.audioBase64).toBeTruthy();
    expect(result.mimeType).toBe("audio/wav");
  });

  it("should throw on failure", async () => {
    const tts = new MockTTSProvider();
    tts.setShouldFail(true, "TTS unavailable");
    await expect(tts.synthesize("Hello")).rejects.toThrow("TTS unavailable");
  });

  it("should stream audio chunks", async () => {
    const tts = new MockTTSProvider();
    const stream = await tts.synthesizeStream("Hello");
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    expect(chunks.length).toBe(2);
    expect(chunks[0]).toEqual(new Uint8Array([0x01, 0x02, 0x03]));
    expect(chunks[1]).toEqual(new Uint8Array([0x04, 0x05, 0x06]));
  });

  it("should throw on stream failure", async () => {
    const tts = new MockTTSProvider();
    tts.setShouldFail(true, "Stream unavailable");
    await expect(tts.synthesizeStream("Hello")).rejects.toThrow("Stream unavailable");
  });
});
