# Portfolio Audit

**Audit date:** 2026-10-27  
**Project:** `E:\Myrealportfolio\portfolio-am`  
**PRD:** `PORTFOLIO_PRD.md` v2.0  
**Local target:** `http://localhost:3000`  
**Audit type:** Read-only implementation audit. No source, configuration, asset, or behavior changes were made.

## Current Status Addendum — 2026-10-28

This section records the follow-up implementation and verification. The original audit below is retained as the pre-fix baseline.

### Resolved or superseded

- **F-01 / F-02 / F-03 / F-04:** Grounding now requires real lexical/alias/topic evidence, rate limits return `429` with `Retry-After`, injection/private requests are blocked before provider calls, chat accepts history, and the input limit is aligned at 1,000 characters.
- **F-07:** The unsafe realtime/streaming voice path was removed. Voice now uses a batch pipeline with complete WAV playback.
- **F-08:** The avatar was removed entirely, including components, Three.js/R3F dependencies, model assets, and avatar state code. `/ai` is now voice-first with an abstract waveform.
- **F-09:** Typecheck, lint, tests, and production build now pass. ESLint uses a Next 16 flat config.
- **F-11:** Hero CTAs were repaired: primary **Talk to Anand AI** → `/ai`, secondary **View Projects** → `#projects`, and the dead Resume CTA was removed. Navbar now exposes AI entry points.

### Still open

- **F-05:** `/api/contact` remains 404 with a simulated client-side success.
- **F-06:** Core homepage sections still use `ssr: false` and are absent from initial HTML.
- **F-10:** The voice route now has real tests for malformed requests, no speech, STT failure, TTS fallback, and 429 behavior. Automated browser/E2E, accessibility, and performance suites remain absent.
- **F-12:** `/og-image.png`, `/resume.pdf`, and `/sitemap.xml` remain missing. The avatar model is no longer required.
- Headless Edge verification passed for a full synthetic-microphone voice turn, TTS playback, and true-390px layout. Real hardware permission prompts, stop-speaking/interruption, end-conversation, keyboard-only navigation, cross-browser coverage, and screen-reader behavior remain unverified.
- Rate limiting remains in-memory and single-instance only.
- `npm install` reports 12 vulnerabilities (4 moderate, 7 high, 1 critical).

### Current verification evidence

- `npm run typecheck`: pass.
- `npm run lint`: pass with warnings.
- `npm test -- --run`: 12 files, 199 tests passed.
- `npm run build`: Next.js 16.2.6 production build passed.
- Live chat grounding, no-match, private-topic, injection, HTTP status, and `/ai` checks passed.
- Live `/api/ai/voice` round-trip passed: synthesized WAV → transcript → grounded answer with 6 sources → complete `audio/wav` response.
- Headless Edge fake-device browser round-trip passed: generated WAV → Start Conversation/record/stop → transcript → grounded answer → TTS playback (`plays: 1`) → ready state, with no UI error.
- Removed `/api/ai/voice/stream` returns 404.
- Headless Edge at a true 390px viewport (`window.innerWidth = 390`): no horizontal overflow on `/ai`; text fallback rendered a grounded profile answer for “Tell me about Anand.”
- Retrieval now normalizes trailing sentence punctuation, and every suggested question is tested against its intended knowledge IDs.
- Sarvam LLM empty responses receive one bounded retry; the live backend-skills suggestion subsequently answered successfully.
- Voice MIME normalization strips codec parameters after Sarvam rejected `audio/webm;codecs=opus`; a regression test covers the upload contract.
- The earlier runs predating final UI edits were rerun; current typecheck, lint, tests, and build results are listed above.

## 1. Executive Assessment

The portfolio is a substantial visual prototype with structured content, reusable UI primitives, a green unit-test suite, and a text-AI pipeline that did not produce a successful live answer during this audit. It is not yet production-ready against the PRD.

The most serious problems are:

1. The retrieval pipeline marks nearly every query as grounded because demonstrated knowledge entries always receive a positive score.
2. The rate limiter violates the API contract by returning HTTP 200 for rate-limited requests and omitting `Retry-After`.
3. User input is inserted into the system prompt, and prompt-injection detections do not block the request.
4. The chat API is not streamed, ignores conversation history, and uses a different response shape and input limit than the PRD.
5. The contact feature is a simulated client-side delay with no backend.
6. Most homepage sections are excluded from server-rendered HTML, so core portfolio content is not crawlable in the initial response.
7. The voice stream client corrupts binary audio, and the realtime voice flow is incomplete.
8. The avatar is not rendered and its asset is missing.
9. Typecheck, lint, and the production build are broken; the build compiles application code but fails during TypeScript validation.
10. The 225-test suite passes while missing the highest-impact failures.

### Status legend

| Status | Meaning |
| --- | --- |
| `DONE AND VERIFIED` | Implemented and supported by executed verification evidence. |
| `IMPLEMENTED BUT UNVERIFIED` | Code or assets exist, but the required behavior was not executed or visually checked. |
| `PARTIALLY IMPLEMENTED` | Some required behavior exists, but material requirements are missing or contradicted by evidence. |
| `NOT IMPLEMENTED` | The required behavior or asset is absent. |
| `BLOCKED` | Verification or completion cannot proceed without a dependency, decision, credential, or asset. |

No requirement is marked `DONE AND VERIFIED` solely from comments, filenames, or implementation-report claims.

## 2. Critical Findings

