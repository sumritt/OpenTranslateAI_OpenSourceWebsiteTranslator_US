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

  it('dispatches batches concurrently instead of waiting for each to finish', async () => {
    // 30 nodes => 2 chunks of 25 + 5. Make the FIRST batch hang until released.
    const started: number[] = [];
    let releaseFirst!: () => void;
    const service = {
      translateBatch: vi.fn((texts: string[]) => {
        started.push(texts.length);
        if (started.length === 1) {
          return new Promise<string[]>((resolve) => {
            releaseFirst = () => resolve(texts.map((t) => `T:${t}`));
          });
        }
        return Promise.resolve(texts.map((t) => `T:${t}`));
      }),
    };
    const root = rootWith(Array.from({ length: 30 }, (_, i) => `n${i}`));
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);

    const done = dt.translateTo('th');
    await Promise.resolve();
    await Promise.resolve();
    // With concurrency, the 2nd batch starts even though the 1st is still pending.
    expect(service.translateBatch).toHaveBeenCalledTimes(2);

    releaseFirst();
    await done;
  });

  it('maps each translation to the correct node when batches resolve out of order', async () => {
    // 30 nodes => 2 chunks. First chunk resolves AFTER the second.
    let call = 0;
    const service = {
      translateBatch: vi.fn(async (texts: string[]) => {
        call += 1;
        const isFirst = call === 1;
        await new Promise((r) => setTimeout(r, isFirst ? 30 : 5));
        return texts.map((t) => `T:${t}`);
      }),
    };
    const root = rootWith(Array.from({ length: 30 }, (_, i) => `n${i}`));
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);
    await dt.translateTo('th');

    const ps = root.querySelectorAll('p');
    ps.forEach((p, i) => expect(p.textContent).toBe(`T:n${i}`));
    expect(service.translateBatch).toHaveBeenCalledTimes(2);
  });
});
