import type { Metadata } from 'next';
import { LocalizedText } from '@/components/i18n/language';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ArrowIcon, dimmableClassName } from '@/components/navigation/menu-items';
import { PageTransitionLink } from '@/components/navigation/page-transition';
import { formatPostDate, getAllPosts } from '@/lib/blog';
import { AUTHOR, SITE_URL, toJsonLd } from '@/lib/site';

const BLOG_DESCRIPTION =
  'Articles by Bartlomiej Cwiklak on graphic design, visual identity, web development and the process behind client projects.';

export const metadata: Metadata = {
  title: 'Blog',
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': [{ url: '/blog/rss.xml', title: 'Bartlomiej Cwiklak Blog' }]
    }
  },
  openGraph: {
    title: 'Blog | Bartlomiej Cwiklak',
    description: BLOG_DESCRIPTION,
    url: '/blog',
    type: 'website'
  }
};

export default function BlogPage() {
  const posts = getAllPosts();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog`,
    url: `${SITE_URL}/blog`,
    name: 'Bartlomiej Cwiklak Blog',
    description: BLOG_DESCRIPTION,
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: post.lang
    }))
  };

  return (
    <main className="min-h-screen bg-ink text-ash">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }} />

      <SiteHeader />

      {/* Same margins and top offset as the menu and the policy pages; top padding clears the fixed logo. */}
      <section className="px-8 pb-24 pt-[calc(2.5rem+env(safe-area-inset-top)+7rem)] md:px-16 md:pb-32 md:pt-48 lg:px-24">
        <header className="max-w-4xl">
          <h1 className="project-entry text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.06em]">
            <LocalizedText translationKey="blog" />
          </h1>

          <p className="project-entry project-entry-delay-1 mt-6 max-w-2xl text-base leading-7 text-ash/72 md:text-lg md:leading-8">
            <LocalizedText translationKey="blogIntro" />
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="project-entry project-entry-delay-2 mt-16 border-t border-line/20 pt-10 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ash/50 md:mt-24">
            <LocalizedText translationKey="blogEmpty" />
          </p>
        ) : (
          <ol className="group/nav project-entry project-entry-delay-2 mt-16 border-t border-line/20 md:mt-24">
            {posts.map((post, index) => (
              <li key={post.slug} className="border-b border-line/20">
                <article lang={post.lang}>
                  <PageTransitionLink
                    href={`/blog/${post.slug}`}
                    className={`group/item grid gap-5 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-14 ${dimmableClassName}`}
                  >
                    <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash/50 md:grid md:content-start md:gap-3 md:text-xs">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <time dateTime={post.date}>{formatPostDate(post.date, post.lang)}</time>
                      <span>
                        {post.readingMinutes} <LocalizedText translationKey="minRead" />
                      </span>
                    </div>

                    <div className="grid max-w-2xl gap-4">
                      <h2 className="relative text-[clamp(1.6rem,3.2vw,2.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.05em]">
                        {/* Same hover as the menu: the arrow fades in and the title slides right, without reflowing. */}
                        <ArrowIcon className="absolute left-0 top-[0.2em] h-[0.6em] w-[0.6em] -translate-x-2 opacity-0 transition duration-300 ease-out group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                        <span className="block transition-transform duration-300 ease-out group-hover/item:translate-x-[0.85em]">{post.title}</span>
                      </h2>
                      <p className="text-base leading-7 text-ash/72 md:text-lg md:leading-8">{post.description}</p>
                    </div>
                  </PageTransitionLink>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
