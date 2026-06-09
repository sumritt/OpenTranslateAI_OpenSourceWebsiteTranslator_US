import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { LANGUAGES } from './languages';

function parseWidgetLanguages(): { code: string; name: string; nativeName: string }[] {
  const src = readFileSync(resolve(process.cwd(), 'public/widget.js'), 'utf8');
  const start = src.indexOf('var ALL_LANGUAGES = [');
  if (start < 0) throw new Error('ALL_LANGUAGES not found in public/widget.js');
  const end = src.indexOf('];', start);
  const block = src.slice(start, end);
  const re = /code:\s*'([^']+)',\s*name:\s*'([^']+)',\s*nativeName:\s*'([^']+)'/g;
  return [...block.matchAll(re)].map((m) => ({ code: m[1], name: m[2], nativeName: m[3] }));
}

describe('public/widget.js language list drift guard', () => {
  it('widget.js ALL_LANGUAGES has the same code set as src/languages.ts', () => {
    const widget = parseWidgetLanguages();
    expect(widget.length).toBe(LANGUAGES.length);
    expect(new Set(widget.map((l) => l.code))).toEqual(new Set(LANGUAGES.map((l) => l.code)));
  });

  it('widget.js entries are byte-identical to LANGUAGES (code, name, nativeName, order)', () => {
    const widget = parseWidgetLanguages();
    expect(widget).toEqual(LANGUAGES.map((l) => ({ code: l.code, name: l.name, nativeName: l.nativeName })));
  });
});
