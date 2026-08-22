'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';

type ProjectBackLinkProps = {
  children: ReactNode;
  className: string;
  ariaLabel?: string;
  project: {
    id: string;
    title: string;
    imageUrl: string;
    mediaType?: 'image' | 'gif' | 'video';
    posterUrl?: string;
  };
  variant?: 'logo' | 'button';
};

type StoredOrigin = {
  id: string;
  imageUrl: string;
  mediaType?: 'image' | 'gif' | 'video';
  posterUrl?: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

function readOrigin(project: ProjectBackLinkProps['project']) {
  const fallback: StoredOrigin = {
    id: project.id,
    imageUrl: project.imageUrl,
    mediaType: project.mediaType,
    posterUrl: project.posterUrl,
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    width: 0,
    height: 0
  };

  try {
    const stored = window.sessionStorage.getItem('project-transition-origin');

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored) as StoredOrigin;

    if (parsed.id !== project.id) {
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

export function ProjectBackLink({ children, className, ariaLabel, project, variant = 'button' }: ProjectBackLinkProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    if (isExiting) {
      return;
    }

    const origin = readOrigin(project);

    setIsExiting(true);
    window.dispatchEvent(
      new CustomEvent('project-return-transition', {
        detail: {
          ...origin,
          title: project.title
        }
      })
    );
  };

  return (
    <>
      <button type="button" onClick={handleBack} className={className} aria-label={ariaLabel}>
        {children}
      </button>

    </>
  );
}

export function ProjectBackLogo({ project }: { project: ProjectBackLinkProps['project'] }) {
  return (
    <ProjectBackLink project={project} variant="logo" className="flex min-h-10 items-center" ariaLabel="Back to portfolio">
      <Image src="/images/LOGOnowe.png" alt="Logo" width={160} height={104} className="h-11 w-auto object-contain md:h-12" priority />
    </ProjectBackLink>
  );
}
