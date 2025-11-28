const DEFAULT_API_BASE = 'https://api.olostep.com';

function resolveApiKey(explicitApiKey) {
  const keyFromParam = explicitApiKey && String(explicitApiKey).trim();
  const keyFromEnv = process.env.OLOSTEP_API_KEY && String(process.env.OLOSTEP_API_KEY).trim();
  const apiKey = keyFromParam || keyFromEnv;
  if (!apiKey) {
    throw new Error('Olostep API key is required. Set OLOSTEP_API_KEY env var or pass apiKey.');
  }
  return apiKey;
}

async function fetchOlostep(path, options) {
  const {
    apiKey,
    method = 'POST',
    body = undefined,
    baseUrl = DEFAULT_API_BASE,
    headers = {},
    signal,
  } = options || {};

  const resolvedKey = resolveApiKey(apiKey);
  const url = `${baseUrl.replace(/\/$/, '')}/v1/${path.replace(/^\/?v1\//, '').replace(/^\//, '')}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${resolvedKey}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    const err = new Error(json?.message || `Olostep API error ${response.status}`);
    err.status = response.status;
    err.body = json ?? text;
    throw err;
  }

  return json;
}

function normalizeFormats(formats) {
  if (!formats) return undefined;
  if (Array.isArray(formats)) return formats;
  const trimmed = String(formats).trim();
  if (!trimmed) return undefined;
  // Allow comma-separated string
  if (trimmed.includes(',')) {
    return trimmed.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [trimmed];
}

export { fetchOlostep, normalizeFormats };





