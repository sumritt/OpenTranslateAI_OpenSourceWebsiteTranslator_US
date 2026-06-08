import { describe, it, expect, vi } from 'vitest';
import { DOMTranslator } from './domTranslator';

function makeService(impl: (texts: string[], target: string) => Promise<string[]>) {
  return { translateBatch: vi.fn(impl) };
}

function rootWith(texts: string[]): HTMLElement {
  const root = document.createElement('div');
  texts.forEach((t) => {
    const p = document.createElement('p');
    p.textContent = t;
    root.appendChild(p);
  });
  document.body.appendChild(root);
  return root;
}

describe('DOMTranslator', () => {
  it('translates every text node via translateBatch and writes results back', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['Hello', 'World']);
    const dt = new DOMTranslator(service as never, 'en');

    await dt.initialize(root);
    await dt.translateTo('th');

    expect(root.textContent).toContain('T:Hello');
    expect(root.textContent).toContain('T:World');
    expect(service.translateBatch).toHaveBeenCalledWith(['Hello', 'World'], 'th');
  });

  it('chunks nodes into batches of 25', async () => {
    const service = makeService(async (texts) => texts.map((t) => t));
    const root = rootWith(Array.from({ length: 60 }, (_, i) => `n${i}`));
    const dt = new DOMTranslator(service as never, 'en');

    await dt.initialize(root);
    await dt.translateTo('th');

    expect(service.translateBatch).toHaveBeenCalledTimes(3); // ceil(60/25)
  });

  it('restores original text when switching back to the original language', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['Hello']);
    const dt = new DOMTranslator(service as never, 'en');

    await dt.initialize(root);
    await dt.translateTo('th');
    await dt.translateTo('en');

    expect(root.textContent).toBe('Hello');
  });
});
