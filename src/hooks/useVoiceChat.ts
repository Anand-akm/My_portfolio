"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useSyncExternalStore,
} from "react";
import type {
  ConversationMessage,
  VoiceChatMessage,
  VoiceLatencyMarkers,
  VoiceResponse,
  VoiceState,
} from "@/types/ai";
import { LatencyTracker } from "@/lib/audio/latency-tracker";

interface UseVoiceChatOptions {
  apiEndpoint?: string;
  onTranscript?: (transcript: string) => void;
  onResponse?: (answer: string) => void;
  onError?: (error: string) => void;
}

interface ApiErrorBody {
  error?: string;
  code?: string;
  retryAfterMs?: number;
  transcript?: string;
}

const REQUEST_TIMEOUT_MS = 60_000;
const MAX_RECORDING_MS = 30_000;
const MIN_AUDIO_BYTES = 1_000;

const subscribeToBrowserSupport = () => () => {};

function getVoiceSupport(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.mediaDevices?.getUserMedia != null &&
    typeof MediaRecorder !== "undefined" &&
    typeof Audio !== "undefined"
  );
}

function getServerVoiceSupport(): boolean {
  return false;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toHistory(messages: VoiceChatMessage[]): ConversationMessage[] {
  return messages.slice(-6).map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function getRecorderMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  return (
    candidates.find((type) => MediaRecorder.isTypeSupported(type)) || ""
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read recorded audio"));
        return;
      }
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(new Error("Could not read recorded audio"));
    reader.readAsDataURL(blob);
  });
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function friendlyErrorMessage(
  status: number,
  body: ApiErrorBody | null
): string {
  if (status === 429) {
    const retryAfter = body?.retryAfterMs
      ? Math.max(1, Math.ceil(body.retryAfterMs / 1000))
      : null;
    return retryAfter
      ? `Too many requests. Please try again in ${retryAfter} seconds.`
      : "Too many requests. Please wait a moment before trying again.";
  }

  if (status === 422) {
    return body?.error || "No speech detected. Please try speaking again.";
  }

  if (status === 503) {
    return "AI Anand is not configured right now. Please use text chat or the contact section.";
  }

  return (
    body?.error ||
    "Voice processing failed. Please check your connection and try again."
  );
}

/**
 * Voice-first conversation hook.
 *
 * The reliable path is deliberately batch-based:
 *   microphone → bounded MediaRecorder blob → server STT → grounded answer
 *   → complete WAV response → single audio element
 *
 * This avoids the unsafe binary/text mixing that corrupted streamed audio.
 * Every request carries bounded history for follow-up questions.
 */
