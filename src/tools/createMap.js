import { fetchOlostep } from '../lib/http.js';

async function createMap(params) {
  const {
    apiKey,
    url,
    search_query,
    top_n,
    include_urls,
    exclude_urls,
    baseUrl,
    signal,
  } = params || {};

  if (!url || typeof url !== 'string') {
    throw new Error('createMap: "url" is required and must be a string.');
  }

  const body = {
    url,
    search_query: search_query || undefined,
    top_n: typeof top_n === 'number' ? top_n : undefined,
    include_urls: Array.isArray(include_urls) ? include_urls : undefined,
    exclude_urls: Array.isArray(exclude_urls) ? exclude_urls : undefined,
  };

  return await fetchOlostep('maps', {
    apiKey,
    baseUrl,
    method: 'POST',
    body,
    signal,
  });
}

export { createMap };


