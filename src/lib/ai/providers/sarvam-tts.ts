import type { TTSProvider, TTSSynthesizeOptions, TTSSynthesizeResult } from "@/types/ai";

const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";
const SARVAM_TTS_STREAM_URL = "https://api.sarvam.ai/text-to-speech/stream";
const FETCH_TIMEOUT_MS = 25_000;

/**
 * Sarvam AI Text-to-Speech provider.
 *
 * Uses Bulbul v3 with a complete WAV response. The voice experience currently
 * uses this reliable batch path; the streaming method remains available for a
 * future binary-safe server implementation.
 */
export class SarvamTTSProvider implements TTSProvider {
  name = "sarvam-tts";
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("Sarvam API key is required for TTS");
    this.apiKey = apiKey;
  }

  async synthesize(
    text: string,
    options?: TTSSynthesizeOptions
  ): Promise<TTSSynthesizeResult> {
    if (!text.trim()) {
      throw new Error("Cannot synthesize empty text");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(SARVAM_TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": this.apiKey,
        },
        body: JSON.stringify({
          text: text.slice(0, 2500),
          language_code: options?.languageCode || "en-IN",
          model: options?.model || "bulbul:v3",
          speaker: options?.speaker || "anand",
          pace: options?.pace || 1.0,
          output_audio_codec: "wav",
          speech_sample_rate: 24000,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "unknown");
        throw new Error(
          `Sarvam TTS error ${response.status}: ${errorBody}`
        );
      }

      const data = await response.json();
      const audios = data?.audios;

      if (!Array.isArray(audios) || audios.length === 0) {
        throw new Error("Sarvam TTS returned no audio data");
      }

      const audioBase64 = audios[0];
      if (typeof audioBase64 !== "string" || !audioBase64) {
        throw new Error("Sarvam TTS returned invalid audio data");
      }

      return { audioBase64, mimeType: "audio/wav" };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Sarvam TTS request timed out");
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async synthesizeStream(
    text: string,
    options?: TTSSynthesizeOptions
  ): Promise<ReadableStream<Uint8Array>> {
    if (!text.trim()) {
      throw new Error("Cannot synthesize empty text");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(SARVAM_TTS_STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": this.apiKey,
        },
        body: JSON.stringify({
          text: text.slice(0, 2500),
          language_code: options?.languageCode || "en-IN",
          model: options?.model || "bulbul:v3",
          speaker: options?.speaker || "anand",
          pace: options?.pace || 1.0,
          output_audio_codec: options?.audioCodec || "mp3",
          speech_sample_rate: options?.sampleRate || 24000,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Sarvam TTS stream request timed out");
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "unknown");
      throw new Error(`Sarvam TTS stream error ${response.status}: ${errorBody}`);
    }

    if (!response.body) {
      throw new Error("Sarvam TTS stream returned no body");
    }

    return response.body;
  }
}
