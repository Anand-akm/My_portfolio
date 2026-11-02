import { describe, it, expect, vi, beforeEach } from "vitest";
import { SarvamSTTProvider } from "./sarvam-stt";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock FormData
class MockFormData {
  private data = new Map<string, unknown>();
  append(key: string, value: unknown) {
    this.data.set(key, value);
  }
  get(key: string) {
    return this.data.get(key);
  }
}
vi.stubGlobal("FormData", MockFormData);

// Mock Blob
class MockBlob {
  constructor(public parts: unknown[], public options?: { type?: string }) {}
  get size() {
    return 1000;
  }
}
vi.stubGlobal("Blob", MockBlob);

describe("SarvamSTTProvider", () => {
  let stt: SarvamSTTProvider;
  const apiKey = "test-sarvam-key";

  beforeEach(() => {
    vi.clearAllMocks();
    stt = new SarvamSTTProvider(apiKey);
  });

  describe("constructor", () => {
    it("should create provider with valid API key", () => {
      expect(stt.name).toBe("sarvam-stt");
    });

    it("should throw if API key is empty", () => {
      expect(() => new SarvamSTTProvider("")).toThrow("Sarvam API key is required");
    });
  });

  describe("transcribe", () => {
    it("should transcribe audio successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "Hello, this is a test transcript",
          language_code: "en-IN",
          language_probability: 0.95,
        }),
      });

      const audioBuffer = new ArrayBuffer(1024);
      const result = await stt.transcribe(audioBuffer, "audio/webm");

      expect(result.transcript).toBe("Hello, this is a test transcript");
      expect(result.languageCode).toBe("en-IN");
      expect(result.languageProbability).toBe(0.95);

      // Verify API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.sarvam.ai/speech-to-text");
      expect(options.method).toBe("POST");
      expect(options.headers["api-subscription-key"]).toBe(apiKey);
    });

    it("should strip media codec parameters before upload", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "test",
          language_code: "en-IN",
        }),
      });

      await stt.transcribe(
        new ArrayBuffer(100),
        "audio/webm;codecs=opus"
      );

      const formData = mockFetch.mock.calls[0][1].body;
      const blob = formData.get("file") as MockBlob;
      expect(blob.options?.type).toBe("audio/webm");
    });

    it("should pass transcribe mode by default", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "test",
          language_code: "hi-IN",
        }),
      });

      await stt.transcribe(new ArrayBuffer(100), "audio/wav");

      const formData = mockFetch.mock.calls[0][1].body;
      expect(formData.get("mode")).toBe("transcribe");
      expect(formData.get("model")).toBe("saaras:v3");
    });

    it("should pass custom options", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "translated text",
          language_code: "en-IN",
        }),
      });

      await stt.transcribe(new ArrayBuffer(100), "audio/mp3", {
        languageCode: "hi-IN",
        mode: "translate",
      });

      const formData = mockFetch.mock.calls[0][1].body;
      expect(formData.get("mode")).toBe("translate");
      expect(formData.get("language_code")).toBe("hi-IN");
    });

    it("should use 'unknown' language code when not specified", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "test",
          language_code: "bn-IN",
        }),
      });

      await stt.transcribe(new ArrayBuffer(100), "audio/webm");

      const formData = mockFetch.mock.calls[0][1].body;
      expect(formData.get("language_code")).toBe("unknown");
    });

    it("should throw on API error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      });

      await expect(
        stt.transcribe(new ArrayBuffer(100), "audio/webm")
      ).rejects.toThrow("Sarvam STT error 401: Unauthorized");
    });

    it("should throw on network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network failure"));

      await expect(
        stt.transcribe(new ArrayBuffer(100), "audio/webm")
      ).rejects.toThrow("Network failure");
    });

    it("should return empty transcript when no speech detected", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "",
          language_code: null,
        }),
      });

      const result = await stt.transcribe(new ArrayBuffer(100), "audio/webm");
      expect(result.transcript).toBe("");
      expect(result.languageCode).toBeNull();
    });

    it("should throw on null transcript", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: null,
          language_code: null,
        }),
      });

      await expect(
        stt.transcribe(new ArrayBuffer(100), "audio/webm")
      ).rejects.toThrow("Sarvam STT returned invalid transcript format");
    });

    it("should trim transcript whitespace", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "  hello world  ",
          language_code: "en-IN",
        }),
      });

      const result = await stt.transcribe(new ArrayBuffer(100), "audio/webm");
      expect(result.transcript).toBe("hello world");
    });

    it("should handle missing language_probability", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcript: "test",
          language_code: "en-IN",
          // no language_probability
        }),
      });

      const result = await stt.transcribe(new ArrayBuffer(100), "audio/webm");
      expect(result.languageProbability).toBeNull();
    });
  });
});
