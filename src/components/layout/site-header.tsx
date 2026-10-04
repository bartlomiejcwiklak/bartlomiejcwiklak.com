'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/language';
import { menuButtonClassName } from '@/components/layout/menu-button-styles';
import { useIsFooterVisible } from '@/components/layout/use-footer-visibility';
import { CLOSE_MENU_EVENT, MENU_STATE_EVENT, OPEN_CONTACT_EVENT } from '@/components/navigation/menu-items';
import { SiteMenu, type MenuView } from '@/components/navigation/site-menu';

// Round menu button fixed at the bottom centre plus the fullscreen menu it opens. The button sits above the
// menu, so opening and closing it never moves it. The fixed logo lives in the root layout (see FixedLogo).
export function SiteHeader({ onMenuOpenChange }: { onMenuOpenChange?: (isOpen: boolean) => void }) {
  const { t } = useLanguage();
  const isFooterVisible = useIsFooterVisible();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const isHidden = isFooterVisible && !isMenuOpen;

  useEffect(() => {
    onMenuOpenChange?.(isMenuOpen);
    window.dispatchEvent(new CustomEvent(MENU_STATE_EVENT, { detail: { isOpen: isMenuOpen } }));
  }, [isMenuOpen, onMenuOpenChange]);

  // Tell the persistent logo the menu is gone when this page unmounts.
  useEffect(() => () => {
    window.dispatchEvent(new CustomEvent(MENU_STATE_EVENT, { detail: { isOpen: false } }));
  }, []);

  useEffect(() => {
    const handleOpenContact = () => {
      setMenuView('contact');
      setIsMenuOpen(true);
    };

    window.addEventListener(OPEN_CONTACT_EVENT, handleOpenContact);
    window.addEventListener(CLOSE_MENU_EVENT, closeMenu);

    return () => {
      window.removeEventListener(OPEN_CONTACT_EVENT, handleOpenContact);
      window.removeEventListener(CLOSE_MENU_EVENT, closeMenu);
    };
  }, [closeMenu]);

  return (
    <>
      <SiteMenu isOpen={isMenuOpen} view={menuView} onViewChange={setMenuView} onClose={closeMenu} />

      {/* Single round menu button centred above the bottom edge; it stays on top of the open menu and turns into a close button. */}
      <nav
        aria-label={t('menu')}
        aria-hidden={isHidden}
        className={`fixed bottom-[calc(2.5rem+env(safe-area-inset-bottom))] left-1/2 z-[80] -translate-x-1/2 transition-opacity duration-300 ${
          isHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? t('close') : t('menu')}
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          className={`project-entry ${menuButtonClassName}`}
        >
          {/* Three lines that morph into an X while the menu is open. */}
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 block h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                isMenuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-[1.5px] w-5 bg-current transition-opacity duration-200 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute bottom-[0.5px] left-0 block h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>
    </>
  );
}