| ID | Severity | Finding | Evidence | Impact |
| --- | --- | --- | --- | --- |
| F-01 | P0 | Irrelevant queries are treated as grounded. | `src/lib/ai/knowledge-retriever.ts:115-129` adds a confidence bonus to every `demonstrated` entry; `minScore` defaults to 0 and filtering uses `s.score > minScore`. At least six demonstrated entries always match. `src/lib/ai/chat-service.ts:70` treats any match as grounded. A live `POST /api/ai/chat` for `What is the weather in Tokyo?` returned HTTP 200, the no-information answer, `grounded: true`, `confidence: "demonstrated"`, and six unrelated certification/education sources. A prior nonsense query, `zzqqxxww xyzzy plugh`, also returned `grounded: true`. | The no-knowledge fallback is unreachable for ordinary nonsense. The AI can answer from unrelated context and consume provider credits. |
| F-02 | P0 | Rate limiting violates the required contract and leaves cost gaps. | Rate-limited requests return HTTP 200 with `error: "rate_limited"`, no `Retry-After`, and no countdown. The limiter is in-memory and defaults to 20 requests/hour. `RATE_LIMIT_CHAT` and `RATE_LIMIT_CONTACT` are unused. Voice transcription runs before `processChatMessage` and therefore before the shared rate-limit check. | Clients cannot implement retry/backoff correctly; distributed deployments can bypass limits; unauthenticated audio can consume STT cost. |
| F-03 | P0 | Prompt-injection defenses are not enforced. | `src/lib/ai/prompt-builder.ts:61` embeds the raw user message in the system prompt. `input-sanitizer.ts` detects suspicious patterns but does not block them. `response-validator.ts` records fabricated-project and fabricated-technology claims as warnings, while `isValid` is based on errors only; `chat-service.ts` imports `isResponseSafe` but does not use it. | A user can influence system instructions. Fabrication warnings do not prevent unsafe output from reaching the user. |
| F-04 | P0 | Chat API does not implement the PRD contract. | `/api/ai/chat` returns a single JSON object with `answer`, not streamed content. `ChatRequest.history` exists in `src/types/ai.ts` but is ignored. The route accepts 2,000 characters while `input-sanitizer.ts` truncates at 1,000 and the PRD requires 1,000. `ChatResponse` declares `content`, but the route returns `answer`. | Streaming UX, multi-turn context, input validation, and client integration all diverge from the specification. |
| F-05 | P0 | Contact is not implemented. | `src/components/sections/Contact.tsx:21-30` waits 1,500 ms and shows success. `POST /api/contact` returns 404. There is no server validation, email delivery, spam prevention, or contact rate limit. `RESEND_API_KEY` is not used. | The primary conversion path silently falsifies delivery. |
| F-06 | P0 | Core homepage content is absent from the initial HTML. | `src/app/page.tsx:1-27` is a client component and marks Skills, Experience, Projects, Certifications, GitHub, and Contact as `ssr: false`. The initial HTML contained About and certification text duplicated inside About, but no `#skills`, `#experience`, `#projects`, `#certifications`, `#github`, or `#contact` content. | Search engines, social previews, no-JS users, and reduced/disabled-JS clients do not receive most portfolio content. |
| F-07 | P1 | Streaming voice playback is unreliable. | `src/hooks/useVoiceChat.ts:478-505` reads binary response bytes through `TextDecoder` and re-encodes remaining bytes through `TextEncoder`. `AudioQueue` decodes each chunk independently and suppresses decode failures at `src/lib/audio/audio-queue.ts:86-96`. | Audio can be silently corrupted or dropped. The streamed path is not production-safe. |
| F-08 | P1 | Avatar is absent. | Avatar components exist, but `DigitalAnandAvatar` is not imported by any application component. `/ai` HTML contained no 3D/avatar markup. `GET /models/digital-anand/avatar.glb` returns 404. `AvatarModel.tsx` calls `useGLTF` inside a try/catch and conditionally calls `useEffect`, violating hook rules. | No visible Digital Anand, no avatar states, no lip-sync, and no reliable fallback. |
| F-09 | P0 | Quality gates fail. | `npm run typecheck` reports 24 errors: 19 `TS7016` missing `lucide-react` declarations plus five `custom-cursor.tsx` `TS2322` errors. `npm run build` compiles application code in 51 s, then fails at `src/app/ai/client.tsx:6` on the same `lucide-react` declaration error. `npm run lint` fails because Next 16 no longer supports `next lint`, and `npx eslint src` fails because no `eslint.config.*` exists. | The app has no passing typecheck, lint, or production build, so it cannot be certified for deployment. |
| F-10 | P1 | Tests are green but not meaningful for the worst risks. | 14 files and 225 tests pass. `src/app/api/ai/voice/route.test.ts` mocks `processChatMessage` but does not import or exercise the route. There is no chat-route test, no MSW integration, no E2E, no accessibility audit, and no performance test. Many assertions are `toBeDefined()` or equivalent. | The retrieval, rate-limit, prompt-injection, streaming, contact, and SSR failures are not detected. |
| F-11 | P1 | Homepage navigation and calls to action are broken or inert. | Hero has `id="hero-container"`, but there is no `id="hero"`; logo/Home-style `#hero` links cannot resolve. `View Projects` and `Resume` buttons at `src/components/sections/Hero.tsx:116-127` have no link or handler. `/resume.pdf` is 404. | Basic navigation and the primary hero actions do not work. |
| F-12 | P1 | Referenced production assets are missing. | `/og-image.png`, `/resume.pdf`, `/models/digital-anand/avatar.glb`, and `/sitemap.xml` return 404. `public/sitemap.json` exists but is not a standard XML sitemap and is not used by the application. `robots.txt` points to the missing `/sitemap.xml`. | Social cards, resume download, avatar rendering, and search-engine discovery are broken. |

## 3. Verification Record

### Commands executed

| Check | Command | Result |
| --- | --- | --- |
| Unit tests | `npm test -- --run` | 14 files passed, 225 tests passed, 7.10 s. |
| Typecheck | `npm run typecheck` / `npx tsc --noEmit --incremental false --pretty false` | Failed with 24 errors: 19 `TS7016` missing `lucide-react` declarations and five `TS2322` errors in `custom-cursor.tsx`. |
| Lint script | `npm run lint` | Failed: `Invalid project directory provided, no such directory: E:\Myrealportfolio\portfolio-am\portfolio-am\lint` (Next 16 removed `next lint`). |
| ESLint direct | `npx eslint src` | Failed: no `eslint.config.(js|mjs|cjs)` file. |
| Build | `npm run build` | Compiled application code in 51 s, then failed TypeScript at `src/app/ai/client.tsx:6` on the missing `lucide-react` declarations. No production build was produced. |
| Dev server | `npm run dev` | Started in 5.4 s and served the checks below; stopped after verification. |

### HTTP checks

| Request | Result |
| --- | --- |
| `GET /` | 200, 155,536 bytes. Initial HTML contained the name but none of the checked section headings (`About Me`, `Tech Arsenal`, `Work Experience`, `Featured Projects`, `Open Source`, `Get in Touch`), Testimonials, Education, or an `/ai` link; prior DOM inspection found only `#about` among content-section IDs. |
| `GET /ai` | 200, 35,667 bytes. Contained the AI shell but no rendered 3D/avatar markup. |
| `GET /robots.txt` | 200. References `/sitemap.xml`, which is 404. |
| `GET /sitemap.xml` | 404. |
| `GET /sitemap.json` | 200. Non-standard JSON sitemap; not referenced by metadata routes. |
| `GET /site.webmanifest` | 200. |
| `GET /favicon.svg` | 200. |
| `GET /og-image.png` | 404. |
| `GET /resume.pdf` | 404. |
| `GET /models/digital-anand/avatar.glb` | 404. |
| `POST /api/contact` | 404. No contact route exists. |

