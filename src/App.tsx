import { Routes, Route } from 'react-router-dom';
import { TranslationWidget } from './components/TranslationWidget';
import { TranslationDebug } from './components/TranslationDebug';
import { DemoContentEnglish } from './components/DemoContentEnglish';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CookiePolicy } from './components/CookiePolicy';
import { NotFound } from './components/NotFound';

function App() {
  const proxyUrl = (import.meta.env.VITE_TRANSLATE_PROXY_URL as string | undefined) ?? '';
  const proxyToken = import.meta.env.VITE_TRANSLATE_TOKEN as string | undefined;

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <TranslationWidget
              proxyUrl={proxyUrl}
              token={proxyToken}
              defaultLang="en"
              targetElementId="translatable-content"
              position="top-right"
            />
            {import.meta.env.DEV && <TranslationDebug proxyUrl={proxyUrl} />}
            <DemoContentEnglish />
            <CookieConsent />
          </>
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
