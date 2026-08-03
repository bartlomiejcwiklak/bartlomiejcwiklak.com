import type { BacklogItem, BacklogPayload } from './backlog';

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export async function fetchBacklog() {
  const response = await fetch('/api/backlog-public', { cache: 'no-store' });
  const payload = await response.json() as ApiResponse<BacklogPayload>;

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || 'Failed to load backlog');
  }

  return payload.data;
}

export async function verifyBacklogPassword(password: string) {
  const response = await fetch('/api/backlog-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const payload = await response.json() as ApiResponse<null>;
    throw new Error(payload.error || 'Invalid password');
  }
}

export async function upsertBacklogItem(item: BacklogItem, password: string) {
  const response = await fetch('/api/backlog-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upsert', password, item }),
  });

  const payload = await response.json() as ApiResponse<BacklogPayload>;

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || 'Failed to save entry');
  }

  return payload.data;
}

export async function deleteBacklogItem(id: string, password: string) {
  const response = await fetch('/api/backlog-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', password, id }),
  });

  const payload = await response.json() as ApiResponse<BacklogPayload>;

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || 'Failed to delete entry');
  }

  return payload.data;
}

export async function replaceBacklog(payloadToStore: BacklogPayload, password: string) {
  const response = await fetch('/api/backlog-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'replace', password, items: payloadToStore.items }),
  });

  const payload = await response.json() as ApiResponse<BacklogPayload>;

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || 'Failed to replace backlog');
  }

  return payload.data;
}
