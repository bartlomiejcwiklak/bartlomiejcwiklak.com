'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useContactOverlay } from '@/components/contact/contact-overlay';
import { useLanguage, type Language } from '@/components/i18n/language';

const languages: Language[] = ['en', 'pl'];

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full border border-line/35 bg-white/[0.04] p-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash ${className}`} aria-label={t('language')}>
      {languages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
          className={`rounded-full px-3 py-2 transition ${language === item ? 'bg-ash text-ink' : 'text-ash/72 hover:text-ash'}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function MobileMenu({ onBeforeContact }: { onBeforeContact?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { openContact } = useContactOverlay();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const menuOverlay = (
    <div
      className={`fixed inset-0 z-[100] bg-black/0 transition-all duration-300 ${
        isOpen ? 'pointer-events-auto bg-black/82 backdrop-blur-xl' : 'pointer-events-none'
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`ml-auto flex h-[100dvh] w-full max-w-sm flex-col justify-between bg-ink p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))] text-ash transition duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/60">{t('menu')}</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label={t('close')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/35 bg-white/[0.04] font-mono text-lg text-ash transition hover:bg-white/[0.1]"
          >
            ×
          </button>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/50">{t('language')}</p>
            <LanguageSwitcher className="w-fit" />
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onBeforeContact?.();
              openContact();
            }}
            className="w-fit text-left text-[clamp(3rem,18vw,5rem)] font-bold uppercase leading-[0.86] tracking-[-0.07em] text-ash transition hover:opacity-70"
          >
            {t('contact')}
          </button>
        </div>

        <div className="font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.24em] text-ash/50">
          <p>{t('graphicDesigner')}</p>
          <p>{t('webDeveloper')}</p>
          <p className="mt-4">{t('location')}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t('menu')}
          aria-expanded={isOpen}
          className="inline-flex min-h-10 items-center gap-3 rounded-full bg-ash px-4 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink transition hover:opacity-70"
        >
          <span>{t('menu')}</span>
          <span className="grid gap-1" aria-hidden="true">
            <span className="block h-px w-4 bg-current" />
            <span className="block h-px w-4 bg-current" />
          </span>
        </button>
      </div>
      {typeof document !== 'undefined' ? createPortal(menuOverlay, document.body) : null}
    </>
  );
}
