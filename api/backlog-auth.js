import { assertPassword, formatBacklogError, handleOptions, readJsonBody, sendJson } from './_backlog.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    assertPassword(body?.password);
    sendJson(res, 200, { data: true });
  } catch (error) {
    sendJson(res, error?.statusCode || 401, { error: formatBacklogError(error) });
  }
}
