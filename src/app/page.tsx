'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProjectMedia } from '@/components/media/project-media';
import { projects } from '@/data/projects';

const SCROLL_EASING = 0.11;
const SCROLL_STOP_THRESHOLD = 0.05;
const TOUCH_SCROLL_MULTIPLIER = 1.2;
const AUTO_SCROLL_SPEED = 0.018;
const PROJECT_TRANSITION_DURATION = 500;

type ActiveProjectTransition = {
  project: (typeof projects)[number];
  rect: DOMRect;
  expanded: boolean;
};

function getGreatestCommonDivisor(a: number, b: number): number {
  let x = a;
  let y = b;

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x;
}

function getColumnCount(width: number) {
  if (width >= 1280) {
    return 5;
  }

  if (width >= 1024) {
    return 4;
  }

  if (width >= 640) {
    return 3;
  }

  return 2;
}

function ProjectCard({
  project,
  onOpen
}: {
  project: (typeof projects)[number];
  onOpen: (project: (typeof projects)[number], element: HTMLElement) => void;
}) {
  const { id, title, year, imageUrl, mediaType, posterUrl } = project;

  return (
    <Link
      href={`/work/${id}`}
      data-project-id={id}
      onClick={(event) => {
        event.preventDefault();
        onOpen(project, event.currentTarget);
      }}
      className="group relative block border border-line/35 transition"
    >
      <article>
        <div className="overflow-hidden">
          <ProjectMedia
            src={imageUrl}
            alt={title}
            mediaType={mediaType}
            posterUrl={posterUrl}
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="aspect-square w-full object-cover brightness-90 transition duration-500 group-hover:scale-[1.02] group-hover:brightness-100"
            priority={id === projects[0]?.id}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/18" />

          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ash md:text-[0.62rem]">
            {year}
          </span>

          <h2 className="pointer-events-none absolute bottom-3 left-3 max-w-[75%] text-[1rem] font-bold uppercase leading-none text-ash md:text-[1.1rem]">
            {title}
          </h2>
        </div>
      </article>
    </Link>
  );
}

function ContactCard({
  href,
  title,
  label,
  external
}: {
  href: string;
  title: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group relative block border border-line/35 transition"
    >
      <article>
        <div className="aspect-square overflow-hidden bg-black/86 transition duration-500 group-hover:bg-white/[0.08]">

          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ash/72 md:text-[0.62rem]">
            {label}
          </span>

          <h3 className="pointer-events-none absolute bottom-3 left-3 max-w-[75%] text-[1rem] font-bold uppercase leading-none text-ash md:text-[1.1rem]">
            {title}
          </h3>
        </div>
      </article>
    </a>
  );
}

