'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { navigateWithTransition } from '@/components/navigation/page-transition';
import { LANGUAGE_COOKIE, localizePath, stripLanguage, translations, type Language, type TranslationKey } from '@/lib/i18n';

export type { Language, TranslationKey } from '@/lib/i18n';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  localize: (path: string) => string;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Blog posts are written in a single language, so switching from a post goes to the other language's blog index.
function getSwitchTarget(path: string) {
  return /^\/blog\/[^/]+$/.test(path) ? '/blog' : path;
}

// The language comes from the URL (see src/middleware.ts), so the server already renders the right one.
export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (nextLanguage) => {
      if (nextLanguage === language) {
        return;
      }

      // Remembered for a year, so the middleware stops redirecting by the browser language.
      document.cookie = `${LANGUAGE_COOKIE}=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
      navigateWithTransition(localizePath(getSwitchTarget(stripLanguage(window.location.pathname)), nextLanguage));
    },
    localize: (path) => localizePath(path, language),
    t: (key) => translations[language][key]
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}

export function LocalizedText({ translationKey }: { translationKey: TranslationKey }) {
  const { t } = useLanguage();

  return <>{t(translationKey)}</>;
}
