import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LocalizedText } from '@/components/i18n/language';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ArrowIcon } from '@/components/navigation/menu-items';
import { PageTransitionLink } from '@/components/navigation/page-transition';
import { formatPostDate, getAllPosts, getPost } from '@/lib/blog';
import { localizePath } from '@/lib/i18n';
import { AUTHOR, SITE_NAME, SITE_URL, toJsonLd } from '@/lib/site';
import { getThemeStyle } from '@/lib/theme';

type PostPageProps = {
  params: {
    lang: string;
    slug: string;
  };
};

export const dynamicParams = false;

// Each post exists only in the language it is written in.
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getAllPosts()
    .filter((post) => post.lang === params.lang)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post || post.lang !== params.lang) {
    return {};
  }

  const url = localizePath(`/blog/${post.slug}`, post.lang);

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': [{ url: '/blog/rss.xml', title: 'Bartlomiej Cwiklak Blog' }]
      }
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      locale: post.lang === 'pl' ? 'pl_PL' : 'en_US',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [AUTHOR.url],
      tags: post.tags,
      images: post.cover
        ? [{ url: post.cover, width: 1600, height: 900, alt: post.coverAlt ?? post.title }]
        : [{ url: '/images/LOGOnowe.png', width: 160, height: 104, alt: 'Bartlomiej Cwiklak logo' }]
    },
    twitter: {
      card: post.cover ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.description
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post || post.lang !== params.lang) {
    notFound();
  }

  const homeUrl = `${SITE_URL}${localizePath('/', post.lang)}`;
  const blogPath = localizePath('/blog', post.lang);
  const url = `${SITE_URL}${localizePath(`/blog/${post.slug}`, post.lang)}`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': url,
      mainEntityOfPage: url,
      url,
      headline: post.title,
      description: post.description,
      image: post.cover ? `${SITE_URL}${post.cover}` : `${SITE_URL}/images/LOGOnowe.png`,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: post.lang,
      keywords: post.tags.join(', '),
      timeRequired: `PT${post.readingMinutes}M`,
      author: {
        '@type': 'Person',
        name: AUTHOR.name,
        url: AUTHOR.url,
        jobTitle: AUTHOR.jobTitle,
        sameAs: AUTHOR.sameAs
      },
      publisher: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      isPartOf: { '@type': 'Blog', '@id': `${SITE_URL}${blogPath}` }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}${blogPath}` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-ink text-ash" style={getThemeStyle(post.theme)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }} />

      <SiteHeader />

      {/* Same margins and top offset as the menu and the policy pages; top padding clears the fixed logo. */}
      <article lang={post.lang} className="px-8 pb-24 pt-[calc(2.5rem+env(safe-area-inset-top)+7rem)] md:px-16 md:pb-32 md:pt-48 lg:px-24">
        <header className="max-w-5xl">
          <nav aria-label="Breadcrumb" className="project-entry">
            <PageTransitionLink
              href={blogPath}
              className="flex w-fit items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ash/72 transition hover:text-ash"
            >
              <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
              <LocalizedText translationKey="blog" />
            </PageTransitionLink>
          </nav>

          <h1 className="project-entry project-entry-delay-1 mt-8 text-[clamp(2.25rem,5.5vw,4.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.06em]">
            {post.title}
          </h1>

          <p className="project-entry project-entry-delay-2 mt-6 max-w-2xl text-base leading-7 text-ash/72 md:text-lg md:leading-8">
            {post.description}
          </p>
        </header>

        {post.cover ? (
          <div className="project-entry project-entry-delay-3 mt-14 overflow-hidden md:mt-20">
            <Image
              src={post.cover}
              alt={post.coverAlt ?? post.title}
              width={1600}
              height={900}
              sizes="100vw"
              className="aspect-[16/9] w-full object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="project-entry project-entry-delay-3 mt-14 grid gap-10 border-t border-line/20 pt-10 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:pt-14">
          {/* Article details, the left column of the same two-column grid used on the policy pages. */}
          <aside className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/50 md:sticky md:top-48 md:grid md:content-start md:gap-3 md:self-start md:text-xs">
            <span className="text-ash">{AUTHOR.name}</span>
            <time dateTime={post.date}>{formatPostDate(post.date, post.lang)}</time>
            {post.updated ? (
              <span>
                <LocalizedText translationKey="updatedOn" /> <time dateTime={post.updated}>{formatPostDate(post.updated, post.lang)}</time>
              </span>
            ) : null}
            <span>
              {post.readingMinutes} <LocalizedText translationKey="minRead" />
            </span>
            {post.tags.length > 0 ? (
              <ul className="flex w-full flex-wrap gap-2 md:mt-3">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-line/20 px-3 py-1.5 text-[0.62rem] tracking-[0.2em] text-ash/72">
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>

          <div
            className="prose prose-site prose-lg max-w-2xl prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-[-0.04em] prose-h2:text-[clamp(1.4rem,2.6vw,2.25rem)] prose-h2:leading-none prose-h3:text-xl prose-h3:leading-tight prose-p:text-ash/72 prose-li:text-ash/72 prose-a:text-ash prose-a:underline-offset-4 prose-img:w-full"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>

        <div className="mt-16 border-t border-line/20 pt-8 md:mt-24">
          <PageTransitionLink
            href={blogPath}
            className="flex w-fit items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ash/72 transition hover:text-ash"
          >
            <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
            <LocalizedText translationKey="backToBlog" />
          </PageTransitionLink>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
