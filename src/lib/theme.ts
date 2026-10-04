import type { CSSProperties } from 'react';

// Colors for a single page: `background` replaces the dark ink color, `text` replaces the light ash color
// everywhere on that page (text, borders, header, footer and the inverted contact button).
export type PageTheme = {
  background: string;
  text: string;
};

function toRgbChannels(hex: string) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());

  if (!match) {
    throw new Error(`Invalid theme color "${hex}". Use a hex color such as "#F3F1E8".`);
  }

  const value = match[1].length === 3 ? match[1].replace(/./g, (char) => char + char) : match[1];

  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)).join(' ');
}

export function getThemeStyle(theme?: PageTheme): CSSProperties | undefined {
  if (!theme) {
    return undefined;
  }

  const text = toRgbChannels(theme.text);

  return {
    '--color-ink': toRgbChannels(theme.background),
    '--color-ash': text,
    '--color-line': text
  } as CSSProperties;
}
