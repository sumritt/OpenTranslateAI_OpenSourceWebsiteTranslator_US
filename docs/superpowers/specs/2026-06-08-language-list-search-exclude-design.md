# Language List, Search, and Exclude — Design

- **Date:** 2026-06-08
- **Status:** Approved (pending written-spec review)
- **Scope:** Translation widget language selector (React `TranslationWidget` + standalone `public/widget.js`)

## Overview

The widget currently ships two **divergent** hard-coded language lists:

- `src/components/TranslationWidget.tsx` — 10 languages (`zh, en, es, fr, de, ja, ko, ar, hi, pt`), no filtering, no search.
- `public/widget.js` — 9 languages (`en, th, zh, es, fr, de, ja, ko, ar`), with an allowlist via `data-languages`, no exclude, no search.

This design:

1. Replaces both with a single **canonical ~50-language set** (kept identical in both files, guarded by a drift test).
2. Adds **allowlist** (`includeLanguages` / `data-languages`) and **blocklist** (`excludeLanguages` / `data-exclude`) configuration to both surfaces.
3. Adds a **type-to-search** box to both dropdowns (necessary at ~50 entries).

The translation engine, proxy, batching/concurrency pool, and the demo-only `localLanguages` component-swap are **not** touched.

## Goals / Non-goals

**Goals**

- One canonical language set, ~50 major languages, with English name + native name.
- Configurable allowlist and blocklist on both the React widget and `widget.js`.
- Live search filter in both dropdowns.
- The default (original) language is always selectable, so the user can always restore the original page.

**Non-goals**

- Adding arbitrary/obscure languages outside the curated ~50 (custom-language support is a separate future feature).
- Sharing code between the React module and `widget.js` via a build step (kept as two synced copies; see Drift Guard).
- RTL direction handling inside the React widget (`widget.js` already sets `dir`; the React app is the demo surface — out of scope here, noted as a pre-existing gap).
- Changing the translation engine, proxy, caching, or concurrency.

## Canonical Language Set

`~52` languages, ordered roughly by global usage. Each entry: `{ code, name, nativeName }`. `code` is ISO 639-1 (plus `fil` for Filipino).

```
en English / English          zh Chinese / 中文            es Spanish / Español
hi Hindi / हिन्दी              ar Arabic / العربية          bn Bengali / বাংলা
pt Portuguese / Português     ru Russian / Русский         ja Japanese / 日本語
de German / Deutsch           fr French / Français         ko Korean / 한국어
it Italian / Italiano         tr Turkish / Türkçe          vi Vietnamese / Tiếng Việt
th Thai / ไทย                 id Indonesian / Bahasa Indonesia   pl Polish / Polski
uk Ukrainian / Українська     nl Dutch / Nederlands        fa Persian / فارسی
he Hebrew / עברית             ur Urdu / اردو               ms Malay / Bahasa Melayu
fil Filipino / Filipino       sw Swahili / Kiswahili       ro Romanian / Română
el Greek / Ελληνικά           cs Czech / Čeština           hu Hungarian / Magyar
sv Swedish / Svenska          da Danish / Dansk            fi Finnish / Suomi
no Norwegian / Norsk          sk Slovak / Slovenčina       bg Bulgarian / Български
hr Croatian / Hrvatski        sr Serbian / Српски          lt Lithuanian / Lietuvių
sl Slovenian / Slovenščina    et Estonian / Eesti          lv Latvian / Latviešu
ta Tamil / தமிழ்              te Telugu / తెలుగు           ml Malayalam / മലയാളം
kn Kannada / ಕನ್ನಡ            mr Marathi / मराठी           gu Gujarati / ગુજરાતી
pa Punjabi / ਪੰਜਾਬੀ           my Burmese / မြန်မာ          km Khmer / ខ្មែរ
ne Nepali / नेपाली
```

**RTL subset:** `['ar', 'he', 'fa', 'ur']`. (`widget.js` already uses this list for `dir`.)

The exact array is finalized in `src/languages.ts` during implementation.

## Module: `src/languages.ts`

Single source of truth for the React side, plus pure (DOM-free, unit-testable) helpers.

```ts
export interface Language { code: string; name: string; nativeName: string; }

export const LANGUAGES: Language[];          // the canonical ~52
export const RTL_CODES: string[];            // ['ar','he','fa','ur']

export function computeLanguages(opts: {
  all: Language[];
  include?: string[];      // allowlist of codes; undefined/empty = all
  exclude?: string[];      // blocklist of codes
  defaultLang: string;     // always present in the result
}): Language[];

export function matchLanguage(lang: Language, query: string): boolean;
```

