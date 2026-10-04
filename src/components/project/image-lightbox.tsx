'use client';

import Image from 'next/image';
import type { TouchEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/i18n/language';
import { ArrowIcon } from '@/components/navigation/menu-items';

export type LightboxImage = {
  url: string;
  alt: string;
  caption?: string;
};

const SWIPE_THRESHOLD = 50;

const controlClassName =
  'inline-flex h-12 w-12 items-center justify-center rounded-full bg-ash text-ink shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:scale-105 active:scale-95';

type ImageLightboxProps = {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

// Fullscreen preview of a project's images. Arrow keys, on-screen arrows or a swipe move between images;
// Escape, the close button or a click on the backdrop closes it.
export function ImageLightbox({ images, index, onIndexChange }: ImageLightboxProps) {
  const { t } = useLanguage();
  const touchStartRef = useRef<number | null>(null);
  const isOpen = index !== null;
  const image = index !== null ? images[index] : null;

  const close = useCallback(() => onIndexChange(null), [onIndexChange]);
  const step = useCallback(
    (direction: 1 | -1) => {
      if (index !== null) {
        onIndexChange((index + direction + images.length) % images.length);
      }
    },
    [images.length, index, onIndexChange]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowRight') {
        step(1);
      } else if (event.key === 'ArrowLeft') {
        step(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, isOpen, step]);

  const handleTouchEnd = (event: TouchEvent) => {
    const startX = touchStartRef.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartRef.current = null;

    if (startX === null || endX === undefined || Math.abs(endX - startX) < SWIPE_THRESHOLD) {
      return;
    }

    step(endX < startX ? 1 : -1);
  };

  const hasMany = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={image?.alt}
      onClick={close}
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-[97] flex flex-col bg-ink/95 text-ash backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 pb-3 pt-[calc(1rem+env(safe-area-inset-top))] md:px-6 md:pt-6">
        <span className="font-mono text-[0.68rem] tracking-[0.2em] text-ash/50 md:text-xs">
          {index !== null && hasMany ? `${String(index + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}` : null}
        </span>
        <button type="button" onClick={close} aria-label={t('close')} tabIndex={isOpen ? undefined : -1} className={controlClassName}>
          <span className="relative h-4 w-4" aria-hidden="true">
            <span className="absolute left-0 top-1/2 block h-[1.5px] w-4 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 block h-[1.5px] w-4 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-4 md:px-24">
        {image ? (
          <Image
            key={image.url}
            src={image.url}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        ) : null}

        {hasMany ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label={t('previous')}
              tabIndex={isOpen ? undefined : -1}
              className={`absolute left-4 top-1/2 hidden -translate-y-1/2 md:inline-flex md:left-6 ${controlClassName}`}
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label={t('next')}
              tabIndex={isOpen ? undefined : -1}
              className={`absolute right-4 top-1/2 hidden -translate-y-1/2 md:inline-flex md:right-6 ${controlClassName}`}
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      <p className="min-h-[3.5rem] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 text-center font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/72 md:px-6 md:pb-6">
        {image?.caption}
      </p>
    </div>
  );
}
