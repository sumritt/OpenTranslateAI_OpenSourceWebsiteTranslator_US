# Language List, Search, and Exclude — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two divergent hard-coded language lists with one canonical ~52-language set, and add allowlist, blocklist, and type-to-search to both the React widget and `public/widget.js`.

**Architecture:** A new pure module `src/languages.ts` holds the canonical list plus DOM-free helpers `computeLanguages()` and `matchLanguage()`, fully unit-tested. The React `TranslationWidget` imports them. `public/widget.js` is a standalone IIFE that cannot import, so it carries an identical copy of the list and mirrors the same algorithm; a Vitest drift-guard test asserts the two code sets stay equal.

**Tech Stack:** React 18 + TypeScript + Vite, Vitest + jsdom, standalone ES5-ish `widget.js`.

**Spec:** `docs/superpowers/specs/2026-06-08-language-list-search-exclude-design.md`

---

## File Structure

- **Create** `src/languages.ts` — canonical `LANGUAGES`, `RTL_CODES`, `matchLanguage`, `computeLanguages`.
- **Create** `src/languages.test.ts` — unit tests for the helpers + list sanity.
- **Create** `src/languages.drift.test.ts` — reads `public/widget.js`, asserts its code set equals `LANGUAGES`.
- **Modify** `public/widget.js` — replace `ALL_LANGUAGES`, add `computeLanguages`, `data-exclude`, search box.
- **Modify** `src/components/TranslationWidget.tsx` — import the module, add `includeLanguages`/`excludeLanguages` props, render the computed list, add search.

`src/App.tsx` is **not** modified: the new props are optional and the demo works without them.

---

## Task 1: `src/languages.ts` — list, RTL, `matchLanguage`

**Files:**
- Create: `src/languages.ts`
- Test: `src/languages.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/languages.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { LANGUAGES, RTL_CODES, matchLanguage } from './languages';

describe('LANGUAGES', () => {
  it('has unique codes', () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
  it('has ~52 entries', () => {
    expect(LANGUAGES.length).toBeGreaterThanOrEqual(50);
  });
  it('includes core languages', () => {
    const codes = LANGUAGES.map((l) => l.code);
    for (const c of ['en', 'th', 'zh', 'ar', 'es', 'hi', 'pt']) {
      expect(codes).toContain(c);
    }
  });
  it('every entry has code, name and nativeName', () => {
    for (const l of LANGUAGES) {
      expect(l.code).toBeTruthy();
      expect(l.name).toBeTruthy();
      expect(l.nativeName).toBeTruthy();
    }
  });
});

describe('RTL_CODES', () => {
  it('contains the four RTL languages', () => {
    expect(RTL_CODES).toEqual(['ar', 'he', 'fa', 'ur']);
  });
});

describe('matchLanguage', () => {
  const en = { code: 'en', name: 'English', nativeName: 'English' };
  const th = { code: 'th', name: 'Thai', nativeName: 'ไทย' };

  it('empty/whitespace query matches anything', () => {
    expect(matchLanguage(en, '')).toBe(true);
    expect(matchLanguage(en, '   ')).toBe(true);
  });
  it('matches by English name, case-insensitive', () => {
    expect(matchLanguage(en, 'eng')).toBe(true);
    expect(matchLanguage(en, 'ENG')).toBe(true);
  });
  it('matches by code', () => {
    expect(matchLanguage(th, 'th')).toBe(true);
  });
  it('matches by native name', () => {
    expect(matchLanguage(th, 'ไทย')).toBe(true);
  });
  it('returns false when nothing matches', () => {
    expect(matchLanguage(en, 'xyz')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/languages.test.ts`
Expected: FAIL — cannot resolve `./languages`.

- [ ] **Step 3: Write the implementation**

Create `src/languages.ts`:

```ts
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
];

export const RTL_CODES: string[] = ['ar', 'he', 'fa', 'ur'];

export function matchLanguage(lang: Language, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    lang.code.toLowerCase().includes(q) ||
    lang.name.toLowerCase().includes(q) ||
    lang.nativeName.toLowerCase().includes(q)
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/languages.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/languages.ts src/languages.test.ts
git commit -m "feat: add canonical language list and matchLanguage helper" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: `computeLanguages` (allowlist + blocklist + default guarantee)

**Files:**
- Modify: `src/languages.ts`
- Test: `src/languages.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `src/languages.test.ts`:

