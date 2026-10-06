// Shared by the server (metadata, middleware, static params) and the client (LanguageProvider).

export type Language = 'en' | 'pl';

export type TranslationKey =
  | 'contact'
  | 'close'
  | 'menu'
  | 'language'
  | 'graphicDesigner'
  | 'webDeveloper'
  | 'location'
  | 'backToPortfolio'
  | 'allRightsReserved'
  | 'privacyPolicy'
  | 'aiPolicy'
  | 'contactEmail'
  | 'contactCall'
  | 'fallbackDetails'
  | 'projectVisualArchive'
  | 'aboutProject'
  | 'previous'
  | 'next'
  | 'openImage'
  | 'work'
  | 'about'
  | 'aboutSubtitle'
  | 'aboutIntro'
  | 'aboutWhatTitle'
  | 'aboutWhatP1'
  | 'aboutWhatP2'
  | 'aboutExpTitle'
  | 'aboutExpP1'
  | 'aboutEduTitle'
  | 'aboutEduP1'
  | 'aboutEduP2'
  | 'aboutToolsTitle'
  | 'aboutToolsP1'
  | 'aboutToolsP2'
  | 'aboutToolsP3'
  | 'aboutToolsP4'
  | 'aboutToolsP5'
  | 'downloadCv'
  | 'menuIntro'
  | 'contactTitle'
  | 'contactLead'
  | 'back'
  | 'blog'
  | 'blogIntro'
  | 'blogEmpty'
  | 'backToBlog'
  | 'minRead'
  | 'updatedOn'
  | 'readArticle'
  | 'privacyTitle'
  | 'privacyH1'
  | 'privacyH2'
  | 'privacyH3'
  | 'privacyH4'
  | 'privacyP1'
  | 'privacyP2'
  | 'privacyP3'
  | 'privacyP4'
  | 'aiTitle'
  | 'aiIntro'
  | 'aiHumanTitle'
  | 'aiHumanP1'
  | 'aiHumanP2'
  | 'aiHumanP3'
  | 'aiCopilotTitle'
  | 'aiCopilotP1'
  | 'aiCopilotP2'
  | 'aiCopilotP3'
  | 'aiCopilotP4';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    contact: 'Contact',
    close: 'Close',
    menu: 'Menu',
    language: 'Language',
    graphicDesigner: 'Graphic Designer',
    webDeveloper: '& Web Developer',
    location: 'Lodz, Poland',
    backToPortfolio: 'Back to portfolio',
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    aiPolicy: 'AI Policy',
    contactEmail: 'Send an email',
    contactCall: 'Book a phone call',
    fallbackDetails: 'More case study details, process notes and production context will be added as this project archive grows.',
    projectVisualArchive: 'Project visual archive',
    aboutProject: 'About the project',
    previous: 'Previous image',
    next: 'Next image',
    openImage: 'Open image preview',
    work: 'Work',
    about: 'About',
    aboutSubtitle: 'Graphic designer and web developer from Łódź.',
    aboutIntro: 'I combine a designer’s eye with a programmer’s background. Since 2021 I have been designing visual identities and marketing materials, and I take websites from the first sketch all the way to code.',
    aboutWhatTitle: 'What I do',
    aboutWhatP1: 'Graphic design and branding: visual identities, posters, book covers, flyers and social media ads.',
    aboutWhatP2: 'Websites: design and development of company websites, landing pages and online stores, built with modern tools such as React and Tailwind CSS.',
    aboutExpTitle: 'Experience',
    aboutExpP1: 'Fiverr / freelance (since August 2021): graphic design and branding – marketing and advertising materials for international clients, from the brief and visual direction to final files, often on tight deadlines.',
    aboutEduTitle: 'Education',
    aboutEduP1: 'Lodz University of Technology (2024 – present): Computer Science in the English-taught programme of the International Faculty of Engineering (IFE).',
    aboutEduP2: 'Technical school of electronics in Radom (2019 – 2024): IT technician with the national qualifications INF.03 (websites and databases) and INF.04 (application design and development).',
    aboutToolsTitle: 'Tools',
    aboutToolsP1: 'Design: Adobe Photoshop, InDesign.',
    aboutToolsP2: 'Video and audio: Premiere Pro, Vegas Pro, FL Studio, Ableton Live.',
    aboutToolsP3: 'Web: HTML, CSS, JavaScript, TypeScript, React, Next.js, Angular, Vite, Tailwind CSS, PHP, SQL.',
    aboutToolsP4: 'Programming: C, C++, C#, Java, Python.',
    aboutToolsP5: 'Languages: English at C2 level (Cambridge Certificate in Advanced English, 98%).',
    downloadCv: 'Download CV (PDF)',
    contactTitle: 'Let’s talk about your project.',
    contactLead: 'Send me an email or book a short call, whichever is easier for you.',
    back: 'Back',
    menuIntro: 'I am Bartłomiej, a graphic designer and web developer based in Łódź, Poland. I design visual identities and build fast, thoughtful websites for brands and small businesses.',
    blog: 'Blog',
    blogIntro: 'Notes on graphic design, web development and the process behind the work.',
    blogEmpty: 'The first articles are on their way.',
    backToBlog: 'Back to Blog',
    minRead: 'min read',
    updatedOn: 'Updated',
    readArticle: 'Read article',
    privacyTitle: 'Privacy Policy',
    privacyH1: 'About this site',
    privacyH2: 'Your data',
    privacyH3: 'External links',
    privacyH4: 'Changes',
    privacyP1: 'This website is a personal portfolio for Bartlomiej Cwiklak. It is designed to present selected work and provide ways to get in touch.',
    privacyP2: 'The website does not intentionally collect personal data unless you choose to contact me through email or an external social platform.',
    privacyP3: 'External links, including social media profiles, may be governed by their own privacy policies. Please review those policies when using external services.',
    privacyP4: 'If analytics, forms, or additional services are added in the future, this policy will be updated to reflect what data is collected and why.',
    aiTitle: 'Balancing craftsmanship and technology',
    aiIntro: 'In a rapidly evolving digital landscape, transparency regarding the tools we use is essential. My approach to Artificial Intelligence is guided by a strict boundary: AI is a powerful engine for execution, but it is never a substitute for human creativity.',
    aiHumanTitle: 'Design is 100% Human-Driven',
    aiHumanP1: 'Every visual and creative decision-from the foundational architectural layout and typographic spacing to the final aesthetic direction-is crafted entirely by me.',
    aiHumanP2: 'No AI-generated graphics: I do not use Artificial Intelligence to generate images, interface assets, or design systems.',
    aiHumanP3: 'Authentic vision: The intentionality, clean editorial structure, and empathy required to build a truly refined digital experience cannot be automated. My design process relies entirely on human intuition and craftsmanship.',
    aiCopilotTitle: 'AI as a Development Co-Pilot',
    aiCopilotP1: 'While the creative vision remains strictly my own, I leverage Artificial Intelligence during the technical execution phase to enhance efficiency and maintain high standards.',
    aiCopilotP2: 'Streamlined engineering: AI acts as an advanced assistant during the coding process. I utilize it to optimize full-stack architectures, debug complex logic, and write boilerplate code.',
    aiCopilotP3: 'Polishing the product: AI serves as an additional layer of quality assurance, helping to refine algorithms and identify edge cases before deployment.',
    aiCopilotP4: 'Ultimately, AI helps me build faster and more efficiently, but human craftsmanship entirely dictates what is being built.'
  },
  pl: {
    contact: 'Kontakt',
    close: 'Zamknij',
    menu: 'Menu',
    language: 'Język',
    graphicDesigner: 'Projektant graficzny',
    webDeveloper: 'i Web Developer',
    location: 'Łódź, Polska',
    backToPortfolio: 'Wróć do portfolio',
    allRightsReserved: 'Wszelkie prawa zastrzeżone.',
    privacyPolicy: 'Polityka prywatności',
    aiPolicy: 'Polityka AI',
    contactEmail: 'Wyślij email',
    contactCall: 'Umów rozmowę',
    fallbackDetails: 'Więcej szczegółów case study, notatek z procesu i kontekstu produkcyjnego pojawi się wraz z rozwojem archiwum projektów.',
    projectVisualArchive: 'Archiwum wizualne projektu',
    aboutProject: 'O projekcie',
    previous: 'Poprzednie zdjęcie',
    next: 'Następne zdjęcie',
    openImage: 'Otwórz podgląd zdjęcia',
    work: 'Projekty',
    about: 'O mnie',
    aboutSubtitle: 'Projektant graficzny i web developer z Łodzi.',
    aboutIntro: 'Łączę oko projektanta z zapleczem programisty. Od 2021 roku projektuję identyfikacje wizualne i materiały marketingowe, a strony internetowe prowadzę od pierwszego szkicu aż po kod.',
    aboutWhatTitle: 'Co robię',
    aboutWhatP1: 'Projektowanie graficzne i branding: identyfikacje wizualne, plakaty, okładki książek, ulotki i reklamy w social mediach.',
    aboutWhatP2: 'Strony internetowe: projekt i wdrożenie stron firmowych, landing page’y i sklepów internetowych z użyciem nowoczesnych narzędzi, takich jak React i Tailwind CSS.',
    aboutExpTitle: 'Doświadczenie',
    aboutExpP1: 'Fiverr / freelance (od sierpnia 2021): projektowanie graficzne i branding – materiały marketingowe i reklamowe dla klientów z całego świata, od briefu i kierunku wizualnego po gotowe pliki, często pod presją czasu.',
    aboutEduTitle: 'Wykształcenie',
    aboutEduP1: 'Politechnika Łódzka (od 2024): informatyka w anglojęzycznym programie International Faculty of Engineering (IFE).',
    aboutEduP2: 'Zespół Szkół Elektronicznych w Radomiu (2019–2024): technik programista z kwalifikacjami INF.03 (strony internetowe i bazy danych) oraz INF.04 (projektowanie i programowanie aplikacji).',
    aboutToolsTitle: 'Narzędzia',
    aboutToolsP1: 'Design: Adobe Photoshop, InDesign.',
    aboutToolsP2: 'Wideo i audio: Premiere Pro, Vegas Pro, FL Studio, Ableton Live.',
    aboutToolsP3: 'Web: HTML, CSS, JavaScript, TypeScript, React, Next.js, Angular, Vite, Tailwind CSS, PHP, SQL.',
    aboutToolsP4: 'Programowanie: C, C++, C#, Java, Python.',
    aboutToolsP5: 'Języki: angielski na poziomie C2 (Cambridge Certificate in Advanced English, 98%).',
    downloadCv: 'Pobierz CV (PDF)',
    contactTitle: 'Porozmawiajmy o Twoim projekcie.',
    contactLead: 'Napisz maila albo umów krótką rozmowę – jak Ci wygodniej.',
    back: 'Wróć',
    menuIntro: 'Jestem Bartłomiej, projektant graficzny i web developer z Łodzi. Projektuję identyfikacje wizualne i tworzę szybkie, przemyślane strony internetowe dla marek i małych firm.',
    blog: 'Blog',
    blogIntro: 'Notatki o projektowaniu graficznym, tworzeniu stron i procesie stojącym za projektami.',
    blogEmpty: 'Pierwsze artykuły są w drodze.',
    backToBlog: 'Wróć do bloga',
    minRead: 'min czytania',
    updatedOn: 'Zaktualizowano',
    readArticle: 'Czytaj artykuł',
    privacyTitle: 'Polityka prywatności',
    privacyH1: 'O stronie',
    privacyH2: 'Twoje dane',
    privacyH3: 'Linki zewnętrzne',
    privacyH4: 'Zmiany',
    privacyP1: 'Ta strona jest osobistym portfolio Bartłomieja Ćwiklaka. Służy do prezentacji wybranych prac oraz udostępnienia sposobów kontaktu.',
    privacyP2: 'Strona nie zbiera celowo danych osobowych, chyba że zdecydujesz się skontaktować ze mną przez email lub zewnętrzną platformę społecznościową.',
    privacyP3: 'Linki zewnętrzne, w tym profile społecznościowe, mogą podlegać własnym politykom prywatności. Zapoznaj się z nimi podczas korzystania z usług zewnętrznych.',
    privacyP4: 'Jeśli w przyszłości zostaną dodane analityka, formularze lub dodatkowe usługi, ta polityka zostanie zaktualizowana o informacje, jakie dane są zbierane i dlaczego.',
    aiTitle: 'Rzemiosło i technologia',
    aiIntro: 'W szybko zmieniającym się świecie cyfrowym transparentność dotycząca używanych narzędzi jest kluczowa. Moje podejście do sztucznej inteligencji opiera się na jasnej granicy: AI jest silnikiem wykonawczym, ale nigdy nie zastępuje ludzkiej kreatywności.',
    aiHumanTitle: 'Design jest w 100% prowadzony przez człowieka',
    aiHumanP1: 'Każda decyzja wizualna i kreatywna - od układu, przez typografię, po finalny kierunek estetyczny - jest tworzona przeze mnie.',
    aiHumanP2: 'Bez grafik generowanych przez AI: nie używam sztucznej inteligencji do generowania obrazów, assetów interfejsu ani systemów designu.',
    aiHumanP3: 'Autentyczna wizja: intencjonalność, czysta struktura editorial i empatia potrzebne do stworzenia dopracowanego doświadczenia cyfrowego nie mogą zostać zautomatyzowane. Mój proces projektowy opiera się na ludzkiej intuicji i rzemiośle.',
    aiCopilotTitle: 'AI jako asystent developmentu',
    aiCopilotP1: 'Kreatywna wizja pozostaje w pełni moja, natomiast podczas technicznego wdrożenia korzystam z AI, aby zwiększać efektywność i utrzymywać wysoki standard.',
    aiCopilotP2: 'Sprawniejsza praca inżynierska: AI działa jako zaawansowany asystent przy kodowaniu. Wykorzystuję je do optymalizacji architektury, debugowania złożonej logiki i pisania powtarzalnych fragmentów kodu.',
    aiCopilotP3: 'Dopracowanie produktu: AI jest dodatkową warstwą kontroli jakości, pomagającą dopracowywać algorytmy i identyfikować edge case’y przed wdrożeniem.',
    aiCopilotP4: 'Ostatecznie AI pomaga mi budować szybciej i efektywniej, ale to ludzkie rzemiosło decyduje, co jest budowane.'
  }
};

