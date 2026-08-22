import Image from 'next/image';
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
          AI Policy: Balancing Craftsmanship and Technology
        </h1>

        <div className="mt-14 grid max-w-6xl gap-6 text-base leading-7 text-ash/82 md:text-lg md:leading-8">
          <p className="project-entry project-entry-delay-1">
            In a rapidly evolving digital landscape, transparency regarding the tools we use is essential. My approach to Artificial Intelligence is guided by a strict boundary: AI is a powerful engine for execution, but it is never a substitute for human creativity.
          </p>
          <h2 className="project-entry project-entry-delay-2 mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] text-ash md:text-3xl">
            Design is 100% Human-Driven
          </h2>
          <p className="project-entry project-entry-delay-3">
            Every visual and creative decision-from the foundational architectural layout and typographic spacing to the final aesthetic direction-is crafted entirely by me.
          </p>
          <p className="project-entry project-entry-delay-3">
            No AI-generated graphics: I do not use Artificial Intelligence to generate images, interface assets, or design systems.
          </p>
          <p className="project-entry project-entry-delay-4">
            Authentic vision: The intentionality, clean editorial structure, and empathy required to build a truly refined digital experience cannot be automated. My design process relies entirely on human intuition and craftsmanship.
          </p>
          <h2 className="project-entry project-entry-delay-5 mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] text-ash md:text-3xl">
            AI as a Development Co-Pilot
          </h2>
          <p className="project-entry project-entry-delay-5">
            While the creative vision remains strictly my own, I leverage Artificial Intelligence during the technical execution phase to enhance efficiency and maintain high standards.
          </p>
          <p className="project-entry project-entry-delay-6">
            Streamlined engineering: AI acts as an advanced assistant during the coding process. I utilize it to optimize full-stack architectures, debug complex logic, and write boilerplate code.
          </p>
          <p className="project-entry project-entry-delay-6">
            Polishing the product: AI serves as an additional layer of quality assurance, helping to refine algorithms and identify edge cases before deployment.
          </p>
          <p className="project-entry project-entry-delay-6">
            Ultimately, AI helps me build faster and more efficiently, but human craftsmanship entirely dictates what is being built.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
