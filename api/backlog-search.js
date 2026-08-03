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

async function fetchIgdb(query) {
  const clientId = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_ACCESS_TOKEN;

  if (!clientId || !accessToken) {
    return [];
  }

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'text/plain',
      'User-Agent': 'bartlomiejcwiklak.com backlog proxy',
    },
    body: `search "${query.replace(/"/g, '')}"; fields name,summary,first_release_date,cover.image_id,genres.name,involved_companies.company.name,platforms.name,url; limit 8;`,
  });

  if (!response.ok) {
    throw new Error(`IGDB request failed: ${response.status}`);
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

function mapIgdbItem(item) {
  const imageId = item?.cover?.image_id;
  const baseImageUrl = imageId ? `https://images.igdb.com/igdb/image/upload` : undefined;

  return {
    id: item.id ? `igdb-${item.id}` : slugify(item.name),
    title: item.name,
    coverUrl: baseImageUrl ? `${baseImageUrl}/t_cover_big/${imageId}.jpg` : undefined,
    heroUrl: baseImageUrl ? `${baseImageUrl}/t_1080p/${imageId}.jpg` : undefined,
    description: item.summary || '',
    releaseDate: item.first_release_date ? new Date(item.first_release_date * 1000).toISOString().slice(0, 10) : undefined,
    developers: Array.isArray(item.involved_companies) ? item.involved_companies.map((company) => company?.company?.name).filter(Boolean) : [],
    publishers: [],
    genres: Array.isArray(item.genres) ? item.genres.map((genre) => genre?.name).filter(Boolean) : [],
    steamAppId: undefined,
    storeUrl: item.url || undefined,
    source: 'IGDB',
  };
}

function firstClaimValue(entity, propertyId) {
  const claim = entity?.claims?.[propertyId]?.[0]?.mainsnak?.datavalue?.value;
  return claim;
}

function allEntityIds(entity, propertyId) {
  const claims = entity?.claims?.[propertyId] || [];
  return claims
    .map((claim) => claim?.mainsnak?.datavalue?.value?.id)
    .filter(Boolean);
}

async function fetchWikidataItems(query) {
  const searchResponse = await fetchJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&limit=8&type=item`).catch(() => ({ search: [] }));
  const searchItems = Array.isArray(searchResponse?.search) ? searchResponse.search : [];

  if (searchItems.length === 0) {
    return [];
  }

  return Promise.all(searchItems.map(async (result) => {
    try {
      const entityData = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${result.id}.json`);
      const entity = entityData?.entities?.[result.id];

      if (!entity) {
        return null;
      }

      const release = firstClaimValue(entity, 'P577');
      const imageName = firstClaimValue(entity, 'P18');
      const developerIds = allEntityIds(entity, 'P178');
      const genreIds = allEntityIds(entity, 'P136');
      const relatedIds = [...new Set([...developerIds, ...genreIds])];
      const relatedEntities = relatedIds.length > 0
        ? await fetchJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${relatedIds.join('|')}&languages=en&format=json&props=labels`).catch(() => ({ entities: {} }))
        : { entities: {} };

      const developerNames = developerIds.map((id) => relatedEntities?.entities?.[id]?.labels?.en?.value).filter(Boolean);
      const genreNames = genreIds.map((id) => relatedEntities?.entities?.[id]?.labels?.en?.value).filter(Boolean);

      let coverUrl;
      if (imageName) {
        const fileName = encodeURIComponent(String(imageName).replace(/ /g, '_'));
        coverUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
      }

      return {
        id: result.id,
        title: entity.labels?.en?.value || result.label,
        coverUrl,
        heroUrl: coverUrl,
        description: entity.descriptions?.en?.value || result.description || '',
        releaseDate: normalizeReleaseDate(release?.time?.slice(1, 11)),
        developers: developerNames,
        publishers: [],
        genres: genreNames,
        steamAppId: undefined,
        storeUrl: result.concepturi,
        source: 'Wikidata',
      };
    } catch {
      return null;
    }
  })).then((items) => items.filter(Boolean));
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

    const [igdbResults, cheapSharkResults, steamSearchResponse, wikidataItems] = await Promise.all([
      fetchIgdb(query).catch(() => []),
      fetchJson(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}&limit=8`).catch(() => []),
      fetchJson(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=us`).catch(() => ({ items: [] })),
      fetchWikidataItems(query),
    ]);

    const igdbItems = Array.isArray(igdbResults)
      ? igdbResults.map(mapIgdbItem)
      : [];

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

    const items = dedupeItems([...igdbItems, ...cheapSharkItems, ...steamSearchItems, ...wikidataItems]).slice(0, 12);
    sendJson(res, 200, { items });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
