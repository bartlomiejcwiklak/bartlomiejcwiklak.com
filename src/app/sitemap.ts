import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: SITE_URL,
      priority: 1
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.id}`,
      priority: 0.8
    })),
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0] ? new Date(posts[0].updated ?? posts[0].date) : undefined,
      priority: 0.8
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      priority: 0.7
    })),
    {
      url: `${SITE_URL}/privacy-policy`,
      priority: 0.2
    },
    {
      url: `${SITE_URL}/ai-policy`,
      priority: 0.2
    }
  ];
}
