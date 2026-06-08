import { useState } from 'react';
import { Bug, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { TranslationService } from '../services/translation';

interface TranslationDebugProps {
  proxyUrl: string;
}

export function TranslationDebug({ proxyUrl }: TranslationDebugProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const runTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const service = new TranslationService({ proxyUrl });
      await service.translateBatch(['Hello'], 'es');
      setTestResult({
        success: true,
        message: 'Connection successful!',
        details: 'Translation proxy is working correctly.',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Debug Translation API"
        data-no-translate
      >
        <Bug className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
      data-no-translate
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-900">Translation Debug</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs text-gray-600">
          <p className="mb-1">
            <strong>API URL:</strong>
          </p>
          <p className="bg-gray-50 p-2 rounded break-all font-mono">
            {proxyUrl}
          </p>
        </div>

        <button
          onClick={runTest}
          disabled={isTesting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <span>Test Connection</span>
          )}
        </button>

        {testResult && (
          <div
            className={`p-3 rounded-lg border ${
              testResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {testResult.message}
                </p>
                {testResult.details && (
                  <p
                    className={`text-xs mt-1 ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {testResult.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p className="mb-2">
            <strong>Troubleshooting:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check network connection</li>
            <li>Verify the proxy URL is correct</li>
            <li>Check for CORS restrictions</li>
            <li>Verify the proxy is deployed and OPENROUTER_API_KEY is set</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
