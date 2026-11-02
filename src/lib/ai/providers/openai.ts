import type { LLMProvider, LLMMessage, LLMGenerateOptions, LLMGenerateResult } from "@/types/ai";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * OpenAI adapter using raw REST API.
 * No SDK dependency — uses fetch directly.
 */
export class OpenAIProvider implements LLMProvider {
  name = "openai";
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey: string, model?: string) {
    if (!apiKey) throw new Error("OpenAI API key is required");
    this.apiKey = apiKey;
    this.defaultModel = model || "gpt-4o-mini";
  }

  async generate(
    messages: LLMMessage[],
    options?: LLMGenerateOptions
  ): Promise<LLMGenerateResult> {
    const model = options?.model || this.defaultModel;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "unknown");
      throw new Error(
        `OpenAI API error ${response.status}: ${errorBody}`
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("OpenAI returned empty response");
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
}
