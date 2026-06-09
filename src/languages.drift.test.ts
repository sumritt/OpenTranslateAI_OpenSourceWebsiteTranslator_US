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
