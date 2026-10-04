'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

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
  | 'work'
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

const STORAGE_KEY = 'preferred-language';

const translations: Record<Language, Record<TranslationKey, string>> = {
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
    work: 'Work',
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
    work: 'Projekty',
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

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectLanguage(): Language {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === 'en' || stored === 'pl') {
    return stored;
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const preferred = languages.find((language) => {
    const normalizedLanguage = language.toLowerCase();

    return normalizedLanguage === 'pl' || normalizedLanguage.startsWith('pl-') || normalizedLanguage === 'en' || normalizedLanguage.startsWith('en-');
  });

  return preferred?.toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    setLanguageState(detectLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (nextLanguage) => {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
      setLanguageState(nextLanguage);
    },
    t: (key) => translations[language][key]
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}

export function LocalizedText({ translationKey }: { translationKey: TranslationKey }) {
  const { t } = useLanguage();

  return <>{t(translationKey)}</>;
}
