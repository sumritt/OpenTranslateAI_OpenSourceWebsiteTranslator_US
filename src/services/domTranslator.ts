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

    if (targetLang === this.currentLang) {
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
        const batchSize = 25;
        const concurrency = 5;

        const chunks: { nodes: TextNodeData[]; start: number }[] = [];
        for (let i = 0; i < this.textNodes.length; i += batchSize) {
          chunks.push({ nodes: this.textNodes.slice(i, i + batchSize), start: i });
        }

        const allTranslations: string[] = new Array(this.textNodes.length);
        let completed = 0;
        let nextChunk = 0;

        const worker = async (): Promise<void> => {
          while (true) {
            const idx = nextChunk++;
            if (idx >= chunks.length) return;
            const chunk = chunks[idx];
            const texts = chunk.nodes.map((nodeData) => nodeData.originalText);

            const translated = await this.translationService.translateBatch(texts, targetLang);

            chunk.nodes.forEach((nodeData, j) => {
              nodeData.node.textContent = translated[j];
              allTranslations[chunk.start + j] = translated[j];
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

        this.translationCache[targetLang] = allTranslations;
        this.currentLang = targetLang;
      }
    } finally {
      this.isTranslating = false;
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
