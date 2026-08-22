'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { ContentBlock, Project } from '@/data/projects';

type Language = 'en' | 'pl';

function getPreferredLanguage(): Language {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const preferred = languages.find((language) => {
    const normalizedLanguage = language.toLowerCase();

    return normalizedLanguage === 'pl' || normalizedLanguage.startsWith('pl-') || normalizedLanguage === 'en' || normalizedLanguage.startsWith('en-');
  });

  return preferred?.toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

function getTextBlocks(content: ContentBlock[] | undefined, description: string) {
  const blocks = content?.filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text') ?? [];

  if (blocks.length) {
    return blocks.map((block) => block.value);
  }

  return [description, 'More case study details, process notes and production context will be added as this project archive grows.'];
}

function getImageBlocks(content: ContentBlock[] | undefined, fallbackImage: string) {
  const images =
    content?.flatMap((block) => {
      if (block.type === 'image') {
        return [{ url: block.url, caption: block.caption }];
      }

      if (block.type === 'gallery') {
        return block.images;
      }

      return [];
    }) ?? [];

  if (images.length) {
    return images;
  }

  return [{
    url: fallbackImage,
    caption: 'Project visual archive'
  }];
}

function getLocalizedProject(project: Project, language: Language) {
  if (language !== 'pl' || !project.pl) {
    return project;
  }

  return {
    ...project,
    description: project.pl.description,
    content: project.pl.content ?? project.content
  };
}

export function LocalizedProjectDetails({ project }: { project: Project }) {
  const [language, setLanguage] = useState<Language>('en');
  const localizedProject = getLocalizedProject(project, language);
  const textBlocks = getTextBlocks(localizedProject.content, localizedProject.description);
  const imageBlocks = getImageBlocks(localizedProject.content, localizedProject.imageUrl);

  useEffect(() => {
    setLanguage(getPreferredLanguage());
  }, []);

  return (
    <>
      <section className="project-entry project-entry-delay-2 mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-24">
        <p className="max-w-[22ch] text-[clamp(2rem,4.8vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-ash">
          {localizedProject.description}
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-4 pb-14 md:px-6 md:pb-24">
        {textBlocks.map((block, index) => (
          <p
            key={`${localizedProject.id}-text-${index}`}
            className="project-entry project-entry-delay-3 text-left text-lg leading-8 text-ash/82 md:text-xl md:leading-9"
          >
            {block}
          </p>
        ))}
      </section>

      <section className="grid gap-6 bg-ink px-2 pb-16 md:gap-10 md:px-4 md:pb-24">
        {imageBlocks.map((image, index) => (
          <figure key={`${image.url}-${index}`} className="project-entry project-entry-delay-3 bg-ink">
            <Image
              src={image.url}
              alt={image.caption ?? `${localizedProject.title} visual ${index + 1}`}
              width={1600}
              height={1200}
              sizes="100vw"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </figure>
        ))}
      </section>
    </>
  );
}
