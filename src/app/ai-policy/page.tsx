import Image from 'next/image';
import { ContactButton } from '@/components/contact/contact-overlay';
import { LocalizedText } from '@/components/i18n/language';
import { LanguageSwitcher, MobileMenu } from '@/components/i18n/language-switcher';
import { SiteFooter } from '@/components/layout/site-footer';
import { PageTransitionLink } from '@/components/navigation/page-transition';

export default function AiPolicyPage() {
  return (
    <main className="min-h-screen bg-ink px-4 pt-32 text-ash md:px-6 md:pt-40">
      <header className="site-banner fixed inset-x-0 top-0 z-[80] bg-ink/16 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-[auto_1fr_auto] md:px-6">
          <PageTransitionLink href="/" className="flex min-h-10 items-center" ariaLabel="Back to portfolio">
            <Image src="/images/LOGOnowe.png" alt="Logo" width={160} height={104} className="h-11 w-auto object-contain md:h-12" priority />
          </PageTransitionLink>

          <MobileMenu />

          <div className="hidden translate-x-36 justify-self-center gap-12 font-mono text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.28em] text-ash/82 md:flex lg:translate-x-44">
            <div>
              <span className="block text-left"><LocalizedText translationKey="graphicDesigner" /></span>
              <span className="mt-1 block text-left"><LocalizedText translationKey="webDeveloper" /></span>
            </div>
            <span className="translate-x-4 self-start whitespace-nowrap text-left"><LocalizedText translationKey="location" /></span>
          </div>

          <div className="hidden items-center gap-5 md:flex md:justify-self-end">
            <LanguageSwitcher />
            <ContactButton
              className="inline-flex min-h-10 items-center rounded-full bg-ash px-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink transition hover:opacity-70"
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl pb-20 md:pb-28">
        <h1 className="project-entry text-[clamp(2.6rem,7vw,6.75rem)] font-bold leading-[0.9] tracking-[-0.06em]">
          <LocalizedText translationKey="aiTitle" />
        </h1>

        <div className="mt-14 grid max-w-6xl gap-6 text-base leading-7 text-ash/82 md:text-lg md:leading-8">
          <p className="project-entry project-entry-delay-1">
            <LocalizedText translationKey="aiIntro" />
          </p>
          <h2 className="project-entry project-entry-delay-2 mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] text-ash md:text-3xl">
            <LocalizedText translationKey="aiHumanTitle" />
          </h2>
          <p className="project-entry project-entry-delay-3">
            <LocalizedText translationKey="aiHumanP1" />
          </p>
          <p className="project-entry project-entry-delay-3">
            <LocalizedText translationKey="aiHumanP2" />
          </p>
          <p className="project-entry project-entry-delay-4">
            <LocalizedText translationKey="aiHumanP3" />
          </p>
          <h2 className="project-entry project-entry-delay-5 mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] text-ash md:text-3xl">
            <LocalizedText translationKey="aiCopilotTitle" />
          </h2>
          <p className="project-entry project-entry-delay-5">
            <LocalizedText translationKey="aiCopilotP1" />
          </p>
          <p className="project-entry project-entry-delay-6">
            <LocalizedText translationKey="aiCopilotP2" />
          </p>
          <p className="project-entry project-entry-delay-6">
            <LocalizedText translationKey="aiCopilotP3" />
          </p>
          <p className="project-entry project-entry-delay-6">
            <LocalizedText translationKey="aiCopilotP4" />
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
