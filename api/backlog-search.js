const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sendJson(res, status, body) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.status(status).json(body);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'bartlomiejcwiklak.com backlog proxy',
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed: ${response.status}`);
  }

  return response.json();
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeReleaseDate(value) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}

async function fetchSteamAppDetails(steamAppId) {
  if (!steamAppId) {
    return undefined;
  }

  try {
    const steamResponse = await fetchJson(`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&l=english`);
    const appData = steamResponse?.[steamAppId];
    return appData?.success ? appData.data : undefined;
  } catch {
    return undefined;
  }
}

function mapSteamData(result, steamData, fallbackId, source) {
  const steamAppId = result?.steamAppID ? String(result.steamAppID) : result?.id ? String(result.id) : undefined;

  return {
    id: steamAppId || fallbackId,
    title: steamData?.name || result?.external || result?.name || fallbackId,
    coverUrl: steamData?.header_image || result?.thumb || result?.tiny_image || undefined,
    heroUrl: steamData?.background_raw || steamData?.header_image || result?.thumb || result?.tiny_image || undefined,
    description: steamData?.short_description || '',
    releaseDate: normalizeReleaseDate(steamData?.release_date?.date || result?.release_date),
    developers: Array.isArray(steamData?.developers) ? steamData.developers.filter(Boolean) : [],
    publishers: Array.isArray(steamData?.publishers) ? steamData.publishers.filter(Boolean) : [],
    genres: Array.isArray(steamData?.genres) ? steamData.genres.map((genre) => genre.description).filter(Boolean) : [],
    steamAppId,
    storeUrl: steamAppId ? `https://store.steampowered.com/app/${steamAppId}` : undefined,
    source,
  };
}

function dedupeItems(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.steamAppId || slugify(item.title);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const query = typeof req.query.query === 'string' ? req.query.query.trim() : '';

    if (!query) {
      sendJson(res, 400, { error: 'Missing query parameter' });
      return;
    }

    const [cheapSharkResults, steamSearchResponse] = await Promise.all([
      fetchJson(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}&limit=8`).catch(() => []),
      fetchJson(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=us`).catch(() => ({ items: [] })),
    ]);

    const cheapSharkItems = Array.isArray(cheapSharkResults)
      ? await Promise.all(cheapSharkResults.map(async (result) => {
          const steamAppId = result.steamAppID ? String(result.steamAppID) : undefined;
          const steamData = await fetchSteamAppDetails(steamAppId);

          return mapSteamData(
            result,
            steamData,
            String(result.gameID || result.dealID || result.external).toLowerCase(),
            steamData ? 'CheapShark + Steam' : 'CheapShark',
          );
        }))
      : [];

    const steamSearchItems = Array.isArray(steamSearchResponse?.items)
      ? await Promise.all(steamSearchResponse.items.slice(0, 8).map(async (result) => {
          const steamAppId = result.id ? String(result.id) : undefined;
          const steamData = await fetchSteamAppDetails(steamAppId);

          return mapSteamData(
            result,
            steamData,
            slugify(result.name),
            'Steam',
          );
        }))
      : [];

    const items = dedupeItems([...cheapSharkItems, ...steamSearchItems]).slice(0, 12);
    sendJson(res, 200, { items });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
