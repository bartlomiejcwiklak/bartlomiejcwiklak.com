# Design System: Brutalist Clean

## 1. Typography
- **Primary Font**: `DM Sans`
  - Usage: Hero headlines, large project titles, primary navigation, short punchy copy.
  - Weight: Bold (700) for structural impact, Regular (400) for standard reading.
- **Secondary Font**: `Roboto Mono`
  - Usage: Technical details, metadata (Year, Category), tags, small captions, structural UI labels (e.g., "[01] WORK", "STATUS: ONLINE").
  - Weight: Regular (400) or Light (300).

## 2. Color Palette
- **Background**: Raw Ash (`#F4F4F0`) or Stark White (`#FFFFFF`).
- **Text & Lines**: Pure Black (`#000000`).
- **Accent (Optional)**: A single brutalist accent color for active states or hovers (e.g., Electric Blue `#0000FF` or Safety Orange `#FF3300`), used very sparingly.

## 3. Layout Principles
- **Grid & Borders**: Make the structural grid visible. Use 1px solid black borders to divide sections. Avoid soft drop-shadows or rounded corners (use sharp 0px radius).
- **Whitespace**: Deliberate and extreme. Use negative space to frame content rather than containing it in boxes.
- **Image Treatment**: Images should be raw, large, and unstyled (no rounded corners). Captions should sit strictly in Roboto Mono below or beside the image.

## 4. Animation Guidelines (Framer Motion)
- **Page Transitions**: Hard structural wipes or extremely smooth Y-axis slides. No slow, dreamy fades. Keep it snappy and responsive.
- **Hover Effects**: Marquee scrolling on large text links, harsh color inversion (black background, white text) on interactive elements.
- **Content Rendering**: When opening a project (`/work/[id]`), elements should stagger in sharply. Quotes should have a distinct, slightly oversized typographic treatment.