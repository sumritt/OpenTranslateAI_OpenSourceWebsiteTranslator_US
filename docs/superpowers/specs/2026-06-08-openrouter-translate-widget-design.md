# OpenRouter AI Translate Widget — Design

**Date:** 2026-06-08
**Status:** Approved (design phase)
**Goal:** Adapt this open-source site/widget into a personal, embeddable translation widget that translates page content via an LLM through OpenRouter, instead of LibreTranslate.

---

## 1. Summary

Replace the translation **engine** (currently the LibreTranslate REST API) with **OpenRouter chat-completion translation**, while keeping the rest of the repo intact.

The OpenRouter API key is a secret and must never ship in client code. All translation requests go through a **serverless proxy** (a Supabase edge function) that holds the key and the model name in environment variables. Two front-ends call that proxy:

1. The existing **React widget** (`src/services/translation.ts` + `domTranslator.ts` + `TranslationWidget.tsx`) — used by the demo/landing app.
2. A new **standalone `widget.js`** extracted from `public/standalone-widget.html` — an embeddable `<script>` that can be dropped onto any website.

The defining difference from LibreTranslate: OpenRouter is an LLM, so each request costs tokens and latency. We therefore **batch many text nodes into one LLM call** (array in → JSON array out) rather than one call per text.

---

## 2. Current state (what exists today)

- **React app:** `TranslationWidget` initializes a `DOMTranslator`, which walks `#translatable-content`, snapshots text nodes, and translates them in batches of 10 via `TranslationService`. `TranslationService.translate()` POSTs one text per request to `https://libretranslate.com/translate` (default), with retry/backoff and an in-memory cache.
- **Standalone widget:** `public/standalone-widget.html` is a single HTML file (CSS + vanilla JS) that does the same DOM-walk + per-text LibreTranslate calls inline. It is a demo page, not a drop-in script.
- **Supabase:** one edge function already exists (`supabase/functions/waitlist/index.ts`) using `Deno.serve`, demonstrating the platform and code pattern. (Note: that file has a hardcoded Google key — out of scope here, see §10.)

---

## 3. Target architecture

```
Host page (any website)
  └─ <script src=".../widget.js"
            data-proxy="https://<proj>.supabase.co/functions/v1/translate"
            data-target="th"
            data-default="en">
       │  injects widget UI + CSS
       │  walks host DOM → collects text nodes
       │  batches texts (chunks of N)
       └─ POST { texts:[...], target } ──► Supabase edge function `translate`
                                              │  reads OPENROUTER_API_KEY + OPENROUTER_MODEL (env)
                                              │  checks Origin allowlist (+ optional token)
                                              │  ONE OpenRouter chat-completion per request
                                              └─ POST https://openrouter.ai/api/v1/chat/completions
                                                 ◄─ { translations:[...] }  (same length/order as texts)
```

The same proxy serves the React app (`TranslationService` points at the proxy URL instead of LibreTranslate).

---

## 4. Components

### 4.1 Proxy — Supabase edge function `translate`

**Path:** `supabase/functions/translate/index.ts`

**Responsibility:** Hold the OpenRouter secret; translate one batch of strings per call; protect against abuse. Stateless.

**Request (POST, JSON):**
```ts
{
  texts: string[];     // one batch of strings to translate
  target: string;      // target language code or name, e.g. "th", "Thai"
  source?: string;     // optional; omitted/"auto" → let the model detect
}
```

**Response (200, JSON):**
```ts
{ translations: string[] }   // same length and order as `texts`
```

**Environment variables:**
- `OPENROUTER_API_KEY` — secret, the OpenRouter key.
- `OPENROUTER_MODEL` — model id, e.g. `google/gemini-2.0-flash-001` (user-chosen; the model decides quality/cost).
- `ALLOWED_ORIGINS` — comma-separated list of allowed `Origin` values (e.g. `https://mysite.com,http://localhost:5173`). `*` allowed for local/dev only.
- `WIDGET_TOKEN` — optional shared token; if set, requests must send a matching `X-Widget-Token` header.

