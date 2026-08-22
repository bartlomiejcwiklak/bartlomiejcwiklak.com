import Image from 'next/image';
import { PageTransitionLink } from '@/components/navigation/page-transition';
import { ProjectBackLink } from '@/components/project/project-back-link';

type SiteFooterProps = {
  project?: {
    id: string;
    title: string;
    imageUrl: string;
    mediaType?: 'image' | 'gif' | 'video';
    posterUrl?: string;
  };
};

export function SiteFooter({ project }: SiteFooterProps) {
  return (
    <footer className="bg-ink px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14">
        <div className="flex items-start justify-between gap-8">
          <Image src="/images/LOGOnowe.png" alt="Logo" width={160} height={104} className="h-12 w-auto object-contain md:h-16" />

          <div className="flex gap-3 text-ash">
            <a
              href="https://www.linkedin.com/in/bartlomiejcwiklak/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] transition hover:bg-white/[0.1]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.68H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/cwiklak.design/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] transition hover:bg-white/[0.1]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <path d="M17.5 6.5h.01" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        {project ? (
          <ProjectBackLink project={project} className="w-fit text-left text-[clamp(3rem,10vw,9rem)] font-bold uppercase leading-[0.86] tracking-[-0.07em] text-ash transition hover:opacity-70">
            <span>Back to Work</span>
          </ProjectBackLink>
        ) : (
          <PageTransitionLink href="/" className="w-fit text-left text-[clamp(3rem,10vw,9rem)] font-bold uppercase leading-[0.86] tracking-[-0.07em] text-ash transition hover:opacity-70">
            <span>Back to Work</span>
          </PageTransitionLink>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/50">
          <p>© 2026 Bartlomiej Cwiklak. All rights reserved.</p>
          <div className="ml-auto flex gap-5 text-ash">
            <PageTransitionLink href="/privacy-policy" className="underline underline-offset-4 transition hover:opacity-70">
              Privacy Policy
            </PageTransitionLink>
            <PageTransitionLink href="/ai-policy" className="underline underline-offset-4 transition hover:opacity-70">
              AI Policy
            </PageTransitionLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
