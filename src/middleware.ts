import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, localizePath, type Language } from '@/lib/i18n';

// Picks pl or en from an Accept-Language header such as "de-DE,de;q=0.9,pl;q=0.8,en;q=0.7".
// A browser that asks for neither gets English; no header at all (most crawlers) gets the default, Polish.
function getBrowserLanguage(header: string | null): Language {
  if (!header) {
    return DEFAULT_LANGUAGE;
  }

  const ranked = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const quality = params.find((param) => param.trim().startsWith('q='));

      return { language: tag.split('-')[0], quality: quality ? Number(quality.trim().slice(2)) || 0 : 1, index };
    })
    .filter((entry) => isLanguage(entry.language) && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  return (ranked[0]?.language as Language | undefined) ?? 'en';
}

// Polish pages live at the bare paths and are served from app/[lang] as /pl/...; English pages are /en/...
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const prefix = /^\/(en|pl)(?=\/|$)/.exec(pathname)?.[1];

  if (prefix === 'en') {
    return NextResponse.next();
  }

  // /pl/about would duplicate /about.
  if (prefix === 'pl') {
    return NextResponse.redirect(new URL(`${pathname.slice(3) || '/'}${search}`, request.url), 308);
  }

  const cookie = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const language = isLanguage(cookie) ? cookie : getBrowserLanguage(request.headers.get('accept-language'));

  if (language !== DEFAULT_LANGUAGE) {
    const response = NextResponse.redirect(new URL(`${localizePath(pathname, language)}${search}`, request.url), 307);
    response.headers.set('Vary', 'Accept-Language, Cookie');
    return response;
  }

  const response = NextResponse.rewrite(new URL(`/${DEFAULT_LANGUAGE}${pathname === '/' ? '' : pathname}${search}`, request.url));
  response.headers.set('Vary', 'Accept-Language, Cookie');
  return response;
}

export const config = {
  // Skip Next internals and anything with a file extension (images, icons, sitemap.xml, robots.txt, rss.xml, resume.pdf).
  matcher: ['/((?!_next/|.*\\.[^/]+$).*)']
};
