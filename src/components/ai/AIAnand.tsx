"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Keyboard,
  Loader2,
  Mic,
  RotateCcw,
  Send,
  Square,
  VolumeX,
  X,
} from "lucide-react";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { SuggestedQuestions } from "./SuggestedQuestions";
import type { VoiceChatMessage, VoiceState } from "@/types/ai";

const STATE_LABELS: Record<VoiceState, string> = {
  idle: "Ready when you are",
  "requesting-permission": "Requesting microphone access...",
  listening: "Listening...",
  "user-speaking": "Listening...",
  transcribing: "Transcribing your question...",
  thinking: "Checking Anand's verified experience...",
  "streaming-audio": "Preparing audio...",
  speaking: "Speaking...",
  error: "Something went wrong",
};

const WAVE_HEIGHTS: Record<VoiceState, number[]> = {
  idle: [8, 14, 20, 14, 8],
  "requesting-permission": [10, 18, 26, 18, 10],
  listening: [20, 38, 54, 38, 20],
  "user-speaking": [20, 38, 54, 38, 20],
  transcribing: [12, 22, 32, 22, 12],
  thinking: [14, 26, 40, 26, 14],
  "streaming-audio": [18, 34, 48, 34, 18],
  speaking: [24, 44, 62, 44, 24],
  error: [8, 8, 8, 8, 8],
};

