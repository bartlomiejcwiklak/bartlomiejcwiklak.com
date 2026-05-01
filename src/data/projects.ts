export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  links: {
    live?: string;
    github?: string;
  };
  gallery?: string[];
  galleryFullWidth?: number;
  year?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'IDME',
    category: 'Web',
    description: 'IDME is a song guessing game, where the player is presented with a snippet of a song.',
    imageUrl: 'src/assets/images/idme.jpeg',
    links: {
      live: 'https://bartlomiejcwiklak.github.io/IDME',
      github: 'https://github.com/bartlomiejcwiklak/IDME',
    },
    year: '2026'
  },
  {
    id: '2',
    title: 'beatbuild',
    category: 'Web',
    description: 'beatbuild is a browser loop-based music making tool, loosely inspired by incredibox.',
    imageUrl: 'src/assets/images/beatbuild.jpg',
    links: {
      live: 'https://bartlomiejcwiklak.github.io/beatbuild',
      github: 'https://github.com/bartlomiejcwiklak/beatbuild',
    },
    year: '2026'
  },
  {
    id: '3',
    title: 'beatclick',
    category: 'Web',
    description: 'beatclick is a browser drum-grid sequencer.',
    imageUrl: 'src/assets/images/beatclick.jpg',
    links: {
      live: 'https://bartlomiejcwiklak.github.io/beatclick',
      github: 'https://github.com/bartlomiejcwiklak/beatclick',
    },
    year: '2026'
  },
  {
    id: '4',
    title: 'Soul Crystal Presents: Journey',
    category: 'Design',
    description: 'I was the creative director and graphic designer for Shae\'s Universe London concerts. I was tasked with preparing all of the assets for the event, such as ads, posters and Instagram posts.',
    imageUrl: 'src/assets/images/shae.jpg',
    links: {},
    gallery: [
      'src/assets/images/shae/shae1.jpg',
      'src/assets/images/shae/shae2.jpg',
      'src/assets/images/shae/shae3.jpg',
      'src/assets/images/shae/shae4.jpg',
      'src/assets/images/shae/shae5.jpg'
    ],
    year: '2025'
  },
  {
    id: '5',
    title: 'THE ARTI$T London Campaign 2',
    category: 'Design',
    description: 'I was the creative director and graphic designer for THE ARTI$T\'s London concerts. I was tasked with preparing a triptych of posters advertising the event in a specific style inspired by Jean-Michel Basquiat.',
    imageUrl: 'src/assets/images/theartist1.jpg',
    links: {},
    gallery: [
      'src/assets/images/theartist1/theartist1.jpg',
      'src/assets/images/theartist1/theartist2.jpg',
      'src/assets/images/theartist1/theartist3.jpg',
      'src/assets/images/theartist1/theartist4.jpg',
    ],
    year: '2025'
  },
  {
    id: '6',
    title: 'THE ARTI$T London Campaign 1',
    category: 'Design',
    description: 'I was the creative director and graphic designer for Shae\'s Universe London concerts. I was tasked with preparing all of the assets for the event, such as ads, posters and Instagram posts.',
    imageUrl: 'src/assets/images/theartist2.jpg',
    links: {},
    gallery: [
      'src/assets/images/theartist2/theartist1.jpg',
      'src/assets/images/theartist2/theartist2.jpg',
      'src/assets/images/theartist2/theartist3.jpg',
      'src/assets/images/theartist2/theartist4.jpg',
    ],
    year: '2025'
  },
  {
    id: '7',
    title: 'SOUL CRYSTAL PRESENTS: THE ARTI$T X TEJY',
    category: 'Design',
    description: 'I was tasked with designing a poster for the collaboration concert between THE ARTI$T and TEJY.',
    imageUrl: 'src/assets/images/tejy/tejy.jpg',
    links: {},
    gallery: [
      'src/assets/images/tejy/tejy.jpg',
    ],
    year: '2025'
  },
  {
    id: '8',
    title: '"SLIDE THROUGH" BY ILYFETTI',
    category: 'Design',
    description: 'I was the cover designer and artist behind ilyfetti\'s single "SLIDE THROUGH".',
    imageUrl: 'src/assets/images/slidethrough0.jpg',
    links: {},
    gallery: [
      'src/assets/images/slidethrough.jpg',
    ],
    galleryFullWidth: 1,
    year: '2022'
  },
  {
    id: '9',
    title: '"GREEN LIGHT" BY ILYFETTI',
    category: 'Design',
    description: 'I was the cover designer and artist behind ilyfetti\'s single "GREEN LIGHT".',
    imageUrl: 'src/assets/images/greenlight0.jpg',
    links: {},
    gallery: [
      'src/assets/images/greenlight.jpg',
    ],
    galleryFullWidth: 1,
    year: '2022'
  },
  {
    id: '10',
    title: '6IXCUT BANNER ARTWORK',
    category: 'Design',
    description: 'I did a banner artwork for 6ixcut\'s debut on Spotify.',
    imageUrl: 'src/assets/images/6ixcut0.jpg',
    links: {},
    gallery: [
      'src/assets/images/6ixcut.jpg',
    ],
    galleryFullWidth: 1,
    year: '2022'
  },
  {
    id: '11',
    title: 'RESONANCE ALBUM ARTWORK (MOCK)',
    category: 'Design',
    description: 'A practice piece for a fictional release of an album titled Resonance.',
    imageUrl: 'src/assets/images/resonance0.jpg',
    links: {},
    gallery: [
      'src/assets/images/resonance.jpg',
    ],
    galleryFullWidth: 1,
    year: '2022'
  },
  {
    id: '12',
    title: '"DON\'T HATE THE PLAYER, HATE THE GAME" PRACTICE POSTER',
    category: 'Design',
    description: 'A practice poster inspired by the phrase "Don\'t hate the player, hate the game.".',
    imageUrl: 'src/assets/images/dhtphtg0.jpg',
    links: {},
    gallery: [
      'src/assets/images/dhtphtg.jpg',
    ],
    galleryFullWidth: 1,
    year: '2022'
  },
  {
    id: '13',
    title: '"SMALLEST DOGS BARK THE LOUDEST" PRACTICE POSTER',
    category: 'Design',
    description: 'A practice poster inspired by the phrase "Smallest dogs bark the loudest".',
    imageUrl: 'src/assets/images/sdbtl0.jpg',
    links: {},
    gallery: [
      'src/assets/images/sdbtl.jpg',
    ],
    galleryFullWidth: 1,
    year: '2022'
  },
  {
    id: '14',
    title: 'Philippe Lutton\'s "MAIS MOI JE VEUX ALLER DANS LE CAUCASE"',
    category: 'Design',
    description: 'I was tasked with creating a design for the paperback cover of the book "Mais Moi Je Veux Aller Dans Le Caucase" by Philippe Lutton.',
    imageUrl: 'src/assets/images/book1.jpg',
    links: {},
    gallery: [
      'src/assets/images/book1/1_front.jpg',
      'src/assets/images/book1/1_back.jpg',
      'src/assets/images/book1/2_front.jpg',
      'src/assets/images/book1/2_back.jpg',
    ],
    year: '2024'
  },
  {
    id: '15',
    title: 'Isolde Novak\'s "THE STELLAR ARCHIVE" (Mock Design)',
    category: 'Design',
    description: 'This is a mock design for an e-book release of a sci-fi novel.',
    imageUrl: 'src/assets/images/book2.jpg',
    links: {},
    gallery: [
      'src/assets/images/book2/front.jpg',
    ],
    year: '2024'
  },
  {
    id: '16',
    title: 'NEON GENESIS EVANGELION PRACTICE POSTER',
    category: 'Design',
    description: 'This is a mock design for a poster for the anime Neon Genesis Evangelion.',
    imageUrl: 'src/assets/images/nge0.jpg',
    links: {},
    gallery: [
      'src/assets/images/nge.jpg',
    ],
    year: '2025'
  },
  {
    id: '17',
    title: 'SCHAFTER PRACTICE POSTER',
    category: 'Design',
    description: 'This is a mock design for a poster for the artist Schafter.',
    imageUrl: 'src/assets/images/schafter0.jpg',
    links: {},
    gallery: [
      'src/assets/images/schafter.jpg',
    ],
    year: '2025'
  },
  {
    id: '18',
    title: 'FIODOR DOSTOYEVSKY: "CRIME AND PUNISHMENT" PRACTICE BOOK COVER',
    category: 'Design',
    description: 'This is a mock design for a poster for Fyodor Dostoyevsky\'s novel Crime and Punishment.',
    imageUrl: 'src/assets/images/cap.jpg',
    links: {},
    gallery: [
      'src/assets/images/cap.jpg',
    ],
    year: '2025'
  },
  {
    id: '19',
    title: 'JACEK DUKAJ: "THE CATHEDRAL" PRACTICE BOOK COVER',
    category: 'Design',
    description: 'This is a mock design for a poster for Jacek Dukaj\'s novel The Cathedral.',
    imageUrl: 'src/assets/images/cathedral.jpg',
    links: {},
    gallery: [
      'src/assets/images/cathedral.jpg',
    ],
    year: '2025'
  },
];

export const categories = ['All', ...new Set(projects.map(p => p.category))];
