'use client';

import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/language';
import { useIsFooterVisible } from '@/components/layout/use-footer-visibility';
import { CLOSE_MENU_EVENT, MENU_STATE_EVENT } from '@/components/navigation/menu-items';
import { PageTransitionLink } from '@/components/navigation/page-transition';

const themeVariables = ['--color-ash', '--color-ink'] as const;

function maskStyle(url: string): CSSProperties {
  return {
    maskImage: `url(${url})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskImage: `url(${url})`,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat'
  };
}

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
  const { t } = useLanguage();
  const isFooterVisible = useIsFooterVisible();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHidden = isFooterVisible && !isMenuOpen;
  const themeStyle = usePageThemeStyle();

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
      <PageTransitionLink href="/" className="project-entry flex items-center" ariaLabel={t('backToPortfolio')}>
        <span role="img" aria-label="Bartłomiej Ćwiklak logo" className="relative block aspect-[480/321] h-10 md:h-12" style={themeStyle}>
          {/* Outline in the page background colour, fill in the page text colour; both fade to a new page's theme. */}
          <span className="absolute inset-0 bg-ink transition-colors duration-500 ease-out" style={maskStyle('/images/logo-stroked-outline-mask.png')} />
          <span className="absolute inset-0 bg-ash transition-colors duration-500 ease-out" style={maskStyle('/images/logo-stroked-fill-mask.png')} />
        </span>
      </PageTransitionLink>
    </div>
  );
}