function VoiceWaveform({ state }: { state: VoiceState }) {
  const heights = WAVE_HEIGHTS[state];
  const isActive =
    state === "listening" ||
    state === "user-speaking" ||
    state === "speaking" ||
    state === "thinking" ||
    state === "transcribing";

  const color =
    state === "speaking"
      ? "bg-emerald-400"
      : state === "listening" || state === "user-speaking"
        ? "bg-sky-400"
        : state === "error"
          ? "bg-red-400"
          : "bg-primary";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
      <AnimatePresence>
        {(state === "listening" || state === "user-speaking") && (
          <>
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-sky-400/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-sky-400/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 2], opacity: [0.35, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>
      <div className="relative flex h-24 w-24 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur">
        {heights.map((height, index) => (
          <motion.span
            key={index}
            className={`w-1.5 rounded-full ${color}`}
            animate={
              isActive
                ? { height: [Math.max(6, height * 0.4), height, Math.max(6, height * 0.45)] }
                : { height }
            }
            transition={
              isActive
                ? {
                    duration: 0.75 + index * 0.08,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: VoiceChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl border px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "border-sky-400/20 bg-sky-400/10 text-white/85"
            : "border-white/[0.06] bg-white/[0.035] text-white/80"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.sources && message.sources.length > 0 && (
          <details className="mt-2 border-t border-white/[0.06] pt-2">
            <summary className="cursor-pointer text-[10px] uppercase tracking-wider text-white/35">
              Verified sources
            </summary>
            <ul className="mt-1.5 space-y-1">
              {message.sources.map((source) => (
                <li key={source.id} className="text-[10px] text-white/45">
                  {source.topic}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </motion.div>
  );
}

export function AIAnand() {
  const {
    state,
    transcript,
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
  } = useVoiceChat();

  const [showTextInput, setShowTextInput] = useState(false);
  const [input, setInput] = useState("");
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const isListening = state === "listening" || state === "user-speaking";
  const isSpeaking = state === "speaking" || state === "streaming-audio";
  const isBusy =
    state === "requesting-permission" ||
    state === "transcribing" ||
    state === "thinking";
  const hasConversation = messages.length > 0;
  const textMode = showTextInput || !isSupported;

  useEffect(() => {
    if (!retryAfterMs) return;

    const retryAt = Date.now() + retryAfterMs;
    const tick = () => {
      setCountdown(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)));
    };

    const initialTick = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(initialTick);
      clearInterval(interval);
    };
  }, [retryAfterMs]);

  const visibleCountdown = retryAfterMs ? countdown : 0;

  useEffect(() => {
    if (messages.length === 0 && !isBusy) return;
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isBusy]);

  useEffect(() => {
    if (showTextInput) inputRef.current?.focus();
  }, [showTextInput]);

  const handlePrimaryAction = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    if (isSpeaking) {
      cancelSpeaking();
    }
    void startListening();
  }, [isListening, isSpeaking, stopListening, cancelSpeaking, startListening]);

  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      const value = input.trim();
      if (!value || isBusy) return;
      setInput("");
      void sendTextMessage(value);
    },
    [input, isBusy, sendTextMessage]
  );

  const handleSuggestion = useCallback(
    (question: string) => {
      if (showTextInput || !isSupported) {
        setInput(question);
        inputRef.current?.focus();
        return;
      }
      void sendTextMessage(question);
    },
    [sendTextMessage, showTextInput, isSupported]
  );

  const handleEndConversation = useCallback(() => {
    endConversation();
    setInput("");
    setShowTextInput(false);
  }, [endConversation]);

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
            aria-label="Back to Anand's portfolio"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">AI Anand</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/45">
              Voice recruiter assistant
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTextInput((current) => !current)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white/80"
            aria-pressed={showTextInput}
          >
            {showTextInput ? <X className="h-3.5 w-3.5" /> : <Keyboard className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{showTextInput ? "Hide text" : "Type instead"}</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 sm:px-6">
        <section className="pt-8 text-center sm:pt-12">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary/80">
            AI Anand
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Talk to Anand AI
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            Ask about Anand&apos;s experience, projects, skills, certifications,
            or fit for an AI engineering role. Answers are limited to his
            verified portfolio information.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20 sm:mt-8">
          <div className="flex flex-col items-center border-b border-white/[0.06] px-4 py-7 sm:py-9">
            <VoiceWaveform state={state} />

            <p
              className="mt-2 min-h-5 text-sm text-white/55"
              aria-live="polite"
              aria-atomic="true"
            >
              {STATE_LABELS[state]}
            </p>

            {!isSupported && (
              <p className="mt-2 max-w-md text-center text-xs text-amber-300/80">
                Voice is unavailable in this browser. You can still ask every
                question using the text fallback.
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {!textMode && (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={isBusy}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                    isListening
                      ? "bg-sky-500 text-white hover:bg-sky-400"
                      : isSpeaking
                        ? "bg-emerald-500 text-white hover:bg-emerald-400"
                        : "bg-primary text-white hover:bg-primary/90"
                  }`}
                  aria-label={
                    isListening
                      ? "Stop listening"
                      : isSpeaking
                        ? "Interrupt and ask another question"
                        : hasConversation
                          ? "Ask another question"
                          : "Start conversation"
                  }
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isListening ? (
                    <Square className="h-4 w-4" />
                  ) : isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                  {isBusy
                    ? "Working..."
                    : isListening
                      ? "Stop listening"
                      : isSpeaking
                        ? "Interrupt"
                        : hasConversation
                          ? "Ask another question"
                          : "Start Conversation"}
                </button>
              )}

              {isSpeaking && (
                <button
                  type="button"
                  onClick={cancelSpeaking}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <VolumeX className="h-3.5 w-3.5" />
                  Stop speaking
                </button>
              )}

              {hasConversation && (
                <button
                  type="button"
                  onClick={handleEndConversation}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/75"
                >
                  End conversation
                </button>
              )}
            </div>

            {transcript && state === "thinking" && (
              <p className="mt-3 max-w-md text-center text-xs italic text-white/40">
                You said: &ldquo;{transcript}&rdquo;
              </p>
            )}

            <p className="mt-4 max-w-md text-center text-[10px] leading-relaxed text-white/30">
              The microphone starts only when you click. Audio is processed by
              Sarvam AI to transcribe your question and speak the answer.
            </p>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mb-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-red-200/85">{error}</p>
                    {visibleCountdown > 0 && (
                      <p className="mt-1 text-[10px] text-red-200/55">
                        Try again in {visibleCountdown}s.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (textMode) {
                          inputRef.current?.focus();
                        } else {
                          void startListening();
                        }
                      }}
                      disabled={visibleCountdown > 0}
                      className="mt-2 text-xs text-primary underline underline-offset-2 disabled:opacity-40"
                    >
                      Try again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              ref={logRef}
              className={`space-y-3 ${
                messages.length === 0 && !isBusy
                  ? ""
                  : "max-h-[360px] overflow-y-auto"
              }`}
              role="log"
              aria-live="polite"
              aria-label="Conversation transcript"
            >
              {messages.length === 0 && !isBusy ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-5 text-center">
                  <p className="text-sm text-white/55">
                    Try a recruiter-focused question
                  </p>
                  <div className="mt-3">
                    <SuggestedQuestions
                      onSelect={handleSuggestion}
                      disabled={isBusy}
                    />
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}

              {isBusy && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {STATE_LABELS[state]}
                </div>
              )}
            </div>

            {messages.length > 0 && !isBusy && (
              <div className="mt-4">
                <SuggestedQuestions
                  onSelect={handleSuggestion}
                  disabled={isBusy}
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <button
                type="button"
                onClick={() => setShowTextInput((current) => !current)}
                className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
              >
                <Keyboard className="h-3.5 w-3.5" />
                {showTextInput ? "Hide text input" : "Prefer typing?"}
              </button>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence initial={false}>
              {(showTextInput || !isSupported) && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-3 overflow-hidden"
                >
                  <div className="flex items-end gap-2">
                    <label htmlFor="ai-anand-text-input" className="sr-only">
                      Type your question for AI Anand
                    </label>
                    <textarea
                      id="ai-anand-text-input"
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleSubmit();
                        }
                      }}
                      rows={2}
                      maxLength={1000}
                      disabled={isBusy}
                      placeholder="Type a question about Anand's experience, projects, or skills..."
                      className="min-h-12 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isBusy}
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/15 text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Send question"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>

        <p className="mt-5 text-center text-[10px] leading-relaxed text-white/25">
          AI Anand answers from a verified knowledge base. It does not invent
          employers, certifications, metrics, or project details. For anything
          not covered, contact Anand directly.
        </p>
      </div>
    </div>
  );
}