export function useVoiceChat(options?: UseVoiceChatOptions) {
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [retryAfterMs, setRetryAfterMs] = useState<number | null>(null);
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [latency, setLatency] = useState<VoiceLatencyMarkers | undefined>();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latencyTrackerRef = useRef(new LatencyTracker());

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);
  const stateRef = useRef<VoiceState>("idle");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const isSupported = useSyncExternalStore(
    subscribeToBrowserSupport,
    getVoiceSupport,
    getServerVoiceSupport
  );

  const clearAutoStopTimer = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const releaseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
  }, []);

  const cancelSpeaking = useCallback(() => {
    releaseAudio();
    if (stateRef.current === "speaking" || stateRef.current === "streaming-audio") {
      setState("idle");
    }
  }, [releaseAudio]);

  const cleanup = useCallback(() => {
    clearAutoStopTimer();
    stopStream();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      } catch {
        // Already stopped
      }
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    abortRef.current?.abort();
    abortRef.current = null;
    requestIdRef.current += 1;

    releaseAudio();
  }, [clearAutoStopTimer, stopStream, releaseAudio]);

  useEffect(() => cleanup, [cleanup]);

  const playAudio = useCallback(
    async (
      base64Audio: string,
      mimeType: string,
      currentRequestId: number
    ): Promise<boolean> => {
      try {
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        releaseAudio();
        const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
        const url = URL.createObjectURL(blob);
        audioBlobUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;
        setState("speaking");
        latencyTrackerRef.current.mark("playback_start");

        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            if (currentRequestId === requestIdRef.current) setState("idle");
            releaseAudio();
            resolve();
          };
          audio.onerror = () => {
            if (currentRequestId === requestIdRef.current) {
              setError("Audio playback failed. The answer is shown as text.");
              setState("idle");
            }
            releaseAudio();
            reject(new Error("Audio playback failed"));
          };
          audio.play().catch(reject);
        });

        return true;
      } catch {
        if (currentRequestId === requestIdRef.current) {
          setError("Audio playback failed. The answer is shown as text.");
          setState("idle");
        }
        releaseAudio();
        return false;
      }
    },
    [releaseAudio]
  );

  const sendAudioToServer = useCallback(
    async (audioBlob: Blob, currentRequestId: number) => {
      const controller = new AbortController();
      abortRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        setState("transcribing");
        latencyTrackerRef.current.mark("speech_end");

        const base64 = await blobToBase64(audioBlob);
        if (!base64) throw new Error("Recorded audio was empty");

        setState("thinking");
        latencyTrackerRef.current.mark("llm_start");

        const response = await fetch("/api/ai/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio: base64,
            mimeType: audioBlob.type || "audio/webm",
            history: toHistory(messages),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (currentRequestId !== requestIdRef.current) return;

        if (!response.ok) {
          const body = await readJsonResponse<ApiErrorBody>(response);
          if (body?.retryAfterMs) setRetryAfterMs(body.retryAfterMs);
          throw new Error(friendlyErrorMessage(response.status, body));
        }

        const data = await readJsonResponse<VoiceResponse>(response);
        if (!data || typeof data.answer !== "string") {
          throw new Error("Voice service returned an invalid response");
        }

        const userMessage: VoiceChatMessage = {
          id: createId("voice-user"),
          role: "user",
          content: data.transcript,
          transcript: data.transcript,
          timestamp: Date.now(),
        };
        const assistantMessage: VoiceChatMessage = {
          id: createId("voice-assistant"),
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          grounded: data.grounded,
          timestamp: Date.now(),
        };

        setTranscript(data.transcript);
        setPartialTranscript("");
        setMessages((previous) => [...previous, userMessage, assistantMessage]);
        options?.onTranscript?.(data.transcript);
        options?.onResponse?.(data.answer);
        setLatency(latencyTrackerRef.current.getMarkers());

        if (data.audioBase64 && data.audioMimeType) {
          const played = await playAudio(
            data.audioBase64,
            data.audioMimeType,
            currentRequestId
          );
          if (!played && currentRequestId === requestIdRef.current) {
            setState("idle");
          }
        } else {
          setError("Voice audio is unavailable. The answer is shown as text.");
          setState("idle");
        }
      } catch (err) {
        clearTimeout(timeout);
        if (err instanceof DOMException && err.name === "AbortError") {
          if (currentRequestId === requestIdRef.current) {
            setError("Voice request timed out. Please try again or use text chat.");
            setState("error");
          }
          return;
        }
        if (currentRequestId !== requestIdRef.current) return;

        const message =
          err instanceof Error ? err.message : "Voice processing failed";
        setError(message);
        setState("error");
        options?.onError?.(message);
      } finally {
        clearTimeout(timeout);
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [messages, options, playAudio]
  );

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError("Voice is not supported in this browser. Please use text chat.");
      setState("error");
      return;
    }

    if (
      stateRef.current === "requesting-permission" ||
      stateRef.current === "listening" ||
      stateRef.current === "user-speaking" ||
      stateRef.current === "transcribing" ||
      stateRef.current === "thinking"
    ) {
      return;
    }

    cancelSpeaking();
    abortRef.current?.abort();
    abortRef.current = null;
    const currentRequestId = ++requestIdRef.current;

    setError(null);
    setRetryAfterMs(null);
    setTranscript("");
    setPartialTranscript("");
    latencyTrackerRef.current.reset();
    latencyTrackerRef.current.mark("speech_start");
    stateRef.current = "requesting-permission";
    setState("requesting-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (currentRequestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const mimeType = getRecorderMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setState("listening");

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setError("The microphone stopped unexpectedly. Please try again.");
        setState("error");
        cleanup();
      };

      recorder.onstop = () => {
        clearAutoStopTimer();
        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        stopStream();

        if (chunks.length === 0) {
          setState("idle");
          return;
        }

        const audioBlob = new Blob(chunks, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });

        if (audioBlob.size < MIN_AUDIO_BYTES) {
          setError("No speech was captured. Please try speaking a little longer.");
          setState("error");
          return;
        }

        const currentRequestId = ++requestIdRef.current;
        void sendAudioToServer(audioBlob, currentRequestId);
      };

      recorder.start(500);
      autoStopTimerRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, MAX_RECORDING_MS);
    } catch (err) {
      cleanup();
      let errorMessage = "Failed to access microphone.";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Microphone permission denied. Enable microphone access or use text chat.";
        } else if (err.name === "NotFoundError") {
          errorMessage =
            "No microphone was found. Connect a microphone or use text chat.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "The microphone is in use by another application.";
        }
      }
      setError(errorMessage);
      setState("error");
      options?.onError?.(errorMessage);
    }
  }, [
    isSupported,
    cancelSpeaking,
    cleanup,
    clearAutoStopTimer,
    stopStream,
    sendAudioToServer,
    options,
  ]);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      setState("transcribing");
      recorder.stop();
    }
  }, []);

  const sendTextMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (
        stateRef.current === "thinking" ||
        stateRef.current === "transcribing"
      ) {
        return;
      }

      cancelSpeaking();
      abortRef.current?.abort();

      const currentRequestId = ++requestIdRef.current;
      const controller = new AbortController();
      abortRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      setError(null);
      setRetryAfterMs(null);
      stateRef.current = "thinking";
      setState("thinking");

      const userMessage: VoiceChatMessage = {
        id: createId("text-user"),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((previous) => [...previous, userMessage]);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed.slice(0, 1000),
            history: toHistory(messages),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (currentRequestId !== requestIdRef.current) return;

        const data = await readJsonResponse<{
          answer?: string;
          sources?: VoiceChatMessage["sources"];
          grounded?: boolean;
          error?: string;
          retryAfterMs?: number;
        }>(response);

        if (!response.ok) {
          if (data?.retryAfterMs) setRetryAfterMs(data.retryAfterMs);
          throw new Error(
            friendlyErrorMessage(response.status, data || null)
          );
        }

        if (!data || typeof data.answer !== "string") {
          throw new Error("AI service returned an invalid response");
        }

        setMessages((previous) => [
          ...previous,
          {
            id: createId("text-assistant"),
            role: "assistant",
            content: data.answer!,
            sources: data.sources,
            grounded: data.grounded,
            timestamp: Date.now(),
          },
        ]);
        options?.onResponse?.(data.answer);
        setState("idle");
      } catch (err) {
        clearTimeout(timeout);
        if (err instanceof DOMException && err.name === "AbortError") {
          if (currentRequestId === requestIdRef.current) {
            setError("Text request timed out. Please try again.");
            setState("error");
          }
          return;
        }
        if (currentRequestId !== requestIdRef.current) return;

        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        setState("error");
        options?.onError?.(message);
      } finally {
        clearTimeout(timeout);
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [messages, options, cancelSpeaking]
  );

  const clearMessages = useCallback(() => {
    requestIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    cancelSpeaking();
    setMessages([]);
    setError(null);
    setRetryAfterMs(null);
    setTranscript("");
    setPartialTranscript("");
    setLatency(undefined);
    setState("idle");
  }, [cancelSpeaking]);

  const endConversation = useCallback(() => {
    cleanup();
    setError(null);
    setRetryAfterMs(null);
    setTranscript("");
    setPartialTranscript("");
    setState("idle");
  }, [cleanup]);

  return {
    state,
    transcript,
    partialTranscript,
    error,
    retryAfterMs,
    isSupported,
    startListening,
    stopListening,
    cancelSpeaking,
    sendTextMessage,
    messages,
    clearMessages,
    endConversation,
    latency,
  };
}
