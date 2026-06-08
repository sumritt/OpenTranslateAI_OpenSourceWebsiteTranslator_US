export interface TranslateRequest {
  texts: string[];
  target: string;
  source?: string;
}

export interface Caps {
  maxTexts: number;
  maxChars: number;
  maxTotal: number;
}

export const DEFAULT_CAPS: Caps = {
  maxTexts: 60,
  maxChars: 5000,
  maxTotal: 20000,
};

export type ValidationResult =
  | { ok: true; value: TranslateRequest }
  | { ok: false; error: string };

export function validateRequest(body: unknown, caps: Caps = DEFAULT_CAPS): ValidationResult {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid body' };
  const { texts, target, source } = body as Record<string, unknown>;
  if (!Array.isArray(texts) || texts.some((t) => typeof t !== 'string')) {
    return { ok: false, error: 'texts must be an array of strings' };
  }
  if (typeof target !== 'string' || !target.trim()) {
    return { ok: false, error: 'target is required' };
  }
  if (texts.length === 0) return { ok: false, error: 'texts must not be empty' };
  if (texts.length > caps.maxTexts) return { ok: false, error: 'too many texts' };
  let total = 0;
  for (const t of texts as string[]) {
    if (t.length > caps.maxChars) return { ok: false, error: 'a text is too long' };
    total += t.length;
  }
  if (total > caps.maxTotal) return { ok: false, error: 'payload too large' };
  return {
    ok: true,
    value: {
      texts: texts as string[],
      target,
      source: typeof source === 'string' ? source : undefined,
    },
  };
}

export function isOriginAllowed(origin: string | null, allowed: string[]): boolean {
  if (allowed.includes('*')) return true;
  if (!origin) return false;
  return allowed.includes(origin);
}

export function parseAllowedOrigins(env: string | undefined): string[] {
  return (env || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
