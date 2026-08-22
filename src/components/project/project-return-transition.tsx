'use client';

import Image from 'next/image';
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
  collapsing: boolean;
};

const RETURN_TRANSITION_DURATION = 500;

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
    const handleReturn = (event: Event) => {
      if (isRunningRef.current) {
        return;
      }

      const origin = (event as CustomEvent<ProjectReturnTransitionDetail>).detail;

      isRunningRef.current = true;
      document.body.classList.add('project-return-active');
      setTransition({ origin, collapsing: false });
      router.push('/');

      window.setTimeout(() => {
        const target = getVisibleTarget(origin);

        setTransition({ origin: target, collapsing: true });
      }, 90);

      window.setTimeout(() => {
        setTransition(null);
        isRunningRef.current = false;
        document.body.classList.remove('project-return-active');
      }, RETURN_TRANSITION_DURATION + 120);
    };

    window.addEventListener('project-return-transition', handleReturn);

    return () => {
      window.removeEventListener('project-return-transition', handleReturn);
    };
  }, [router]);

  if (!transition) {
    return null;
  }

  return (
    <>
      <div
        className="pointer-events-none fixed z-40 overflow-hidden bg-ink transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          left: transition.collapsing ? transition.origin.left : 0,
          top: transition.collapsing ? transition.origin.top : 0,
          width: transition.collapsing ? transition.origin.width : '100vw',
          height: transition.collapsing ? transition.origin.height : '100vh'
        }}
      >
        <ProjectMedia
          src={transition.origin.imageUrl}
          alt={transition.origin.title}
          mediaType={transition.origin.mediaType}
          posterUrl={transition.origin.posterUrl}
          sizes="100vw"
          className={`h-full w-full object-cover brightness-75 transition duration-500 ${transition.collapsing ? 'opacity-100' : 'opacity-0'}`}
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] bg-[#0b0b0b]/16 text-[#f3f1e8] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-[auto_1fr_auto] md:px-6">
          <div className="flex min-h-10 items-center">
            <Image src="/images/LOGOnowe.png" alt="Logo" width={160} height={104} className="h-11 w-auto object-contain md:h-12" priority />
          </div>

          <div className="hidden translate-x-36 justify-self-center gap-12 font-mono text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.28em] text-ash/82 md:flex lg:translate-x-44">
            <div>
              <span className="block text-left">Graphic Designer</span>
              <span className="mt-1 block text-left">& Web Developer</span>
            </div>
            <span className="translate-x-4 self-start whitespace-nowrap text-left">Lodz, Poland</span>
          </div>

          <div className="hidden md:justify-self-end md:block">
            <div className="inline-flex min-h-10 items-center rounded-full bg-ash px-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink">
              Contact
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
