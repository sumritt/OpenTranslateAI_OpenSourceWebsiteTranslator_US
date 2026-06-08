import { describe, it, expect } from 'vitest';
import {
  validateRequest,
  isOriginAllowed,
  parseAllowedOrigins,
  DEFAULT_CAPS,
} from './lib';
import { buildMessages, parseTranslations } from './lib';

describe('validateRequest', () => {
  it('accepts a valid batch', () => {
    const r = validateRequest({ texts: ['hi', 'bye'], target: 'th' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.texts).toEqual(['hi', 'bye']);
  });

  it('rejects non-array texts', () => {
    expect(validateRequest({ texts: 'hi', target: 'th' }).ok).toBe(false);
  });

  it('rejects missing target', () => {
    expect(validateRequest({ texts: ['hi'] }).ok).toBe(false);
  });

  it('rejects empty texts', () => {
    expect(validateRequest({ texts: [], target: 'th' }).ok).toBe(false);
  });

  it('rejects too many texts', () => {
    const texts = Array.from({ length: DEFAULT_CAPS.maxTexts + 1 }, () => 'a');
    expect(validateRequest({ texts, target: 'th' }).ok).toBe(false);
  });

  it('rejects an oversized single text', () => {
    const texts = ['a'.repeat(DEFAULT_CAPS.maxChars + 1)];
    expect(validateRequest({ texts, target: 'th' }).ok).toBe(false);
  });

  it('rejects when the total payload exceeds the aggregate cap', () => {
    // 5 texts of 4001 chars each = 20005 total: each under maxChars, count under maxTexts,
    // but over maxTotal (20000).
    const texts = Array.from({ length: 5 }, () => 'a'.repeat(4001));
    expect(validateRequest({ texts, target: 'th' }).ok).toBe(false);
  });
});

describe('isOriginAllowed', () => {
  it('allows listed origin', () => {
    expect(isOriginAllowed('https://a.com', ['https://a.com'])).toBe(true);
  });
  it('blocks unlisted origin', () => {
    expect(isOriginAllowed('https://evil.com', ['https://a.com'])).toBe(false);
  });
  it('wildcard allows anything', () => {
    expect(isOriginAllowed('https://evil.com', ['*'])).toBe(true);
  });
  it('blocks null origin without wildcard', () => {
    expect(isOriginAllowed(null, ['https://a.com'])).toBe(false);
  });
});

describe('parseAllowedOrigins', () => {
  it('splits and trims', () => {
    expect(parseAllowedOrigins('https://a.com, https://b.com')).toEqual([
      'https://a.com',
      'https://b.com',
    ]);
  });
  it('handles undefined', () => {
    expect(parseAllowedOrigins(undefined)).toEqual([]);
  });
});

describe('buildMessages', () => {
  it('produces a system + user message with the target language', () => {
    const msgs = buildMessages(['hi'], 'Thai');
    expect(msgs).toHaveLength(2);
    expect(msgs[0].role).toBe('system');
    expect(msgs[0].content).toContain('Thai');
    expect(msgs[1].role).toBe('user');
    expect(msgs[1].content).toBe(JSON.stringify(['hi']));
  });

  it('mentions auto-detection when no source given', () => {
    expect(buildMessages(['hi'], 'th')[0].content.toLowerCase()).toContain('detect');
  });
});

describe('parseTranslations', () => {
  it('parses a plain JSON array of the right length', () => {
    expect(parseTranslations('["สวัสดี","ลาก่อน"]', 2)).toEqual(['สวัสดี', 'ลาก่อน']);
  });

  it('strips ```json fences', () => {
    const content = '```json\n["a","b"]\n```';
    expect(parseTranslations(content, 2)).toEqual(['a', 'b']);
  });

  it('returns null on length mismatch', () => {
    expect(parseTranslations('["a"]', 2)).toBeNull();
  });

  it('returns null on invalid JSON', () => {
    expect(parseTranslations('not json', 1)).toBeNull();
  });

  it('returns null when elements are not strings', () => {
    expect(parseTranslations('[1,2]', 2)).toBeNull();
  });
});
