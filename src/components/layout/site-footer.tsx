'use client';

import { useLanguage } from '@/components/i18n/language';
import { SiteLogo } from '@/components/layout/site-logo';
import { ExternalArrowIcon, MenuItemContent, menuItemClassName, openContactMenu, smallLinkClassName, socialLinks } from '@/components/navigation/menu-items';
import { PageTransitionLink } from '@/components/navigation/page-transition';

// Footer styled like the fullscreen menu: the same big links, social links and spacing.
export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer data-site-footer className="bg-ink px-8 pb-16 pt-24 text-ash md:px-16 md:pb-20 md:pt-32 lg:px-24">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
        <div>
          <PageTransitionLink href="/" className="flex w-fit items-center" ariaLabel={t('backToPortfolio')}>
            <SiteLogo className="h-10 md:h-12" />
          </PageTransitionLink>
          <p className="mt-8 max-w-md text-base leading-7 text-ash/72 md:mt-10 md:text-lg md:leading-8">{t('menuIntro')}</p>
        </div>

        <nav aria-label={t('menu')} className="group/nav">
          <ul className="grid justify-items-start gap-1 md:gap-2">
            <li>
              <PageTransitionLink href="/" className={menuItemClassName}>
                <MenuItemContent label={t('work')} index={0} />
              </PageTransitionLink>
            </li>
            <li>
              <PageTransitionLink href="/about" className={menuItemClassName}>
                <MenuItemContent label={t('about')} index={1} />
              </PageTransitionLink>
            </li>
            <li>
              <PageTransitionLink href="/blog" className={menuItemClassName}>
                <MenuItemContent label={t('blog')} index={2} />
              </PageTransitionLink>
            </li>
            <li>
              <button type="button" onClick={openContactMenu} className={menuItemClassName}>
                <MenuItemContent label={t('contact')} index={3} />
              </button>
            </li>
          </ul>

          <ul className="mt-10 flex gap-6 md:mt-14 md:gap-8">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer" className={smallLinkClassName}>
                  <span className="inline-flex items-center gap-[0.3em]">
                    {link.label}
                    <ExternalArrowIcon />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line/20 pt-8 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/50 md:mt-28">
        <p>© 2026 Bartłomiej Ćwiklak. {t('allRightsReserved')}</p>
        <div className="flex gap-6">
          <PageTransitionLink href="/privacy-policy" className="transition hover:text-ash">
            {t('privacyPolicy')}
          </PageTransitionLink>
          <PageTransitionLink href="/ai-policy" className="transition hover:text-ash">
            {t('aiPolicy')}
          </PageTransitionLink>
        </div>
      </div>
    </footer>
  );
}
