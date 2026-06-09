import { describe, it, expect } from 'vitest';
import { LANGUAGES, RTL_CODES, matchLanguage, computeLanguages } from './languages';

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
