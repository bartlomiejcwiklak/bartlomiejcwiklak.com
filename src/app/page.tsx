'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { ProjectMedia } from '@/components/media/project-media';
import { navigateWithTransition } from '@/components/navigation/page-transition';
import { GalleryHoverTitle } from '@/components/project/gallery-hover-title';
import { projects } from '@/data/projects';

const SCROLL_EASING = 0.11;
const SCROLL_STOP_THRESHOLD = 0.05;
// How far (in ms of the release speed) a flick keeps the gallery moving after the finger lifts.
const TOUCH_MOMENTUM = 320;
// A flick only counts if the finger was still moving this recently (ms) when it lifted.
const TOUCH_RELEASE_WINDOW = 100;
const AUTO_SCROLL_SPEED = 0.018;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

// Rows needed below the loop segment so the viewport never runs past the end of the track.
function getMinRowCount(width: number, height: number, columnCount: number) {
  const cardSize = width / columnCount;

  return Math.ceil(height / cardSize) + 1;
}

// The segment holds lcm(projects, columns) cards so it ends on a full row and a full project cycle,
// which keeps the reading order continuous across the loop seam.
function getSegmentProjects(columnCount: number) {
  const repeatCount = columnCount / getGreatestCommonDivisor(projects.length, columnCount);

  return Array.from({ length: repeatCount }, () => projects).flat();
}

// Continuation of the sequence after the segment, just tall enough to cover the viewport at the seam.
function getTailProjects(columnCount: number, minRowCount: number) {
  return Array.from({ length: minRowCount * columnCount }, (_, index) => projects[index % projects.length]);
}