### Safe POST checks

These validation probes are intended not to call a provider unless noted. Two live text-chat requests were made separately, as recorded below.

| Request | Result |
| --- | --- |
| Chat, invalid JSON | 400, `Invalid JSON in request body`. |
| Chat, empty message | 400, `A non-empty 'message' field is required`. |
| Chat, 2,001 characters | 400, `Message exceeds maximum length of 2000 characters`. |
| Chat, HTML-only input | 200, `error: "empty_input"`, generic answer. This should be a 4xx validation response. |
| Voice, missing audio | 400, audio-required message. |
| Voice stream, missing audio | 400, audio-required message. |
| Voice, invalid base64 | 400, `Invalid base64 audio data`. |
| Rate limit, 21 unique client IPs, nonsense query | Requests 1-20: 200, no error, `grounded: true`. Request 21: 200, `error: "rate_limited"`, no `Retry-After`. |

In the prior audit run, the rate-limit test caused 20 real LLM calls because of F-01. Do not repeat this test against the live provider until fallback behavior is fixed.

### Live provider check

Two live text-chat requests were made during the current audit; no STT or TTS request was made.

| Request | Result |
| --- | --- |
| `POST /api/ai/chat` with `{"message":"<b>What are Anand skills?</b>"}` | 200, `error: "llm_unavailable"`, fallback text, `grounded: false`. Dev log: `[chat-service] LLM error: Sarvam returned empty response`. |
| `POST /api/ai/chat` with `{"message":"What is the weather in Tokyo?"}` | 200, the no-information answer, but `grounded: true`, `confidence: "demonstrated"`, and six unrelated certification/education sources. This is live proof of F-01. |

The provider returned an empty successful response for the first question, and the route mapped the failure to HTTP 200. The cause was not diagnosed. Treat live text AI as unreliable in this environment until the provider response and route error contract are fixed and retested.

### Not verified

- No browser automation, microphone test, WebGL render, mobile-device test, keyboard-only test, or screen-reader test was performed.
- No Sarvam STT or TTS request was made. Two Sarvam text-chat requests were made: one returned `llm_unavailable`; the other returned a no-information answer falsely marked grounded. No successful grounded LLM answer was verified.
- No production build completed; the build failed typecheck. No production start, preview, or deployment was performed.
- No Lighthouse, axe, or bundle analysis was performed.
- No email delivery or contact backend was tested because none exists.

## 4. Requirement Matrix

### 4.1 Core functional requirements

| Requirement | Status | Evidence | Gaps and dependencies | Priority | Verification method |
| --- | --- | --- | --- | --- | --- |
| FR-1 | `PARTIALLY IMPLEMENTED` | `src/app/page.tsx:1-27` renders Hero, About, Skills, Experience, Projects, Certifications, GitHub, Contact. Testimonials and Education are absent. Hero is 523 lines and has inert primary buttons. The server HTML lacks most section content. | Activate Testimonials and Education; decide on Achievements; repair navigation IDs; reduce Hero; verify content accuracy; restore server rendering and static metadata. | P0 | Playwright section/nav test, curl HTML assertions, axe, Lighthouse. |
| FR-2 | `PARTIALLY IMPLEMENTED` | `/ai` route exists. Access is through the floating desktop dock and command menu; the navbar and mobile menu have no AI action. `window.location.href` is used for AI navigation. | Add an explicit navbar/hero/mobile entry; preserve URL/history; add a real transition. | P0 | Click through desktop/mobile, back/forward, and direct `/ai` load. |
| FR-3 | `NOT IMPLEMENTED` | `src/components/sections/Contact.tsx:21-30` is a simulated success state. No `/api/contact` route exists. | Build server validation, email delivery, anti-spam, contact rate limiting, honest success/error UI. | P0 | Route tests and end-to-end email delivery in a non-production inbox. |
| AI-1 | `PARTIALLY IMPLEMENTED` | `AIChat`, `/api/ai/chat`, and `useVoiceChat.sendTextMessage` exist. The route returns one JSON response; no streaming. `useAIChat` exists but is unused. A live request returned HTTP 200 with `error: "llm_unavailable"` after Sarvam returned an empty response. | Implement streamed output, typing/error states, history propagation, request cancellation, a stable response contract, and mapping provider failure to an explicit error status. | P0 | HTTP streaming test, UI interruption test, route unit tests, live provider smoke test. |
| AI-2 | `PARTIALLY IMPLEMENTED` | Prompt builder, no-match response, and validator exist. The retrieval bug makes false grounding common, and validator warnings do not block output. A live weather query returned `grounded: true` with six irrelevant sources. | Fix retrieval scoring and threshold; hard-fail unsafe output; add no-match tests that assert `grounded: false` and that no LLM call occurs. | P0 | Unit tests with unrelated/adversarial queries plus provider-call spy. |
| AI-3 | `IMPLEMENTED BUT UNVERIFIED` | `SuggestedQuestions` and 10 suggested questions exist; selection sends text. | No browser test or assertion that all questions are visible and usable. | P1 | Playwright visibility/click test and mobile layout check. |
| AI-4 | `IMPLEMENTED BUT UNVERIFIED` | System prompt defines identity/personality rules. | No behavioral rubric or regression test for tone, identity, and unknown-answer behavior. | P1 | Scripted transcript review and automated assertions on key phrases. |
| VOICE-1 | `PARTIALLY IMPLEMENTED` | Batch `saaras:v3` STT exists through the server. It is not Web Speech API based. The client always uses batch STT; realtime mode is not wired. No language selector exists. | Implement a reliable primary/fallback STT strategy, explicit language selection or detection UX, and provider timeouts. | P1 | Mic tests in Chrome/Edge/Safari and simulated provider failures. |
| VOICE-2 | `PARTIALLY IMPLEMENTED` | `bulbul:v3` TTS returns WAV for batch and MP3 for stream. Barge-in cancellation exists. No Web Speech fallback; stream playback is corrupted by F-07. | Fix audio framing/decoding; add fallback; expose transcript/controls; verify barge-in and playback completion. | P1 | Audio fixture tests, browser playback test, interruption test. |
| VOICE-3 | `PARTIALLY IMPLEMENTED` | Voice states, barge-in, manual start/stop, and a 30 s recording auto-stop exist. There is no VAD-driven `user-speaking`, automatic re-listen, 10 s silence prompt, 20-turn cap, or conversation context. | Implement continuous conversation lifecycle and limits without re-recording over active playback. | P1 | Timed browser tests with fake audio input and inspectable state transitions. |
| VOICE-4 | `PARTIALLY IMPLEMENTED` | STT can auto-detect language; TTS is fixed to `en-IN`; no language selector. | Add explicit language preference, detection feedback, and TTS language matching. | P1 | Multi-language fixture tests and UI state test. |
| AVATAR-1 | `NOT IMPLEMENTED` | Avatar components exist, but `DigitalAnandAvatar` is not rendered. `/ai` uses `VoiceOrb`. GLB is 404. | Provide the asset and render the avatar with a real fallback. | P2 | Screenshot/visual test with asset present and absent. |
| AVATAR-2 | `NOT IMPLEMENTED` | State mapping code exists but is not connected to a rendered avatar. | Connect the state machine to visible states. | P2 | State-transition test and visual assertions. |
| AVATAR-3 | `NOT IMPLEMENTED` | No lip-sync, no speaking animation driven by audio, and no verified idle/listening/thinking motion. | Implement and verify animation states, including reduced-motion behavior. | P2 | Visual regression and manual review. |
| AVATAR-4 | `NOT IMPLEMENTED` | No verified responsive avatar-size variants. | Define mobile/desktop/compact modes and verify layout. | P2 | Responsive screenshots at defined breakpoints. |
| PROJECT-1 | `NOT IMPLEMENTED` | Projects are static legacy data-engineering cards. No interactive demos. | Add real demos or explicitly mark demo availability; do not claim demos that do not exist. | P2 | Browser test per demo and fallback test. |
| PROJECT-2 | `NOT IMPLEMENTED` | No architecture walkthrough, data flow, or verification deep-link is modeled in the Project type or UI. | Extend data/types and build an accessible architecture view. | P2 | Schema validation plus component/E2E tests. |
| PROJECT-3 | `PARTIALLY IMPLEMENTED` | Standard project cards exist. No architecture expand/collapse or unavailable-demo fallback. | Add expandable detail and honest fallback states. | P2 | Interaction and no-demo tests. |
| CMD-1 | `PARTIALLY IMPLEMENTED` | Command menu has seven commands, label filtering, arrow navigation, Enter, Escape, and AI navigation. | No categories, semantic/fuzzy search, recents/context, or complete hinting. | P2 | Keyboard and query tests. |
| CMD-2 | `PARTIALLY IMPLEMENTED` | Navigation and AI commands exist, plus contact. Connectivity is partial. | Cover all required categories and system actions; verify command coverage. | P2 | Command inventory test. |
| CMD-3 | `PARTIALLY IMPLEMENTED` | Open/navigate/select/close basics work. No dialog semantics, focus trap, `>`/`/`/`@` prefixes, or scoped parsing. | Add accessible dialog behavior, focus restoration, scoped prefixes, and conflict handling. | P2 | axe plus keyboard-only E2E. |

