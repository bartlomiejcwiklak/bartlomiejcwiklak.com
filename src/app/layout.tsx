import type { Metadata } from 'next';
import { DM_Sans, Roboto_Mono } from 'next/font/google';
import { LanguageProvider } from '@/components/i18n/language';
import { FixedLogo } from '@/components/layout/fixed-logo';
import { PageTransition } from '@/components/navigation/page-transition';
import { AUTHOR, SITE_NAME, SITE_URL, toJsonLd } from '@/lib/site';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Bartłomiej Ćwiklak'
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'strony internetowe Łódź',
    'tworzenie stron internetowych Łódź',
    'projektowanie stron www Łódź',
    'strona internetowa dla firmy Łódź',
    'web developer Łódź',
    'grafik Łódź',
    'sklep internetowy Łódź',
    'landing page Łódź'
  ],
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    images: [
      {
        url: '/images/LOGOnowe.png',
        width: 160,
        height: 104,
        alt: 'Bartłomiej Ćwiklak – strony internetowe Łódź'
      }
    ],
    locale: 'pl_PL',
    alternateLocale: ['en_US'],
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${robotoMono.variable} bg-ash font-sans text-ink antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }} />
        <LanguageProvider>
          {children}
          <PageTransition />
          <FixedLogo />
        </LanguageProvider>
      </body>
    </html>
  );
}
