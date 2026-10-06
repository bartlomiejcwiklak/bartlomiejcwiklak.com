'use client';

import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { useEffect, useId, useState } from 'react';
import { useLanguage } from '@/components/i18n/language';
import { useIsFooterVisible } from '@/components/layout/use-footer-visibility';
import { CLOSE_MENU_EVENT, MENU_STATE_EVENT } from '@/components/navigation/menu-items';
import { PageTransitionLink } from '@/components/navigation/page-transition';

const themeVariables = ['--color-ash', '--color-ink'] as const;

// The logo sits outside the page's <main>, which is where a page sets its theme colours, so copy them over.
function usePageThemeStyle() {
  const pathname = usePathname();
  const [style, setStyle] = useState<CSSProperties>();

  useEffect(() => {
    const main = document.querySelector('main');
    const nextStyle: Record<string, string> = {};

    themeVariables.forEach((name) => {
      const value = main?.style.getPropertyValue(name);

      if (value) {
        nextStyle[name] = value;
      }
    });

    setStyle(nextStyle as CSSProperties);
  }, [pathname]);

  return style;
}

// Logo hovering in the top-left corner. It lives in the root layout and sits above the page transition
// overlay and the menu, so it stays visible and still while pages change and the menu opens or closes.
// The stroked version stays readable over light and dark images, and takes its colours from the current
// page's theme (see src/lib/theme.ts).
export function FixedLogo() {
  const { localize, t } = useLanguage();
  const isFooterVisible = useIsFooterVisible();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHidden = isFooterVisible && !isMenuOpen;
  const themeStyle = usePageThemeStyle();
  // useId output contains colons, which are awkward inside url(#...) references.
  const maskId = `logo-mask${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const handleMenuState = (event: Event) => setIsMenuOpen((event as CustomEvent<{ isOpen: boolean }>).detail.isOpen);

    window.addEventListener(MENU_STATE_EVENT, handleMenuState);

    return () => window.removeEventListener(MENU_STATE_EVENT, handleMenuState);
  }, []);

  return (
    <div
      onClickCapture={() => window.dispatchEvent(new CustomEvent(CLOSE_MENU_EVENT))}
      aria-hidden={isHidden}
      className={`fixed left-8 top-[calc(2.5rem+env(safe-area-inset-top))] z-[96] transition-opacity duration-300 md:left-16 md:top-16 lg:left-24 ${
        isHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <PageTransitionLink href={localize('/')} className="project-entry flex items-center" ariaLabel={t('backToPortfolio')}>
        {/* Outline in the page background colour, fill in the page text colour; both fade to a new page's theme.
            Drawn as SVG masks: with two stacked CSS mask-image layers, iOS Safari dropped the fill layer. */}
        <svg role="img" aria-label="Bartłomiej Ćwiklak logo" viewBox="0 0 480 321" className="block aspect-[480/321] h-10 md:h-12" style={themeStyle}>
          <defs>
            <mask id={`${maskId}-outline`} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="321">
              <image href="/images/logo-stroked-outline-mask.png" width="480" height="321" />
            </mask>
            <mask id={`${maskId}-fill`} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="321">
              <image href="/images/logo-stroked-fill-mask.png" width="480" height="321" />
            </mask>
          </defs>
          <rect width="480" height="321" mask={`url(#${maskId}-outline)`} className="fill-ink transition-colors duration-500 ease-out" />
          <rect width="480" height="321" mask={`url(#${maskId}-fill)`} className="fill-ash transition-colors duration-500 ease-out" />
        </svg>
      </PageTransitionLink>
    </div>
  );
}
