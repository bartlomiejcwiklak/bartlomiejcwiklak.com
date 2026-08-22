import Image from 'next/image';
import { SiteFooter } from '@/components/layout/site-footer';
import { PageTransitionLink } from '@/components/navigation/page-transition';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-ink px-4 pt-32 text-ash md:px-6 md:pt-40">
      <header className="site-banner fixed inset-x-0 top-0 z-[80] bg-ink/16 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-[auto_1fr_auto] md:px-6">
          <PageTransitionLink href="/" className="flex min-h-10 items-center" ariaLabel="Back to portfolio">
            <Image src="/images/LOGOnowe.png" alt="Logo" width={160} height={104} className="h-11 w-auto object-contain md:h-12" priority />
          </PageTransitionLink>

          <div className="hidden translate-x-36 justify-self-center gap-12 font-mono text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.28em] text-ash/82 md:flex lg:translate-x-44">
            <div>
              <span className="block text-left">Graphic Designer</span>
              <span className="mt-1 block text-left">& Web Developer</span>
            </div>
            <span className="translate-x-4 self-start whitespace-nowrap text-left">Lodz, Poland</span>
          </div>

          <div className="hidden items-center gap-5 md:flex md:justify-self-end">
            <a
              href="mailto:contact@bartlomiejcwiklak.com"
              className="inline-flex min-h-10 items-center rounded-full bg-ash px-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink transition hover:opacity-70"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl pb-20 md:pb-28">
        <h1 className="project-entry text-[clamp(2.6rem,7vw,6.75rem)] font-bold leading-[0.9] tracking-[-0.06em]">
          Privacy Policy
        </h1>

        <div className="mt-14 grid max-w-6xl gap-6 text-base leading-7 text-ash/82 md:text-lg md:leading-8">
          <p className="project-entry project-entry-delay-1">
            This website is a personal portfolio for Bartlomiej Cwiklak. It is designed to present selected work and provide ways to get in touch.
          </p>
          <p className="project-entry project-entry-delay-2">
            The website does not intentionally collect personal data unless you choose to contact me through email or an external social platform.
          </p>
          <p className="project-entry project-entry-delay-3">
            External links, including social media profiles, may be governed by their own privacy policies. Please review those policies when using external services.
          </p>
          <p className="project-entry project-entry-delay-4">
            If analytics, forms, or additional services are added in the future, this policy will be updated to reflect what data is collected and why.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
