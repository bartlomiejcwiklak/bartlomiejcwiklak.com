export type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'quote'; value: string; author?: string; link?: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] };

export interface ProjectTranslation {
  description: string;
  content?: ContentBlock[];
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: string;
  imageUrl: string;
  mediaType?: 'image' | 'gif' | 'video';
  posterUrl?: string;
  description: string;
  content?: ContentBlock[];
  pl?: ProjectTranslation;
}

export const projects: Project[] = [
  {
    id: '1984',
    title: '1984',
    year: '2026',
    category: 'Graphic Design',
    imageUrl: '/images/optimized/1984thumb.webp',
    description: "Poster and visual direction for a theatre production of George Orwell's 1984 in Switzerland, designed to support the stage scenography with a stark, oppressive visual language.",
    content: [
      { type: 'text', value: "A visual identity study created for a theatre adaptation of George Orwell's 1984 staged in Switzerland. The work was developed to sit alongside the scenography, extending the atmosphere of surveillance, control and psychological pressure beyond the stage." },
      { type: 'text', value: "The direction uses a restrained, theatrical visual language: monumental composition, heavy contrast and a sense of institutional coldness. The goal was not to illustrate the novel literally, but to build a graphic system that feels aligned with Orwell's world and the physical space of the performance." },
      {
        type: 'gallery',
        images: [
          { url: '/images/optimized/1984pic1.webp', caption: "Poster concept for the Swiss theatre production of Orwell's 1984." },
          { url: '/images/optimized/1984pic2.webp', caption: 'Alternative visual direction exploring surveillance and theatrical tension.' },
          { url: '/images/optimized/1984pic3.webp', caption: 'Scenography-focused graphic treatment for the production.' },
          { url: '/images/optimized/1984pic4.webp', caption: "Final visual study extending the mood of Orwell's dystopia." }
        ]
      }
    ],
    pl: {
      description: "Plakat i kierunek wizualny dla teatralnej adaptacji Roku 1984 George'a Orwella w Szwajcarii, zaprojektowane jako uzupełnienie scenografii spektaklu surowym, opresyjnym językiem graficznym.",
      content: [
        { type: 'text', value: "Studium identyfikacji wizualnej przygotowane dla teatralnej adaptacji Roku 1984 George'a Orwella wystawianej w Szwajcarii. Projekt powstał jako dopełnienie scenografii, rozszerzając atmosferę kontroli, nadzoru i psychologicznego napięcia poza samą scenę." },
        { type: 'text', value: 'Kierunek opiera się na oszczędnym, teatralnym języku wizualnym: monumentalnej kompozycji, mocnym kontraście i chłodzie instytucjonalnej estetyki. Celem nie była dosłowna ilustracja powieści, ale stworzenie systemu graficznego spójnego ze światem Orwella i przestrzenią spektaklu.' },
        {
          type: 'gallery',
          images: [
            { url: '/images/optimized/1984pic1.webp', caption: "Koncepcja plakatu do szwajcarskiej produkcji teatralnej Roku 1984 Orwella." },
            { url: '/images/optimized/1984pic2.webp', caption: 'Alternatywny kierunek wizualny eksplorujący nadzór i teatralne napięcie.' },
            { url: '/images/optimized/1984pic3.webp', caption: 'Scenograficzne opracowanie graficzne dla spektaklu.' },
            { url: '/images/optimized/1984pic4.webp', caption: 'Studium wizualne rozwijające nastrój dystopii Orwella.' }
          ]
        }
      ]
    }
  },
  {
    id: 'nringbus',
    title: 'NRINGBUS',
    year: '2026',
    category: 'Web Design',
    imageUrl: '/images/optimized/nringbusthumb.webp',
    description: 'Turning a niche motorsport trip into a clear, trustworthy booking experience. A conversion-focused website for a licensed premium transport service from Poland to the Nurburgring.',
    content: [
      { type: 'text', value: 'NRingBus is a licensed Polish transport service built around weekend trips to the Nurburgring. The website had to communicate the emotion of a motorsport escape while making the practical offer immediately clear: route, price, itinerary, safety, insurance and booking.' },
      { type: 'text', value: 'The structure follows the user journey from excitement to trust. A bold hero introduces the Poland-to-Nurburgring proposition, while dedicated sections explain the legal transport licence, double driver crew, passenger insurance, on-site mobility and transparent 1399 PLN pricing with a 600 PLN reservation deposit.' },
      { type: 'text', value: 'The booking flow is supported by a September 2026 trip calendar, route stops along the A4 motorway and detailed FAQ content. The goal was to reduce uncertainty before payment and make the service feel premium, organised and safe without losing the raw appeal of a track weekend at the Green Hell.' },
      { type: 'image', url: '/images/optimized/nringbus.webp' }
    ],
    pl: {
      description: 'Przekształcenie niszowego wyjazdu motorsportowego w przejrzyste, budzące zaufanie doświadczenie rezerwacji. Strona dla licencjonowanego transportu premium z Polski na Nurburgring.',
      content: [
        { type: 'text', value: 'NRingBus to licencjonowany polski przewoźnik organizujący weekendowe wyjazdy na Nurburgring. Strona musiała połączyć emocje związane z wyprawą do motorsportowego raju z bardzo konkretną ofertą: trasą, ceną, planem wyprawy, bezpieczeństwem, ubezpieczeniem i rezerwacją miejsca.' },
        { type: 'text', value: 'Układ prowadzi użytkownika od zajawki do zaufania. Mocny hero komunikuje trasę Polska - Nurburgring, a kolejne sekcje wyjaśniają oficjalną licencję transportową, podwójną obsadę zawodowych kierowców, ubezpieczenie NNW i Assistance, mobilność na miejscu oraz transparentny cennik 1399 PLN z zadatkiem rezerwacyjnym 600 PLN.' },
        { type: 'text', value: 'Proces rezerwacji wspiera kalendarz wyjazdów na wrzesień 2026, punkty odbioru wzdłuż autostrady A4 oraz rozbudowane FAQ. Celem było zmniejszenie niepewności przed płatnością i zbudowanie wrażenia usługi premium: legalnej, dobrze zorganizowanej i bezpiecznej, ale nadal osadzonej w surowej energii weekendu na Zielonym Piekle.' },
        { type: 'image', url: '/images/optimized/nringbus.webp' }
      ]
    }
  },
  {
    id: 'soul-crystal',
    title: 'SOUL CRYSTAL',
    year: '2026',
    category: 'Graphic Design',
    imageUrl: '/images/optimized/marzz.webp',
    description: 'Translating sound into striking visual narratives. A comprehensive, long-term creative partnership with the music label Soul Crystal, focused on delivering cohesive and dynamic marketing materials.',
    content: [
      { type: 'text', value: 'What started as a single project on Fiverr quickly evolved into a trusted, ongoing collaboration. Working closely with the team at Soul Crystal music label, I took charge of designing their visual marketing assets to ensure their brand identity resonates with their audience.' },
      { type: 'quote', value: 'Excellent quality and very professional. Really happy with the result.', author: 'Toni, Head of Marketing at Soul Crystal' },
      { type: 'image', url: '/images/optimized/theartist1-theartist1.webp', caption: "A triptych of posters for TheArti$t's London event." },
      {
        type: 'gallery',
        images: [
          { url: '/images/optimized/shae-shae5.webp', caption: "Event poster for Shae's London performance" },
          { url: '/images/optimized/marzz_1.webp', caption: "Event poster for Marzz's London performance" },
          { url: '/images/optimized/tejy-tejy.webp', caption: "Event poster for Tejy's feature in TheArti$t's London event" }
        ]
      },
      { type: 'text', value: 'My role involves creating a diverse range of promotional materials tailored to the music industry. The creative scope includes event posters and flyers and social media campaigns.' },
      { type: 'image', url: '/images/optimized/theartist2-theartist4.webp', caption: "A triptych of posters for TheArti$t's London event." }
    ],
    pl: {
      description: 'Przekształcanie dźwięku w wyraziste narracje wizualne. Kompleksowa, długoterminowa współpraca kreatywna z wytwórnią Soul Crystal - spójne i dynamiczne materiały marketingowe.',
      content: [
        { type: 'text', value: 'To co zaczęło się jako jedno zlecenie na Fiverr, szybko przerodziło się w stałą, opartą na zaufaniu współpracę. Pracując blisko z zespołem wytwórni Soul Crystal, przejąłem odpowiedzialność za projektowanie materiałów wizualnych, dbając o spójność marki z oczekiwaniami odbiorców.' },
        { type: 'quote', value: 'Excellent quality and very professional. Really happy with the result.', author: 'Toni, Head of Marketing at Soul Crystal' },
        { type: 'image', url: '/images/optimized/theartist1-theartist1.webp', caption: 'Tryptyk plakatów na londyński event TheArti$ta.' },
        {
          type: 'gallery',
          images: [
            { url: '/images/optimized/shae-shae5.webp', caption: 'Plakat na koncert Shae w Londynie' },
            { url: '/images/optimized/marzz_1.webp', caption: 'Plakat na koncert Marzz w Londynie' },
            { url: '/images/optimized/tejy-tejy.webp', caption: 'Plakat dla Tejy na event TheArti$ta w Londynie' }
          ]
        },
        { type: 'text', value: 'Moja rola obejmuje tworzenie różnorodnych materiałów promocyjnych dla branży muzycznej: plakaty i ulotki na wydarzenia oraz kampanie w mediach społecznościowych.' },
        { type: 'image', url: '/images/optimized/theartist2-theartist4.webp', caption: 'Tryptyk plakatów na londyński event TheArti$ta.' }
      ]
    }
  },
  {
    id: 'velmont',
    title: 'VELMONT',
    year: '2026',
    category: 'Web Design',
    imageUrl: '/images/optimized/velmontthumb.webp',
    description: 'Building a digital presence that communicates exclusivity without saying too much. A multilingual editorial website for an international private office serving entrepreneurs, investors and high-net-worth families.',
    content: [
      { type: 'text', value: 'Velmont is an international private office serving a discreet clientele of entrepreneurs, investors and high-net-worth families. The brief was precise: build a digital presence that communicates exclusivity without saying too much - quiet, editorial, and immediately trustworthy.' },
      { type: 'quote', value: 'This was definitely one of the best collaborations I have ever had the opportunity to experience.', author: 'Piotr, Head of Velmont Co.', link: 'https://www.trustpilot.com/reviews/6a1dea25f01def0ca3af5064' },
      { type: 'text', value: 'The design leans on a bespoke luxury palette, full-viewport editorial sections and carefully tuned Framer Motion animations to create a sense of unhurried confidence.' },
      { type: 'image', url: '/images/velmont/luxury.webp' },
      { type: 'text', value: 'The site supports five languages - English, Polish, Spanish, French and Arabic - with full right-to-left layout for Arabic, including a mirrored hero gradient, reversed scroll indicators and locale-aware navbar styling. All routing and translation is handled by next-intl with hreflang alternates, a generated sitemap and JSON-LD structured data for search visibility across markets.' },
      { type: 'text', value: 'On the technical side, every image was converted to WebP (18 MB -> 2.3 MB), fonts are self-hosted via next/font to eliminate render-blocking requests, and the contact form is powered by Resend with server-side validation.' },
      { type: 'image', url: '/images/optimized/velmont-screen1.webp' },
      { type: 'text', value: 'The codebase supports both static export and a full Node.js server deployment - the same build targets GitHub Pages or a production VPS without any code changes.' }
    ],
    pl: {
      description: 'Budowanie cyfrowej obecności komunikującej ekskluzywność bez zbędnych słów. Wielojęzyczna strona editorial dla międzynarodowego biura prywatnego obsługującego przedsiębiorców, inwestorów i zamożne rodziny.',
      content: [
        { type: 'text', value: 'Velmont to międzynarodowe biuro prywatne obsługujące dyskretną klientelę przedsiębiorców, inwestorów i zamożnych rodzin. Wytyczne były precyzyjne: cyfrowa obecność komunikująca ekskluzywność bez zbędnych słów - spokojna, editorial i natychmiast budząca zaufanie.' },
        { type: 'quote', value: 'This was definitely one of the best collaborations I have ever had the opportunity to experience.', author: 'Piotr, Head of Velmont Co.', link: 'https://www.trustpilot.com/reviews/6a1dea25f01def0ca3af5064' },
        { type: 'text', value: 'Design opiera się na luksusowej palecie barw, pełnoekranowych sekcjach editorial i animacjach Framer Motion tworzących poczucie nieśpiesznej pewności siebie.' },
        { type: 'image', url: '/images/velmont/luxury.webp' },
        { type: 'text', value: 'Strona obsługuje pięć języków - angielski, polski, hiszpański, francuski i arabski - z pełnym układem RTL dla arabskiego, w tym odwróconymi gradientami i stylizacją nawigacji uwzględniającą lokalizację. Routing obsługuje next-intl z hreflang, mapą witryny i danymi JSON-LD.' },
        { type: 'text', value: 'Pod względem technicznym: obrazy przekonwertowane do WebP (18 MB -> 2,3 MB), czcionki hostowane przez next/font, formularz kontaktowy na Resend z walidacją serwerową.' },
        { type: 'image', url: '/images/optimized/velmont-screen1.webp' },
        { type: 'text', value: 'Baza kodu obsługuje zarówno eksport statyczny, jak i wdrożenie na Node.js - ten sam build trafia na GitHub Pages lub produkcyjny VPS bez zmian w kodzie.' }
      ]
    }
  },
  {
    id: 'ustr',
    title: 'USTR.STORE',
    year: '2026',
    category: 'Web Design',
    imageUrl: '/images/optimized/ustr-cover.webp',
    description: 'A digital storefront built for a rising generation. An e-commerce website for ustr.store - a young adult clothing brand rooted in bold aesthetics and a culture-first approach to fashion.',
    content: [
      { type: 'text', value: 'ustr.store is an emerging clothing brand aimed squarely at the young adult market - a generation that blends streetwear sensibility with a demand for something that feels real. The brief was to build a web presence as direct and confident as the brand itself.' },
      { type: 'text', value: "The design prioritises clean hierarchy, fast product discovery and a visual language that speaks to the brand's audience without shouting at them - bold without being loud, minimal without being cold." }
    ],
    pl: {
      description: 'Cyfrowy sklep dla wschodzącego pokolenia. Sklep internetowy dla ustr.store - marki odzieżowej typu young adult, zbudowanej wokół odważnej estetyki i podejścia, w którym kultura jest na pierwszym miejscu.',
      content: [
        { type: 'text', value: 'ustr.store to wschodząca marka odzieżowa skierowana do młodych dorosłych - pokolenia łączącego streetwearową wrażliwość z potrzebą autentyczności. Zadaniem było stworzenie obecności w sieci tak świeżej i bezpośredniej jak sama marka.' },
        { type: 'text', value: 'Design stawia na czystą hierarchię, szybkie odkrywanie produktów i język wizualny, który przemawia do odbiorców - odważny bez krzykliwości, minimalistyczny bez chłodu.' }
      ]
    }
  },
  {
    id: 'hometria',
    title: 'HOMETRIA',
    year: '2026',
    category: 'Web Design',
    imageUrl: '/images/optimized/hometria.webp',
    description: 'A clean, conversion-focused property platform. A website for Hometria - a real estate listings office built to connect buyers, renters and agents through an intuitive, trust-first digital experience.',
    content: [
      { type: 'text', value: 'Hometria is a real estate listings office connecting buyers, renters and agents in one place. The brief was to move away from the cluttered, information-heavy aesthetic typical of the industry and build something that felt genuinely modern - clear, calm and easy to navigate.' },
      { type: 'text', value: 'The design centres on strong property photography, a structured listings layout and a search experience that gets users to the right offer in as few steps as possible. Every detail - from filter placement to card hierarchy - was shaped around reducing friction and building confidence at each step of the decision process.' },
      { type: 'text', value: 'The result is a platform that feels as considered as the properties it presents: clean grid layouts, generous whitespace, and a visual language that positions Hometria as a trustworthy partner rather than just another listings board.' }
    ],
    pl: {
      description: 'Przejrzysta platforma nieruchomości nastawiona na konwersję. Strona dla Hometria - biura ofert nieruchomości łączącego kupujących, najemców i agentów przez intuicyjny, budujący zaufanie serwis.',
      content: [
        { type: 'text', value: 'Hometria to biuro ofert nieruchomości łączące kupujących, najemców i agentów w jednym miejscu. Zadaniem było odejście od przeładowanej, informacyjnie ciężkiej estetyki typowej dla branży i stworzenie czegoś naprawdę nowoczesnego - klarownego, spokojnego i łatwego w nawigacji.' },
        { type: 'text', value: 'Design skupia się na mocnej fotografii nieruchomości, przejrzystym układzie ogłoszeń i doświadczeniu wyszukiwania, które prowadzi użytkownika do właściwej oferty w jak najmniejszej liczbie kroków. Każdy detal - od umiejscowienia filtrów po hierarchię kart - kształtowany był pod kątem redukcji tarcia i budowania zaufania na każdym etapie procesu decyzyjnego.' },
        { type: 'text', value: 'Efektem jest platforma, która jest tak przemyślana jak prezentowane na niej nieruchomości: czyste układy siatkowe, przestronne białe tło i język wizualny pozycjonujący Hometria jako zaufanego partnera, a nie tylko kolejną tablicę ogłoszeń.' }
      ]
    }
  },
  {
    id: 'idme',
    title: 'IDME',
    year: '2026',
    category: 'Web Design',
    imageUrl: '/images/optimized/idmemock.webp',
    description: "Gamifying the music discovery experience. A fully functional, interactive web application designed to challenge users' musical knowledge through a sleek, responsive, and engaging user interface.",
    content: [
      { type: 'text', value: 'IDME is a dynamic web application that merges modern web design with engaging game mechanics. This project showcases the ability to design and develop a complete, interactive user experience from the ground up, focusing heavily on intuitive UI/UX and seamless performance.' },
      { type: 'image', url: '/images/optimized/idme1.webp', caption: 'Desktop view of the IDME interface' },
      { type: 'text', value: 'The core of the application is an interactive music guessing game, which required a thoughtful approach to integrating both audio and visual elements.' },
      { type: 'image', url: '/images/optimized/idme2.webp', caption: 'Game modes available in the game' },
      { type: 'text', value: 'Key features and design focuses of this project include custom-designed elements which ensure a smooth user journey, featuring a dynamic audio progress bar, an integrated search bar, and clear game-state modals for guess history and end-game results.' },
      { type: 'image', url: '/images/optimized/idme.webp', caption: 'Logo design' },
      { type: 'text', value: 'IDME stands as a comprehensive example of modern digital product creation-demonstrating how clean aesthetics can be successfully paired with complex frontend logic to deliver a highly entertaining web experience.' }
    ],
    pl: {
      description: 'Grywalizacja odkrywania muzyki. Interaktywna aplikacja sprawdzająca wiedzę muzyczną użytkowników za pomocą eleganckiego, responsywnego interfejsu.',
      content: [
        { type: 'text', value: 'IDME to dynamiczna aplikacja łącząca nowoczesny design z angażującą mechaniką gry. Projekt demonstruje zdolność do zaprojektowania i zbudowania kompletnego, interaktywnego doświadczenia od podstaw, z naciskiem na intuicyjny UI/UX i płynne działanie.' },
        { type: 'image', url: '/images/optimized/idme1.webp', caption: 'Widok desktopowy interfejsu IDME' },
        { type: 'text', value: 'Sercem aplikacji jest interaktywna gra w zgadywanie muzyki, wymagająca przemyślanego podejścia do integracji elementów audio i wizualnych.' },
        { type: 'image', url: '/images/optimized/idme2.webp', caption: 'Tryby gry dostępne w aplikacji' },
        { type: 'text', value: 'Kluczowe elementy to niestandardowy interfejs zapewniający płynne doświadczenie: dynamiczny pasek postępu audio, zintegrowany pasek wyszukiwania i modalne widoki historii zgadywania i wyników końcowych.' },
        { type: 'image', url: '/images/optimized/idme.webp', caption: 'Projekt logo' },
        { type: 'text', value: 'IDME jest kompleksowym przykładem tworzenia nowoczesnego produktu cyfrowego - czysta estetyka połączona ze złożoną logiką frontendową daje wysoce angażujące doświadczenie sieciowe.' }
      ]
    }
  },
  {
    id: 'topgolf-x-yoasobi',
    title: 'TOPGOLF X YOASOBI',
    year: '2026',
    category: 'Graphic Design',
    imageUrl: '/images/optimized/yoasobi1.webp',
    description: 'Bridging the gap between active entertainment and vibrant J-Pop. A high-impact promotional poster celebrating a unique crossover event between the US-based entertainment venue Topgolf and the acclaimed Japanese music duo YOASOBI.',
    content: [
      { type: 'text', value: 'This project involved designing a promotional poster for an exciting, unexpected cross-cultural collaboration. Bringing together Topgolf, a premier sports and entertainment brand in the US, and YOASOBI, a powerhouse in the global Japanese music scene, required a design approach that respected and merged two highly distinct brand identities.' },
      { type: 'image', url: '/images/optimized/yoasobi2.webp', caption: 'The poster' },
      { type: 'text', value: "The primary goal was to create a visual piece that captures the high-energy, social atmosphere of a Topgolf venue while seamlessly integrating the colorful, dynamic aesthetic that YOASOBI's global fanbase instantly recognizes. This design utilizes YOASOBI's album design and integrates it in a playful way with the golf theme." }
    ],
    pl: {
      description: 'Łączenie aktywnej rozrywki z energicznym J-Popem. Efektowny plakat promocyjny celebrujący crossover pomiędzy siecią obiektów Topgolf a japońskim duetem muzycznym YOASOBI.',
      content: [
        { type: 'text', value: 'Projekt polegał na stworzeniu plakatu dla ekscytującej, niespodziewanej współpracy międzykulturowej. Połączenie Topgolf - czołowej marki rozrywkowej w USA - z YOASOBI, potęgą japońskiej sceny muzycznej, wymagało podejścia szanującego i łączącego dwie wyraźnie odmienne tożsamości marek.' },
        { type: 'image', url: '/images/optimized/yoasobi2.webp', caption: 'Plakat' },
        { type: 'text', value: 'Głównym celem było stworzenie wizualizacji oddającej energetyczną atmosferę Topgolf, jednocześnie integrując kolorową estetykę YOASOBI. Design wykorzystuje grafikę albumu duetu i łączy ją z motywem golfa w zabawny sposób.' }
      ]
    }
  },
  {
    id: 'book-covers',
    title: 'BOOK DESIGN',
    year: '2025',
    category: 'Graphic Design',
    imageUrl: '/images/optimized/bookdesignthumb.webp',
    description: 'Capturing the essence of a narrative in a single, compelling image. A curated collection of conceptual book cover designs focused on visual storytelling, creative typography, and genre adaptability.',
    content: [
      { type: 'text', value: 'In the publishing industry, a cover is the critical first point of connection between a story and its potential reader. This portfolio segment showcases a series of self-initiated, concept-driven book cover designs. Created outside the constraints of traditional client briefs, these projects serve as an exploration of visual communication and stylistic versatility.' },
      { type: 'image', url: '/images/optimized/book1-1_front.webp', caption: 'A design for the front cover of a novel.' },
      { type: 'quote', value: 'Really nice, very good work, with excellent responsiveness.', author: "Anne, Philippe's Publisher" },
      {
        type: 'gallery',
        images: [
          { url: '/images/optimized/book2-front.webp', caption: 'Cover art for a sci-fi novel' },
          { url: '/images/optimized/cap.webp', caption: "Cover art for Dostoyevski's 'Crime and Punishment'" },
          { url: '/images/optimized/cathedral.webp', caption: "Cover art for Dukaj's 'The Cathedral'" }
        ]
      },
      { type: 'text', value: 'Key focuses of this creative process include crafting imagery that hints at the core narrative without giving too much away, instantly intriguing the potential reader.' }
    ],
    pl: {
      description: 'Uchwycenie istoty narracji w jednym, przekonującym obrazie. Kolekcja konceptualnych projektów okładek skupionych na storytellingu wizualnym, kreatywnej typografii i elastyczności gatunkowej.',
      content: [
        { type: 'text', value: 'W branży wydawniczej okładka jest kluczowym pierwszym punktem kontaktu między historią a czytelnikiem. Ta część portfolio prezentuje serię samodzielnych projektów konceptualnych - tworzonych poza ograniczeniami typowych zleceń, jako eksploracja komunikacji wizualnej i wszechstronności stylistycznej.' },
        { type: 'image', url: '/images/optimized/book1-1_front.webp', caption: 'Projekt okładki frontowej powieści.' },
        { type: 'quote', value: 'Really nice, very good work, with excellent responsiveness.', author: "Anne, Philippe's Publisher" },
        {
          type: 'gallery',
          images: [
            { url: '/images/optimized/book2-front.webp', caption: 'Okładka powieści sci-fi' },
            { url: '/images/optimized/cap.webp', caption: "Okładka 'Zbrodni i kary' Dostojewskiego" },
            { url: '/images/optimized/cathedral.webp', caption: "Okładka 'Katedry' Dukaja" }
          ]
        },
        { type: 'text', value: 'Kluczowy element procesu twórczego to tworzenie obrazów sugerujących treść bez ujawniania zbyt wiele - natychmiast intrygując potencjalnego czytelnika.' }
      ]
    }
  },
  {
    id: 'poster-study',
    title: 'POSTER STUDY',
    year: '2024',
    category: 'Graphic Design',
    imageUrl: '/images/optimized/nge1.webp',
    description: 'Reimagining iconic cultural touchstones through experimental design. A series of conceptual poster studies dedicated to capturing the distinct atmospheres.',
    content: [
      { type: 'text', value: "Great design often stems from personal passion and the continuous desire to refine one's craft. This section of my portfolio features a collection of self-initiated poster studies, focusing on subjects that carry strong, established visual identities." },
      { type: 'image', url: '/images/optimized/nge0.webp', caption: "A design study for 'Neon Genesis Evangelion'." },
      { type: 'text', value: 'Created as design exercises rather than commercial commissions, these posters provided an opportunity to push my creative boundaries. The challenge was to respect the original source material and its existing fan base, while injecting my own stylistic interpretation and maintaining high professional standards in layout, color theory, and typography.' },
      { type: 'image', url: '/images/optimized/schafter0.webp', caption: "A design study for Schafter's promo poster." },
      { type: 'image', url: '/images/optimized/sdbtl.webp', caption: 'A design showcase for a poster.' }
    ],
    pl: {
      description: 'Reinterpretacja ikonicznych dzieł kultury przez eksperymentalny design. Seria studiów plakatowych poświęconych uchwyceniu charakterystycznych atmosfer.',
      content: [
        { type: 'text', value: 'Świetny design rodzi się z osobistej pasji i pragnienia doskonalenia warsztatu. Ta część portfolio zawiera samodzielne studia plakatowe, skupiające się na tematach o silnie ugruntowanej tożsamości wizualnej.' },
        { type: 'image', url: '/images/optimized/nge0.webp', caption: "Studium designu do 'Neon Genesis Evangelion'." },
        { type: 'text', value: 'Tworzone jako ćwiczenia projektowe, plakaty te dały możliwość przekraczania granic kreatywności. Wyzwaniem było uszanowanie oryginalnego materiału i fanów, przy dodaniu własnej interpretacji i utrzymaniu wysokich standardów layoutu, teorii koloru i typografii.' },
        { type: 'image', url: '/images/optimized/schafter0.webp', caption: 'Studium designu plakatu promocyjnego Schaftera.' },
        { type: 'image', url: '/images/optimized/sdbtl.webp', caption: 'Prezentacja projektu plakatu.' }
      ]
    }
  },
  {
    id: 'ilyfetti',
    title: 'ILYFETTI',
    year: '2022',
    category: 'Graphic Design',
    imageUrl: '/images/optimized/ilyfettithumb.webp',
    description: 'Translating raw lyrical energy into striking digital artwork. A series of custom cover designs created for an emerging rap artist to maximize visual impact across global streaming platforms.',
    content: [
      { type: 'text', value: "In today's digital music landscape, listeners often see a track before they hear it. For this project, I collaborated with a young, rising hip-hop artist to design a series of single and EP covers tailored specifically for platforms like Spotify, Apple Music, and Tidal. The main objective was to encapsulate the raw energy and personal narrative of his music into bold, scroll-stopping imagery." },
      { type: 'image', url: '/images/optimized/slidethrough.webp', caption: 'Showcase of the artwork for a brand new single.' },
      { type: 'text', value: 'Working with an emerging artist means not only designing a single cover but also helping to build the foundation of their visual brand. I focused on creating graphics that authentically represent the artist\'s sound while standing out in a highly competitive genre.' },
      { type: 'image', url: '/images/optimized/greenlight.webp', caption: 'Showcase of the artwork for another single.' }
    ],
    pl: {
      description: 'Przekształcanie surowej energii tekstów w uderzające grafiki cyfrowe. Seria okładek dla wschodzącego rapera, zoptymalizowanych pod globalne platformy streamingowe.',
      content: [
        { type: 'text', value: 'W dzisiejszym krajobrazie muzycznym słuchacze często widzą utwór przed usłyszeniem go. Współpracowałem z młodym artystą hip-hopowym przy projektowaniu serii okładek na Spotify, Apple Music i Tidal. Celem było zamknięcie surowej energii jego muzyki w odważnych, przyciągających wzrok grafikach.' },
        { type: 'image', url: '/images/optimized/slidethrough.webp', caption: 'Prezentacja grafiki nowego singla.' },
        { type: 'text', value: 'Praca z wschodzącym artystą oznacza nie tylko projektowanie okładki, ale budowanie fundamentów jego marki wizualnej. Skupiłem się na tworzeniu grafik autentycznie reprezentujących jego brzmienie, wyróżniając się jednocześnie w wysoce konkurencyjnym gatunku.' },
        { type: 'image', url: '/images/optimized/greenlight.webp', caption: 'Prezentacja grafiki kolejnego singla.' }
      ]
    }
  }
];