### 4.2 Data, knowledge, RAG, and architecture

| Requirement | Status | Evidence | Gaps and dependencies | Priority | Verification method |
| --- | --- | --- | --- | --- | --- |
| DATA-1 | `PARTIALLY IMPLEMENTED` | `src/data/` is split into domain modules and re-exported. `achievements.ts` is absent. `education.ts` exists but is not used by UI. | Add achievements or document exclusion; make education visible; establish one source of truth. | P1 | Import graph check and data-presence tests. |
| DATA-2 | `PARTIALLY IMPLEMENTED` | Core types exist in `src/types/index.ts`. Project lacks architecture/demo fields; Certification lacks `verificationUrl`; Experience lacks `responsibilities`; no achievements type. `ChatResponse` disagrees with the route. | Extend types to match the PRD and update components/data. | P1 | Type-level/unit fixtures and schema checks. |
| DATA-3 | `IMPLEMENTED BUT UNVERIFIED` | `Education` type and education data exist. | No Education UI or test; content accuracy not reviewed. | P2 | Component test and content review. |
| KNOWLEDGE-1 | `PARTIALLY IMPLEMENTED` | `src/data/ai-knowledge.ts` is structured TS. Content is manually duplicated from other data files. No automatic derivation or validation. | Remove duplicated sources of truth; add consistency checks. | P0 | Cross-file consistency tests. |
| KNOWLEDGE-2 | `IMPLEMENTED BUT UNVERIFIED` | `KnowledgeBase` has version, lastUpdated, and entries in `src/types/ai.ts`. | No schema/version validation test. | P1 | Runtime schema validation test. |
| KNOWLEDGE-3 | `PARTIALLY IMPLEMENTED` | 33 entries exist. The PRD calls for 50-100 entries of 100-500 words each. Many entries are far shorter, and skills are grouped by category rather than one entry per skill. | Expand coverage or obtain an approved scope exception; keep the count accurate. | P1 | Entry-count and word-count report. |
| KNOWLEDGE-4 | `PARTIALLY IMPLEMENTED` | Keyword/category/alias scoring and top-10 retrieval exist. Confidence-only matches create false positives; no robust intent extraction or vector retrieval. | Fix the confidence bonus and threshold; add intent-aware ranking; test unrelated queries. | P0 | Unit tests and provider-call assertions for no-match. |
| KNOWLEDGE-5 | `PARTIALLY IMPLEMENTED` | Prompt rules and validation exist, but warnings do not block and user text is injected into the system prompt. | Enforce hard failures, remove user text from system instructions, log safely, and add adversarial tests. | P0 | Red-team unit/integration tests. |
| RAG-1 | `PARTIALLY IMPLEMENTED` | Keyword/category retrieval and prompt construction exist. Relevance is broken by F-01. | Implement correct scoring and no-match behavior; preserve sources. | P0 | Retrieval precision/recall fixtures. |
| RAG-2 | `NOT IMPLEMENTED` | No embeddings, vector store, or hybrid search. | V2 decision; do not claim RAG pipeline completion without it. | P3 | N/A until scoped. |
| RAG-3 | `PARTIALLY IMPLEMENTED` | Prompt template includes professional rules and verified-context framing. | User message is inserted into the system prompt; improve template isolation and enforce it. | P0 | Prompt snapshot and injection tests. |
| VOICE_ARCH-1 | `PARTIALLY IMPLEMENTED` | Browser `MediaRecorder` sends audio to the server for Sarvam STT. No Web Speech API primary path. | Define and implement the primary/fallback architecture; document provider tradeoffs. | P1 | Browser capability matrix. |
| VOICE_ARCH-2 | `PARTIALLY IMPLEMENTED` | Audio exists transiently in the browser and is sent to a third-party provider; the app does not intentionally persist raw audio. No visible disclosure. | Add privacy disclosure, retention statement, and logging review. | P1 | Privacy copy review and network inspection. |
| VOICE_ARCH-3 | `PARTIALLY IMPLEMENTED` | Latency tracker classes and tests exist. No measured end-to-end latency, no performance budget proof, and stream playback is broken. | Instrument and measure; fix stream first; publish measurements. | P1 | Browser performance traces. |
| FE-1 | `DONE AND VERIFIED` | `/` and `/ai` both return 200. Core routes render. | None for route availability. | P1 | HTTP checks. |
| FE-2 | `PARTIALLY IMPLEMENTED` | Voice/chat hooks and AI state exist. `useAIChat` is unused; no shared URL/mode state for normal-to-AI context. | Consolidate state and preserve conversation/mode context. | P1 | Hook tests and navigation E2E. |
| FE-3 | `PARTIALLY IMPLEMENTED` | UI primitives and AI components exist. The page uses a client boundary; below-fold sections are `ssr: false`. | Move static content to server rendering where possible; keep interactive islands client-side. | P1 | HTML crawl and hydration checks. |
| FE-4 | `PARTIALLY IMPLEMENTED` | Framer Motion and global reduced-motion CSS exist. No page transition; avatar motion missing. | Add intentional transitions and verify reduced-motion behavior. | P2 | Visual and `prefers-reduced-motion` tests. |
| BE-1 | `PARTIALLY IMPLEMENTED` | Chat and voice routes exist. Contact route is missing. Node runtime is used by default. | Add contact backend and confirm runtime requirements. | P0 | API contract tests. |
| BE-2 | `PARTIALLY IMPLEMENTED` | Provider keys are server-side; retrieval, prompt construction, and validation run server-side. Voice rate limiting happens after STT; contact security is absent. | Enforce rate limits before costly work and add contact protections. | P0 | Cost-path tests and load/abuse tests. |
| BE-3 | `PARTIALLY IMPLEMENTED` | Sarvam LLM/STT/TTS implemented. PRD OpenAI/Web Speech/ElevenLabs/Resend decisions are unresolved. | Resolve provider decisions and document deviations. | P1 | Decision record and provider contract tests. |
| API-1 | `PARTIALLY IMPLEMENTED` | `/api/ai/chat` validates basic shape and returns structured JSON. It is non-streaming, ignores history, uses 2,000 characters, and returns `answer` instead of `content`. | Implement the PRD contract, including streaming and history. | P0 | Contract tests and SSE/NDJSON consumer test. |
| API-2 | `NOT IMPLEMENTED` | No `/api/contact` route or email transport. | Implement server route, validation, delivery, spam control, and rate limiting. | P0 | Route/integration tests with mocked transport. |

