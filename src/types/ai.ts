export type KnowledgeCategory =
  | "profile"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "education"
  | "achievements";

export type ConfidenceLevel = "demonstrated" | "partial" | "self-described";

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  topic: string;
  content: string;
  evidence: string;
  confidence: ConfidenceLevel;
  keywords: string[];
  aliases: string[];
  relatedIds: string[];
}

export interface KnowledgeBase {
  version: string;
  lastUpdated: string;
  entries: KnowledgeEntry[];
}

export type ConversationRole = "user" | "assistant";

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ConversationMessage[];
}

export interface VoiceChatRequest {
  audio: string;
  mimeType: string;
  history?: ConversationMessage[];
}

export interface ChatResponse {
  content: string;
  sources?: string[];
}

// ─── Voice State Machine ────────────────────────────────────────

export type VoiceState =
  | "idle"
  | "requesting-permission"
  | "listening"
  | "user-speaking"
  | "transcribing"
  | "thinking"
  | "streaming-audio"
  | "speaking"
  | "error";

/** Latency timing markers for performance measurement */
export interface VoiceLatencyMarkers {
  speech_start?: number;
  speech_end?: number;
  final_transcript?: number;
  llm_start?: number;
  llm_first_response?: number;
  tts_start?: number;
  first_audio?: number;
  playback_start?: number;
}

export interface VoiceChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  transcript?: string;
  sources?: Array<{ id: string; topic: string; evidence: string }>;
  grounded?: boolean;
  timestamp: number;
}

// ─── Server-Side STT Provider ───────────────────────────────────

export interface STTTranscribeOptions {
  languageCode?: string;
  mode?: "transcribe" | "translate" | "verbatim" | "translit" | "codemix";
}

export interface STTTranscribeResult {
  transcript: string;
  languageCode: string | null;
  languageProbability?: number | null;
}

export interface STTProvider {
  name: string;
  /**
   * Transcribe audio buffer to text.
   * @param audioBuffer - The raw audio bytes
   * @param mimeType - The MIME type of the audio (e.g. "audio/webm")
   * @param options - Optional transcription options
   */
  transcribe(
    audioBuffer: ArrayBuffer,
    mimeType: string,
    options?: STTTranscribeOptions
  ): Promise<STTTranscribeResult>;
}

// ─── Server-Side TTS Provider ───────────────────────────────────

export interface TTSSynthesizeOptions {
  languageCode?: string;
  speaker?: string;
  model?: string;
  pace?: number;
  /** Audio codec for streaming: "mp3" (default for stream) or "wav" */
  audioCodec?: "mp3" | "wav";
  /** Sample rate in Hz (default: 24000) */
  sampleRate?: number;
}

export interface TTSSynthesizeResult {
  audioBase64: string;
  mimeType: string;
}

export interface TTSProvider {
  name: string;
  /**
   * Synthesize text to speech audio.
   * @param text - The text to synthesize
   * @param options - Optional synthesis options
   */
  synthesize(
    text: string,
    options?: TTSSynthesizeOptions
  ): Promise<TTSSynthesizeResult>;

  /**
   * Stream TTS audio as binary chunks.
   * @param text - The text to synthesize
   * @param options - Optional synthesis options
   * @returns ReadableStream of audio chunks
   */
  synthesizeStream?(
    text: string,
    options?: TTSSynthesizeOptions
  ): Promise<ReadableStream<Uint8Array>>;
}

// ─── Voice API Types ────────────────────────────────────────────

export interface VoiceRequest {
  /** Base64-encoded audio data from the browser */
  audio: string;
  /** MIME type of the audio (e.g. "audio/webm;codecs=opus") */
  mimeType: string;
}

export interface VoiceResponse {
  /** The user's spoken words transcribed to text */
  transcript: string;
  /** Detected language code */
  languageCode: string | null;
  /** The AI's grounded text response */
  answer: string;
  /** Base64-encoded audio of the AI's response (batch mode) */
  audioBase64: string;
  /** MIME type of the audio response */
  audioMimeType: string;
  /** Whether this response uses streaming audio */
  streaming?: boolean;
  /** Knowledge sources used */
  sources: Array<{ id: string; topic: string; evidence: string }>;
  /** Confidence level */
  confidence: string;
  /** Whether response was grounded in knowledge */
  grounded: boolean;
  /** Error if any */
  error?: string;
}

// ─── Client-Side Voice Types ────────────────────────────────────

export interface UseVoiceChatOptions {
  apiEndpoint?: string;
  onTranscript?: (transcript: string) => void;
  onResponse?: (answer: string) => void;
  onError?: (error: string) => void;
}

export interface UseVoiceChatReturn {
  state: VoiceState;
  transcript: string;
  partialTranscript: string;
  error: string | null;
  retryAfterMs: number | null;
  isSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  cancelSpeaking: () => void;
  sendTextMessage: (text: string) => Promise<void>;
  messages: VoiceChatMessage[];
  clearMessages: () => void;
  endConversation: () => void;
  latency?: VoiceLatencyMarkers;
}

// ─── LLM Provider ──────────────────────────────────────────────

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMGenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMGenerateResult {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  name: string;
  generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMGenerateResult>;
}

// ─── Chat Service ──────────────────────────────────────────────

export interface ChatServiceConfig {
  llmProvider: LLMProvider;
  rateLimitKey?: string;
}

export interface ChatServiceOptions {
  llmProvider: LLMProvider;
  rateLimitKey?: string;
  history?: ConversationMessage[];
  maxContextEntries?: number;
  maxHistoryMessages?: number;
  skipRateLimit?: boolean;
}

export interface ChatServiceResult {
  answer: string;
  sources: Array<{ id: string; topic: string; evidence: string }>;
  confidence: string;
  grounded: boolean;
  error?: string;
  retryAfterMs?: number;
}
