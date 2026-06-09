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

function appendP(root: HTMLElement, text: string): HTMLElement {
  const p = document.createElement('p');
  p.textContent = text;
  root.appendChild(p);
  return p;
}

// MutationObserver delivers on a microtask; the async translate that follows
// resolves on later ticks. Flush several rounds to let it settle.
async function flushObserver(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
  }
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

  it('chunks nodes into batches of 10', async () => {
    const service = makeService(async (texts) => texts.map((t) => t));
    const root = rootWith(Array.from({ length: 60 }, (_, i) => `n${i}`));
    const dt = new DOMTranslator(service as never, 'en');

    await dt.initialize(root);
    await dt.translateTo('th');

    expect(service.translateBatch).toHaveBeenCalledTimes(6); // ceil(60/10)
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
    // 20 nodes => 2 chunks of 10. Make the FIRST batch hang until released.
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
    const root = rootWith(Array.from({ length: 20 }, (_, i) => `n${i}`));
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
    // 20 nodes => 2 chunks. First chunk resolves AFTER the second.
    let call = 0;
    const service = {
      translateBatch: vi.fn(async (texts: string[]) => {
        call += 1;
        const isFirst = call === 1;
        await new Promise((r) => setTimeout(r, isFirst ? 30 : 5));
        return texts.map((t) => `T:${t}`);
      }),
    };
    const root = rootWith(Array.from({ length: 20 }, (_, i) => `n${i}`));
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);
    await dt.translateTo('th');

    const ps = root.querySelectorAll('p');
    ps.forEach((p, i) => expect(p.textContent).toBe(`T:n${i}`));
    expect(service.translateBatch).toHaveBeenCalledTimes(2);
  });

  it('isolates a failing item via bisection and leaves only it untranslated', async () => {
    // A batch that contains 'BAD' throws (mirrors a degraded proxy response).
    // The translator should bisect the batch so the good items still translate
    // and only the failing item is left as its original text.
    const service = makeService(async (texts: string[]) => {
      if (texts.includes('BAD')) throw new Error('Translation degraded');
      return texts.map((t) => `T:${t}`);
    });
    const root = rootWith(['a', 'b', 'BAD', 'd']);
    const dt = new DOMTranslator(service as never, 'en');

    await dt.initialize(root);
    await dt.translateTo('th');

    const ps = root.querySelectorAll('p');
    expect(ps[0].textContent).toBe('T:a');
    expect(ps[1].textContent).toBe('T:b');
    expect(ps[2].textContent).toBe('BAD'); // left untranslated
    expect(ps[3].textContent).toBe('T:d');
  });

  it('does not cache a partial translation and retries on re-select', async () => {
    let failBad = true;
    const service = makeService(async (texts: string[]) => {
      if (texts.includes('BAD') && failBad) throw new Error('Translation degraded');
      return texts.map((t) => `T:${t}`);
    });
    const root = rootWith(['a', 'BAD']);
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);

    await dt.translateTo('th');
    const ps = () => root.querySelectorAll('p');
    expect(ps()[1].textContent).toBe('BAD'); // failed item stays original
    expect(dt.getCachedLanguages()).not.toContain('th'); // partial => not cached

    // The proxy recovers; re-selecting the same language must retry (not no-op).
    failBad = false;
    await dt.translateTo('th');
    expect(ps()[1].textContent).toBe('T:BAD');
    expect(dt.getCachedLanguages()).toContain('th'); // now fully cached
  });

  it('translates nodes added after initialize to the current language (ingest)', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['Hello']);
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);
    await dt.translateTo('th');

    const p = appendP(root, 'Later'); // e.g. an accordion answer mounting
    await dt.ingestNodes([p]);

    expect(p.textContent).toBe('T:Later');
    dt.disconnect();
  });

  it('leaves added nodes untouched while showing the original language', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['Hello']);
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root); // currentLang === original ('en')

    const p = appendP(root, 'Later');
    await dt.ingestNodes([p]);

    expect(p.textContent).toBe('Later');
    expect(service.translateBatch).not.toHaveBeenCalled();
    dt.disconnect();
  });

  it('auto-translates dynamically mounted content via the MutationObserver', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['Hello']);
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);
    await dt.translateTo('th');

    const p = appendP(root, 'Later'); // no manual ingest — the observer must react
    await flushObserver();

    expect(p.textContent).toBe('T:Later');
    dt.disconnect();
  });

  it('keeps the original text of added nodes for restore', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['Hello']);
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);
    await dt.translateTo('th');
    const p = appendP(root, 'Later');
    await dt.ingestNodes([p]);

    await dt.translateTo('en'); // restore

    expect(p.textContent).toBe('Later');
    dt.disconnect();
  });

  it('re-translates a previously cached language after nodes were added', async () => {
    const service = makeService(async (texts) => texts.map((t) => `T:${t}`));
    const root = rootWith(['A']);
    const dt = new DOMTranslator(service as never, 'en');
    await dt.initialize(root);
    await dt.translateTo('th'); // caches th, aligned to 1 node
    await dt.translateTo('en'); // back to original

    const p = appendP(root, 'B');
    await dt.ingestNodes([p]); // on original => not translated; th cache now stale

    await dt.translateTo('th'); // stale cache must not be reused
    expect(p.textContent).toBe('T:B');
    dt.disconnect();
  });
});