### 4.3 Security and privacy

| Requirement | Status | Evidence | Gaps and dependencies | Priority | Verification method |
| --- | --- | --- | --- | --- | --- |
| SEC-1 | `IMPLEMENTED BUT UNVERIFIED` | Provider calls are in server routes; no API key is present in client source. | No production bundle scan. | P1 | Build and bundle scan for key patterns. |
| SEC-2 | `PARTIALLY IMPLEMENTED` | In-memory limiter, 20/hour default, chat/voice shared key. HTTP 200 on limit; no `Retry-After`; no contact limit; STT before limit. | Use env-configured limits, return 429 with header, separate voice/contact controls, and add distributed storage or explicitly document single-instance scope. | P0 | 429/header tests and concurrent-instance tests. |
| SEC-3 | `PARTIALLY IMPLEMENTED` | Sanitizer strips HTML/control characters and truncates at 1,000. Chat route accepts 2,000 first. Contact validation absent. | Align request validation and sanitizer limits; add contact schema. | P0 | Boundary tests at 999/1,000/1,001/2,000/2,001. |
| SEC-4 | `PARTIALLY IMPLEMENTED` | Injection patterns are detected. User message is placed in system prompt; detection does not block; validator warnings do not block. | Treat injection as a hard or strongly constrained path; keep user content in a user role; hard-fail fabrication warnings for public answers. | P0 | Adversarial prompt tests and snapshot review. |
| SEC-5 | `PARTIALLY IMPLEMENTED` | Microphone permission is requested on action; denial reaches a text fallback; an active indicator/orb exists. | No privacy disclosure, no explicit retention explanation, no visible stop state details. | P1 | UX review and network disclosure check. |
| SEC-6 | `NOT IMPLEMENTED` | No Origin validation or explicit CORS policy. | Add same-origin enforcement and test cross-origin POSTs. | P1 | Preflight and forged-origin tests. |
| SEC-7 | `NOT IMPLEMENTED` | No CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, or other security headers. Only the voice stream route sets `X-Content-Type-Options: nosniff`. | Add headers at the framework/proxy layer and verify on all routes. | P1 | Header scan per route. |
| PRIV-1, PRIV-2 | `PARTIALLY IMPLEMENTED` | No application-level chat/audio transcript persistence was found. Text/audio is sent to Sarvam. No contact or analytics tool exists. | Add a clear third-party processing disclosure and retention statement. | P1 | Privacy copy and network/data-flow review. |
| PRIV-3 | `NOT IMPLEMENTED` | No privacy policy, AI disclosure, or footer legal link. | Add an accessible policy and link it from the site and AI surface. | P1 | Link/content review. |
| PRIV-4 | `NOT IMPLEMENTED` | No retention/deletion/logging policy. | Define log redaction, retention windows, and operator responsibilities. | P1 | Policy review plus log inspection. |

### 4.4 Accessibility, SEO, performance, analytics, and errors

