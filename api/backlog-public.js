import { handleOptions, readBacklogPayload, sendJson } from './_backlog.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const data = await readBacklogPayload();
    sendJson(res, 200, { data });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
