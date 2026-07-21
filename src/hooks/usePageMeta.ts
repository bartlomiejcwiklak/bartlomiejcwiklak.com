import { useEffect } from 'react';

type PageMeta = {
  title: string;
  description: string;
  path?: string;
  lang?: string;
};

const SITE_URL = 'https://bartlomiejcwiklak.com';

function updateMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  const selector = `meta[${attribute}="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

export function usePageMeta({ title, description, path, lang }: PageMeta) {
  useEffect(() => {
    document.title = title;

    if (lang) {
      document.documentElement.lang = lang;
    }

    updateMeta('description', description);
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:locale', lang === 'pl' ? 'pl_PL' : 'en_US', 'property');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);

    if (path) {
      const href = `${SITE_URL}${path}`;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }

      canonical.setAttribute('href', href);
      updateMeta('og:url', href, 'property');
    }
  }, [description, lang, path, title]);
}