| Requirement | Status | Evidence | Gaps and dependencies | Priority | Verification method |
| --- | --- | --- | --- | --- | --- |
| A11Y-1 | `PARTIALLY IMPLEMENTED` | Baseline assessment only. Current code has a skip link, focus-visible CSS, reduced-motion CSS, some ARIA labels, and basic keyboard support in the command menu. | The PRD baseline is stale in some areas, but semantic-HTML, contrast, and screen-reader evidence remain incomplete. | P1 | Accessibility baseline audit; see A11Y-2 and A11Y-3 for forward requirements. |
| A11Y-2 | `PARTIALLY IMPLEMENTED` | Skip link, visible focus CSS, reduced-motion CSS, labels in voice controls, and text fallback exist. | No `aria-live`/`role=log` for chat; command menu lacks dialog/focus trap; custom cursor/mouse glow may distract; no axe run. | P1 | axe, keyboard-only, screen-reader, reduced-motion tests. |
| A11Y-3 | `PARTIALLY IMPLEMENTED` | Voice labels, transcript display, and text fallback exist. | No live conversation announcements; permission/processing state is not announced; no verified screen-reader voice flow. | P1 | Manual assistive-technology test. |
| SEO-1 | `PARTIALLY IMPLEMENTED` | Baseline assessment only. Basic metadata, OpenGraph/Twitter tags, and `robots.txt` exist; structured data, a generated sitemap, canonical URLs, and schema.org are absent. | The baseline is accurate but incomplete; deficiencies are tracked under SEO-2, SEO-3, and SEO-4. | P1 | Metadata/sitemap/canonical crawl. |
| SEO-2 | `PARTIALLY IMPLEMENTED` | Root metadata, OG/Twitter tags, manifest, icons, and robots directives exist. `/ai` has page metadata. | `og-image.png` is 404; no canonical; no JSON-LD; no verified per-page Open Graph image. | P1 | Crawl metadata and rich-result checks. |
| SEO-3 | `NOT IMPLEMENTED` | No generated `sitemap.ts`, no JSON-LD, no canonical URLs. `robots.txt` points to a missing sitemap. | Add canonical and JSON-LD; generate a valid sitemap; fix robots reference. | P1 | Sitemap fetch, canonical parse, schema validation. |
| SEO-4 | `PARTIALLY IMPLEMENTED` | Initial HTML includes only About among content sections. Skills, Experience, Projects, Certifications, GitHub, and Contact are client-only. | SSR or static render core content; keep AI in a separate route. | P0 | `curl` content assertions and search-engine crawl review. |
| PERF-1 | `IMPLEMENTED BUT UNVERIFIED` | Code splitting and AI route isolation exist. No performance measurement. | Run Lighthouse/Core Web Vitals on production build and mobile throttling. | P1 | Lighthouse CI. |
| PERF-2 | `PARTIALLY IMPLEMENTED` | Dynamic imports are used for below-fold sections; no bundle analyzer. `next.config.ts` uses wildcard remote image patterns. | Analyze bundles, remove unnecessary client code, restrict remote image hosts. | P1 | Bundle report and image-host policy test. |
| PERF-3 | `PARTIALLY IMPLEMENTED` | AI is on `/ai`; chat has no stream; no AI skeleton/streaming UX. | Add loading/skeleton and streaming; keep normal mode independent of provider failures. | P1 | Lighthouse and network-throttled AI test. |
| PERF-4 | `PARTIALLY IMPLEMENTED` | Hero is 523 lines, not the PRD's reported 920, and still exceeds a 200-line target. No decomposition. | Split Hero sections; verify animation cost. | P1 | File-size check and React profiler. |
| PERF-5 | `PARTIALLY IMPLEMENTED` | Global reduced-motion CSS exists. No reduced concurrency check; animations are Framer Motion based. | Verify animation cost and reduced-motion path; cap concurrent audio/LLM work. | P2 | Profiler and reduced-motion test. |
| ANALYTICS-1, ANALYTICS-2 | `NOT IMPLEMENTED` | No analytics dependency, script, event code, or consent UI. | Choose a tool only after a privacy decision; instrument normal/AI funnels if required. | P2 | Event payload tests and privacy review. |
| ERROR-1 | `PARTIALLY IMPLEMENTED` | API routes return structured errors; voice has text fallback. | No explicit "Explore Portfolio" CTA on AI failure; no verified text-chat error card. | P1 | Error-path E2E tests. |
| ERROR-2 | `PARTIALLY IMPLEMENTED` | Error messages and fallbacks exist in places. | No consistent error component; no contact error; no user-visible distinction between retryable and permanent failures. | P1 | Component tests and API failure injection. |
| ERROR-3 | `NOT IMPLEMENTED` | No Web Speech fallback after STT failure. | Implement fallback or clearly label text-only degradation. | P1 | Browser capability/failure tests. |
| ERROR-4 | `NOT IMPLEMENTED` | No single automatic retry after 3 s. | Add bounded retry with cancellation and no duplicate messages. | P1 | Network-failure fixture test. |
| ERROR-5 | `PARTIALLY IMPLEMENTED` | Rate-limit message exists. | It arrives as HTTP 200, has no countdown, and does not expose `Retry-After`. | P0 | 429 contract test. |
| ERROR-6 | `PARTIALLY IMPLEMENTED` | AI is on a separate route, so normal content is conceptually isolated. No error boundary exists. | Add route/component error boundaries and verify AI failure cannot blank normal mode. | P2 | Error-boundary tests. |
| RESP-1 | `IMPLEMENTED BUT UNVERIFIED` | Tailwind responsive classes and mobile navigation exist. | No device/browser testing. | P1 | Playwright viewport matrix. |
| RESP-2 | `PARTIALLY IMPLEMENTED` | Mobile nav and dock exist; voice UI has responsive styles. | No keyboard-aware mobile verification; no avatar; AI entry absent from mobile menu. | P1 | Mobile device tests. |
| RESP-3 | `PARTIALLY IMPLEMENTED` | Voice mode is stacked, not a desktop split layout. | Desktop split layout with avatar absent. | P1 | Desktop screenshots and layout tests. |
| RESP-4 | `PARTIALLY IMPLEMENTED` | Text/voice controls exist; no avatar, waveform, or verified mobile voice layout. | Add the missing visual/voice affordances. | P1 | Visual regression tests. |
| DESIGN-1, DESIGN-2, DESIGN-3 | `IMPLEMENTED BUT UNVERIFIED` | Design tokens, glass, borders, gradients, and shared utilities exist in `globals.css` and UI primitives. | No visual review against the PRD. | P2 | Visual comparison and token audit. |
| DESIGN-4 | `PARTIALLY IMPLEMENTED` | AI surfaces use gradient/glow styles. | Avatar/voice visualization is absent. | P2 | Visual review. |
| DESIGN-5 | `IMPLEMENTED BUT UNVERIFIED` | Principles and style choices are documented in code/PRD. | No human design acceptance. | P2 | Design review. |
| MOTION-1 | `PARTIALLY IMPLEMENTED` | Page load fade exists. Normal-to-AI navigation is a full reload; no page transition. | Add a real transition while preserving focus and URL state. | P2 | Visual navigation test. |
| MOTION-2 | `IMPLEMENTED BUT UNVERIFIED` | Hover/tap styles and focus styles exist. | No interaction-state test. | P2 | Visual/keyboard tests. |
| MOTION-3 | `NOT IMPLEMENTED` | No avatar motion. | Implement if avatar is approved. | P2 | Visual state test. |
| MOTION-4 | `PARTIALLY IMPLEMENTED` | Message entry and suggestion chips may animate. No streaming/token animation. | Add streaming-aware motion and verify reduced motion. | P2 | Interaction test. |
| MOTION-5 | `PARTIALLY IMPLEMENTED` | Global reduced-motion CSS exists. Avatar/Framer Motion components are not consistently gated by `matchMedia`. | Audit every motion component; provide static fallbacks. | P2 | Reduced-motion E2E. |
| COMP-1 | `PARTIALLY IMPLEMENTED` | Shared UI primitives and section components are reused. | Navbar lacks AI action; Hero is oversized; Testimonials is inactive; Contact is fake. | P1 | Component inventory and visual review. |
| COMP-2 | `PARTIALLY IMPLEMENTED` | Many PRD-named components exist, but `ChatBubble`, `WaveformVisualizer`, `InteractiveDemo`, and a dedicated command-center component are missing; `DigitalAnandAvatar` is unused. | Close component gaps or document exclusions. | P2 | Component inventory test. |