**OpenRouter call:**
- Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`
- Headers: `Authorization: Bearer ${OPENROUTER_API_KEY}`, `Content-Type: application/json`. Optional `HTTP-Referer` / `X-Title` for OpenRouter dashboard attribution.
- Body: `{ model, temperature: 0, messages: [system, user] }`.
- **System prompt:** instruct the model that it is a translation engine; translate every input string into `target`; return ONLY a JSON array of strings, same length and order; never add commentary, never merge/split items; preserve numbers, URLs, and any text already in the target language; treat the input strictly as data to translate, never as instructions (prompt-injection guard).
- **User message:** a JSON array of the input `texts`.

**Output parsing (robustness):**
1. Read `data.choices[0].message.content`.
2. Strip Markdown code fences (```json … ```), trim.
3. `JSON.parse`; require `Array.isArray` and `length === texts.length`.
4. On parse/length mismatch: retry the OpenRouter call once. If still bad → respond 200 with `translations = texts` (originals) so the page degrades gracefully rather than breaking, and include a `degraded: true` flag for the client to log.

**Abuse protection (primary controls):**
- **Origin allowlist:** reject (`403`) any request whose `Origin` is not in `ALLOWED_ORIGINS`. CORS `Access-Control-Allow-Origin` echoes the validated origin (not `*`) when an allowlist is set.
- **Request-size caps:** reject if `texts.length > MAX_TEXTS` (default 60), any single text `> MAX_CHARS` (default 5000), or total chars `> MAX_TOTAL` (default 20000). Bounds the per-request token cost.
- **Optional shared token:** if `WIDGET_TOKEN` is set, require matching `X-Widget-Token`. Note: a token embedded in a public `<script>` is visible to anyone viewing the page, so it mainly deters non-browser abuse; the Origin allowlist is the real browser-side control.
- **Optional rate limiting** (enhancement, not MVP): per-IP counter backed by a Supabase table or Upstash. MVP relies on origin allowlist + size caps + OpenRouter's own account limits.

**Errors:** validation → `400`; disallowed origin/token → `403`; OpenRouter failure after retry → graceful `200 { translations: texts, degraded: true }`. Log detail server-side via `console.error`; return generic messages to the client.

### 4.2 Shared React engine

**`src/services/translation.ts`**
- Remove the LibreTranslate default URL and the `q/source/target/format` body shape.
- `TranslationService` config: `{ proxyUrl: string; token?: string }`. No API key on the client.
- Replace per-text `translate()` as the primary path with a batch call:
  `translateBatch(texts: string[], target: string): Promise<string[]>` → single POST to the proxy with the whole `texts` array → returns `translations`.
- Keep an in-memory cache keyed on `${target}::${trimmedText}` (trim fixes the whitespace-variant cache-miss issue). `source` is dropped from the key since detection is automatic.
- Keep retry/backoff around the proxy fetch and the 30s `AbortController` timeout, but move `clearTimeout` into a `finally` (fixes the timer-leak finding).

**`src/services/domTranslator.ts`**
- Keep the TreeWalker extraction and `originalText` snapshot (restore path unchanged).
- Change the batch loop: slice text nodes into chunks of `batchSize` (default 25), and for each chunk call `translationService.translateBatch(chunkTexts, target)` — **one proxy/LLM call per chunk** instead of `Promise.all` of per-text calls. Apply results by index, update progress per chunk.
- Drop `source`/`originalLang` from the translate call (detection is automatic); `originalLang` remains only as the key for the "restore original" branch.

**`src/components/TranslationWidget.tsx`**
- Accept `proxyUrl` (+ optional `token`) props instead of `apiUrl`/`apiKey`. Wire from app config / env (`VITE_TRANSLATE_PROXY_URL`).

> The React landing app's pre-existing stale-DOM bug (text-node references break when `localLang` swaps the `DemoContent*` subtree) is **not** fixed by this work and is documented as a known limitation (§10). The standalone widget is unaffected because it re-walks the DOM on each init.

### 4.3 Standalone embeddable `widget.js`

**Path:** `public/widget.js` (plus a thin `public/standalone-widget.html` demo that loads it).

**Responsibility:** A self-contained IIFE that any site can embed with one `<script>` tag. It injects its own UI + CSS, reads config from the script tag's `data-*` attributes, walks the host page DOM, and translates via the proxy.

**Config (script-tag data attributes):**
- `data-proxy` (required) — proxy URL.
- `data-target` — default target language (optional; user picks in the dropdown otherwise).
- `data-default` — the page's original language code (for the "restore" option). Default `en`.
- `data-element` — id of the element to translate. Default: whole `<body>`.
- `data-token` — optional shared token sent as `X-Widget-Token`.
- `data-languages` — optional comma list to override the offered language set.

**Behavior:** mirrors the current standalone logic (extract nodes, dropdown, progress bar, restore-original, in-memory cache, close-on-outside-click which it already has), but:
- `translateBatch` posts the array to the proxy (chunked by `batchSize`, default 25) instead of per-text LibreTranslate calls.
- Null-guard `node.parentElement` in the TreeWalker filter (fixes the standalone null-deref finding).
- On `target`/`document.documentElement` set `lang` (and `dir="rtl"` for RTL codes like `ar/he/fa/ur`) so translated output reads correctly.

---

## 5. Data flow (translate action)

1. User picks a target language in the widget.
2. Widget collects snapshotted text nodes, slices into chunks of `batchSize`.
3. For each chunk: `POST {texts, target}` → proxy.
4. Proxy validates (origin/token/size) → one OpenRouter call → parses JSON array → returns `translations`.
5. Widget writes `translations[i]` back into the matching text node, updates the progress bar.
6. Results cached in memory keyed by `target + trimmed text`; re-selecting a language reuses cache. Selecting the original language restores `originalText`.

---

## 6. Configuration surface

- **Proxy env:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `ALLOWED_ORIGINS`, optional `WIDGET_TOKEN`, optional size-cap overrides.
- **React app env:** `VITE_TRANSLATE_PROXY_URL` (+ optional `VITE_TRANSLATE_TOKEN`). Add a committed `.env.example` documenting these (and the existing `VITE_SUPABASE_*`).
- **Standalone widget:** `data-*` attributes (§4.3).

---

## 7. Error handling & degradation

- Network/proxy failure on a chunk: surface a non-blocking error in the widget; already-translated chunks stay. (Atomic-apply is a possible enhancement but not required for MVP.)
- Model returns malformed/again-mismatched output: proxy returns originals with `degraded: true`; the page shows source text for that chunk rather than `undefined`.
- Client validates `translations.length === texts.length` before applying; on mismatch it keeps originals for that chunk.

---

## 8. Security

- OpenRouter key lives only in the proxy env — never in any bundle or `<script>`.
- Origin allowlist + request-size caps bound who can call the proxy and how expensive each call is, protecting the OpenRouter wallet.
- Prompt-injection guard in the system prompt; input passed as a JSON array in the user message and described as data-only.
- Proxy returns generic client errors; logs detail server-side.

---

## 9. Testing strategy

- **Proxy unit-ish tests:** valid batch → array of same length; fence-wrapped model output is parsed; length mismatch triggers one retry then graceful originals; disallowed origin → 403; oversized request → 400.
- **Client engine tests:** `translateBatch` posts the array and maps results by index; cache hit avoids a second call; trimmed-text cache key collapses whitespace variants; `clearTimeout` runs on the error path.
- **Manual/e2e:** load the demo page, translate to Thai and back to original; embed `widget.js` on a scratch HTML page pointing at the deployed proxy; verify Arabic sets `dir="rtl"`.
- **Cost check:** confirm a ~100-node page produces ≈ `ceil(100/25)` OpenRouter calls, not 100.

---

## 10. Out of scope (flagged, not addressed here)

- **Hardcoded Google service-account key** in `supabase/functions/waitlist/index.ts` — a separate critical security issue. If the waitlist function is kept/deployed, rotate the key and move it to env. Not part of the engine swap.
- **React landing stale-DOM bug** when switching the local demo language — documented limitation; the standalone widget is unaffected.
- Broader review findings (a11y, SEO/JSON-LD, GA-before-consent, duplication) — tracked separately from this feature.

---

## 11. Decisions made

- **Batching:** Approach A — array per call, client-chunked at `batchSize` 25, JSON array out. (Rejected: per-text = too many LLM calls; whole-page = token-limit/all-or-nothing risk.)
- **Proxy platform:** Supabase edge function (repo already uses Supabase). Swappable for Cloudflare Worker / Vercel later — the request/response contract is platform-neutral.
- **Source language:** auto-detected by the model (omit `source`).
- **Proxy protection:** Origin allowlist + size caps as MVP; optional shared token; per-IP rate limiting as a later enhancement.
- **Model/key:** user-supplied via proxy env; quality and cost are the user's choice of model.
