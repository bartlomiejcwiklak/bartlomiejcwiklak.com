import { AUTHOR } from '@/lib/site';

// Shared link styles for the fullscreen menu and the footer, so both read as the same navigation.

// Other links dim only while the pointer is over one of the links themselves, not anywhere in the row.
// Wrap the links in an element with the `group/nav` class.
export const dimmableClassName =
  'menu-link transition-opacity duration-300 group-has-[.menu-link:hover]/nav:opacity-30 hover:!opacity-100 focus-visible:!opacity-100';

export const menuItemClassName = `group/item flex w-fit items-center text-left text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.06em] text-ash ${dimmableClassName}`;

export const smallLinkClassName = `text-[clamp(1.1rem,2vw,1.5rem)] font-bold uppercase tracking-[-0.03em] text-ash ${dimmableClassName}`;

export const socialLinks = [
  { label: 'LinkedIn', href: AUTHOR.sameAs[0] },
  { label: 'Instagram', href: AUTHOR.sameAs[1] }
];

export function ArrowIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

// Hovering an item slides it right and reveals an arrow in front of it. Only transforms are animated, so the
// link keeps its size and nothing around it reflows (important where the links sit in an auto-width column).
export function MenuItemContent({ label, index }: { label: string; index: number }) {
  return (
    <span className="relative flex items-center">
      <ArrowIcon className="absolute left-0 h-[0.6em] w-[0.6em] -translate-x-2 opacity-0 transition duration-300 ease-out group-hover/item:translate-x-0 group-hover/item:opacity-100" />
      <span className="flex transition-transform duration-300 ease-out group-hover/item:translate-x-[0.85em]">
        <span>{label}</span>
        <sup className="ml-3 self-start pt-[0.35em] font-mono text-[0.68rem] font-normal tracking-[0.2em] text-ash/50 md:text-xs">
          {String(index + 1).padStart(2, '0')}
        </sup>
      </span>
    </span>
  );
}

// Opens the fullscreen menu straight on its contact view, from anywhere on the page (e.g. the footer).
export const OPEN_CONTACT_EVENT = 'open-contact-menu';

export function openContactMenu() {
  window.dispatchEvent(new CustomEvent(OPEN_CONTACT_EVENT));
}

// Lets the persistent site logo (rendered in the root layout) follow the menu owned by each page.
export const MENU_STATE_EVENT = 'site-menu-state';
export const CLOSE_MENU_EVENT = 'close-site-menu';
