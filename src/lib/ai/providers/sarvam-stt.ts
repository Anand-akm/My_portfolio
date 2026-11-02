import type { STTProvider, STTTranscribeOptions, STTTranscribeResult } from "@/types/ai";

const SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text";
const FETCH_TIMEOUT_MS = 25_000;

function baseMimeType(mimeType: string): string {
  return mimeType.split(";")[0].trim().toLowerCase() || "audio/webm";
}

function fileExtensionForMime(mimeType: string): string {
  const normalized = baseMimeType(mimeType);
  if (normalized.includes("mp4")) return "mp4";
  if (normalized.includes("ogg")) return "ogg";
  if (normalized.includes("wav")) return "wav";
  return "webm";
}

/**
 * Sarvam AI Speech-to-Text provider.
 *
 * Uses the REST API with Saaras v3. Server-side only; the API key never
 * reaches the browser.
 */
export class SarvamSTTProvider implements STTProvider {
  name = "sarvam-stt";
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("Sarvam API key is required for STT");
    this.apiKey = apiKey;
  }

  async transcribe(
    audioBuffer: ArrayBuffer,
    mimeType: string,
    options?: STTTranscribeOptions
  ): Promise<STTTranscribeResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const formData = new FormData();
      const audioBlob = new Blob([audioBuffer], {
        type: baseMimeType(mimeType),
      });
      formData.append(
        "file",
        audioBlob,
        `audio.${fileExtensionForMime(mimeType)}`
      );
      formData.append("model", "saaras:v3");
      formData.append("mode", options?.mode || "transcribe");
      formData.append("language_code", options?.languageCode || "unknown");

      const response = await fetch(SARVAM_STT_URL, {
        method: "POST",
        headers: {
          "api-subscription-key": this.apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "unknown");
        throw new Error(
          `Sarvam STT error ${response.status}: ${errorBody}`
        );
      }

      const data = await response.json();
      if (typeof data.transcript !== "string") {
        throw new Error("Sarvam STT returned invalid transcript format");
      }

      return {
        transcript: data.transcript.trim(),
        languageCode: data.language_code || null,
        languageProbability: data.language_probability ?? null,
      };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Sarvam STT request timed out");
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
