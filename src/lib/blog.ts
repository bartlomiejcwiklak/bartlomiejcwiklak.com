import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { SITE_URL } from '@/lib/site';
import type { PageTheme } from '@/lib/theme';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'blog');
const WORDS_PER_MINUTE = 200;

export type PostLanguage = 'en' | 'pl';

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  lang: PostLanguage;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  readingMinutes: number;
  theme?: PageTheme;
};

export type Post = PostMeta & {
  html: string;
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function requireString(value: unknown, field: string, file: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Blog post "${file}" is missing the required "${field}" field.`);
  }

  return value.trim();
}

// YAML parses unquoted dates into Date objects; normalize both forms to YYYY-MM-DD.
function readDate(value: unknown, field: string, file: string) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const date = requireString(value, field, file);

  if (Number.isNaN(new Date(date).getTime())) {
    throw new Error(`Blog post "${file}" has an invalid "${field}" date: ${date}`);
  }

  return date;
}

// Lazy-loads images and opens external links in a new tab.
function rehypeEnhanceElements() {
  const visit = (node: HastNode) => {
    if (node.type === 'element' && node.properties) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }

      const href = node.properties.href;

      if (node.tagName === 'a' && typeof href === 'string' && /^https?:\/\//.test(href) && !href.startsWith(SITE_URL)) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
      }
    }

    node.children?.forEach(visit);
  };

  return (tree: HastNode) => visit(tree);
}

function readTheme(data: Record<string, unknown>, file: string): PageTheme | undefined {
  if (data.background === undefined && data.text === undefined) {
    return undefined;
  }

  return {
    background: requireString(data.background, 'background', file),
    text: requireString(data.text, 'text', file)
  };
}

function getPostFiles() {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  return fs.readdirSync(POSTS_DIRECTORY).filter((file) => file.endsWith('.md') && !file.startsWith('_'));
}

function readPost(file: string) {
  const source = fs.readFileSync(path.join(POSTS_DIRECTORY, file), 'utf8');
  const { data, content } = matter(source);
  const lang = data.lang ?? 'pl';

  if (lang !== 'en' && lang !== 'pl') {
    throw new Error(`Blog post "${file}" has an unsupported "lang": ${lang}. Use "en" or "pl".`);
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const meta: PostMeta = {
    slug: file.replace(/\.md$/, ''),
    title: requireString(data.title, 'title', file),
    description: requireString(data.description, 'description', file),
    date: readDate(data.date, 'date', file),
    updated: data.updated ? readDate(data.updated, 'updated', file) : undefined,
    lang,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    coverAlt: typeof data.coverAlt === 'string' ? data.coverAlt : undefined,
    draft: data.draft === true,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    theme: readTheme(data, file)
  };

  return { meta, content };
}

// Drafts are visible while running `next dev` and left out of production builds.
function isPublished(meta: PostMeta) {
  return !meta.draft || process.env.NODE_ENV === 'development';
}

export function getAllPosts(): PostMeta[] {
  return getPostFiles()
    .map((file) => readPost(file).meta)
    .filter(isPublished)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = `${slug}.md`;

  if (!getPostFiles().includes(file)) {
    return null;
  }

  const { meta, content } = readPost(file);

  if (!isPublished(meta)) {
    return null;
  }

  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeEnhanceElements)
    .use(rehypeStringify)
    .process(content);

  return { ...meta, html: String(html) };
}

export function formatPostDate(date: string, lang: PostLanguage) {
  return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(date));
}
