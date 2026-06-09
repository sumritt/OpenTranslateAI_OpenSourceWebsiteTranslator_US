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
