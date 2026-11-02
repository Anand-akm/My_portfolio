import { describe, it, expect, vi, beforeEach } from "vitest";
import { LatencyTracker, logLatency } from "@/lib/audio/latency-tracker";

describe("LatencyTracker", () => {
  let tracker: LatencyTracker;

  beforeEach(() => {
    tracker = new LatencyTracker();
  });

  it("should record markers", () => {
    tracker.mark("speech_start");
    tracker.mark("speech_end");

    const markers = tracker.getMarkers();
    expect(markers.speech_start).toBeDefined();
    expect(markers.speech_end).toBeDefined();
  });

  it("should calculate elapsed time between markers", () => {
    tracker.mark("speech_start");
    // Simulate some time passing
    const start = performance.now();
    while (performance.now() - start < 5) {
      // busy wait ~5ms
    }
    tracker.mark("speech_end");

    const elapsed = tracker.getElapsed("speech_start", "speech_end");
    expect(elapsed).not.toBeNull();
    expect(elapsed!).toBeGreaterThanOrEqual(0);
  });

  it("should return null for missing markers", () => {
    const elapsed = tracker.getElapsed("speech_start", "speech_end");
    expect(elapsed).toBeNull();
  });

  it("should reset markers", () => {
    tracker.mark("speech_start");
    tracker.mark("speech_end");
    tracker.reset();

    const markers = tracker.getMarkers();
    // After reset, speech_end should be cleared
    expect(markers.speech_end).toBeUndefined();
    // speech_start should also be undefined after reset (all markers cleared)
    expect(markers.speech_start).toBeUndefined();
  });

  it("should calculate total latency", () => {
    tracker.mark("speech_start");
    tracker.mark("playback_start");

    const total = tracker.getTotalLatency();
    expect(total).not.toBeNull();
    expect(total!).toBeGreaterThanOrEqual(0);
  });

  it("should log summary in development mode", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
    const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});

    tracker.mark("speech_start");
    tracker.mark("speech_end");
    tracker.mark("final_transcript");
    tracker.mark("llm_start");
    tracker.mark("llm_first_response");
    tracker.mark("tts_start");
    tracker.mark("first_audio");
    tracker.mark("playback_start");

    tracker.logSummary();

    // Just verify it doesn't throw
    consoleSpy.mockRestore();
    groupSpy.mockRestore();
    groupEndSpy.mockRestore();
  });

  it("should track all expected marker types", () => {
    const expectedMarkers = [
      "speech_start",
      "speech_end",
      "final_transcript",
      "llm_start",
      "llm_first_response",
      "tts_start",
      "first_audio",
      "playback_start",
    ] as const;

    for (const marker of expectedMarkers) {
      tracker.mark(marker);
    }

    const markers = tracker.getMarkers();
    for (const marker of expectedMarkers) {
      expect(markers[marker]).toBeDefined();
    }
  });
});

describe("logLatency", () => {
  it("should not throw", () => {
    expect(() => logLatency("test", 0, 100)).not.toThrow();
  });
});