function ProjectCard({
  project,
  onOpen
}: {
  project: (typeof projects)[number];
  onOpen: (project: (typeof projects)[number]) => void;
}) {
  const { id, title, year, imageUrl, mediaType, posterUrl, galleryThumbUrl } = project;

  return (
    <Link
      href={`/work/${id}`}
      data-project-id={id}
      data-project-title={title}
      onClick={(event) => {
        // Let the browser handle new-tab and other modified clicks.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();
        onOpen(project);
      }}
      className="group relative block"
    >
      <article>
        <div className="overflow-hidden">
          <ProjectMedia
            src={galleryThumbUrl ?? imageUrl}
            alt={title}
            mediaType={galleryThumbUrl ? 'gif' : mediaType}
            posterUrl={posterUrl}
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            // Highlighted via data-hovered (set by GalleryHoverTitle) rather than :hover, which browsers don't
            // update while the gallery moves under a still cursor.
            className="aspect-square w-full object-cover brightness-90 transition duration-500 group-data-[hovered=true]:scale-[1.02] group-data-[hovered=true]:brightness-100"
            priority={id === projects[0]?.id}
          />

          {/* With a mouse the title shows next to the logo instead (GalleryHoverTitle); touch devices keep it on the card. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/18 [@media(hover:hover)_and_(pointer:fine)]:hidden" />

          <span className="pointer-events-none absolute right-3 top-3 [@media(hover:hover)_and_(pointer:fine)]:hidden font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ash md:text-[0.62rem]">
            {year}
          </span>

          <h2 className="pointer-events-none absolute bottom-3 left-3 max-w-[75%] text-[1rem] font-bold uppercase leading-none text-ash md:text-[1.1rem] [@media(hover:hover)_and_(pointer:fine)]:hidden">
            {title}
          </h2>
        </div>
      </article>
    </Link>
  );
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const isProjectOpeningRef = useRef(false);
  const lastFrameTimeRef = useRef<number | null>(null);
  const currentOffsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const segmentHeightRef = useRef(0);
  const isMenuOpenRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const [columnCount, setColumnCount] = useState(5);
  const [minRowCount, setMinRowCount] = useState(0);

  const applyTrackTransform = () => {
    const segmentHeight = segmentHeightRef.current;
    const trackElement = trackRef.current;

    if (!segmentHeight || !trackElement) {
      return;
    }

    const normalizedOffset = ((currentOffsetRef.current % segmentHeight) + segmentHeight) % segmentHeight;
    trackElement.style.transform = `translate3d(0, ${-normalizedOffset}px, 0)`;
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

    if (!segmentHeight || !trackRef.current || isMenuOpenRef.current || isProjectOpeningRef.current || document.hidden) {
      stopAnimation();
      return;
    }

    const previousTimestamp = lastFrameTimeRef.current ?? timestamp;
    const elapsed = Math.min(timestamp - previousTimestamp, 64);

    lastFrameTimeRef.current = timestamp;

    if (!prefersReducedMotionRef.current) {
      targetOffsetRef.current += elapsed * AUTO_SCROLL_SPEED;
    }

    const delta = targetOffsetRef.current - currentOffsetRef.current;
    currentOffsetRef.current += delta * SCROLL_EASING;

    if (Math.abs(delta) < SCROLL_STOP_THRESHOLD) {
      currentOffsetRef.current = targetOffsetRef.current;

      // Without auto-scroll there is nothing left to animate once the user's scroll has settled.
      if (prefersReducedMotionRef.current) {
        applyTrackTransform();
        stopAnimation();
        return;
      }
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

  const loopedProjects = useMemo(
    () => [getSegmentProjects(columnCount), getTailProjects(columnCount, minRowCount)],
    [columnCount, minRowCount]
  );

  useEffect(() => {
    let resizeFrame: number | null = null;

    const updateColumns = () => {
      const nextColumnCount = getColumnCount(window.innerWidth);

      setColumnCount(nextColumnCount);
      setMinRowCount(getMinRowCount(window.innerWidth, window.innerHeight, nextColumnCount));
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

      if (!isMenuOpenRef.current && !isProjectOpeningRef.current && !document.hidden) {
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
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const handleChange = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;

      if (!mediaQuery.matches && !document.hidden && !isMenuOpenRef.current && !isProjectOpeningRef.current) {
        startAnimation();
      }
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isMenuOpenRef.current && !isProjectOpeningRef.current) {
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
    isMenuOpenRef.current = isMenuOpen;

    if (isMenuOpen) {
      stopAnimation();
      return;
    }

    if (!document.hidden && !isProjectOpeningRef.current) {
      startAnimation();
    }
  }, [isMenuOpen]);

  // Wheel and touch input drive the gallery directly. These listeners are registered as non-passive (React
  // makes them passive), so preventDefault really stops the browser from scrolling or bouncing the page.
  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) {
      return;
    }

    let lastY: number | null = null;
    let lastTime = 0;
    let velocity = 0;

    const canScroll = () => !isMenuOpenRef.current && !isProjectOpeningRef.current;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (!canScroll()) {
        return;
      }

      targetOffsetRef.current += event.deltaY;
      startAnimation();
    };

    const handleTouchStart = (event: TouchEvent) => {
      lastY = event.touches[0]?.clientY ?? null;
      lastTime = event.timeStamp;
      velocity = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();

      const currentY = event.touches[0]?.clientY;

      if (currentY === undefined || lastY === null || !canScroll()) {
        return;
      }

      const delta = lastY - currentY;
      const elapsed = Math.max(event.timeStamp - lastTime, 1);
      velocity = 0.8 * (delta / elapsed) + 0.2 * velocity;

      // Follow the finger 1:1 instead of easing towards it, so dragging never lags behind.
      targetOffsetRef.current += delta;
      currentOffsetRef.current += delta;
      applyTrackTransform();
      startAnimation();

      lastY = currentY;
      lastTime = event.timeStamp;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      // Fling: push the target further in the direction of travel; the easing loop then decelerates smoothly.
      if (lastY !== null && canScroll() && event.timeStamp - lastTime < TOUCH_RELEASE_WINDOW) {
        targetOffsetRef.current += velocity * TOUCH_MOMENTUM;
        startAnimation();
      }

      lastY = null;
    };

    gallery.addEventListener('wheel', handleWheel, { passive: false });
    gallery.addEventListener('touchstart', handleTouchStart, { passive: true });
    gallery.addEventListener('touchmove', handleTouchMove, { passive: false });
    gallery.addEventListener('touchend', handleTouchEnd);
    gallery.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      gallery.removeEventListener('wheel', handleWheel);
      gallery.removeEventListener('touchstart', handleTouchStart);
      gallery.removeEventListener('touchmove', handleTouchMove);
      gallery.removeEventListener('touchend', handleTouchEnd);
      gallery.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const openProject = (project: (typeof projects)[number]) => {
    if (isProjectOpeningRef.current) {
      return;
    }

    isProjectOpeningRef.current = true;
    stopAnimation();
    navigateWithTransition(`/work/${project.id}`);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-ink text-ash">
      <SiteHeader onMenuOpenChange={setIsMenuOpen} />

      <GalleryHoverTitle containerRef={galleryRef} />

      <div
        ref={galleryRef}
        className="scrollbar-none h-full touch-none overflow-hidden overscroll-none"
      >
        <div ref={trackRef} className="will-change-transform">
          {loopedProjects.map((projectGroup, groupIndex) => (
            <div
              key={groupIndex}
              ref={groupIndex === 0 ? segmentRef : undefined}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {projectGroup.map((project, projectIndex) => (
                <ProjectCard key={`${groupIndex}-${project.id}-${projectIndex}`} project={project} onOpen={openProject} />
              ))}
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
