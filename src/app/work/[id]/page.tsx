import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/site-footer';
import { ProjectMedia } from '@/components/media/project-media';
import { ProjectBackLink, ProjectBackLogo } from '@/components/project/project-back-link';
import { LocalizedProjectDetails } from '@/components/project/localized-project-details';
import { projects } from '@/data/projects';

type ProjectPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((entry) => entry.id === params.id);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/work/${project.id}`
    },
    openGraph: {
      title: `${project.title} | Bartlomiej Cwiklak`,
      description: project.description,
      url: `/work/${project.id}`,
      images: [
        {
          url: project.posterUrl ?? project.imageUrl,
          width: 1400,
          height: 900,
          alt: project.title
        }
      ],
      type: 'article'
    }
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((entry) => entry.id === params.id);

  if (!project) {
    notFound();
  }

  const tags = [project.category, project.year];

  return (
    <main className="min-h-screen bg-ink text-ash">
      <header className="site-banner fixed inset-x-0 top-0 z-[80] bg-ink/16 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-[auto_1fr_auto] md:px-6">
          <ProjectBackLogo project={project} />

          <a
            href="mailto:contact@bartlomiejcwiklak.com"
            className="inline-flex min-h-10 items-center rounded-full bg-ash px-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink transition hover:opacity-70 md:hidden"
          >
            Contact
          </a>

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

      <section className="project-entry flex min-h-[30vh] items-center justify-center bg-ink px-4 pb-10 pt-28 text-center md:min-h-[75vh] md:px-6 md:pt-32">
        <div className="mx-auto max-w-[92rem]">
          <h1 className="text-[clamp(3.8rem,15vw,16rem)] font-bold uppercase leading-[0.82] tracking-[-0.08em] text-ash">
            {project.title}
          </h1>

          <div className="mt-7 flex flex-wrap justify-center gap-2 md:mt-10">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line/35 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash/78"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="project-entry project-entry-delay-1 px-4 md:px-6">
        <div className="overflow-hidden">
          <ProjectMedia
            src={project.imageUrl}
            alt={project.title}
            mediaType={project.mediaType}
            posterUrl={project.posterUrl}
            sizes="100vw"
            className="aspect-[4/3] w-full object-cover md:aspect-[16/9]"
            priority
          />
        </div>
      </section>

      <LocalizedProjectDetails project={project} />

      <SiteFooter project={project} />
    </main>
  );
}
