import { describe, it, expect, vi, beforeEach } from "vitest";
import { SarvamTTSProvider } from "./sarvam-tts";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("SarvamTTSProvider", () => {
  let tts: SarvamTTSProvider;
  const apiKey = "test-sarvam-key";

  beforeEach(() => {
    vi.clearAllMocks();
    tts = new SarvamTTSProvider(apiKey);
  });

  describe("constructor", () => {
    it("should create provider with valid API key", () => {
      expect(tts.name).toBe("sarvam-tts");
    });

    it("should throw if API key is empty", () => {
      expect(() => new SarvamTTSProvider("")).toThrow("Sarvam API key is required");
    });
  });

  describe("synthesize", () => {
    it("should synthesize text to speech successfully", async () => {
      const fakeAudio = "UklGRiQAAABXQVZFZm10IBAAAA..."; // fake base64
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          request_id: "req-123",
          audios: [fakeAudio],
        }),
      });

      const result = await tts.synthesize("Hello, this is a test.");

      expect(result.audioBase64).toBe(fakeAudio);
      expect(result.mimeType).toBe("audio/wav");

      // Verify API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.sarvam.ai/text-to-speech");
      expect(options.method).toBe("POST");
      expect(options.headers["Content-Type"]).toBe("application/json");
      expect(options.headers["api-subscription-key"]).toBe(apiKey);
    });

    it("should use default parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          audios: ["audio-data"],
        }),
      });

      await tts.synthesize("Test text");

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.text).toBe("Test text");
      expect(body.language_code).toBe("en-IN");
      expect(body.model).toBe("bulbul:v3");
      expect(body.speaker).toBe("anand");
      expect(body.pace).toBe(1.0);
      expect(body.output_audio_codec).toBe("wav");
      expect(body.speech_sample_rate).toBe(24000);
    });

    it("should use custom options", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          audios: ["audio-data"],
        }),
      });

      await tts.synthesize("Test text", {
        languageCode: "hi-IN",
        speaker: "shubh",
        pace: 1.2,
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.language_code).toBe("hi-IN");
      expect(body.speaker).toBe("shubh");
      expect(body.pace).toBe(1.2);
    });

    it("should truncate text to 2500 characters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          audios: ["audio-data"],
        }),
      });

      const longText = "a".repeat(3000);
      await tts.synthesize(longText);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.text.length).toBe(2500);
    });

    it("should throw on empty text", async () => {
      await expect(tts.synthesize("")).rejects.toThrow("Cannot synthesize empty text");
      await expect(tts.synthesize("   ")).rejects.toThrow("Cannot synthesize empty text");
    });

    it("should throw on API error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limit exceeded",
      });

      await expect(tts.synthesize("Test")).rejects.toThrow(
        "Sarvam TTS error 429: Rate limit exceeded"
      );
    });

    it("should throw on network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Connection refused"));

      await expect(tts.synthesize("Test")).rejects.toThrow("Connection refused");
    });

    it("should throw on empty audios array", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          audios: [],
        }),
      });

      await expect(tts.synthesize("Test")).rejects.toThrow(
        "Sarvam TTS returned no audio data"
      );
    });

    it("should throw on null audios", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          audios: null,
        }),
      });

      await expect(tts.synthesize("Test")).rejects.toThrow(
        "Sarvam TTS returned no audio data"
      );
    });

    it("should throw on invalid audio data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          audios: [""],
        }),
      });

      await expect(tts.synthesize("Test")).rejects.toThrow(
        "Sarvam TTS returned invalid audio data"
      );
    });
  });

  describe("synthesizeStream", () => {
    it("should stream audio successfully", async () => {
      const audioChunk1 = new Uint8Array([0x01, 0x02, 0x03]);
      const audioChunk2 = new Uint8Array([0x04, 0x05, 0x06]);

      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: audioChunk1 })
          .mockResolvedValueOnce({ done: false, value: audioChunk2 })
          .mockResolvedValueOnce({ done: true, value: undefined }),
        cancel: vi.fn(),
      };

      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(audioChunk1);
          controller.enqueue(audioChunk2);
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      });

      const stream = await tts.synthesizeStream("Hello, streaming test!");
      expect(stream).toBeInstanceOf(ReadableStream);

      // Verify API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.sarvam.ai/text-to-speech/stream");
      expect(options.method).toBe("POST");
      expect(options.headers["api-subscription-key"]).toBe(apiKey);

      const body = JSON.parse(options.body);
      expect(body.text).toBe("Hello, streaming test!");
      expect(body.output_audio_codec).toBe("mp3");
      expect(body.speech_sample_rate).toBe(24000);
    });

    it("should use custom options for streaming", async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      });

      await tts.synthesizeStream("Test", {
        languageCode: "hi-IN",
        speaker: "shubh",
        pace: 1.5,
        audioCodec: "wav",
        sampleRate: 16000,
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.language_code).toBe("hi-IN");
      expect(body.speaker).toBe("shubh");
      expect(body.pace).toBe(1.5);
      expect(body.output_audio_codec).toBe("wav");
      expect(body.speech_sample_rate).toBe(16000);
    });

    it("should truncate text to 2500 characters", async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      });

      const longText = "a".repeat(3000);
      await tts.synthesizeStream(longText);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.text.length).toBe(2500);
    });

    it("should throw on empty text", async () => {
      await expect(tts.synthesizeStream("")).rejects.toThrow("Cannot synthesize empty text");
      await expect(tts.synthesizeStream("   ")).rejects.toThrow("Cannot synthesize empty text");
    });

    it("should throw on API error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limit exceeded",
      });

      await expect(tts.synthesizeStream("Test")).rejects.toThrow(
        "Sarvam TTS stream error 429: Rate limit exceeded"
      );
    });

    it("should throw on network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Connection refused"));

      await expect(tts.synthesizeStream("Test")).rejects.toThrow("Connection refused");
    });

    it("should throw when response body is null", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: null,
      });

      await expect(tts.synthesizeStream("Test")).rejects.toThrow(
        "Sarvam TTS stream returned no body"
      );
    });
  });
});
