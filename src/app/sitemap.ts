import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { getAllPosts } from '@/lib/blog';
import { LANGUAGES, localizePath } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

type Entry = Omit<MetadataRoute.Sitemap[number], 'url'>;

// One entry per language, each listing the other language as an hreflang alternate.
function bilingual(path: string, entry: Entry): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LANGUAGES.map((language) => [language, `${SITE_URL}${localizePath(path, language)}`]));

  return LANGUAGES.map((language) => ({
    ...entry,
    url: `${SITE_URL}${localizePath(path, language)}`,
    alternates: { languages }
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    ...bilingual('/', { priority: 1 }),
    ...projects.flatMap((project) => bilingual(`/work/${project.id}`, { priority: 0.8 })),
    ...bilingual('/about', { priority: 0.7 }),
    ...bilingual('/blog', {
      lastModified: posts[0] ? new Date(posts[0].updated ?? posts[0].date) : undefined,
      priority: 0.8
    }),
    // Posts are written in one language, so each has a single URL.
    ...posts.map((post) => ({
      url: `${SITE_URL}${localizePath(`/blog/${post.slug}`, post.lang)}`,
      lastModified: new Date(post.updated ?? post.date),
      priority: 0.7
    })),
    ...bilingual('/privacy-policy', { priority: 0.2 }),
    ...bilingual('/ai-policy', { priority: 0.2 })
  ];
}
