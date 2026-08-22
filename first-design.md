# First Website Design

## Core Direction
- Visual style: `Brutalist Clean`
- Tone: confident, technical, fast, editorial
- Primary contrast: raw light background, black typography, one sharp accent on interaction
- Layout language: visible grid, strong borders, large type, no rounded corners, no decorative shadows

## Global Frame
- Background: `#F4F4F0`
- Text: `#000000`
- Accent: `#FF3300`
- Max width: full-bleed sections with internal padding, not centered "cards"
- Spacing rhythm: large vertical gaps on desktop, tighter but still airy on mobile
- Border system: `1px solid #000` used for header, section dividers, cards, image captions, footer

## Typography
- Headings: `DM Sans`, bold, uppercase or near-uppercase feeling
- Meta information: `Roboto Mono`, small size, tracking slightly increased
- Hero headline:  clamp-based scale, visually dominant, 4-6 short lines max
- Body copy: restrained width for readability, but still aligned to hard grid

## Page Structure

### 1. Header
- Left: `BARTLOMIEJ CWIKLAK`
- Center/right: nav links `HOME`, `WORK`, `ABOUT`
- Far right: language toggle `EN / PL`
- Style: one horizontal bar with bottom border, mono metadata feel, sticky on scroll

### 2. Home Page `/`

#### Hero
- Two-column grid on desktop, one column on mobile
- Left: oversized intro
- Right: short manifesto and status block

Example structure:
- `[01] FREELANCE GRAPHIC DESIGNER`
- `& CUSTOM WEB DEVELOPER`
- Short paragraph: building sharp visual systems and custom portfolio-style websites
- Status rows:
- `LOCATION: POLAND`
- `STATUS: AVAILABLE FOR SELECT PROJECTS`
- `LANGUAGE: EN / PL`

Interaction:
- CTA buttons invert on hover
- Hero text can reveal line-by-line on first load

#### Featured Work
- Section title in mono: `[02] SELECTED WORK`
- 2 or 3 large project cards stacked vertically
- Each card:
- big image
- title
- year / category row
- short description
- hover: image slightly scales, text row inverts to black background with white text

Layout feel:
- not Pinterest, not soft SaaS grid
- more like editorial case-study index

#### Short About Strip
- Full-width bordered band
- Left: `BRAND / DIGITAL / FRONTEND`
- Right: 2-3 sentences about combining graphic sensibility with implementation

#### Footer
- Contact email
- Instagram / Behance / GitHub if available
- copyright / status line in mono

### 3. Work Archive `/work`
- Dense but clean archive
- Intro row with page title and short explanation
- Below: responsive grid of all projects
- Desktop: 2 columns
- Mobile: 1 column
- Each project card keeps same brutalist language
- Optional filter row by category if categories in `projects.ts` are stable

### 4. Project Detail `/work/[id]`
- Top section:
- project title large
- year + category in mono
- short lead description
- hero image full width
- Content blocks rendered in sequence with generous spacing

Block behaviors:
- `text`: narrow readable column
- `quote`: oversized text, border-left or top/bottom borders, author/link in mono
- `image`: large raw image with strict caption below
- `gallery`: 2-column grid on desktop, stacked on mobile

Animation:
- stagger content in quickly
- image reveal via clip or vertical slide
- transition between pages should feel structural, not dreamy

## Responsive Behavior
- Mobile hero collapses to one column
- Header remains compact and may wrap minimally
- Large typography scales down aggressively but remains dominant
- Borders remain visible at all breakpoints
- Project gallery becomes single-column when needed

## UI Components To Build First
- `Header`
- `LocaleToggle`
- `SectionLabel`
- `ProjectCard`
- `ContentRenderer`
- `TextBlock`
- `QuoteBlock`
- `ImageBlock`
- `GalleryBlock`
- `Footer`

## Recommended First Visual Pass
- Keep palette nearly monochrome with only one orange hover accent
- Use large home hero with one strong sentence instead of multiple marketing claims
- Make project cards image-led
- Avoid gradients, glassmorphism, blur, soft shadows, rounded corners, centered landing-page cliches

## Suggested Hero Copy
- `Sharp design.`
- `Custom websites.`
- `No templates.`

## Implementation Priority
1. Global layout, fonts, and border system
2. Header and language toggle
3. Home hero and featured projects
4. Work archive grid
5. Dynamic project page with block renderer
6. Framer Motion page transitions and hover interactions
