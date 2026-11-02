# Voice-First AI Anand Implementation Plan

**Date:** 2026-10-27  
**Updated:** 2026-10-28  
**Decision:** Replace the avatar-centric experience with a voice-first English recruiter assistant named **AI Anand**. Normal portfolio remains intact; `/ai` is the dedicated voice experience.

## Implementation Status — 2026-10-28

### Complete

- Grounding, injection/private-topic blocking, provider-error handling, history, and chat/voice rate limits are implemented.
- Batch voice pipeline is implemented with Sarvam Saaras v3 STT, grounded chat, and Bulbul v3 WAV TTS.
- `AIAnand` voice-first UI is implemented with waveform, states, transcript, sources, text fallback, and retry countdown.
- Hero and navbar CTAs link to `/ai`; `/ai` hides the normal portfolio chrome.
- Avatar components, Three.js/R3F dependencies, and realtime/streaming voice scaffolding were removed.
- `ai-knowledge.ts` contains 54 verified entries at version `2.1.0`.
- Live chat and voice API round-trips passed; `/ai` and HTTP error contracts were checked.
- Headless Edge at 390px confirmed no horizontal overflow and a successful text-fallback answer.
- Headless Edge fake-device QA completed a full browser voice turn: synthetic WAV input, recording, transcript, grounded answer, TTS playback, and return to ready state.
- Sarvam STT uploads normalize codec-suffixed MIME types; voice-hook request races and late streams are guarded.
- Every suggested question is regression-tested against intended knowledge IDs; trailing punctuation is normalized.
- Final green runs after all source edits: typecheck pass, lint pass with warnings, 199 tests pass, production build pass.

### Remaining

- Verify the real microphone permission prompt and physical-device audio quality.
- Verify stop-speaking/interruption, end-conversation, keyboard-only navigation, screen-reader behavior, and the Chrome/Safari matrix.
- Add browser/E2E, accessibility, and performance coverage; voice-route failure tests now cover malformed input, no speech, STT failure, TTS fallback, and rate limits.
- Keep unrelated site blockers documented separately; they are not part of the voice-first change.

## 1. Product Scope

- No 3D avatar, GLB, lip-sync, digital human, facial animation, or avatar state model.
- Use a lightweight waveform/orb and explicit voice states as the visual identity.
- Two modes: the normal portfolio and the voice-first `/ai` experience.
- Prominent **Talk to Anand AI** actions in the hero and navigation.
- Microphone permission is requested only after the visitor starts a conversation.
- Voice conversation includes transcript, suggested questions, follow-ups, interruption, stop speaking, end conversation, and a text fallback.
- English answers and English TTS. Unsupported answers use the verified fallback instead of guessing.
- Reuse the existing Sarvam provider. Do not add a provider without a documented cost/benefit and do not add an unapproved browser Web Speech fallback.

## 2. Architecture Decision

- Use the existing batch voice endpoint as the reliable baseline: record a bounded utterance, transcribe server-side, run the same grounded chat pipeline, synthesize WAV server-side, and play one complete audio response.
- Remove the client's broken text-decoder path over binary audio. Do not ship the current realtime/streaming path unless it can be made binary-safe and verified; unused realtime scaffolding will be isolated or removed.
- Add bounded conversation history to text and voice requests so follow-up questions work.
- Keep API keys server-side and rate-limit expensive STT, LLM, and TTS work before it starts.
- Remove avatar code and `three`/`@react-three` dependencies only after a repository-wide reference check.

## 3. Implementation Order

### Step 1 — Grounding, provider errors, security, rate limits

- Require a real lexical/alias/topic match before retrieval returns evidence; remove the confidence bonus and zero-score acceptance.
- Block unsupported personal topics and prompt-injection attempts before provider calls.
- Return no provider call for no-match queries, with `grounded: false` and no unrelated sources.
- Put user text in the user message only; keep system instructions and verified context separate.
- Pass bounded, sanitized history as prior `user`/`assistant` messages.
- Return explicit provider errors; do not report a failed or empty provider result as a successful answer.
- Return HTTP 429 with `Retry-After` for chat, voice, and contact budgets.
- Add regression tests for unrelated queries, fake employers/certifications, injection, provider failure, history, and rate limits.

### Step 2 — Voice audio and STT/TTS reliability

- Use binary-safe audio transport and complete WAV playback; remove `TextDecoder`/`TextEncoder` from the audio path.
- Add STT/TTS timeouts and clear error states. Retries were deliberately omitted; failures return explicit API errors and keep text fallback available.
- Clear recorder timers/listeners, stop tracks, and prevent duplicate/overlapping requests and audio.
- Support 30-second utterance bounds, empty/silence handling, permission failures, and network errors.
- Preserve the recognized transcript before sending it through the AI pipeline.

### Step 3 — Voice-first UI

- Build a mobile-safe `/ai` screen with a prominent **Start Conversation** action and a no-avatar waveform/orb.
- Show Listening, Transcribing, Thinking, Speaking, and Error states; expose transcript, stop speaking, interrupt, end conversation, and mute/stop mic.
- Add suggested recruiter questions and an always-available text fallback.
- Add `aria-live`, keyboard support, reduced-motion handling, and accessible labels.

### Step 4 — Verified knowledge

- Keep existing verified portfolio data as the source of truth.
- Expand granular knowledge entries where the source data supports them; do not invent metrics, clients, dates, certifications, or responsibilities.
- Remove duplicate/conflicting entries and validate related IDs and source consistency.

### Step 5 — Avatar removal and portfolio integration

- Remove unused avatar components, assets, and dependencies after reference checks.
- Add **Talk to Anand AI** to the hero and desktop/mobile navigation.
- Update `/ai` metadata and copy.

### Step 6 — Documentation and verification

- Update the PRD and audit with the no-avatar decision and current status.
- Run: `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build`.
- Start the production server and verify `/`, `/ai`, the AI chat API, the voice contract, and no-match behavior.
- Synthetic-microphone browser verification passed in headless Edge; physical-device and assistive-technology verification remain required before claiming full voice completion.

## 4. Acceptance Gates

- Unrelated and unsupported questions return no sources, `grounded: false`, and make zero LLM calls.
- Prompt-injection and fabricated-claim responses cannot reach users as normal answers.
- A follow-up question includes prior conversation context without unbounded input.
- Rate-limited chat/voice requests return 429 with `Retry-After` and do no provider work.
- Voice playback is binary-safe and clears without overlapping audio.
- `/ai` works by keyboard and text without a microphone; voice failures are explicit and recoverable.
- No avatar/Three.js code remains referenced; no unused avatar dependency remains.
- Typecheck, lint, tests, and production build pass.
