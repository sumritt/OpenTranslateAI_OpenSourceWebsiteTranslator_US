# Open-Source AI Website Translator Widget | Google Translate Alternative

A production-ready, SEO-friendly AI translation widget for modern websites. Translation is powered by an **LLM through [OpenRouter](https://openrouter.ai/)**, called via a small **Supabase Edge Function proxy** so your API key never ships to the browser. Built with React + TypeScript, and also available as a single drop-in `<script>` embed.

> This repository is a fork that re-platforms the original LibreTranslate-based template onto OpenRouter + a serverless proxy. See [Acknowledgements](#acknowledgements).

🔗 **[Original project (aceman23)](https://github.com/aceman23/OpenTranslateAI_OpenSourceWebsiteTranslator_US)**

## Why this widget?

✅ **Bring your own model** — point `OPENROUTER_MODEL` at any OpenRouter model (e.g. `google/gemini-2.5-flash`, GPT-4o, Claude, DeepSeek, Qwen)

✅ **Key stays server-side** — the OpenRouter key lives only in the Supabase proxy's secrets, never in the client bundle

✅ **Embed anywhere** — a standalone `public/widget.js` works on any site via one `<script>` tag, no build step

✅ **~50 languages** — curated set with native names, type-to-search, and per-site allowlist / blocklist

✅ **Works on dynamic pages** — a `MutationObserver` translates content mounted after load (accordions, modals, tabs, lazy sections)

✅ **Full control** — open source, self-hosted proxy, origin allowlist + optional shared token

## Features

### Translation
- **Smart DOM translation**: walks text nodes with `TreeWalker` and updates them in place, preserving HTML structure, styles, and interactive elements
- **OpenRouter LLM backend**: any chat model via a single configurable env var
- **~50 languages**: native names + English names, type-to-search in the dropdown; restrict with `includeLanguages` / `excludeLanguages` (React) or `data-languages` / `data-exclude` (widget.js)
- **Dynamic content**: newly mounted nodes are auto-translated to the active language via a `MutationObserver`
- **Smart caching**: per-text and per-language caches make switching back to a translated language instant
- **Batched + concurrent**: text is chunked and translated through a bounded worker pool, with a progress bar
- **Resilient**: a failed batch is bisected so one bad item can't block its neighbours; failed (degraded) responses are never cached

### Embedding
- **React component**: `<TranslationWidget />` for React/Vite apps
- **Standalone script**: `public/widget.js` — a self-contained IIFE that reads config from its own `data-*` attributes, injects its own UI, and calls the proxy

### Production-ready
- SEO meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- Accessible (ARIA, keyboard navigation, screen-reader friendly)
- GDPR cookie consent banner; Privacy Policy / Terms / Cookie Policy pages
- Mobile responsive; custom 404 page

## How it works

```
Browser (React widget or widget.js)
  → POST { texts: string[], target } to the Supabase Edge Function (translate)
      → proxy validates origin + optional X-Widget-Token, builds the prompt,
        calls OpenRouter with OPENROUTER_API_KEY (server-side only)
      → returns a JSON array of translations
  → widget writes each translation back onto its text node
```

The OpenRouter key is read from the proxy's environment and is never exposed to the client. The browser only knows the proxy URL (and an optional shared widget token).

## Quick Start

### 1. Install & run the demo

```bash
npm install
npm run dev
```

### 2. Deploy the translate proxy (Supabase Edge Function)

The proxy lives in `supabase/functions/translate`. Set its secrets and deploy:

```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-...
supabase secrets set OPENROUTER_MODEL=google/gemini-2.5-flash
supabase secrets set ALLOWED_ORIGINS=https://your-site.com,http://localhost:5173
# optional shared token; if set, clients must send the same value
supabase secrets set WIDGET_TOKEN=some-shared-secret

supabase functions deploy translate
```

`supabase/config.toml` sets `verify_jwt = false` for this function — it is intentionally public and protected by the origin allowlist + optional `WIDGET_TOKEN`, not by a Supabase JWT.

### 3a. Use the React widget

```tsx
import { TranslationWidget } from './components/TranslationWidget';

function App() {
  return (
    <>
      <TranslationWidget
        proxyUrl={import.meta.env.VITE_TRANSLATE_PROXY_URL}
        token={import.meta.env.VITE_TRANSLATE_TOKEN}
        defaultLang="en"
        targetElementId="content"
        position="top-right"
      />
      <div id="content">{/* your translatable content */}</div>
    </>
  );
}
```

### 3b. Or embed `widget.js` on any site

```html
<div id="content"><!-- your content --></div>

<script
  src="https://your-cdn.com/widget.js"
  data-proxy="https://your-project.supabase.co/functions/v1/translate"
  data-default="en"
  data-element="content"
  data-exclude="th,ar"
  defer
></script>
```

## Configuration

### React `<TranslationWidget>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `proxyUrl` | string | — (required) | Translate Edge Function URL |
| `token` | string | undefined | Shared widget token; sent as `X-Widget-Token` (must match `WIDGET_TOKEN`) |
| `defaultLang` | string | `'zh'` | Language the page content is written in (the "original") |
| `targetElementId` | string | `'translatable-content'` | ID of the element to translate |
| `position` | string | `'top-right'` | `top-left` \| `top-right` \| `bottom-left` \| `bottom-right` |
| `includeLanguages` | string[] | undefined | Allowlist of language codes to show |
| `excludeLanguages` | string[] | undefined | Blocklist of language codes to hide |
| `onLanguageChange` | function | undefined | Callback `(lang) => void` when language changes |

### `widget.js` `data-*` attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-proxy` | — (required) | Translate Edge Function URL |
| `data-token` | `''` | Shared widget token (`X-Widget-Token`) |
| `data-default` | `'en'` | Original language of the page |
| `data-element` | whole page | ID of the element to translate |
| `data-languages` | all | Comma-separated allowlist of codes (e.g. `en,th,zh`) |
| `data-exclude` | none | Comma-separated blocklist of codes (e.g. `th,ar`) |
| `data-concurrency` | `5` | Parallel translation requests |

## Preventing translation

Add `data-no-translate` to any element (and its subtree) that must stay untranslated:

```html
<button data-no-translate>Original Text</button>
<div data-no-translate><!-- skipped entirely --></div>
```

## Dynamic content

The widget snapshots text nodes on init, then keeps watching the target element with a `MutationObserver`. Content that mounts later — FAQ accordion answers, modals, tabs, lazily loaded sections — is captured and translated into the language currently shown, so dynamic pages stay fully translated.

## Supported languages

~50 curated languages, each with a native name. The canonical list is `src/languages.ts` (mirrored into `public/widget.js`, kept in sync by a drift test):

```
en English   zh Chinese   es Spanish   hi Hindi   ar Arabic   bn Bengali
pt Portuguese ru Russian   ja Japanese  de German  fr French   ko Korean
it Italian   tr Turkish   vi Vietnamese th Thai    id Indonesian pl Polish
uk Ukrainian nl Dutch     fa Persian   he Hebrew  ur Urdu     ms Malay
fil Filipino sw Swahili   ro Romanian  el Greek   cs Czech    hu Hungarian
sv Swedish   da Danish    fi Finnish   no Norwegian sk Slovak  bg Bulgarian
hr Croatian  sr Serbian   lt Lithuanian sl Slovenian et Estonian lv Latvian
ta Tamil     te Telugu    ml Malayalam kn Kannada  mr Marathi  gu Gujarati
pa Punjabi   my Burmese   km Khmer     ne Nepali
```

RTL languages (`ar`, `he`, `fa`, `ur`) set `dir="rtl"` in the standalone widget.

> Codes are sent to the model as full English names (e.g. `my` → "Burmese") to avoid ambiguous ISO codes — `my` is Burmese in ISO 639-1 but also Malaysia's country code.

## Environment variables

**Client (Vite — exposed in the bundle, safe to be public):**

| Var | Description |
|-----|-------------|
| `VITE_TRANSLATE_PROXY_URL` | Translate Edge Function URL |
| `VITE_TRANSLATE_TOKEN` | Optional shared token; must match `WIDGET_TOKEN` |

**Proxy secrets (`supabase secrets set` — never in the client):**

| Var | Description |
|-----|-------------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_MODEL` | Model id, e.g. `google/gemini-2.5-flash` |
| `ALLOWED_ORIGINS` | Comma-separated origin allowlist |
| `WIDGET_TOKEN` | Optional shared token clients must send |

See `.env.example`.

## Project structure

```
src/
├── components/
│   ├── TranslationWidget.tsx   # main React widget
│   ├── TranslationDebug.tsx    # dev-only debug panel
│   ├── DemoContentEnglish.tsx  # demo landing page
│   ├── CookieConsent.tsx       # GDPR cookie banner
│   └── NotFound.tsx            # 404 page
├── services/
│   ├── translation.ts          # proxy client + cache
│   └── domTranslator.ts        # DOM walking, batching, MutationObserver
├── languages.ts                # canonical language list + helpers
└── App.tsx

public/
└── widget.js                   # standalone <script> embed

supabase/functions/translate/
├── index.ts                    # Edge Function (CORS, auth, OpenRouter call)
└── lib.ts                      # validation, prompt builder, output parser
```

## Build commands

```bash
npm run dev        # development server
npm run build      # production build
npm run preview    # preview the build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest run
```

## Troubleshooting

- **Translations are slow**: pick a fast model via `OPENROUTER_MODEL` and, where supported, disable reasoning tokens (the proxy already sends `reasoning: { enabled: false }`, which works on models where thinking is optional, e.g. Gemini 2.5 Flash; some models make thinking mandatory).
- **Part of the page is translated, the rest stays original**: a batch that the model returns unusable is left untranslated; the widget bisects and retries, and re-selecting the language retries any remaining items.
- **A language translates into the wrong language**: ensure the proxy is redeployed — codes are resolved to full English names server-side.
- **`401`/`403` from the proxy**: check `ALLOWED_ORIGINS` includes your site's origin and that `WIDGET_TOKEN` (if set) matches the client token.

## Contributing

Contributions are welcome — open an issue or PR.

## License

MIT License — free to use in personal and commercial projects.

## Credits

Built with:
- [OpenRouter](https://openrouter.ai/) — unified LLM API for translation
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions) — serverless key-holding proxy
- [React](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) · [Lucide React](https://lucide.dev/) · [Vite](https://vitejs.dev/)

## Acknowledgements

Huge thanks to **[@aceman23](https://github.com/aceman23)** and **Hybrid Ads.ai** for the original open-source website translator, [OpenTranslateAI_OpenSourceWebsiteTranslator_US](https://github.com/aceman23/OpenTranslateAI_OpenSourceWebsiteTranslator_US). This fork builds on their landing page, SEO scaffolding, and React widget foundation, re-platforming the translation engine onto OpenRouter + a serverless proxy. 🙏

## SEO Keywords

open source AI website translator widget, Google Translate alternative, OpenRouter translation, self-hosted translation proxy, React translation component, TypeScript i18n, language switcher widget, embeddable website translator, GDPR-compliant translation, multilingual website
