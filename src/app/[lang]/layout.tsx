import type { Metadata } from 'next';
import { DM_Sans, Roboto_Mono } from 'next/font/google';
import { LanguageProvider } from '@/components/i18n/language';
import { FixedLogo } from '@/components/layout/fixed-logo';
import { PageTransition } from '@/components/navigation/page-transition';
import { getAlternates, isLanguage, LANGUAGES, type Language } from '@/lib/i18n';
import { AUTHOR, SITE_NAME, SITE_URL, toJsonLd } from '@/lib/site';
import '../globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono'
});

const SITE_TITLE = 'Bartłomiej Ćwiklak | Graphic Designer & Web Developer';
const SITE_DESCRIPTION =
  'Projektuję i tworzę nowoczesne strony internetowe dla firm z Łodzi i okolic: strony firmowe, landing page i sklepy. Szybkie, responsywne i przygotowane pod Google.';

const SITE_DESCRIPTION_EN =
  'I design and build modern websites for businesses in Łódź and beyond: company websites, landing pages and online stores. Fast, responsive and ready for Google.';

const KEYWORDS: Record<Language, string[]> = {
  pl: [
    'strony internetowe Łódź',
    'tworzenie stron internetowych Łódź',
    'projektowanie stron www Łódź',
    'strona internetowa dla firmy Łódź',
    'web developer Łódź',
    'grafik Łódź',
    'sklep internetowy Łódź',
    'landing page Łódź'
  ],
  en: ['web developer Lodz', 'web design Lodz', 'website design Poland', 'graphic designer Lodz', 'branding', 'landing page design']
};

type LayoutProps = {
  children: React.ReactNode;
  params: { lang: string };
};

// Both languages are prerendered; any other first segment is a Polish path (the middleware adds /pl) or a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const language: Language = params.lang === 'en' ? 'en' : 'pl';
  const description = language === 'pl' ? SITE_DESCRIPTION : SITE_DESCRIPTION_EN;
  const alternates = getAlternates('/', language);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_TITLE,
      template: '%s | Bartłomiej Ćwiklak'
    },
    description,
    keywords: KEYWORDS[language],
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
    alternates,
    openGraph: {
      title: SITE_TITLE,
      description,
      url: alternates.canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: '/images/LOGOnowe.png',
          width: 160,
          height: 104,
          alt: language === 'pl' ? 'Bartłomiej Ćwiklak – strony internetowe Łódź' : 'Bartłomiej Ćwiklak – web design Łódź'
        }
      ],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: SITE_TITLE,
      description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    other: {
      'geo.region': 'PL-10',
      'geo.placename': 'Łódź',
      'geo.position': '51.7592;19.4560',
      ICBM: '51.7592, 19.4560'
    }
  };
}

// Local business data for Google: who offers web design services and in which area.
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: 'Bartłomiej Ćwiklak – strony internetowe Łódź',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/images/LOGOnowe.png`,
    logo: `${SITE_URL}/images/LOGOnowe.png`,
    email: 'contact@bartlomiejcwiklak.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Łódź',
      addressRegion: 'łódzkie',
      addressCountry: 'PL'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.7592,
      longitude: 19.456
    },
    areaServed: [
      { '@type': 'City', name: 'Łódź' },
      { '@type': 'AdministrativeArea', name: 'województwo łódzkie' },
      { '@type': 'Country', name: 'Polska' }
    ],
    knowsAbout: ['strony internetowe', 'projektowanie stron www', 'sklepy internetowe', 'landing page', 'SEO', 'identyfikacja wizualna', 'projektowanie graficzne'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Usługi',
      itemListElement: [
        'Tworzenie stron internetowych dla firm',
        'Projektowanie stron www',
        'Sklepy internetowe',
        'Landing page',
        'Identyfikacja wizualna i projektowanie graficzne'
      ].map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service, areaServed: { '@type': 'City', name: 'Łódź' } }
      }))
    },
    founder: { '@id': `${SITE_URL}/#person` },
    sameAs: AUTHOR.sameAs
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Bartłomiej Ćwiklak',
    alternateName: AUTHOR.name,
    jobTitle: 'Web Developer i grafik',
    url: SITE_URL,
    homeLocation: { '@type': 'City', name: 'Łódź' },
    sameAs: AUTHOR.sameAs
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['pl', 'en'],
    publisher: { '@id': `${SITE_URL}/#business` }
  }
];

export default function RootLayout({ children, params }: Readonly<LayoutProps>) {
  const language: Language = isLanguage(params.lang) ? params.lang : 'pl';

  return (
    <html lang={language}>
      <body className={`${dmSans.variable} ${robotoMono.variable} bg-ink font-sans text-ash antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }} />
        <LanguageProvider language={language}>
          {children}
          <PageTransition />
          <FixedLogo />
        </LanguageProvider>
      </body>
    </html>
  );
}