### `computeLanguages` rules

1. `base = (include && include.length) ? all.filter(l => include.includes(l.code)) : all`
   - Unknown codes in `include` are ignored (no entry in `all`). Adding unknown languages is out of scope.
2. `filtered = base.filter(l => !(exclude ?? []).includes(l.code))`
3. Ensure the default language is selectable: if no entry in `filtered` has `code === defaultLang`, prepend the `all` entry for `defaultLang` (or, if `defaultLang` is not in `all`, a `{ code, name: code, nativeName: code }` fallback).
4. Canonical order from `all` is preserved; the re-added default (step 3) is prepended.

### `matchLanguage` rules

- `q = query.trim().toLowerCase()`. Empty `q` → `true` (no filtering).
- Returns `true` if `q` is a case-insensitive substring of `code`, `name`, **or** `nativeName`.

## React `TranslationWidget`

- Import `LANGUAGES`, `computeLanguages`, `matchLanguage` from `src/languages.ts` (remove the inline `LANGUAGES` array).
- **New props:**
  - `includeLanguages?: string[]` — allowlist (parity with `data-languages`).
  - `excludeLanguages?: string[]` — blocklist (parity with `data-exclude`).
- Compute the configured list once (memoized): `computeLanguages({ all: LANGUAGES, include: includeLanguages, exclude: excludeLanguages, defaultLang })`.
- **Search:** a controlled `<input>` at the top of the open dropdown. Local `searchQuery` state; the rendered options are `configured.filter(l => matchLanguage(l, searchQuery))`.
  - Autofocus the input when the menu opens.
  - Clear `searchQuery` when the menu closes.
  - Show a "no matches" row when the filtered list is empty.
- `localLanguages` (demo swap) and the existing instant-cache badge logic are unchanged; they operate on the configured list.

## `public/widget.js`

- Replace `ALL_LANGUAGES` with the canonical ~52 (identical to `src/languages.ts`).
- **Config:**
  - `data-languages` — allowlist (existing; now strictly filters the canonical set — the prior "bare unknown code" fallback is dropped for consistency with `computeLanguages`).
  - `data-exclude="th,ar"` — new blocklist.
- Compute the configured list with the same logic as `computeLanguages` (mirrored inline, ~5 lines), including the default-language guarantee.
- **Search:** an `<input>` at the top of `.otw-menu`. On input, filter the option rows case-insensitively against each option's searchable text (`code + name + nativeName`, stored in a `data-search` attribute), toggling visibility. Autofocus on open; Escape still closes the menu.

## Data Flow

```
all (canonical ~52)
  → base   = include ? keep codes in include : all
  → minus  = base without codes in exclude
  → ensure = minus ∪ { defaultLang }          // config-level, always selectable
  → render = ensure.filter(matchLanguage(query))  // live search, UI-only
```

The default-language guarantee is **config-level**. Live search may transiently hide the default while typing; clearing the search restores it.

## Duplication & Drift Guard (Approach A)

The canonical list lives in two files that cannot share code (`widget.js` is a standalone IIFE served statically, no import/build). To prevent drift:

- A Vitest test reads `public/widget.js` as text, extracts the `code:` values from its `ALL_LANGUAGES` array via regex, and asserts the resulting code **set** equals the set of `LANGUAGES[].code` from `src/languages.ts`.
- This catches added/removed/renamed codes cheaply, without a build step, keeping `widget.js` a single embeddable file.

## Testing Strategy (Vitest)

- **Drift guard:** `widget.js` code set === `src/languages.ts` code set.
- **`computeLanguages`:**
  - no include/exclude → returns all.
  - include subset → returns only those (canonical order).
  - exclude → removes those.
  - include + exclude together → include defines base, exclude removes from it.
  - excluding the default language → default still present.
  - default not in `all` → fallback entry present.
- **`matchLanguage`:**
  - empty query → true.
  - matches by `name`, by `nativeName`, by `code`, case-insensitive.
  - non-match → false.

`widget.js`'s mirrored filter/search is a thin copy; the pure helpers above are the tested contract and the drift guard covers the data.

## Out of Scope

- Translation engine, proxy, OpenRouter config, batching/concurrency.
- React-side RTL `dir` handling (pre-existing gap; `widget.js` handles `dir`).
- Custom/arbitrary languages beyond the curated set.
- `localLanguages` demo behavior.
