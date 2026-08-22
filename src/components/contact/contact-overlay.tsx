'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ContactOverlayContextValue = {
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactOverlayContext = createContext<ContactOverlayContextValue | null>(null);

function ContactCard({
  href,
  title,
  label,
  external
}: {
  href: string;
  title: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group relative block border border-line/35 transition"
    >
      <article>
        <div className="aspect-square overflow-hidden bg-black/86 transition duration-500 group-hover:bg-white/[0.08]">
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ash/72 md:text-[0.62rem]">
            {label}
          </span>

          <h3 className="pointer-events-none absolute bottom-3 left-3 max-w-[75%] text-[1rem] font-bold uppercase leading-none text-ash md:text-[1.1rem]">
            {title}
          </h3>
        </div>
      </article>
    </a>
  );
}

export function ContactOverlayProvider({ children }: { children: ReactNode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <ContactOverlayContext.Provider
      value={{
        isContactOpen,
        openContact: () => setIsContactOpen(true),
        closeContact: () => setIsContactOpen(false)
      }}
    >
      {children}
    </ContactOverlayContext.Provider>
  );
}

export function useContactOverlay() {
  const context = useContext(ContactOverlayContext);

  if (!context) {
    throw new Error('useContactOverlay must be used within ContactOverlayProvider');
  }

  return context;
}

export function ContactButton({ children = 'Contact', className }: { children?: ReactNode; className?: string }) {
  const { openContact } = useContactOverlay();

  return (
    <button type="button" onClick={openContact} className={className}>
      {children}
    </button>
  );
}

export function ContactOverlay() {
  const { isContactOpen, closeContact } = useContactOverlay();

  useEffect(() => {
    if (!isContactOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContact();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeContact, isContactOpen]);

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center bg-black/0 px-4 transition-all duration-500 ${
        isContactOpen ? 'pointer-events-auto bg-black/80 backdrop-blur-xl' : 'pointer-events-none'
      }`}
      onClick={closeContact}
    >
      <div
        className={`mx-auto w-full max-w-6xl transition-all duration-500 ${
          isContactOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="mb-8 flex items-start justify-between gap-6 px-4 md:px-6">
          <div className="max-w-2xl text-left">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-ash/64">
              Contact
            </p>
            <h2 className="mt-4 text-2xl font-medium leading-tight text-ash md:text-4xl">
              Thanks for reaching out!
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close contact overlay"
            onClick={closeContact}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line/35 bg-white/[0.04] font-mono text-lg text-ash transition hover:bg-white/[0.1]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 px-4 sm:grid-cols-3 md:px-6 lg:grid-cols-4 xl:grid-cols-5">
          <ContactCard href="mailto:contact@bartlomiejcwiklak.com" label="Option 01" title="Send an email" />

          <ContactCard
            href="https://calendly.com/bartlomiej-cwiklak/private-call"
            external
            label="Option 02"
            title="Book a phone call"
          />
        </div>
      </div>
    </div>
  );
}