export const LANGUAGES: Language[] = ['pl', 'en'];

// Polish lives at the bare paths (/about), English under /en (/en/about).
export const DEFAULT_LANGUAGE: Language = 'pl';

// Set when the visitor picks a language with the switcher; it wins over the browser's Accept-Language.
export const LANGUAGE_COOKIE = 'lang';

export function isLanguage(value: unknown): value is Language {
  return value === 'pl' || value === 'en';
}

// Turns a language-neutral path ("/about") into the URL for the given language ("/en/about").
export function localizePath(path: string, language: Language) {
  if (language === DEFAULT_LANGUAGE) {
    return path;
  }

  return path === '/' ? `/${language}` : `/${language}${path}`;
}

// The inverse of localizePath: "/en/about" -> "/about".
export function stripLanguage(pathname: string) {
  const match = /^\/(en|pl)(?=\/|$)/.exec(pathname);

  return match ? pathname.slice(match[0].length) || '/' : pathname;
}

// canonical + hreflang links for a page that exists in both languages.
export function getAlternates(path: string, language: Language) {
  return {
    canonical: localizePath(path, language),
    languages: {
      pl: localizePath(path, 'pl'),
      en: localizePath(path, 'en'),
      'x-default': localizePath(path, DEFAULT_LANGUAGE)
    }
  };
}

export function t(language: Language, key: TranslationKey) {
  return translations[language][key];
}
