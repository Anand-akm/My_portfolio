import type { LLMProvider, LLMMessage, LLMGenerateOptions, LLMGenerateResult } from "@/types/ai";

const SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions";

const MAX_RETRIES = 3;
const MAX_EMPTY_RETRIES = 1;
const RETRY_BASE_MS = 500;
const RETRY_MAX_MS = 4000;
const FETCH_TIMEOUT_MS = 30_000;

/**
 * Sarvam AI adapter using raw REST API.
 * OpenAI-compatible endpoint — no SDK dependency.
 *
 * Auth: api-subscription-key header (Sarvam's primary auth method).
 * Models: sarvam-105b (128K context), sarvam-105b-conversations (32K context).
 *
 * Includes retry with exponential backoff for transient errors (429, 502, 503, 504).
 * Does NOT retry auth errors (401, 403) or validation errors (400, 422).
 */
export class SarvamProvider implements LLMProvider {
  name = "sarvam";
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey: string, model?: string) {
    if (!apiKey) throw new Error("Sarvam API key is required");
    this.apiKey = apiKey;
    this.defaultModel = model || "sarvam-105b";
  }

  async generate(
    messages: LLMMessage[],
    options?: LLMGenerateOptions
  ): Promise<LLMGenerateResult> {
    const model = options?.model || this.defaultModel;

    let lastError: Error | null = null;
    let emptyRetries = 0;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(
          RETRY_BASE_MS * Math.pow(2, attempt - 1),
          RETRY_MAX_MS
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        let response: Response;
        try {
          response = await fetch(SARVAM_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-subscription-key": this.apiKey,
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: options?.temperature ?? 0.3,
              max_tokens: options?.maxTokens ?? 1024,
            }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (response.ok) {
          const data = await response.json();

          if (!data.choices?.[0]?.message?.content) {
            const emptyError = new Error("Sarvam returned empty response");
            if (emptyRetries < MAX_EMPTY_RETRIES) {
              emptyRetries++;
              lastError = emptyError;
              console.warn(
                `[SarvamProvider] Empty response (retry ${emptyRetries}/${MAX_EMPTY_RETRIES})`
              );
              continue;
            }
            throw emptyError;
          }

          return {
            content: data.choices[0].message.content,
            model: data.model || model,
            usage: data.usage
              ? {
                  promptTokens: data.usage.prompt_tokens,
                  completionTokens: data.usage.completion_tokens,
                  totalTokens: data.usage.total_tokens,
                }
              : undefined,
          };
        }

        const errorBody = await response.text().catch(() => "unknown");
        const errorMsg = `Sarvam API error ${response.status}: ${errorBody}`;

        // Do not retry on auth or client errors — fail immediately
        if (response.status === 401 || response.status === 403 || response.status === 400 || response.status === 422) {
          throw new Error(errorMsg);
        }

        // Retry on transient errors: 429 (rate limit), 502, 503, 504
        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(errorMsg);
          if (attempt < MAX_RETRIES) {
            console.warn(`[SarvamProvider] Transient error (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ${errorMsg}`);
            continue;
          }
        }

        // Non-retryable error (e.g. 404, 409)
        throw new Error(errorMsg);
      } catch (err) {
        // Non-retryable: abort and client/auth errors
        if (
          (err instanceof Error && err.name === "AbortError") ||
          (err instanceof Error &&
            err.message === "Sarvam returned empty response") ||
          (err instanceof Error && (
            err.message.includes("Sarvam API error 401") ||
            err.message.includes("Sarvam API error 403") ||
            err.message.includes("Sarvam API error 400") ||
            err.message.includes("Sarvam API error 422")
          ))
        ) {
          throw err;
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < MAX_RETRIES) {
          console.warn(`[SarvamProvider] Retryable error (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ${lastError.message}`);
          continue;
        }
      }
    }

    throw lastError || new Error("Sarvam LLM failed after retries");
  }
}
