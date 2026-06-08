import { describe, it, expect } from 'vitest';
import {
  validateRequest,
  isOriginAllowed,
  parseAllowedOrigins,
  DEFAULT_CAPS,
} from './lib';

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
