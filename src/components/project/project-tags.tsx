'use client';

import { useLanguage } from '@/components/i18n/language';

const categoryTranslations: Record<string, string> = {
  'Graphic Design': 'Projekt graficzny',
  'Web Design': 'Projektowanie stron'
};

export function ProjectTags({ tags }: { tags: string[] }) {
  const { language } = useLanguage();

  return (
    <div className="mt-7 flex flex-wrap justify-center gap-2 md:mt-10">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-line/35 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/78"
        >
          {language === 'pl' ? categoryTranslations[tag] ?? tag : tag}
        </span>
      ))}
    </div>
  );
}
