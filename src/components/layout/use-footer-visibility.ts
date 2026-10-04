'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// True while the site footer, which has its own logo and links, is on screen. Re-attaches on every route
// change so it also works for components that persist across pages.
export function useIsFooterVisible() {
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    setIsFooterVisible(false);

    const footer = document.querySelector('[data-site-footer]');

    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsFooterVisible(entry.isIntersecting));
    observer.observe(footer);

    return () => observer.disconnect();
  }, [pathname]);

  return isFooterVisible;
}
