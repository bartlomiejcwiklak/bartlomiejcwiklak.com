'use client';

import { useLanguage } from '@/components/i18n/language';

const categoryTranslations: Record<string, string> = {
  'Graphic Design': 'Projekt graficzny',
  'Web Design': 'Projektowanie stron'
};

export function ProjectTags({ tags }: { tags: string[] }) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/50 md:text-xs">
      {tags.map((tag) => (
        <span key={tag}>{language === 'pl' ? categoryTranslations[tag] ?? tag : tag}</span>
      ))}
    </div>
  );
}
