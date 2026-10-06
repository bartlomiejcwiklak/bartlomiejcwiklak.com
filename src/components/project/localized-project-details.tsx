'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLanguage, type Language } from '@/components/i18n/language';
import { ProjectMedia } from '@/components/media/project-media';
import { ImageLightbox, type LightboxImage } from '@/components/project/image-lightbox';
import type { ContentBlock, Project } from '@/data/projects';

// The description is shown as the lead, so the body falls back to a short note instead of repeating it.
function getTextBlocks(content: ContentBlock[] | undefined, fallbackDetails: string) {
  const blocks = content?.filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text') ?? [];

  if (blocks.length) {
    return blocks.map((block) => block.value);
  }

  return [fallbackDetails];
}

function getImageBlocks(content: ContentBlock[] | undefined, fallbackImage: string, fallbackCaption: string) {
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
    caption: fallbackCaption
  }];
}

function getLocalizedProject(project: Project, language: Language) {
  if (language !== 'pl' || !project.pl) {
    return project;
  }

  return {
    ...project,
    description: project.pl.description,
    content: project.pl.content ?? project.content,
    note: project.pl.note ?? project.note
  };
}

// Project body laid out like the policy and blog pages: a muted lead, the hero image, a numbered two-column
// section with the case study text, then the image gallery. Clicking an image opens it in a fullscreen preview.
export function LocalizedProjectDetails({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const localizedProject = getLocalizedProject(project, language);
  const textBlocks = getTextBlocks(localizedProject.content, t('fallbackDetails'));
  const imageBlocks = getImageBlocks(localizedProject.content, localizedProject.imageUrl, t('projectVisualArchive'));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasHeroImage = project.mediaType !== 'video';

  // Everything the lightbox can show: the hero (unless it is a video) followed by the gallery, without repeats.
  const lightboxImages: LightboxImage[] = [
    ...(hasHeroImage ? [{ url: project.imageUrl, alt: project.title }] : []),
    ...imageBlocks.map((image, index) => ({
      url: image.url,
      alt: image.caption ?? `${localizedProject.title} visual ${index + 1}`,
      caption: image.caption
    }))
  ].filter((image, index, all) => all.findIndex((other) => other.url === image.url) === index);

  const openImage = (url: string) => {
    const index = lightboxImages.findIndex((image) => image.url === url);

    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  return (
    <>
      <p className="project-entry project-entry-delay-2 mt-6 max-w-2xl text-base leading-7 text-ash/72 md:text-lg md:leading-8">
        {localizedProject.description}
      </p>

      <button
        type="button"
        disabled={!hasHeroImage}
        onClick={() => openImage(project.imageUrl)}
        aria-label={t('openImage')}
        className="project-entry project-entry-delay-3 mt-14 block w-full overflow-hidden enabled:cursor-zoom-in md:mt-20"
      >
        <ProjectMedia
          src={project.imageUrl}
          alt={project.title}
          mediaType={project.mediaType}
          posterUrl={project.posterUrl}
          sizes="100vw"
          className="aspect-[4/3] w-full object-cover md:aspect-[16/9]"
          priority
        />
      </button>

      <section className="mt-14 grid gap-5 border-y border-line/20 py-10 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-14">
        <div>
          <span className="font-mono text-[0.68rem] tracking-[0.2em] text-ash/50 md:text-xs">01</span>
          <h2 className="mt-3 text-[clamp(1.4rem,2.6vw,2.25rem)] font-bold uppercase leading-none tracking-[-0.04em]">{t('aboutProject')}</h2>
        </div>

        <div className="grid max-w-2xl gap-5 text-base leading-7 text-ash/72 md:text-lg md:leading-8">
          {textBlocks.map((block, index) => (
            <p key={`${localizedProject.id}-text-${index}`}>{block}</p>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:mt-20 md:gap-10">
        {imageBlocks.map((image, index) => (
          <figure key={`${image.url}-${index}`}>
            <button type="button" onClick={() => openImage(image.url)} aria-label={t('openImage')} className="block w-full cursor-zoom-in">
              <Image
                src={image.url}
                alt={image.caption ?? `${localizedProject.title} visual ${index + 1}`}
                width={1600}
                height={1200}
                sizes="100vw"
                className="h-auto w-full object-contain"
                loading="lazy"
              />
            </button>
            {image.caption ? (
              <figcaption className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/50">{image.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </section>

      {localizedProject.note ? (
        <p className="mt-14 max-w-2xl border-t border-line/20 pt-8 text-sm leading-6 text-ash/50 md:mt-20">{localizedProject.note}</p>
      ) : null}

      <ImageLightbox images={lightboxImages} index={lightboxIndex} onIndexChange={setLightboxIndex} />
    </>
  );
}
