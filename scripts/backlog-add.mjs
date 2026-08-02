import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const backlogPath = resolve(process.cwd(), 'public/backlog.json');
const validStatuses = new Set(['playing', 'completed', 'backlog', 'dropped', 'replaying']);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseArgs(args) {
  const positional = [];
  const options = {
    status: 'completed',
    rating: undefined,
    platforms: [],
    notes: undefined,
    startedAt: undefined,
    finishedAt: undefined,
  };

  for (let index = 0; index < args.length; index += 1) {
    const part = args[index];

    if (!part.startsWith('--')) {
      positional.push(part);
      continue;
    }

    const key = part.slice(2);
    const nextValue = args[index + 1];

    if (!nextValue || nextValue.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    index += 1;

    if (key === 'status') {
      options.status = nextValue;
      continue;
    }

    if (key === 'rating') {
      options.rating = Number(nextValue);
      continue;
    }

    if (key === 'platforms') {
      options.platforms = nextValue.split(',').map((value) => value.trim()).filter(Boolean);
      continue;
    }

    if (key === 'notes') {
      options.notes = nextValue;
      continue;
    }

    if (key === 'startedAt') {
      options.startedAt = nextValue;
      continue;
    }

    if (key === 'finishedAt') {
      options.finishedAt = nextValue;
      continue;
    }

    throw new Error(`Unknown option --${key}`);
  }

  if (positional.length === 0) {
    throw new Error('Usage: npm run backlog:add -- "Game Title" [--status completed] [--rating 9] [--platforms "PC,PS5"] [--notes "..."] [--startedAt 2026-07] [--finishedAt 2026-08]');
  }

  return {
    title: positional.join(' ').trim(),
    options,
  };
}

async function loadBacklog() {
  const content = await readFile(backlogPath, 'utf8');
  return JSON.parse(content);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'bartlomiejcwiklak.com backlog importer',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function pickBestMatch(results, title) {
  const normalizedTitle = title.toLowerCase();

  return [...results].sort((left, right) => {
    const leftTitle = String(left.external || '').toLowerCase();
    const rightTitle = String(right.external || '').toLowerCase();
    const leftScore = leftTitle === normalizedTitle ? 0 : leftTitle.includes(normalizedTitle) ? 1 : 2;
    const rightScore = rightTitle === normalizedTitle ? 0 : rightTitle.includes(normalizedTitle) ? 1 : 2;
    return leftScore - rightScore;
  })[0];
}

async function fetchGameMetadata(title) {
  const searchUrl = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(title)}&limit=10`;
  const searchResults = await fetchJson(searchUrl);

  if (!Array.isArray(searchResults) || searchResults.length === 0) {
    throw new Error(`No matches found for "${title}" in CheapShark.`);
  }

  const match = pickBestMatch(searchResults, title);
  const steamAppId = match.steamAppID ? String(match.steamAppID) : undefined;
  let steamData;

  if (steamAppId) {
    const steamResponse = await fetchJson(`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&l=english`);
    const appData = steamResponse?.[steamAppId];

    if (appData?.success) {
      steamData = appData.data;
    }
  }

  let releaseDate;

  if (steamData?.release_date?.date) {
    const parsedDate = new Date(steamData.release_date.date);

    if (!Number.isNaN(parsedDate.getTime())) {
      releaseDate = parsedDate.toISOString().slice(0, 10);
    }
  }

  return {
    canonicalTitle: steamData?.name || match.external || title,
    steamAppId,
    description: steamData?.short_description || undefined,
    releaseDate,
    genres: Array.isArray(steamData?.genres) ? steamData.genres.map((genre) => genre.description).filter(Boolean) : [],
    developers: Array.isArray(steamData?.developers) ? steamData.developers.filter(Boolean) : [],
    publishers: Array.isArray(steamData?.publishers) ? steamData.publishers.filter(Boolean) : [],
    coverUrl: match.thumb || steamData?.header_image || undefined,
    heroUrl: steamData?.header_image || match.thumb || undefined,
    storeUrl: steamAppId ? `https://store.steampowered.com/app/${steamAppId}` : undefined,
    source: steamData ? 'CheapShark + Steam' : 'CheapShark',
  };
}

async function main() {
  const { title, options } = parseArgs(process.argv.slice(2));
  const backlog = await loadBacklog();
  const id = slugify(title);

  if (!validStatuses.has(options.status)) {
    throw new Error(`Invalid status "${options.status}". Use one of: ${Array.from(validStatuses).join(', ')}`);
  }

  if (options.rating !== undefined && (!Number.isFinite(options.rating) || options.rating < 0 || options.rating > 10)) {
    throw new Error('Rating must be a number between 0 and 10.');
  }

  if (backlog.items.some((item) => item.id === id)) {
    throw new Error(`Game with id "${id}" already exists.`);
  }

  const metadata = await fetchGameMetadata(title);
  const nextItem = {
    id,
    title: metadata.canonicalTitle,
    status: options.status,
    platforms: options.platforms,
    rating: Number.isFinite(options.rating) ? options.rating : undefined,
    startedAt: options.startedAt,
    finishedAt: options.finishedAt,
    notes: options.notes,
    metadata,
  };

  const nextBacklog = {
    updatedAt: new Date().toISOString().slice(0, 10),
    items: [nextItem, ...backlog.items],
  };

  await writeFile(backlogPath, `${JSON.stringify(nextBacklog, null, 2)}\n`, 'utf8');
  console.log(`Added ${nextItem.title} to backlog as ${id}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