### 4.5 Testing, deployment, scope, and acceptance

| Requirement | Status | Evidence | Gaps and dependencies | Priority | Verification method |
| --- | --- | --- | --- | --- | --- |
| TEST-1 | `PARTIALLY IMPLEMENTED` | 14 files / 225 passing tests in 7.10 s. No coverage threshold or report. The retrieval suite explicitly accepts broad matching for an unrelated query instead of requiring no matches. | Add high-value tests for no-match, rate limit, injection, contact, SSR, and streaming; replace permissive retrieval assertions. | P1 | Coverage report and mutation/adversarial tests. |
| TEST-2 | `PARTIALLY IMPLEMENTED` | Some route/provider tests exist. Voice route test mocks the service without exercising the route. | Add MSW/route-level integration tests and a real route-handler test. | P1 | Integration suite. |
| TEST-3 | `NOT IMPLEMENTED` | No Playwright or equivalent end-to-end tests. | Add core navigation, AI, contact, and responsive flows. | P1 | CI E2E run. |
| TEST-4 | `NOT IMPLEMENTED` | No axe, screen-reader, or visual-regression suite. | Add accessibility checks and visual snapshots. | P1 | axe/CI artifacts. |
| TEST-5 | `NOT IMPLEMENTED` | No Lighthouse CI or performance budget. | Add budgets for LCP, CLS, INP, JS size, and AI latency. | P1 | Lighthouse CI. |
| DEPLOY-1 | `BLOCKED` | No `vercel.json`, deployment log, preview URL, or production deployment evidence was available. The primary platform/domain claim is unverified. | Connect the repository to the approved host, configure environment variables, and verify the production domain. | P1 | Preview and production deployment checks. |
| DEPLOY-2 | `PARTIALLY IMPLEMENTED` | Local development was started and served both routes during the audit; it was stopped afterward. Production/preview environment configuration is not documented or verified. | Define production, preview, and local environment variables; verify branch-based previews. | P1 | Environment matrix and preview deployment. |
| DEPLOY-3 | `BLOCKED` | Typecheck and lint fail. `npm run build` compiles application code, then fails TypeScript at `src/app/ai/client.tsx:6`. Missing assets and SEO routes remain. | Reinstall/upgrade dependencies, add a compatible ESLint flat config, fix types, pass a production build, then verify assets and headers. | P0 | Clean `npm ci`, typecheck, lint, test, build, start, smoke test. |
| MVP scope | `NOT IMPLEMENTED` | Multiple MVP requirements fail: contact, text chat streaming/history, grounding safety, 429 contract, full SSR content. | Complete P0 work before calling the MVP complete. | P0 | Acceptance-criteria run. |
| V2 scope | `PARTIALLY IMPLEMENTED` | Voice code exists but is not reliable; avatar and demos are absent; realtime STT is unwired. | Treat as pre-built, not complete. | P2 | V2 acceptance run after P0/P1. |
| V3 scope | `NOT IMPLEMENTED` | No agentic features or governed production agent. | Future scope. | P3 | Not applicable yet. |
| PRD open questions | `BLOCKED` | Provider choices, rate limits, pricing, scope, and completion claims conflict. | Obtain explicit product decisions before implementation. | P0 | Decision record. |
| AC-1 | `PARTIALLY IMPLEMENTED` | Most sections exist in code; navigation has a broken `#hero` target; contact is fake; Testimonials/Education absent; reduced motion present. | Fix content/navigation/contact and verify all sections. | P0 | Acceptance E2E. |
| AC-2 | `PARTIALLY IMPLEMENTED` | Chat/voice endpoints exist and block non-empty requests. They do not stream, a live unrelated query was marked grounded, a live text request returned `llm_unavailable`, rate-limited requests return 200, and unsafe output is not blocked. | Fix API, provider-failure, and safety behavior. | P0 | Contract and red-team tests. |
| AC-3 | `PARTIALLY IMPLEMENTED` | Voice code and text fallback exist. Avatar is absent, stream playback is unreliable, and browser coverage is unverified. | Fix voice/avatar and run cross-browser tests. | P1 | Browser matrix. |
| AC-4 | `NOT IMPLEMENTED` | No interactive demos, no demo fallbacks, no three.js demos. | Implement only after scope approval. | P2 | Demo acceptance tests. |
| AC-5 | `PARTIALLY IMPLEMENTED` | Server-side keys and some input checks exist. CSP, contact security, 429 semantics, injection blocking, and `Retry-After` are missing. | Complete security acceptance criteria. | P0 | Security test checklist. |

## 5. Content and Data Defects

