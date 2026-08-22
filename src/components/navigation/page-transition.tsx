'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export function PageTransition() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const handleTransition = (event: Event) => {
      if (isRunningRef.current) {
        return;
      }

      const { href } = (event as CustomEvent<{ href: string }>).detail;

      isRunningRef.current = true;
      setIsVisible(true);

      window.setTimeout(() => {
        router.push(href);
      }, 220);

      window.setTimeout(() => {
        setIsVisible(false);
        isRunningRef.current = false;
      }, 520);
    };

    window.addEventListener('page-transition', handleTransition);

    return () => {
      window.removeEventListener('page-transition', handleTransition);
    };
  }, [router]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[95] bg-ink transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

export function PageTransitionLink({ href, children, className, ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('page-transition', { detail: { href } }));
      }}
    >
      {children}
    </button>
  );
}
