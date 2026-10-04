'use client';

import { useLanguage, type Language } from '@/components/i18n/language';

const languages: Language[] = ['en', 'pl'];

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`inline-flex min-h-10 items-center rounded-full border border-line/35 bg-white/[0.04] p-1 font-mono md:min-h-12 text-[0.62rem] uppercase tracking-[0.2em] text-ash ${className}`} aria-label={t('language')}>
      {languages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
          className={`inline-flex min-h-8 items-center rounded-full px-3 transition md:min-h-10 ${language === item ? 'bg-ash text-ink' : 'text-ash/72 hover:text-ash'}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
