import { assertPassword, getSupabaseAdmin, handleOptions, mapItemToRow, readBacklogPayload, sendJson } from './_backlog.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const { action, password, item, id, items } = req.body || {};
    assertPassword(password);

    const supabase = getSupabaseAdmin();

    if (action === 'upsert') {
      const { error } = await supabase.from('backlog_entries').upsert(mapItemToRow(item));
      if (error) {
        throw error;
      }
    } else if (action === 'replace') {
      const { error: deleteError } = await supabase.from('backlog_entries').delete().neq('id', '');
      if (deleteError) {
        throw deleteError;
      }

      if (Array.isArray(items) && items.length > 0) {
        const { error: insertError } = await supabase.from('backlog_entries').upsert(items.map(mapItemToRow));
        if (insertError) {
          throw insertError;
        }
      }
    } else if (action === 'delete') {
      const { error } = await supabase.from('backlog_entries').delete().eq('id', id);
      if (error) {
        throw error;
      }
    } else {
      sendJson(res, 400, { error: 'Invalid action' });
      return;
    }

    const data = await readBacklogPayload();
    sendJson(res, 200, { data });
  } catch (error) {
    sendJson(res, error?.statusCode || 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
