'use client';

import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useLanguage } from '@/components/i18n/language';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ArrowIcon, ExternalArrowIcon, MenuItemContent, menuItemClassName, smallLinkClassName, socialLinks } from '@/components/navigation/menu-items';
import { navigateWithTransition } from '@/components/navigation/page-transition';

const CONTACT_EMAIL = 'contact@bartlomiejcwiklak.com';
const CALL_URL = 'https://calendly.com/bartlomiej-cwiklak/private-call';

export type MenuView = 'main' | 'contact';

type SiteMenuProps = {
  isOpen: boolean;
  view: MenuView;
  onViewChange: (view: MenuView) => void;
  onClose: () => void;
};

// Fullscreen navigation hub layered just below the fixed logo and menu button, so those never move.
// Contact is a second view inside the menu: the main content slides up and away while contact slides in.
export function SiteMenu({ isOpen, view, onViewChange, onClose }: SiteMenuProps) {
  const { localize, t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      // Return to the main view once the menu has faded out.
      const timer = window.setTimeout(() => onViewChange('main'), 300);

      return () => window.clearTimeout(timer);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onViewChange]);

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    onClose();

    // Let the browser handle new-tab and other modified clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    navigateWithTransition(href);
  };

  const isMainVisible = isOpen && view === 'main';
  const isContactVisible = isOpen && view === 'contact';
  const mainTabIndex = isMainVisible ? undefined : -1;
  const contactTabIndex = isContactVisible ? undefined : -1;

  const itemStyle = (index: number, isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(1.5rem)',
    transitionDelay: isVisible ? `${120 + index * 70}ms` : '0ms'
  });

  // Position follows the active view; clicks are only accepted while the menu is actually open, because a
  // child with pointer-events enabled would otherwise catch clicks through the invisible closed menu.
  const viewClassName = (isActiveView: boolean, isInteractive: boolean, hiddenOffset: string) =>
    `scrollbar-none absolute inset-0 flex flex-col overflow-y-auto transition duration-500 ease-out ${
      isActiveView ? 'translate-y-0 opacity-100' : `${hiddenOffset} opacity-0`
    } ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`;

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t('menu')}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[70] bg-ink text-ash transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Bottom padding leaves room for the menu button, which stays on top of the menu. */}
      <div className="flex h-[100dvh] flex-col px-8 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))] md:px-16 md:pb-[calc(9rem+env(safe-area-inset-bottom))] md:pt-16 lg:px-24">
        <div className="mb-8 flex items-start justify-between gap-8 md:mb-10">
          {/* Space for the fixed site logo, which is drawn above the menu in this exact spot. */}
          <div className="h-10 md:h-12" aria-hidden="true" />

          <div className={isOpen ? 'shrink-0' : 'invisible shrink-0'}>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="relative flex-1">
          <section aria-hidden={!isMainVisible} className={viewClassName(view === 'main', isMainVisible, '-translate-y-12')}>
            <p className="max-w-md text-base leading-7 text-ash/72 md:max-w-2xl md:text-lg md:leading-8 lg:max-w-3xl">{t('menuIntro')}</p>

            <nav className="group/nav flex flex-1 flex-col justify-center py-8">
              <ul className="grid justify-items-start gap-1 md:gap-2">
                <li style={itemStyle(0, isMainVisible)} className="transition duration-500 ease-out">
                  <a href={localize('/')} tabIndex={mainTabIndex} onClick={(event) => handleNavigate(event, localize('/'))} className={menuItemClassName}>
                    <MenuItemContent label={t('work')} index={0} />
                  </a>
                </li>
                <li style={itemStyle(1, isMainVisible)} className="transition duration-500 ease-out">
                  <a href={localize('/about')} tabIndex={mainTabIndex} onClick={(event) => handleNavigate(event, localize('/about'))} className={menuItemClassName}>
                    <MenuItemContent label={t('about')} index={1} />
                  </a>
                </li>
                <li style={itemStyle(2, isMainVisible)} className="transition duration-500 ease-out">
                  <a href={localize('/blog')} tabIndex={mainTabIndex} onClick={(event) => handleNavigate(event, localize('/blog'))} className={menuItemClassName}>
                    <MenuItemContent label={t('blog')} index={2} />
                  </a>
                </li>
                <li style={itemStyle(3, isMainVisible)} className="transition duration-500 ease-out">
                  <button type="button" tabIndex={mainTabIndex} onClick={() => onViewChange('contact')} className={menuItemClassName}>
                    <MenuItemContent label={t('contact')} index={3} />
                  </button>
                </li>
              </ul>

              <ul className="mt-10 flex gap-6 md:mt-14 md:gap-8" style={itemStyle(4, isMainVisible)}>
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer" tabIndex={mainTabIndex} className={smallLinkClassName}>
                      <span className="inline-flex items-center gap-[0.3em]">
                        {link.label}
                        <ExternalArrowIcon />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex gap-6 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/50 md:mt-8" style={itemStyle(5, isMainVisible)}>
                <li>
                  <a href={localize('/privacy-policy')} tabIndex={mainTabIndex} onClick={(event) => handleNavigate(event, localize('/privacy-policy'))} className="transition hover:text-ash">
                    {t('privacyPolicy')}
                  </a>
                </li>
                <li>
                  <a href={localize('/ai-policy')} tabIndex={mainTabIndex} onClick={(event) => handleNavigate(event, localize('/ai-policy'))} className="transition hover:text-ash">
                    {t('aiPolicy')}
                  </a>
                </li>
              </ul>
            </nav>
          </section>

          <section aria-hidden={!isContactVisible} className={viewClassName(view === 'contact', isContactVisible, 'translate-y-12')}>
            <button
              type="button"
              tabIndex={contactTabIndex}
              onClick={() => onViewChange('main')}
              className="flex w-fit items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ash/72 transition hover:text-ash"
            >
              <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
              {t('back')}
            </button>

            <div className="group/nav flex flex-1 flex-col justify-center py-8">
              <h2 className="max-w-3xl text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] transition duration-500 ease-out" style={itemStyle(0, isContactVisible)}>
                {t('contactTitle')}
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-ash/72 transition duration-500 ease-out md:text-lg md:leading-8" style={itemStyle(1, isContactVisible)}>
                {t('contactLead')}
              </p>

              <ul className="mt-10 grid justify-items-start gap-6 md:mt-14 md:gap-8">
                <li style={itemStyle(2, isContactVisible)} className="transition duration-500 ease-out">
                  <a href={`mailto:${CONTACT_EMAIL}`} tabIndex={contactTabIndex} className={menuItemClassName}>
                    <MenuItemContent label={t('contactEmail')} index={0} />
                  </a>
                  <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/50">{CONTACT_EMAIL}</p>
                </li>
                <li style={itemStyle(3, isContactVisible)} className="transition duration-500 ease-out">
                  <a href={CALL_URL} target="_blank" rel="noreferrer" tabIndex={contactTabIndex} className={menuItemClassName}>
                    <MenuItemContent label={t('contactCall')} index={1} />
                  </a>
                  <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/50">
                    <span className="inline-flex items-center gap-2">
                      Calendly
                      <ExternalArrowIcon className="h-3 w-3" />
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
