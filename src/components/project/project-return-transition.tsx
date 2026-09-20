'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ProjectMedia } from '@/components/media/project-media';

export type ProjectReturnTransitionDetail = {
  id: string;
  title: string;
  imageUrl: string;
  mediaType?: 'image' | 'gif' | 'video';
  posterUrl?: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type ReturnTransition = {
  origin: ProjectReturnTransitionDetail;
  phase: 'origin' | 'expanded' | 'collapsing' | 'revealing';
};

const TRANSITION_DURATION = 520;

function getVisibleTarget(origin: ProjectReturnTransitionDetail) {
  const matchingCards = Array.from(document.querySelectorAll<HTMLElement>(`[data-project-id="${origin.id}"]`));
  const visibleCard = matchingCards
    .map((card) => card.getBoundingClientRect())
    .find((rect) => rect.bottom > 80 && rect.top < window.innerHeight - 80 && rect.right > 0 && rect.left < window.innerWidth);

  if (!visibleCard) {
    return origin;
  }

  return {
    ...origin,
    left: visibleCard.left,
    top: visibleCard.top,
    width: visibleCard.width,
    height: visibleCard.height
  };
}

export function ProjectReturnTransition() {
  const router = useRouter();
  const [transition, setTransition] = useState<ReturnTransition | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      setTransition(null);
      isRunningRef.current = false;
      document.body.classList.remove('project-return-active');
    };

    const handleOpen = (event: Event) => {
      if (isRunningRef.current) {
        return;
      }

      const detail = (event as CustomEvent<ProjectReturnTransitionDetail & { href: string }>).detail;

      isRunningRef.current = true;
      setTransition({ origin: detail, phase: 'origin' });

      window.requestAnimationFrame(() => {
        setTransition({ origin: detail, phase: 'expanded' });
      });

      window.setTimeout(() => router.push(detail.href), TRANSITION_DURATION - 60);
      window.setTimeout(() => setTransition((current) => current ? { ...current, phase: 'revealing' } : null), TRANSITION_DURATION + 60);
      window.setTimeout(finish, TRANSITION_DURATION + 420);
    };

    const handleReturn = (event: Event) => {
      if (isRunningRef.current) {
        return;
      }

      const origin = (event as CustomEvent<ProjectReturnTransitionDetail>).detail;

      isRunningRef.current = true;
      document.body.classList.add('project-return-active');
      setTransition({ origin, phase: 'expanded' });
      router.push('/');

      const findTarget = (attempt = 0) => {
        const matchingCard = getVisibleTarget(origin);

        if (matchingCard !== origin || attempt >= 45) {
          setTransition({ origin: matchingCard, phase: 'collapsing' });
          window.setTimeout(finish, TRANSITION_DURATION + 40);
          return;
        }

        window.requestAnimationFrame(() => findTarget(attempt + 1));
      };

      window.requestAnimationFrame(() => findTarget());
    };

    window.addEventListener('project-open-transition', handleOpen);
    window.addEventListener('project-return-transition', handleReturn);

    return () => {
      window.removeEventListener('project-open-transition', handleOpen);
      window.removeEventListener('project-return-transition', handleReturn);
    };
  }, [router]);

  if (!transition) {
    return null;
  }

  return (
    <>
      <div
        className={`pointer-events-none fixed z-[100] overflow-hidden bg-ink transition-all duration-[520ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          transition.phase === 'revealing' ? 'opacity-0 duration-[360ms]' : 'opacity-100'
        }`}
        style={{
          left: transition.phase === 'origin' || transition.phase === 'collapsing' ? transition.origin.left : 0,
          top: transition.phase === 'origin' || transition.phase === 'collapsing' ? transition.origin.top : 0,
          width: transition.phase === 'origin' || transition.phase === 'collapsing' ? transition.origin.width : '100vw',
          height: transition.phase === 'origin' || transition.phase === 'collapsing' ? transition.origin.height : '100vh'
        }}
      >
        <ProjectMedia
          src={transition.origin.imageUrl}
          alt={transition.origin.title}
          mediaType={transition.origin.mediaType}
          posterUrl={transition.origin.posterUrl}
          sizes="100vw"
          className="h-full w-full object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </>
  );
}
