export const SITE_URL = 'https://bartlomiejcwiklak.com';

export const SITE_NAME = 'Bartłomiej Ćwiklak';

export const AUTHOR = {
  name: 'Bartlomiej Cwiklak',
  url: SITE_URL,
  jobTitle: 'Graphic Designer & Web Developer',
  sameAs: ['https://www.linkedin.com/in/bartlomiejcwiklak/', 'https://www.instagram.com/cwiklak.design/']
};

// Serializes structured data for a <script type="application/ld+json"> tag without allowing it to close the tag early.
export function toJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
