import type { Metadata } from 'next';
import { LocalizedText } from '@/components/i18n/language';
import { TextPage } from '@/components/layout/text-page';
import { ExternalArrowIcon } from '@/components/navigation/menu-items';
import { getAlternates } from '@/lib/i18n';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isPolish = params.lang !== 'en';

  return {
    title: isPolish ? 'O mnie' : 'About',
    description: isPolish
      ? 'Bartłomiej Ćwiklak – projektant graficzny i web developer z Łodzi. Branding, projektowanie graficzne i strony internetowe od 2021 roku.'
      : 'Bartłomiej Ćwiklak – graphic designer and web developer from Łódź. Branding, graphic design and websites since 2021.',
    alternates: getAlternates('/about', isPolish ? 'pl' : 'en')
  };
}

export default function AboutPage() {
  return (
    <TextPage
      titleKey="about"
      subtitleKey="aboutSubtitle"
      introKey="aboutIntro"
      sections={[
        { titleKey: 'aboutWhatTitle', paragraphKeys: ['aboutWhatP1', 'aboutWhatP2'] },
        { titleKey: 'aboutExpTitle', paragraphKeys: ['aboutExpP1'] },
        { titleKey: 'aboutEduTitle', paragraphKeys: ['aboutEduP1', 'aboutEduP2'] },
        { titleKey: 'aboutToolsTitle', paragraphKeys: ['aboutToolsP1', 'aboutToolsP2', 'aboutToolsP3', 'aboutToolsP4', 'aboutToolsP5'] }
      ]}
    >
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noreferrer"
        className="mt-12 inline-flex items-center gap-[0.3em] text-[clamp(1.1rem,2vw,1.5rem)] font-bold uppercase tracking-[-0.03em] text-ash transition hover:opacity-70 md:mt-16"
      >
        <LocalizedText translationKey="downloadCv" />
        <ExternalArrowIcon />
      </a>
    </TextPage>
  );
}
