interface BatchTranslator {
  translateBatch(texts: string[], target: string): Promise<string[]>;
}

interface TextNodeData {
  node: Text;
  originalText: string;
}

interface TranslationCache {
  [langCode: string]: string[];
}

export class DOMTranslator {
  private translationService: BatchTranslator;
  private textNodes: TextNodeData[] = [];
  private originalLang: string;
  private currentLang: string;
  private isTranslating = false;
  private translationCache: TranslationCache = {};

  constructor(translationService: BatchTranslator, originalLang: string) {
    this.translationService = translationService;
    this.originalLang = originalLang;
    this.currentLang = originalLang;
  }

  private shouldSkipNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    // Skip script, style, noscript, and other non-visible elements
    const skipTags = ['script', 'style', 'noscript', 'iframe', 'object', 'embed'];
    if (skipTags.includes(tagName)) return true;

    // Skip elements with data-no-translate attribute
    if (element.hasAttribute('data-no-translate')) return true;

    return false;
  }

  private extractTextNodes(root: Node): void {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE && this.shouldSkipNode(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim() || '';
            if (text.length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
          }

          return NodeFilter.FILTER_SKIP;
        },
      }
    );

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const text = currentNode.textContent || '';
        if (text.trim().length > 0) {
          this.textNodes.push({
            node: currentNode as Text,
            originalText: text,
          });
        }
      }
    }
  }

  async initialize(root: HTMLElement): Promise<void> {
    this.textNodes = [];
    this.extractTextNodes(root);
  }

  async translateTo(targetLang: string, onProgress?: (progress: number) => void): Promise<void> {
    if (this.isTranslating) {
      console.warn('Translation already in progress');
      return;
    }

    // Short-circuit only when re-selecting a language we can show with no work:
    // the untouched original, or a language fully cached from a clean run. A
    // partial translation (some batches failed) is intentionally NOT cached, so
    // re-selecting it falls through to a real retry instead of a silent no-op.
    if (
      targetLang === this.currentLang &&
      (targetLang === this.originalLang || this.translationCache[targetLang] !== undefined)
    ) {
      return;
    }

    this.isTranslating = true;

    try {
      if (targetLang === this.originalLang) {
        // Restore original text
        this.textNodes.forEach((nodeData) => {
          nodeData.node.textContent = nodeData.originalText;
        });
        this.currentLang = this.originalLang;
        onProgress?.(100);
      } else if (this.translationCache[targetLang]) {
        // Use cached translation
        this.textNodes.forEach((nodeData, index) => {
          nodeData.node.textContent = this.translationCache[targetLang][index];
        });
        this.currentLang = targetLang;
        onProgress?.(100);
      } else {
        // Smaller batches reduce per-request failure (the model has fewer items
        // to keep aligned and less output to truncate), so fewer nodes fall back
        // to their original text.
        const batchSize = 10;
        const concurrency = 5;

        const chunks: { nodes: TextNodeData[]; start: number }[] = [];
        for (let i = 0; i < this.textNodes.length; i += batchSize) {
          chunks.push({ nodes: this.textNodes.slice(i, i + batchSize), start: i });
        }

        const allTranslations: string[] = new Array(this.textNodes.length);
        let completed = 0;
        let nextChunk = 0;
        let anyFailed = false;

        const worker = async (): Promise<void> => {
          while (true) {
            const idx = nextChunk++;
            if (idx >= chunks.length) return;
            const chunk = chunks[idx];
            const texts = chunk.nodes.map((nodeData) => nodeData.originalText);

            const { out, ok } = await this.translateChunk(texts, targetLang);
            if (!ok) anyFailed = true;

            chunk.nodes.forEach((nodeData, j) => {
              nodeData.node.textContent = out[j];
              allTranslations[chunk.start + j] = out[j];
            });

            completed++;
            onProgress?.((completed / chunks.length) * 100);
          }
        };

        const pool = Array.from(
          { length: Math.min(concurrency, chunks.length) },
          () => worker(),
        );
        await Promise.all(pool);

        // Only cache a clean, fully-translated run. Caching a partial result
        // would freeze the untranslated nodes in place on every later switch.
        if (!anyFailed) {
          this.translationCache[targetLang] = allTranslations;
        }
        this.currentLang = targetLang;
      }
    } finally {
      this.isTranslating = false;
    }
  }

  // Translate one batch, bisecting on failure so a single bad item cannot block
  // its neighbours. Returns the (possibly partial) texts plus whether every item
  // translated. A leaf that still fails keeps its original text and reports ok=false.
  private async translateChunk(
    texts: string[],
    targetLang: string,
  ): Promise<{ out: string[]; ok: boolean }> {
    try {
      const out = await this.translationService.translateBatch(texts, targetLang);
      return { out, ok: true };
    } catch {
      if (texts.length <= 1) {
        return { out: texts.slice(), ok: false };
      }
      const mid = Math.ceil(texts.length / 2);
      const left = await this.translateChunk(texts.slice(0, mid), targetLang);
      const right = await this.translateChunk(texts.slice(mid), targetLang);
      return { out: [...left.out, ...right.out], ok: left.ok && right.ok };
    }
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  getOriginalLang(): string {
    return this.originalLang;
  }

  getCachedLanguages(): string[] {
    return [this.originalLang, ...Object.keys(this.translationCache)];
  }
}