export default function HomePage() {
  const router = useRouter();
  const segmentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const isProjectOpeningRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const currentOffsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const segmentHeightRef = useRef(0);
  const isContactOpenRef = useRef(false);
  const [columnCount, setColumnCount] = useState(5);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeProjectTransition, setActiveProjectTransition] = useState<ActiveProjectTransition | null>(null);

  const applyTrackTransform = () => {
    const segmentHeight = segmentHeightRef.current;
    const trackElement = trackRef.current;

    if (!segmentHeight || !trackElement) {
      return;
    }

    const normalizedOffset = ((currentOffsetRef.current % segmentHeight) + segmentHeight) % segmentHeight;
    trackElement.style.transform = `translate3d(0, ${-segmentHeight - normalizedOffset}px, 0)`;
  };

  const stopAnimation = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    lastFrameTimeRef.current = null;
    isAnimatingRef.current = false;
  };

  const animate = (timestamp: number) => {
    const segmentHeight = segmentHeightRef.current;

    if (!segmentHeight || !trackRef.current || isContactOpenRef.current || isProjectOpeningRef.current || document.hidden) {
      stopAnimation();
      return;
    }

    const previousTimestamp = lastFrameTimeRef.current ?? timestamp;
    const elapsed = Math.min(timestamp - previousTimestamp, 64);

    lastFrameTimeRef.current = timestamp;
    targetOffsetRef.current += elapsed * AUTO_SCROLL_SPEED;

    const delta = targetOffsetRef.current - currentOffsetRef.current;
    currentOffsetRef.current += delta * SCROLL_EASING;

    if (Math.abs(delta) < SCROLL_STOP_THRESHOLD) {
      currentOffsetRef.current = targetOffsetRef.current;
    }

    applyTrackTransform();

    animationFrameRef.current = window.requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    animationFrameRef.current = window.requestAnimationFrame(animate);
  };

  const segmentProjects = useMemo(() => {
    const divisor = getGreatestCommonDivisor(projects.length, columnCount);
    const repeatCount = columnCount / divisor;

    return Array.from({ length: repeatCount }, () => projects).flat();
  }, [columnCount]);

  const loopedProjects = useMemo(() => Array.from({ length: 3 }, () => segmentProjects), [segmentProjects]);

  useEffect(() => {
    let resizeFrame: number | null = null;

    const updateColumns = () => {
      setColumnCount(getColumnCount(window.innerWidth));
    };

    const handleResize = () => {
      if (resizeFrame !== null) {
        return;
      }

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        updateColumns();
      });
    };

    updateColumns();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
    };
  }, []);

  useEffect(() => {
    const updateTrackPosition = () => {
      const segmentHeight = segmentRef.current?.offsetHeight ?? 0;

      if (!segmentHeight || !trackRef.current) {
        return;
      }

      segmentHeightRef.current = segmentHeight;
      applyTrackTransform();

      if (!isContactOpenRef.current && !isProjectOpeningRef.current && !document.hidden) {
        startAnimation();
      }
    };

    currentOffsetRef.current = 0;
    targetOffsetRef.current = 0;
    updateTrackPosition();

    const handleResize = () => {
      updateTrackPosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [loopedProjects]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isContactOpenRef.current && !isProjectOpeningRef.current) {
        startAnimation();
        return;
      }

      stopAnimation();
    };

    const handlePageHide = () => {
      stopAnimation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      stopAnimation();
    };
  }, []);

  useEffect(() => {
    isContactOpenRef.current = isContactOpen;

    if (isContactOpen) {
      stopAnimation();
      return;
    }

    if (!document.hidden && !isProjectOpeningRef.current) {
      startAnimation();
    }
  }, [isContactOpen]);

  useEffect(() => {
    if (!isContactOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsContactOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isContactOpen]);

  const nudge = (delta: number) => {
    if (isContactOpen || activeProjectTransition) {
      return;
    }

    targetOffsetRef.current += delta;
    startAnimation();
  };

  const openProject = (project: (typeof projects)[number], element: HTMLElement) => {
    if (activeProjectTransition) {
      return;
    }

    isProjectOpeningRef.current = true;
    stopAnimation();

    const rect = element.getBoundingClientRect();
    const href = `/work/${project.id}`;

    window.sessionStorage.setItem(
      'project-transition-origin',
      JSON.stringify({
        id: project.id,
        imageUrl: project.imageUrl,
        mediaType: project.mediaType,
        posterUrl: project.posterUrl,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      })
    );

    setActiveProjectTransition({ project, rect, expanded: false });

    window.requestAnimationFrame(() => {
      setActiveProjectTransition({ project, rect, expanded: true });
    });

    window.setTimeout(() => {
      router.push(href);
    }, PROJECT_TRANSITION_DURATION - 60);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-ink text-ash">
      <header className="site-banner absolute inset-x-0 top-0 z-[80] bg-ink/16 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-[auto_1fr_auto] md:px-6">
          <div className="flex min-h-10 items-center">
            <Image src="/images/LOGOnowe.png" alt="Logo" width={160} height={104} className="h-11 w-auto object-contain md:h-12" priority />
          </div>

          <button
            type="button"
            onClick={() => {
              stopAnimation();
              setIsContactOpen(true);
            }}
            className="inline-flex min-h-10 items-center rounded-full bg-ash px-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink transition hover:opacity-70 md:hidden"
          >
            Contact
          </button>

          <div className="hidden translate-x-36 justify-self-center gap-12 font-mono text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.28em] text-ash/82 md:flex lg:translate-x-44">
            <div>
              <span className="block text-left">Graphic Designer</span>
              <span className="mt-1 block text-left">& Web Developer</span>
            </div>
            <span className="translate-x-4 self-start whitespace-nowrap text-left">Lodz, Poland</span>
          </div>

          <div className="hidden items-center gap-5 md:flex md:justify-self-end">
            <button
              type="button"
              onClick={() => {
                stopAnimation();
                setIsContactOpen(true);
              }}
              className="inline-flex min-h-10 items-center rounded-full bg-ash px-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink transition hover:opacity-70"
            >
              Contact
            </button>
          </div>
        </div>
      </header>

      <div
        className="scrollbar-none h-full overflow-hidden overscroll-none pb-[4.5rem] pt-[4.5rem] md:pb-[4.75rem] md:pt-[4.75rem]"
        onWheel={(event) => {
          event.preventDefault();
          nudge(event.deltaY);
        }}
        onTouchStart={(event) => {
          touchStartRef.current = event.touches[0]?.clientY ?? null;
        }}
        onTouchMove={(event) => {
          event.preventDefault();

          const currentY = event.touches[0]?.clientY;
          const previousY = touchStartRef.current;

          if (currentY === undefined || previousY === null) {
            return;
          }

          nudge((previousY - currentY) * TOUCH_SCROLL_MULTIPLIER);
          touchStartRef.current = currentY;
        }}
        onTouchEnd={() => {
          touchStartRef.current = null;
        }}
      >
        <div ref={trackRef} className="will-change-transform">
          {loopedProjects.map((projectGroup, groupIndex) => (
            <div
              key={groupIndex}
              ref={groupIndex === 1 ? segmentRef : undefined}
              className="grid grid-cols-2 border-t border-line/35 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {projectGroup.map((project, projectIndex) => (
                <ProjectCard key={`${groupIndex}-${project.id}-${projectIndex}`} project={project} onOpen={openProject} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {activeProjectTransition && (
        <div
          className="pointer-events-none fixed z-40 overflow-hidden bg-ink transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            left: activeProjectTransition.expanded ? 0 : activeProjectTransition.rect.left,
            top: activeProjectTransition.expanded ? 0 : activeProjectTransition.rect.top,
            width: activeProjectTransition.expanded ? '100vw' : activeProjectTransition.rect.width,
            height: activeProjectTransition.expanded ? '100vh' : activeProjectTransition.rect.height
          }}
        >
          <ProjectMedia
            src={activeProjectTransition.project.imageUrl}
            alt={activeProjectTransition.project.title}
            mediaType={activeProjectTransition.project.mediaType}
            posterUrl={activeProjectTransition.project.posterUrl}
            sizes="100vw"
            className={`h-full w-full object-cover brightness-75 transition duration-500 ${
              activeProjectTransition.expanded ? 'opacity-0' : 'opacity-100'
            }`}
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div
        className={`absolute inset-0 z-30 flex items-center justify-center bg-black/0 px-4 transition-all duration-500 ${
          isContactOpen ? 'pointer-events-auto bg-black/80 backdrop-blur-xl' : 'pointer-events-none'
        }`}
        onClick={() => {
          setIsContactOpen(false);
        }}
      >
        <div
          className={`mx-auto w-full max-w-6xl transition-all duration-500 ${
            isContactOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="mb-8 flex items-start justify-between gap-6 px-4 md:px-6">
            <div className="max-w-2xl text-left">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-ash/64">
                Contact
              </p>
              <h2 className="mt-4 text-2xl font-medium leading-tight text-ash md:text-4xl">
                Thanks for reaching out!
              </h2>
            </div>

            <button
              type="button"
              aria-label="Close contact overlay"
              onClick={() => {
                setIsContactOpen(false);
              }}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line/35 bg-white/[0.04] font-mono text-lg text-ash transition hover:bg-white/[0.1]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 px-4 sm:grid-cols-3 md:px-6 lg:grid-cols-4 xl:grid-cols-5">
            <ContactCard
              href="mailto:contact@bartlomiejcwiklak.com"
              label="Option 01"
              title="Send an email"
            />

            <ContactCard
              href="https://calendly.com/bartlomiej-cwiklak/private-call"
              external
              label="Option 02"
              title="Book a phone call"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
