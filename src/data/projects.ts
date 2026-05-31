export type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'quote'; value: string; author?: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] };

export interface Project {
  id: string;
  title: string;
  year: string;
  category: string;
  imageUrl: string;
  description: string;
  content?: ContentBlock[];
}

export const projects: Project[] = [
  {
    id: "soul crystal",
    title: "SOUL CRYSTAL",
    year: "2026",
    category: "Graphic Design",
    imageUrl: "/images/marzz.jpg",
    description: "Translating sound into striking visual narratives. A comprehensive, long-term creative partnership with the music label Soul Crystal, focused on delivering cohesive and dynamic marketing materials.",
    content: [
      { type: 'text', value: "What started as a single project on Fiverr quickly evolved into a trusted, ongoing collaboration. Working closely with the team at Soul Crystal music label, I took charge of designing their visual marketing assets to ensure their brand identity resonates with their audience." },
      { type: 'quote', value: "Excellent quality and very professional. Really happy with the result.", author: "Toni, Head of Marketing at Soul Crystal" },
      { type: 'image', url: "/images/theartist1/theartist1.jpg", caption: "A triptych of posters for TheArti$t's London event." },
      {
        type: 'gallery', images: [
          { url: "/images/shae/shae5.jpg", caption: "Event poster for Shae's London performance" },
          { url: "/images/marzz_1.jpg", caption: "Event poster for Marzz's London performance" },
          { url: "/images/tejy/tejy.jpg", caption: "Event poster for Tejy's feature in TheArti$t's London event" }
        ]
      },
      { type: 'text', value: "My role involves creating a diverse range of promotional materials tailored to the music industry. The creative scope includes event posters and flyers and social media campaigns." },
      { type: 'image', url: "/images/theartist2/theartist4.jpg", caption: "A triptych of posters for TheArti$t's London event." },
    ]
  },
  {
    id: "velmont",
    title: "VELMONT",
    year: "2026",
    category: "Web Design",
    imageUrl: "/images/velmont.jpg",
    description: "Building a digital presence that communicates exclusivity without saying too much. A multilingual editorial website for an international private office serving entrepreneurs, investors and high-net-worth families.",
    content: [
      { type: 'text', value: "Velmont is an international private office serving a discreet clientele of entrepreneurs, investors and high-net-worth families. The brief was precise: build a digital presence that communicates exclusivity without saying too much — quiet, editorial, and immediately trustworthy." },
      { type: 'text', value: "The design leans on a bespoke luxury palette, full-viewport editorial sections and carefully tuned Framer Motion animations to create a sense of unhurried confidence." },
      { type: 'image', url: "/images/velmont/luxury.webp" },
      { type: 'text', value: "The site supports five languages — English, Polish, Spanish, French and Arabic — with full right-to-left layout for Arabic, including a mirrored hero gradient, reversed scroll indicators and locale-aware navbar styling. All routing and translation is handled by next-intl with hreflang alternates, a generated sitemap and JSON-LD structured data for search visibility across markets." },
      { type: 'text', value: "On the technical side, every image was converted to WebP (18 MB → 2.3 MB), fonts are self-hosted via next/font to eliminate render-blocking requests, and the contact form is powered by Resend with server-side validation." },
      { type: 'image', url: "/images/velmont/screen1.png" },
      { type: 'text', value: "The codebase supports both static export and a full Node.js server deployment — the same build targets GitHub Pages or a production VPS without any code changes." },
    ]
  },
  {
    id: "idme",
    title: "IDME",
    year: "2026",
    category: "Web Design",
    imageUrl: "/images/idmemock.jpg",
    description: "Gamifying the music discovery experience. A fully functional, interactive web application designed to challenge users' musical knowledge through a sleek, responsive, and engaging user interface.",
    content: [
      { type: 'text', value: "IDME is a dynamic web application that merges modern web design with engaging game mechanics. This project showcases the ability to design and develop a complete, interactive user experience from the ground up, focusing heavily on intuitive UI/UX and seamless performance." },
      { type: 'image', url: "/images/idme1.png", caption: "Desktop view of the IDME interface" },
      { type: 'text', value: "The core of the application is an interactive music guessing game, which required a thoughtful approach to integrating both audio and visual elements." },
      { type: 'image', url: "/images/idme2.png", caption: "Game modes available in the game" },
      { type: 'text', value: "Key features and design focuses of this project include custom-designed elements which ensure a smooth user journey, featuring a dynamic audio progress bar, an integrated search bar, and clear game-state modals for guess history and end-game results." },
      { type: 'image', url: "/images/idme.jpeg", caption: "Logo design" },
      { type: 'text', value: "IDME stands as a comprehensive example of modern digital product creation—demonstrating how clean aesthetics can be successfully paired with complex frontend logic to deliver a highly entertaining web experience." }
    ]
  },
  {
    id: "topgolf",
    title: "TOPGOLF X YOASOBI",
    year: "2026",
    category: "Web Design",
    imageUrl: "/images/yoasobi1.jpg",
    description: "Bridging the gap between active entertainment and vibrant J-Pop. A high-impact promotional poster celebrating a unique crossover event between the US-based entertainment venue Topgolf and the acclaimed Japanese music duo YOASOBI.",
    content: [
      { type: 'text', value: "This project involved designing a promotional poster for an exciting, unexpected cross-cultural collaboration. Bringing together Topgolf, a premier sports and entertainment brand in the US, and YOASOBI, a powerhouse in the global Japanese music scene, required a design approach that respected and merged two highly distinct brand identities." },
      { type: 'image', url: "/images/yoasobi2.jpg", caption: "The poster" },
      { type: 'text', value: "The primary goal was to create a visual piece that captures the high-energy, social atmosphere of a Topgolf venue while seamlessly integrating the colorful, dynamic aesthetic that YOASOBI’s global fanbase instantly recognizes. This design utilizes YOASOBI's album design and integrates it in a playful way with the golf theme." },
    ]
  },
  {
    id: "book-covers",
    title: "BOOK DESIGN",
    year: "2025",
    category: "Graphic Design",
    imageUrl: "/images/book1.jpg",
    description: "Capturing the essence of a narrative in a single, compelling image. A curated collection of conceptual book cover designs focused on visual storytelling, creative typography, and genre adaptability.",
    content: [
      { type: 'text', value: "In the publishing industry, a cover is the critical first point of connection between a story and its potential reader. This portfolio segment showcases a series of self-initiated, concept-driven book cover designs. Created outside the constraints of traditional client briefs, these projects serve as an exploration of visual communication and stylistic versatility." },
      { type: 'image', url: "/images/book1/1_front.jpg", caption: "A design for the front cover of a novel." },
      { type: 'quote', value: "Really nice, very good work, with excellent responsiveness.", author: "Anne, Philippe's Publisher" },
      {
        type: 'gallery', images: [
          { url: "/images/book2/front.jpg", caption: "Cover art for a sci-fi novel" },
          { url: "/images/cap.jpg", caption: "Cover art for Dostoyevski's 'Crime and Punishment'" },
          { url: "/images/cathedral.jpg", caption: "Cover art for Dukaj's 'The Cathedral'" }
        ]
      },
      { type: 'text', value: "Key focuses of this creative process include crafting imagery that hints at the core narrative without giving too much away, instantly intriguing the potential reader." },
    ]
  },
  {
    id: "posters",
    title: "POSTER STUDY",
    year: "2024",
    category: "Graphic Design",
    imageUrl: "/images/nge1.jpg",
    description: "Reimagining iconic cultural touchstones through experimental design. A series of conceptual poster studies dedicated to capturing the distinct atmospheres.",
    content: [
      { type: 'text', value: "Great design often stems from personal passion and the continuous desire to refine one's craft. This section of my portfolio features a collection of self-initiated poster studies, focusing on subjects that carry strong, established visual identities." },
      { type: 'image', url: "/images/nge0.jpg", caption: "A design study for 'Neon Genesis Evangelion'." },
      { type: 'text', value: "Created as design exercises rather than commercial commissions, these posters provided an opportunity to push my creative boundaries. The challenge was to respect the original source material and its existing fan base, while injecting my own stylistic interpretation and maintaining high professional standards in layout, color theory, and typography." },
      { type: 'image', url: "/images/schafter0.jpg", caption: "A design study for Schafter's promo poster." },
      { type: 'image', url: "/images/sdbtl.jpg", caption: "A design showcase for a poster." },
    ]
  },
  {
    id: "ilyfetti",
    title: "ILYFETTI",
    year: "2022",
    category: "Graphic Design",
    imageUrl: "/images/slidethrough0.jpg",
    description: "Translating raw lyrical energy into striking digital artwork. A series of custom cover designs created for an emerging rap artist to maximize visual impact across global streaming platforms.",
    content: [
      { type: 'text', value: "In today's digital music landscape, listeners often see a track before they hear it. For this project, I collaborated with a young, rising hip-hop artist to design a series of single and EP covers tailored specifically for platforms like Spotify, Apple Music, and Tidal. The main objective was to encapsulate the raw energy and personal narrative of his music into bold, scroll-stopping imagery." },
      { type: 'image', url: "/images/slidethrough.jpg", caption: "Showcase of the artwork for a brand new single." },
      { type: 'text', value: "Working with an emerging artist means not only designing a single cover but also helping to build the foundation of their visual brand. I focused on creating graphics that authentically represent the artist's sound while standing out in a highly competitive genre." },
      { type: 'image', url: "/images/greenlight.jpg", caption: "Showcase of the artwork for another single." }
    ]
  }
];
