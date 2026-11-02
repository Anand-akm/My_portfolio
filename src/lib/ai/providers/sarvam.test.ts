import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SarvamProvider } from "./sarvam";

function mockFetchResponse(data: unknown, status = 200) {
  return vi.spyOn(global, "fetch").mockImplementation(
    async () =>
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      })
  );
}

function getRequestBody() {
  const calls = vi.spyOn(global, "fetch").mock.calls;
  return JSON.parse((calls[0][1] as RequestInit).body as string);
}

describe("SarvamProvider", () => {
  const mockApiKey = "test-sarvam-key-12345";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("creates provider with default model", () => {
      const provider = new SarvamProvider(mockApiKey);
      expect(provider.name).toBe("sarvam");
    });

    it("creates provider with custom model", () => {
      const provider = new SarvamProvider(mockApiKey, "sarvam-105b-conversations");
      expect(provider.name).toBe("sarvam");
    });

    it("throws if no API key provided", () => {
      expect(() => new SarvamProvider("")).toThrow("Sarvam API key is required");
    });
  });

  describe("generate", () => {
    it("sends correct request to Sarvam API", async () => {
      mockFetchResponse({
        id: "chatcmpl-123",
        object: "chat.completion",
        created: 1234567890,
        model: "sarvam-105b",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Anand is a software engineer." },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      });

      const provider = new SarvamProvider(mockApiKey);
      const result = await provider.generate([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Tell me about Anand." },
      ]);

      expect(global.fetch).toHaveBeenCalledOnce();

      const body = getRequestBody();
      expect(body.model).toBe("sarvam-105b");
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe("system");
      expect(body.messages[1].role).toBe("user");
      expect(body.temperature).toBe(0.3);
      expect(body.max_tokens).toBe(1024);

      // Verify auth header
      const headers = new Headers(
        (global.fetch as ReturnType<typeof vi.spyOn>).mock.calls[0][1]?.headers as HeadersInit
      );
      expect(headers.get("api-subscription-key")).toBe(mockApiKey);

      expect(result.content).toBe("Anand is a software engineer.");
      expect(result.model).toBe("sarvam-105b");
      expect(result.usage).toEqual({
        promptTokens: 50,
        completionTokens: 20,
        totalTokens: 70,
      });
    });

    it("uses custom model and options", async () => {
      mockFetchResponse({
        id: "chatcmpl-456",
        object: "chat.completion",
        created: 1234567890,
        model: "sarvam-105b-conversations",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Custom response." },
            finish_reason: "stop",
          },
        ],
      });

      const provider = new SarvamProvider(mockApiKey);
      const result = await provider.generate(
        [{ role: "user", content: "Hello" }],
        { model: "sarvam-105b-conversations", temperature: 0.7, maxTokens: 512 }
      );

      const body = getRequestBody();
      expect(body.model).toBe("sarvam-105b-conversations");
      expect(body.temperature).toBe(0.7);
      expect(body.max_tokens).toBe(512);

      expect(result.content).toBe("Custom response.");
      expect(result.model).toBe("sarvam-105b-conversations");
    });

    it("throws on HTTP error", async () => {
      mockFetchResponse("Unauthorized", 401);

      const provider = new SarvamProvider(mockApiKey);
      await expect(
        provider.generate([{ role: "user", content: "Hello" }])
      ).rejects.toThrow("Sarvam API error 401");
    });

    it("throws after retrying an empty response", async () => {
      mockFetchResponse({
        id: "chatcmpl-789",
        object: "chat.completion",
        created: 1234567890,
        model: "sarvam-105b",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: null },
            finish_reason: "stop",
          },
        ],
      });

      const provider = new SarvamProvider(mockApiKey);
      await expect(
        provider.generate([{ role: "user", content: "Hello" }])
      ).rejects.toThrow("Sarvam returned empty response");
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("recovers when a retry returns content", async () => {
      const fetchSpy = vi
        .spyOn(global, "fetch")
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              model: "sarvam-105b",
              choices: [{ message: { role: "assistant", content: "" } }],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              model: "sarvam-105b",
              choices: [
                {
                  message: {
                    role: "assistant",
                    content: "Recovered response.",
                  },
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        );

      const provider = new SarvamProvider(mockApiKey);
      const result = await provider.generate([
        { role: "user", content: "Hello" },
      ]);

      expect(result.content).toBe("Recovered response.");
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("handles missing usage field", async () => {
      mockFetchResponse({
        id: "chatcmpl-abc",
        object: "chat.completion",
        created: 1234567890,
        model: "sarvam-105b",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Response." },
            finish_reason: "stop",
          },
        ],
      });

      const provider = new SarvamProvider(mockApiKey);
      const result = await provider.generate([
        { role: "user", content: "Hi" },
      ]);

      expect(result.content).toBe("Response.");
      expect(result.usage).toBeUndefined();
    });

    it("defaults to sarvam-105b model when no model specified", async () => {
      mockFetchResponse({
        id: "chatcmpl-def",
        object: "chat.completion",
        created: 1234567890,
        model: "sarvam-105b",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "OK" },
            finish_reason: "stop",
          },
        ],
      });

      const provider = new SarvamProvider(mockApiKey);
      await provider.generate([{ role: "user", content: "Hi" }]);

      const body = getRequestBody();
      expect(body.model).toBe("sarvam-105b");
    });

    it("sends api-subscription-key header (not Authorization Bearer)", async () => {
      mockFetchResponse({
        id: "chatcmpl-xyz",
        object: "chat.completion",
        created: 1234567890,
        model: "sarvam-105b",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Hi" },
            finish_reason: "stop",
          },
        ],
      });

      const provider = new SarvamProvider(mockApiKey);
      await provider.generate([{ role: "user", content: "Hi" }]);

      const fetchSpy = vi.spyOn(global, "fetch");
      const headers = new Headers(fetchSpy.mock.calls[0][1]?.headers as HeadersInit);
      expect(headers.get("api-subscription-key")).toBe(mockApiKey);
      expect(headers.get("Authorization")).toBeNull();
    });
  });
});