```ts
import { computeLanguages } from './languages';

describe('computeLanguages', () => {
  const A = { code: 'a', name: 'Alpha', nativeName: 'Alpha' };
  const B = { code: 'b', name: 'Beta', nativeName: 'Beta' };
  const C = { code: 'c', name: 'Gamma', nativeName: 'Gamma' };
  const ALL = [A, B, C];

  it('returns all when no include/exclude', () => {
    expect(computeLanguages({ all: ALL, defaultLang: 'a' })).toEqual([A, B, C]);
  });
  it('include keeps only listed, in canonical order', () => {
    expect(computeLanguages({ all: ALL, include: ['c', 'a'], defaultLang: 'a' })).toEqual([A, C]);
  });
  it('empty include array is treated as all', () => {
    expect(computeLanguages({ all: ALL, include: [], defaultLang: 'a' })).toEqual([A, B, C]);
  });
  it('exclude removes listed', () => {
    expect(computeLanguages({ all: ALL, exclude: ['b'], defaultLang: 'a' })).toEqual([A, C]);
  });
  it('include defines the base, exclude removes from it', () => {
    expect(
      computeLanguages({ all: ALL, include: ['a', 'b'], exclude: ['a'], defaultLang: 'b' }),
    ).toEqual([B]);
  });
  it('re-adds the default language when it was excluded', () => {
    const res = computeLanguages({ all: ALL, exclude: ['a'], defaultLang: 'a' });
    expect(res[0]).toEqual(A);
    expect(res.map((l) => l.code)).toEqual(['a', 'b', 'c']);
  });
  it('falls back to a bare entry when default is not in all', () => {
    const res = computeLanguages({ all: ALL, include: ['b'], defaultLang: 'zz' });
    expect(res[0]).toEqual({ code: 'zz', name: 'zz', nativeName: 'zz' });
    expect(res.map((l) => l.code)).toEqual(['zz', 'b']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/languages.test.ts`
Expected: FAIL — `computeLanguages` is not exported.

- [ ] **Step 3: Add the implementation**

Append to `src/languages.ts`:

```ts
export function computeLanguages(opts: {
  all: Language[];
  include?: string[];
  exclude?: string[];
  defaultLang: string;
}): Language[] {
  const { all, include, exclude, defaultLang } = opts;
  const base = include && include.length
    ? all.filter((l) => include.includes(l.code))
    : all;
  const excluded = new Set(exclude ?? []);
  const filtered = base.filter((l) => !excluded.has(l.code));
  if (!filtered.some((l) => l.code === defaultLang)) {
    const dl =
      all.find((l) => l.code === defaultLang) ??
      { code: defaultLang, name: defaultLang, nativeName: defaultLang };
    return [dl, ...filtered];
  }
  return filtered;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/languages.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/languages.ts src/languages.test.ts
git commit -m "feat: add computeLanguages allowlist/blocklist helper" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Drift guard + sync `public/widget.js` list to the canonical 52

**Files:**
- Create: `src/languages.drift.test.ts`
- Modify: `public/widget.js:18-28` (the `ALL_LANGUAGES` array)

- [ ] **Step 1: Write the failing drift test**

Create `src/languages.drift.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { LANGUAGES } from './languages';

