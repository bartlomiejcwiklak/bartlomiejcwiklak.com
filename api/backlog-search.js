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

function normalizeReleaseDate(value) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
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

    const searchResults = await fetchJson(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}&limit=8`);

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      sendJson(res, 200, { items: [] });
      return;
    }

    const items = await Promise.all(searchResults.map(async (result) => {
      const steamAppId = result.steamAppID ? String(result.steamAppID) : undefined;
      let steamData;

      if (steamAppId) {
        try {
          const steamResponse = await fetchJson(`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&l=english`);
          const appData = steamResponse?.[steamAppId];
          if (appData?.success) {
            steamData = appData.data;
          }
        } catch {
          steamData = undefined;
        }
      }

      return {
        id: steamAppId || String(result.gameID || result.dealID || result.external).toLowerCase(),
        title: steamData?.name || result.external,
        coverUrl: steamData?.header_image || result.thumb || undefined,
        heroUrl: steamData?.background_raw || steamData?.header_image || result.thumb || undefined,
        description: steamData?.short_description || '',
        releaseDate: normalizeReleaseDate(steamData?.release_date?.date),
        developers: Array.isArray(steamData?.developers) ? steamData.developers.filter(Boolean) : [],
        publishers: Array.isArray(steamData?.publishers) ? steamData.publishers.filter(Boolean) : [],
        genres: Array.isArray(steamData?.genres) ? steamData.genres.map((genre) => genre.description).filter(Boolean) : [],
        steamAppId,
        storeUrl: steamAppId ? `https://store.steampowered.com/app/${steamAppId}` : undefined,
        source: steamData ? 'CheapShark + Steam' : 'CheapShark',
      };
    }));

    sendJson(res, 200, { items });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