- The homepage Hero advertises `10+` pipelines, `15+` dashboards, `5` certifications, and `20+` technologies. These claims were not verified and must be confirmed or removed.
- About duplicates certification content and hardcodes career claims. The initial HTML contained `Professional Certifications` because of this duplication, not because a certification section rendered.
- Experience data uses `Feb 2026 - Aug 2026` with `isCurrent: true`. This needs a content/date review.
- The Experience UI omits period, location, description, and skills even though the data includes them.
- Testimonials contain one placeholder entry from `"Data Engineering Community"` and no section renders it.
- Education data exists but no Education section renders it.
- Projects are data-engineering projects. No AI projects, architecture walkthroughs, demos, or honest demo-unavailable states are present.
- The Footer and normal-mode copy position the candidate primarily as a data engineer, while the AI and About copy emphasizes AI engineering. Align the professional positioning and claims.
- The terminal/command surfaces and Hero stats may contain stale claims. Treat all hard-coded metrics as content requiring approval.
- `README.md` describes Next.js 15 and does not document the Sarvam setup. It is not a reliable setup guide.
- `public/robots.txt` references a missing sitemap. `public/sitemap.json` is not a standard sitemap and is not wired into the application.
- Missing referenced assets: `og-image.png`, `resume.pdf`, avatar GLB, and `sitemap.xml`.

## 6. Verified Strengths

- Dependencies are installed and the dev server responds.
- `GET /` and `GET /ai` return 200.
- The provider API key is referenced from server-side code; the live key is not reproduced in this audit.
- Chat and voice routes validate malformed requests and return structured JSON errors for missing/invalid input.
- Voice routes enforce a 5 MB audio limit and return a text answer if TTS fails.
- `useVoiceChat` includes explicit lifecycle states, microphone denial handling, barge-in cancellation, and latency tracking.
- Skip link, focus-visible styles, reduced-motion CSS, and many ARIA labels are present.
- Data is separated into domain modules; UI primitives and AI components are reasonably organized.
- The unit-test suite is green and fast enough to use as a change gate, even though its coverage is weak.
- Next.js compiles the application code in 51 s; the build failure is in TypeScript validation, not syntax or bundling.
- No source files were modified during this audit.

## 7. PRD Conflict Register

| Topic | PRD says | Implementation/evidence | Consequence |
| --- | --- | --- | --- |
| Scope | MVP body excludes voice, avatar, demos, analytics, resume PDF, and multilingual input; appended reports mark voice complete and the avatar foundation complete, while Phase 6.2 admits the model is missing. | Voice/avatar/demo code is partial; avatar/demos/analytics/resume are absent or broken. | The PRD cannot be used as a single source of truth until scope is resolved. |
| Providers | Web Speech API, OpenAI GPT-4o-mini, ElevenLabs, Resend. | Sarvam LLM/STT/TTS; no Resend; no Web Speech. | Deployment, cost, privacy, and acceptance criteria differ materially. |
| Chat API | Streamed response, history, 1,000-character limit, `content` response. | Non-streamed JSON, history ignored, 2,000-character route limit, `answer` response. | Client/API contract and UX are not compliant. |
| Voice flow | Web Speech primary, fallback STT, automatic continuous listening, 10 s silence, 20-turn cap, language selector. | Sarvam batch STT, manual flow, 30 s recording stop, no auto re-listen, no turn cap, no selector. | Voice is not the specified experience. |
| Avatar | AVATAR-1 specifies evolving the SVG `Mascot`; V3 lists a Three.js avatar. Appended Phase 6.1 claims 3D page integration. | A 3D component exists but is unused, the GLB is missing, and `/ai` is voice-first with `VoiceOrb`, not an avatar. | Both the visual approach and the completion claim are unresolved. |
| Avatar completion | Phase 6.1 reports `DigitalAnandAvatar` integrated into `/ai`; Phase 6.2 describes a GLB load path and graceful fallback. | No application component imports `DigitalAnandAvatar`; `/ai` contained no avatar markup; `public/models/digital-anand/` exists but is empty, so `/models/digital-anand/avatar.glb` is 404. | Completion reports cannot be trusted as verification evidence. |
| TypeScript/build status | Appended reports say `tsc` has only "pre-existing lucide-react warnings" and the Webpack build compiles successfully. | Current `npm run typecheck` fails with 24 errors; `npm run build` compiles then fails on the missing `lucide-react` declarations. | The reported quality-gate status is inaccurate. |
| Knowledge size | 50-100 entries of 100-500 words. | 33 short entries; skills are grouped by category. | Content depth is below the stated target. |
| Contact | Server-side contact flow with delivery and spam protection. | Client-only simulated success; no route. | A core conversion path is non-functional. |
| SEO | Fully crawlable normal mode, canonical, sitemap, structured data, OG image. | Most sections client-only; no canonical/JSON-LD; sitemap and OG image missing. | Search/social discoverability is degraded. |
| Rate limits | 429 with retry guidance; configurable per endpoint. | 200 `rate_limited`; no `Retry-After`; env vars unused; in-memory. | Contract breach and incorrect client behavior. |
| Hero/performance | Hero was reported as refactored below 200 lines. | Hero is 523 lines; bundle/performance unmeasured. | Performance claims are stale. |
| Completion status | Reports mark phases complete. | Source and HTTP evidence show P0 failures. | Completion reports must not be used as audit evidence. |

## 8. Unverified and Blocked Areas

- Browser visual quality, responsive layout, WebGL avatar rendering, microphone behavior, and real mobile keyboard behavior.
- Successful Sarvam LLM answer quality/latency, all STT/TTS behavior, provider cost, and recovery from the observed empty-response failure.
- Production email delivery and spam resistance.
- Distributed rate-limit behavior in a serverless deployment.
- Build output, bundle sizes, Core Web Vitals, accessibility audit, and security-header deployment behavior.
- Search-engine indexing and social-card rendering.
- Current content accuracy of metrics, dates, certifications, testimonials, and project claims.

## 9. Conclusion

The implementation is best classified as:

- **Normal portfolio:** `PARTIALLY IMPLEMENTED`
- **Text AI assistant:** `PARTIALLY IMPLEMENTED`, with P0 grounding/safety defects and an unverified live-provider failure path
- **Voice AI:** `PARTIALLY IMPLEMENTED`, pre-production
- **Avatar and demos:** `NOT IMPLEMENTED`
- **Production readiness:** `BLOCKED` by failing typecheck/lint/build, API/safety defects, missing assets, and unverified browser behavior

The P0 remediation sequence is defined in `docs/implementation-plan.md`. No implementation work should begin until the scope conflicts and provider decisions in the PRD are resolved or explicitly accepted.