describe('public/widget.js language list drift guard', () => {
  it('widget.js ALL_LANGUAGES codes equal src/languages.ts LANGUAGES codes', () => {
    const src = readFileSync(resolve(process.cwd(), 'public/widget.js'), 'utf8');
    const start = src.indexOf('var ALL_LANGUAGES = [');
    expect(start).toBeGreaterThan(-1);
    const end = src.indexOf('];', start);
    const block = src.slice(start, end);
    const codes = [...block.matchAll(/code:\s*'([^']+)'/g)].map((m) => m[1]);

    expect(codes.length).toBe(LANGUAGES.length);
    expect(new Set(codes)).toEqual(new Set(LANGUAGES.map((l) => l.code)));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/languages.drift.test.ts`
Expected: FAIL — `widget.js` still has the old 9-entry list, so counts/sets differ.

- [ ] **Step 3: Replace `ALL_LANGUAGES` in `public/widget.js`**

Replace the existing array (lines 18-28):

```js
  var ALL_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];
```

with the canonical 52 (codes and native names identical to `src/languages.ts`):

```js
  var ALL_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
    { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  ];
```

- [ ] **Step 4: Verify the drift test passes and widget.js still parses**

Run: `npx vitest run src/languages.drift.test.ts`
Expected: PASS.
Run: `node --check public/widget.js`
Expected: no output (syntax OK).

- [ ] **Step 5: Commit**

```bash
git add public/widget.js src/languages.drift.test.ts
git commit -m "feat: sync widget.js to canonical language list with drift guard" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: `widget.js` — `data-exclude` + shared compute logic

**Files:**
- Modify: `public/widget.js:31-36` (the `data-languages` mapping)

This mirrors `computeLanguages` from Task 2. `widget.js` is a standalone IIFE and cannot be imported into Vitest; the algorithm's contract is covered by the `computeLanguages` unit tests, and the list by the drift test. Verify here with `node --check` plus manual browser smoke test.

- [ ] **Step 1: Replace the list-selection block**

Replace lines 31-36:

```js
  var langAttr = script.getAttribute('data-languages');
  var LANGUAGES = langAttr
    ? langAttr.split(',').map(function (c) { return c.trim(); }).map(function (code) {
        return ALL_LANGUAGES.find(function (l) { return l.code === code; }) || { code: code, name: code, nativeName: code };
      })
    : ALL_LANGUAGES;
```

with:

```js
  function parseList(attr) {
    return attr
      ? attr.split(',').map(function (c) { return c.trim(); }).filter(Boolean)
      : [];
  }

  function computeLanguages(all, include, exclude, defaultLang) {
    var base = include.length
      ? all.filter(function (l) { return include.indexOf(l.code) !== -1; })
      : all;
    var filtered = base.filter(function (l) { return exclude.indexOf(l.code) === -1; });
    var hasDefault = filtered.some(function (l) { return l.code === defaultLang; });
    if (!hasDefault) {
      var match = all.filter(function (l) { return l.code === defaultLang; });
      var dl = match[0] || { code: defaultLang, name: defaultLang, nativeName: defaultLang };
      return [dl].concat(filtered);
    }
    return filtered;
  }

  var LANGUAGES = computeLanguages(
    ALL_LANGUAGES,
    parseList(script.getAttribute('data-languages')),
    parseList(script.getAttribute('data-exclude')),
    CONFIG.defaultLang
  );
```

Note: unlike the old code, allowlist codes not present in `ALL_LANGUAGES` are now ignored (matches `computeLanguages`).

- [ ] **Step 2: Verify it parses**

Run: `node --check public/widget.js`
Expected: no output (syntax OK).
Run: `npx vitest run src/languages.drift.test.ts`
Expected: PASS (the `ALL_LANGUAGES` block is unchanged by this task).

- [ ] **Step 3: Manual smoke test**

Serve the built site (or open a page embedding `public/widget.js`) with `data-exclude="th,ar"`; confirm those two are gone from the dropdown and `data-languages="en,th,zh"` still limits to that set.

- [ ] **Step 4: Commit**

```bash
git add public/widget.js
git commit -m "feat: add data-exclude blocklist to widget.js" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: `widget.js` — search box

**Files:**
- Modify: `public/widget.js` (CSS in `buildUI`, menu markup, open handler)

- [ ] **Step 1: Add CSS for the search input and scroll list**

In `buildUI`, the `css` string currently ends with the `.otw-bar` rule. Change the `.otw-menu` rule and add two rules. Replace:

```js
      '.otw-menu{position:absolute;top:calc(100% + 8px);right:0;width:220px;max-height:380px;overflow:auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 15px rgba(0,0,0,.1);display:none}' +
```

with:

```js
      '.otw-menu{position:absolute;top:calc(100% + 8px);right:0;width:220px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 15px rgba(0,0,0,.1);display:none;overflow:hidden}' +
      '.otw-search{width:100%;box-sizing:border-box;padding:10px 16px;border:none;border-bottom:1px solid #e5e7eb;font-size:14px;outline:none}' +
      '.otw-list{max-height:320px;overflow:auto}' +
      '.otw-empty{padding:10px 16px;color:#9ca3af;font-size:13px;display:none}' +
```

- [ ] **Step 2: Rebuild the menu markup with a search input + searchable list**

Replace:

```js
    menu.innerHTML = LANGUAGES.map(function (l) {
      return '<button class="otw-opt" type="button" data-lang="' + l.code + '">' +
        '<span>' + l.nativeName + '</span><span>' + l.name + '</span></button>';
    }).join('');
```

with:

```js
    menu.innerHTML =
      '<input class="otw-search" type="text" placeholder="Search language…" />' +
      '<div class="otw-list">' +
      LANGUAGES.map(function (l) {
        var search = (l.code + ' ' + l.name + ' ' + l.nativeName).toLowerCase();
        return '<button class="otw-opt" type="button" data-lang="' + l.code + '" data-search="' + search + '">' +
          '<span>' + l.nativeName + '</span><span>' + l.name + '</span></button>';
      }).join('') +
      '<div class="otw-empty">No languages found</div>' +
      '</div>';

    var searchInput = menu.querySelector('.otw-search');
    var emptyRow = menu.querySelector('.otw-empty');
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      var anyVisible = false;
      menu.querySelectorAll('.otw-opt').forEach(function (opt) {
        var match = !q || opt.getAttribute('data-search').indexOf(q) !== -1;
        opt.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      emptyRow.style.display = anyVisible ? 'none' : 'block';
    });
```

- [ ] **Step 3: Reset + focus search when the menu opens**

Replace the button click handler:

```js
    btn.addEventListener('click', function () { if (!isTranslating) menu.classList.toggle('open'); });
```

with:

```js
    btn.addEventListener('click', function () {
      if (isTranslating) return;
      var willOpen = !menu.classList.contains('open');
      menu.classList.toggle('open');
      if (willOpen) {
        searchInput.value = '';
        menu.querySelectorAll('.otw-opt').forEach(function (opt) { opt.style.display = ''; });
        emptyRow.style.display = 'none';
        searchInput.focus();
      }
    });
```

- [ ] **Step 4: Verify it parses + manual smoke test**

Run: `node --check public/widget.js`
Expected: no output.
Manual: open the embed, click the widget, type in the box — the list filters by code/name/native name; clearing shows all; "No languages found" appears for a non-match.

- [ ] **Step 5: Commit**

```bash
git add public/widget.js
git commit -m "feat: add type-to-search to widget.js language menu" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: React `TranslationWidget` — use the module + include/exclude props

**Files:**
- Modify: `src/components/TranslationWidget.tsx`

- [ ] **Step 1: Replace the inline list with an import**

Remove the local `Language` interface and `LANGUAGES` array (lines 6-23). At the top, change the imports so the first lines read:

```ts
import { useState, useEffect, useMemo } from 'react';
import { Globe, Loader2, Check, AlertCircle } from 'lucide-react';
import { TranslationService } from '../services/translation';
import { DOMTranslator } from '../services/domTranslator';
import { LANGUAGES, computeLanguages, matchLanguage } from '../languages';
```

- [ ] **Step 2: Add the two props**

In `TranslationWidgetProps`, add after `localLanguages?: string[];`:

```ts
  includeLanguages?: string[];
  excludeLanguages?: string[];
```

In the function parameter destructuring, add after `localLanguages = [],`:

```ts
  includeLanguages,
  excludeLanguages,
```

- [ ] **Step 3: Compute the available list and render from it**

After the `cachedLanguages` state declaration (near the other `useState` calls), add:

```ts
  const availableLanguages = useMemo(
    () =>
      computeLanguages({
        all: LANGUAGES,
        include: includeLanguages,
        exclude: excludeLanguages,
        defaultLang,
      }),
    [includeLanguages, excludeLanguages, defaultLang],
  );
```

In the dropdown, change the iteration from `LANGUAGES.map(...)` to `availableLanguages.map(...)`:

```ts
              {availableLanguages.map((lang) => {
```

(The `currentLanguage` button-label lookup keeps using `LANGUAGES.find(...)` so the active language always resolves, even if excluded.)

- [ ] **Step 4: Verify**

Run: `npm run typecheck`
Expected: no errors.
Run: `npx vitest run`
Expected: all tests PASS.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/TranslationWidget.tsx
git commit -m "feat: drive widget language list from languages module with include/exclude" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: React `TranslationWidget` — search box

**Files:**
- Modify: `src/components/TranslationWidget.tsx`

- [ ] **Step 1: Add search state, cleared when the menu closes**

After the `availableLanguages` memo, add:

```ts
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setSearchQuery('');
  }, [isOpen]);

  const visibleLanguages = availableLanguages.filter((lang) =>
    matchLanguage(lang, searchQuery),
  );
```

- [ ] **Step 2: Render the search input + scrollable, filtered list**

In the dropdown panel (`{isOpen && !isTranslating && (...)}`), the block currently renders a header `<div className="mb-3">…</div>` then `<div className="grid grid-cols-2 …">{availableLanguages.map(...)}</div>`. Replace that header `<div>` with a search input, switch the grid to iterate `visibleLanguages`, wrap it in a scroll container, and add an empty state. The panel inner markup becomes:

```tsx
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language…"
              autoFocus
              className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-2 w-[320px] max-w-[calc(100vw-2rem)] max-h-72 overflow-y-auto">
              {visibleLanguages.map((lang) => {
                const isLocal = localLanguages.includes(lang.code);
                const isCached = cachedLanguages.includes(lang.code);
                const showInstantBadge = isLocal || isCached;
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`relative px-3 py-3 rounded-lg transition-all duration-200 text-left group ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md scale-[1.02]'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {lang.nativeName}
                        </span>
                        {showInstantBadge && !isSelected && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded font-semibold">
                            ⚡
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${
                        isSelected ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {lang.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
              {visibleLanguages.length === 0 && (
                <p className="col-span-2 text-xs text-gray-400 py-2 px-1">No languages found</p>
              )}
            </div>
```

(The per-option button markup is unchanged from Task 6 — only the iterated array, the wrapper classes, the new input, and the empty state differ. The old `<p>Select Language</p>` header is removed.)

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: no errors.
Run: `npm run build`
Expected: build succeeds.
Run: `npx vitest run`
Expected: all tests PASS.

- [ ] **Step 4: Manual smoke test**

`npm run dev`, open the widget: typing filters by native name / English name / code; the active language still shows on the button; "No languages found" appears for a non-match; closing and reopening clears the search.

- [ ] **Step 5: Commit**

```bash
git add src/components/TranslationWidget.tsx
git commit -m "feat: add type-to-search to the React language selector" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec coverage:** canonical ~52 set (Task 1, 3) ✓; `computeLanguages`/`matchLanguage` (Task 1, 2) ✓; React include/exclude props (Task 6) ✓; React search (Task 7) ✓; widget.js `data-exclude` (Task 4) ✓; widget.js search (Task 5) ✓; default-language guarantee (Task 2 + mirrored Task 4) ✓; drift guard (Task 3) ✓; RTL list defined (Task 1) ✓. Untouched: engine/proxy/pool/localLanguages ✓.
- **Type/name consistency:** `computeLanguages({ all, include?, exclude?, defaultLang })` and `matchLanguage(lang, query)` signatures identical across Tasks 2, 6, 7; widget.js mirror uses the same algorithm with positional args (Task 4). `LANGUAGES`, `RTL_CODES`, `Language` names consistent.
- **Note:** `RTL_CODES` is exported for completeness/parity; React `dir` handling is explicitly out of scope (widget.js already sets `dir`).
```
