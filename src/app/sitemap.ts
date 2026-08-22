import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';

const SITE_URL = 'https://bartlomiejcwiklak.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${SITE_URL}/privacy-policy`,
      priority: 0.2
    },
    {
      url: `${SITE_URL}/ai-policy`,
      priority: 0.2
    }
  ];
}
