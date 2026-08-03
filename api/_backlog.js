import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function applyCors(res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

export function sendJson(res, status, body) {
  applyCors(res);
  res.status(status).json(body);
}

export function handleOptions(req, res) {
  if (req.method !== 'OPTIONS') {
    return false;
  }

  applyCors(res);
  res.status(204).end();
  return true;
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function mapRowToItem(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    platforms: row.platforms || [],
    rating: row.rating ?? undefined,
    rank: row.rank ?? undefined,
    addedAt: row.added_at ?? undefined,
    startedAt: row.started_at ?? undefined,
    finishedAt: row.finished_at ?? undefined,
    playtime: row.playtime ?? undefined,
    timeToBeat: row.time_to_beat ?? undefined,
    notes: row.notes ?? undefined,
    metadata: row.metadata || {},
  };
}

export function mapItemToRow(item) {
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    platforms: item.platforms,
    rating: item.rating ?? null,
    rank: item.rank ?? null,
    added_at: item.addedAt ?? null,
    started_at: item.startedAt ?? null,
    finished_at: item.finishedAt ?? null,
    playtime: item.playtime ?? null,
    time_to_beat: item.timeToBeat ?? null,
    notes: item.notes ?? null,
    metadata: item.metadata || {},
  };
}

export async function readBacklogPayload() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('backlog_entries')
    .select('*')
    .order('rank', { ascending: true, nullsFirst: false })
    .order('title', { ascending: true });

  if (error) {
    throw error;
  }

  const items = (data || []).map(mapRowToItem);
  const updatedAt = data?.reduce((latest, row) => {
    const next = row.updated_at || row.created_at || latest;
    return next > latest ? next : latest;
  }, '1970-01-01T00:00:00.000Z') || new Date().toISOString();

  return {
    updatedAt: updatedAt.slice(0, 10),
    items,
  };
}

export function assertPassword(password) {
  const expected = process.env.BACKLOG_ADMIN_PASSWORD;

  if (!expected) {
    throw new Error('Missing BACKLOG_ADMIN_PASSWORD');
  }

  if (!password || password !== expected) {
    const error = new Error('Invalid password');
    error.statusCode = 401;
    throw error;
  }
}
