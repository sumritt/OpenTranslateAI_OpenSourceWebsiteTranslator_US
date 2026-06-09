export interface TranslationConfig {
  proxyUrl: string;
  token?: string;
}

export interface TranslationCache {
  [key: string]: string;
}

export class TranslationService {
  private config: TranslationConfig;
  private cache: TranslationCache = {};

  constructor(config: TranslationConfig) {
    this.config = config;
  }

  private cacheKey(text: string, target: string): string {
    return `${target}::${text.trim()}`;
  }

  async translateBatch(texts: string[], target: string): Promise<string[]> {
    if (texts.length === 0) return [];

    const allCached = texts.every((t) => this.cache[this.cacheKey(t, target)] !== undefined);
    if (allCached) {
      return texts.map((t) => this.cache[this.cacheKey(t, target)]);
    }

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (this.config.token) headers['X-Widget-Token'] = this.config.token;

        const response = await fetch(this.config.proxyUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ texts, target }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Translation proxy error: ${response.status}`);
        }

        const data = await response.json();
        // The proxy answers HTTP 200 with { degraded: true } and echoes the
        // original texts when the model failed to produce a usable translation.
        // Treat it as a failure so the untranslated passthrough is never cached
        // as a translation, letting the caller retry (e.g. with a smaller batch).
        if (data?.degraded === true) {
          throw new Error('Translation degraded');
        }
        const translations = data?.translations;
        if (!Array.isArray(translations) || translations.length !== texts.length) {
          throw new Error('Malformed translation response');
        }

        texts.forEach((t, i) => {
          this.cache[this.cacheKey(t, target)] = translations[i];
        });
        return translations;
      } catch (error) {
        lastError = error as Error;
        // These are deterministic at temperature 0 — retrying the same payload
        // would just fail again and waste calls. Surface immediately.
        if (lastError.message === 'Malformed translation response') break;
        if (lastError.message === 'Translation degraded') break;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    console.error('Translation failed after retries:', lastError);
    throw lastError ?? new Error('Translation failed');
  }

  clearCache(): void {
    this.cache = {};
  }
}
