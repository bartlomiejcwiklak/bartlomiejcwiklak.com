# Project Architecture & Guidelines

## Folder Structure (App Router)
```text
src/
├── app/
│   ├── (site)/
│   │   ├── work/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── about/page.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── template.tsx (For Framer Motion page transitions)
├── components/
│   ├── ui/ (Buttons, Nav, Footer)
│   ├── projects/ (ProjectCard, ProjectList)
│   └── blocks/ (TextBlock, QuoteBlock, ImageBlock, GalleryBlock)
├── data/
│   └── projects.ts
└── lib/
    ├── utils.ts
    └── i18n.ts
```

## Handling Data (projects.ts)
The `projects.ts` file contains a highly structured content array. 

**Component Mapping:**
Create a `ContentRenderer` component that takes an array of `ContentBlock` and maps them to specific UI components:
- `{ type: 'text' }` -> `<TextBlock value={block.value} />`
- `{ type: 'quote' }` -> `<QuoteBlock value={block.value} author={block.author} link={block.link} />`
- `{ type: 'image' }` -> `<ImageBlock url={block.url} caption={block.caption} />`
- `{ type: 'gallery' }` -> `<GalleryBlock images={block.images} />`

## i18n Strategy
Since `projects.ts` contains a `pl` override object, implement a simple React Context or Zustand store to manage the current locale. When rendering a project, use:
`const projectData = locale === 'pl' && project.pl ? { ...project, ...project.pl } : project;`