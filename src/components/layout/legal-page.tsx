'use client';

import { useLanguage, type TranslationKey } from '@/components/i18n/language';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

type LegalSection = {
  titleKey?: TranslationKey;
  paragraphKeys: TranslationKey[];
};

type LegalPageProps = {
  titleKey: TranslationKey;
  subtitleKey?: TranslationKey;
  introKey?: TranslationKey;
  sections: LegalSection[];
};

// "Label: text" sentences get a bold label, like a definition list.
function Paragraph({ text }: { text: string }) {
  const match = /^([^:]{3,48}):\s(.+)$/.exec(text);

  if (!match) {
    return <p>{text}</p>;
  }

  return (
    <p>
      <strong className="font-semibold text-ash">{match[1]}:</strong> {match[2]}
    </p>
  );
}

// Text pages (privacy and AI policy) laid out like the fullscreen menu: same margins, a big uppercase title,
// a muted intro and numbered sections.
export function LegalPage({ titleKey, subtitleKey, introKey, sections }: LegalPageProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-ink text-ash">
      <SiteHeader />

      {/* Top padding clears the fixed logo, which sits in the same spot as in the menu. */}
      <article className="px-8 pb-24 pt-[calc(2.5rem+env(safe-area-inset-top)+7rem)] md:px-16 md:pb-32 md:pt-48 lg:px-24">
        <header className="max-w-4xl">
          <h1 className="project-entry text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.06em]">
            {t(titleKey)}
          </h1>
          {subtitleKey ? (
            <p className="project-entry project-entry-delay-1 mt-6 text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold leading-tight tracking-[-0.03em]">
              {t(subtitleKey)}
            </p>
          ) : null}
          {introKey ? (
            <p className="project-entry project-entry-delay-2 mt-6 max-w-2xl text-base leading-7 text-ash/72 md:text-lg md:leading-8">
              {t(introKey)}
            </p>
          ) : null}
        </header>

        <ol className="project-entry project-entry-delay-3 mt-16 border-t border-line/20 md:mt-24">
          {sections.map((section, index) => (
            <li
              key={section.titleKey ?? section.paragraphKeys[0]}
              className="grid gap-5 border-b border-line/20 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-14"
            >
              <div>
                <span className="font-mono text-[0.68rem] tracking-[0.2em] text-ash/50 md:text-xs">{String(index + 1).padStart(2, '0')}</span>
                {section.titleKey ? (
                  <h2 className="mt-3 text-[clamp(1.4rem,2.6vw,2.25rem)] font-bold uppercase leading-none tracking-[-0.04em]">
                    {t(section.titleKey)}
                  </h2>
                ) : null}
              </div>

              <div className="grid max-w-2xl gap-5 text-base leading-7 text-ash/72 md:text-lg md:leading-8">
                {section.paragraphKeys.map((key) => (
                  <Paragraph key={key} text={t(key)} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </article>

      <SiteFooter />
    </main>
  );
}
