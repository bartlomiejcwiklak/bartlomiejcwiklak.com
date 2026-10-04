'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

const FADE_DURATION = 250;
const MAX_HIDDEN_DURATION = 2000;

export function navigateWithTransition(href: string) {
  window.dispatchEvent(new CustomEvent('page-transition', { detail: { href } }));
}

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const isRunningRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);

  const finish = () => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setIsVisible(false);
    isRunningRef.current = false;
  };

  // Fade the new page in once the route has actually changed.
  useEffect(() => {
    if (isRunningRef.current) {
      finish();
    }
  }, [pathname]);

  useEffect(() => {
    const handleTransition = (event: Event) => {
      if (isRunningRef.current) {
        return;
      }

      const { href } = (event as CustomEvent<{ href: string }>).detail;

      isRunningRef.current = true;
      setIsVisible(true);

      window.setTimeout(() => {
        if (href === window.location.pathname) {
          finish();
          return;
        }

        router.push(href);
        fallbackTimerRef.current = window.setTimeout(finish, MAX_HIDDEN_DURATION);
      }, FADE_DURATION);
    };

    window.addEventListener('page-transition', handleTransition);

    return () => {
      window.removeEventListener('page-transition', handleTransition);
    };
  }, [router]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[95] bg-ink transition-opacity duration-[250ms] ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

export function PageTransitionLink({ href, children, className, ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={(event) => {
        // Let the browser handle new-tab and other modified clicks.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();
        navigateWithTransition(href);
      }}
    >
      {children}
    </a>
  );
}
