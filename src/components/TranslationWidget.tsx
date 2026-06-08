import { useState, useEffect } from 'react';
import { Globe, Loader2, Check, AlertCircle } from 'lucide-react';
import { TranslationService } from '../services/translation';
import { DOMTranslator } from '../services/domTranslator';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

interface TranslationWidgetProps {
  defaultLang?: string;
  proxyUrl: string;
  token?: string;
  targetElementId?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onLanguageChange?: (lang: string) => void;
  localLanguages?: string[];
}

export function TranslationWidget({
  defaultLang = 'zh',
  proxyUrl,
  token,
  targetElementId = 'translatable-content',
  position = 'top-right',
  onLanguageChange,
  localLanguages = [],
}: TranslationWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(defaultLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [domTranslator, setDomTranslator] = useState<DOMTranslator | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cachedLanguages, setCachedLanguages] = useState<string[]>([]);

  useEffect(() => {
    const initTranslator = async () => {
      try {
        const translationService = new TranslationService({ proxyUrl, token });
        const translator = new DOMTranslator(translationService, defaultLang);

        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
          await translator.initialize(targetElement);
          setDomTranslator(translator);
          setIsInitialized(true);

          // Initialize cached languages with the original language
          setCachedLanguages([defaultLang]);
        } else {
          setError(`Target element #${targetElementId} not found`);
        }
      } catch (err) {
        console.error('Failed to initialize translator:', err);
        setError('Failed to initialize translation widget');
      }
    };

    initTranslator();
  }, [proxyUrl, token, defaultLang, targetElementId]);

  const handleLanguageChange = async (langCode: string) => {
    if (!domTranslator || isTranslating || !isInitialized) return;

    setError(null);
    setIsOpen(false);

    const isLocalLanguage = localLanguages.includes(langCode);

    if (isLocalLanguage) {
      setCurrentLang(langCode);
      onLanguageChange?.(langCode);
      return;
    }

    const isCached = cachedLanguages.includes(langCode);

    if (isCached) {
      setIsTranslating(true);
      setProgress(0);

      try {
        await domTranslator.translateTo(langCode, (prog) => {
          setProgress(Math.min(prog, 100));
        });
        setCurrentLang(langCode);
        onLanguageChange?.(langCode);
      } catch (err) {
        console.error('Error switching to cached language:', err);
      } finally {
        setIsTranslating(false);
        setTimeout(() => setProgress(0), 300);
      }
      return;
    }

    setIsTranslating(true);
    setProgress(0);

    try {
      await domTranslator.translateTo(langCode, (prog) => {
        setProgress(Math.min(prog, 100));
      });
      setCurrentLang(langCode);
      onLanguageChange?.(langCode);

      // Update cached languages after successful translation
      const newCachedLanguages = domTranslator.getCachedLanguages();
      setCachedLanguages(newCachedLanguages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';

      if (errorMessage.includes('CORS') || errorMessage.includes('network')) {
        setError('Connection error. Check your proxy URL and network.');
      } else if (errorMessage.includes('rate limit')) {
        setError('Rate limit reached. Please wait and try again.');
      } else {
        setError(`Translation failed: ${errorMessage}`);
      }

      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const positionClasses = {
    'top-left': 'top-20 md:top-4 left-4',
    'top-right': 'top-20 md:top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLang);

  return (
    <div className={`fixed ${positionClasses[position]} z-50`} data-no-translate>
      <div className="relative">
        {/* Widget Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating || !isInitialized}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 rounded-lg shadow-lg border border-gray-200 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          title={isInitialized ? 'Select language' : 'Initializing...'}
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span className="font-medium text-sm">
            {currentLanguage?.nativeName || 'Language'}
          </span>
        </button>

        {/* Progress Bar */}
        {isTranslating && (
          <div className={`absolute top-full mt-2 w-full min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 p-3 ${
            position.includes('right') ? 'right-0' : 'left-0'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
              <span className="text-xs text-gray-600">Translating...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Language Dropdown */}
        {isOpen && !isTranslating && (
          <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[100] ${
            position.includes('right') ? 'right-0' : 'left-0'
          }`}>
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select Language
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-[320px] max-w-[calc(100vw-2rem)]">
              {LANGUAGES.map((lang) => {
                const isLocal = localLanguages.includes(lang.code);
                const isCached = cachedLanguages.includes(lang.code);
                const showInstantBadge = isLocal || isCached;
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`relative px-3 py-3 rounded-lg transition-all duration-200 text-left group ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md scale-[1.02]'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {lang.nativeName}
                        </span>
                        {showInstantBadge && !isSelected && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded font-semibold">
                            ⚡
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${
                        isSelected ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {lang.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`absolute top-full mt-2 w-64 max-w-[calc(100vw-2rem)] bg-red-50 border border-red-200 rounded-lg shadow-lg p-3 ${
            position.includes('right') ? 'right-0' : 'left-0'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
