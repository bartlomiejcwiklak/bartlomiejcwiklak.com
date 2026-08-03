import { assertPassword, handleOptions, sendJson } from './_backlog.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    assertPassword(req.body?.password);
    sendJson(res, 200, { data: true });
  } catch (error) {
    sendJson(res, error?.statusCode || 401, { error: error instanceof Error ? error.message : 'Invalid password' });
  }
}
