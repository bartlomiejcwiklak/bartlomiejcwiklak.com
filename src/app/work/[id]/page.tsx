import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { LocalizedProjectDetails } from '@/components/project/localized-project-details';
import { ProjectTags } from '@/components/project/project-tags';
import { projects } from '@/data/projects';
import { getThemeStyle } from '@/lib/theme';

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

  // Web projects get the Polish service phrase in the title to rank for local web design searches.
  const title = project.category === 'Web Design' ? `${project.title} – projekt strony internetowej` : project.title;

  return {
    title,
    description: project.description,
    alternates: {
      canonical: `/work/${project.id}`
    },
    openGraph: {
      title: `${title} | Bartłomiej Ćwiklak`,
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
    <main className="min-h-screen bg-ink text-ash" style={getThemeStyle(project.theme)}>
      <SiteHeader />

      {/* Same margins and top offset as the menu, blog and policy pages; top padding clears the fixed logo. */}
      <article className="px-8 pb-24 pt-[calc(2.5rem+env(safe-area-inset-top)+7rem)] md:px-16 md:pb-32 md:pt-48 lg:px-24">
        <header className="max-w-5xl">
          <h1 className="project-entry text-[clamp(2.75rem,9vw,8rem)] font-bold uppercase leading-[0.9] tracking-[-0.06em]">
            {project.title}
          </h1>

          <div className="project-entry project-entry-delay-1 mt-6">
            <ProjectTags tags={tags} />
          </div>
        </header>

        <LocalizedProjectDetails project={project} />
      </article>

      <SiteFooter />
    </main>
  );
}
