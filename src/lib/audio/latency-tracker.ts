/**
 * LatencyTracker — development-only timing markers for voice pipeline performance.
 *
 * Tracks key timestamps from user speech to first audible response.
 * Only active in development mode; no-ops in production.
 *
 * Tracked events:
 *   speech_start → speech_end → final_transcript → llm_start
 *   → llm_first_response → tts_start → first_audio → playback_start
 */

import type { VoiceLatencyMarkers } from "@/types/ai";

const isDev = process.env.NODE_ENV === "development";

export class LatencyTracker {
  private markers: VoiceLatencyMarkers = {};
  private startMs = 0;

  reset(): void {
    this.markers = {};
    this.startMs = performance.now();
  }

  mark(event: keyof VoiceLatencyMarkers): void {
    this.markers[event] = performance.now();
  }

  getMarkers(): VoiceLatencyMarkers {
    return { ...this.markers };
  }

  /**
   * Get elapsed time between two markers (in ms).
   */
  getElapsed(
    from: keyof VoiceLatencyMarkers,
    to: keyof VoiceLatencyMarkers
  ): number | null {
    const fromTime = this.markers[from];
    const toTime = this.markers[to];
    if (fromTime === undefined || toTime === undefined) return null;
    return toTime - fromTime;
  }

  /**
   * Get total latency from speech start to playback start.
   */
  getTotalLatency(): number | null {
    return this.getElapsed("speech_start", "playback_start");
  }

  /**
   * Log a summary of latency markers.
   */
  logSummary(): void {
    if (!isDev) return;

    const sections = [
      ["STT Processing", "speech_end", "final_transcript"] as const,
      ["LLM Generation", "llm_start", "llm_first_response"] as const,
      ["TTS Synthesis", "tts_start", "first_audio"] as const,
      ["Audio Playback", "first_audio", "playback_start"] as const,
      ["Total (speech → playback)", "speech_start", "playback_start"] as const,
    ];

    console.group("[LatencyTracker] Voice Pipeline Timing");
    for (const [label, from, to] of sections) {
      const ms = this.getElapsed(from, to);
      if (ms !== null) {
        console.log(`  ${label}: ${ms.toFixed(1)}ms`);
      }
    }
    console.groupEnd();
  }
}

/**
 * Dev-only latency logger.
 */
export function logLatency(label: string, start: number, end: number): void {
  if (!isDev) return;
  console.log(`[Latency] ${label}: ${(end - start).toFixed(1)}ms`);
}
