import type { Metadata } from 'next';
import { DM_Sans, Roboto_Mono } from 'next/font/google';
import { PageTransition } from '@/components/navigation/page-transition';
import { ProjectReturnTransition } from '@/components/project/project-return-transition';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bartlomiejcwiklak.com'),
  title: {
    default: 'Bartlomiej Cwiklak | Graphic Designer & Web Developer',
    template: '%s | Bartlomiej Cwiklak'
  },
  description:
    'Portfolio of Bartlomiej Cwiklak, a graphic designer and web developer creating visual identities, web experiences and digital products.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Bartlomiej Cwiklak | Graphic Designer & Web Developer',
    description:
      'Selected graphic design and web development work by Bartlomiej Cwiklak, based in Lodz, Poland.',
    url: '/',
    siteName: 'Bartlomiej Cwiklak Portfolio',
    images: [
      {
        url: '/images/LOGOnowe.png',
        width: 160,
        height: 104,
        alt: 'Bartlomiej Cwiklak logo'
      }
    ],
    locale: 'en_US',
    type: 'website'
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
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${robotoMono.variable} bg-ash font-sans text-ink antialiased`}>
        {children}
        <ProjectReturnTransition />
        <PageTransition />
      </body>
    </html>
  );
}
