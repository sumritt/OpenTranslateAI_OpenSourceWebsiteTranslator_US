import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TranslationService } from './translation';

function mockFetchOnce(translations: string[]) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({ translations }),
  })) as unknown as typeof fetch;
}

describe('TranslationService.translateBatch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts the array and maps translations by index', async () => {
    const fetchMock = mockFetchOnce(['สวัสดี', 'ลาก่อน']);
    vi.stubGlobal('fetch', fetchMock);
    const svc = new TranslationService({ proxyUrl: 'https://proxy.test' });

    const out = await svc.translateBatch(['Hello', 'Bye'], 'th');

    expect(out).toEqual(['สวัสดี', 'ลาก่อน']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse((fetchMock as any).mock.calls[0][1].body);
    expect(body).toEqual({ texts: ['Hello', 'Bye'], target: 'th' });
  });

  it('serves a fully-cached batch without a second fetch', async () => {
    const fetchMock = mockFetchOnce(['สวัสดี']);
    vi.stubGlobal('fetch', fetchMock);
    const svc = new TranslationService({ proxyUrl: 'https://proxy.test' });

    await svc.translateBatch(['Hello'], 'th');
    const out = await svc.translateBatch(['Hello'], 'th');

    expect(out).toEqual(['สวัสดี']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('treats whitespace-variant text as the same cache entry', async () => {
    const fetchMock = mockFetchOnce(['สวัสดี']);
    vi.stubGlobal('fetch', fetchMock);
    const svc = new TranslationService({ proxyUrl: 'https://proxy.test' });

    await svc.translateBatch(['Hello'], 'th');
    const out = await svc.translateBatch(['  Hello  '], 'th');

    expect(out).toEqual(['สวัสดี']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects when the response length does not match', async () => {
    const fetchMock = mockFetchOnce(['only-one']);
    vi.stubGlobal('fetch', fetchMock);
    const svc = new TranslationService({ proxyUrl: 'https://proxy.test' });

    await expect(svc.translateBatch(['a', 'b'], 'th')).rejects.toThrow();
  });

  it('sends the widget token header when configured', async () => {
    const fetchMock = mockFetchOnce(['x']);
    vi.stubGlobal('fetch', fetchMock);
    const svc = new TranslationService({ proxyUrl: 'https://proxy.test', token: 'secret' });

    await svc.translateBatch(['a'], 'th');
    const headers = (fetchMock as any).mock.calls[0][1].headers;
    expect(headers['X-Widget-Token']).toBe('secret');
  });
});
