export type BacklogStatus = 'playing' | 'completed' | 'backlog' | 'dropped' | 'replaying';

export type BacklogItem = {
  id: string;
  title: string;
  status: BacklogStatus;
  platforms: string[];
  rating?: number;
  rank?: number;
  addedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  playtime?: string;
  timeToBeat?: string;
  notes?: string;
  metadata: {
    description?: string;
    coverUrl?: string;
    heroUrl?: string;
    releaseDate?: string;
    genres?: string[];
    developers?: string[];
    publishers?: string[];
    steamAppId?: string;
    storeUrl?: string;
    source?: string;
  };
};

export type BacklogPayload = {
  updatedAt: string;
  items: BacklogItem[];
};

export const statusOrder: BacklogStatus[] = ['playing', 'completed', 'replaying', 'backlog', 'dropped'];

export function createEmptyPayload(): BacklogPayload {
  return {
    updatedAt: new Date().toISOString().slice(0, 10),
    items: [],
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizePayload(payload: BacklogPayload): BacklogPayload {
  return {
    updatedAt: payload.updatedAt || new Date().toISOString().slice(0, 10),
    items: (payload.items || []).map((item) => ({
      ...item,
      id: item.id || slugify(item.title),
      platforms: item.platforms || [],
      metadata: item.metadata || {},
    })),
  };
}

export function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return null;
  }

  const normalized = value.length === 7 ? `${value}-01` : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: value.length >= 7 ? 'long' : undefined,
    day: value.length > 7 ? 'numeric' : undefined,
  }).format(date);
}
