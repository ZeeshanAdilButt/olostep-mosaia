import { fetchOlostep, normalizeFormats } from '../lib/http.js';

async function createCrawl(params) {
  const {
    apiKey,
    start_url,
    max_pages,
    follow_links,
    formats,
    country,
    parser,
    baseUrl,
    signal,
  } = params || {};

  if (!start_url || typeof start_url !== 'string') {
    throw new Error('createCrawl: "start_url" is required and must be a string.');
  }

  const body = {
    start_url,
    max_pages: typeof max_pages === 'number' ? max_pages : undefined,
    follow_links: typeof follow_links === 'boolean' ? follow_links : undefined,
    formats: normalizeFormats(formats) ?? ['markdown'],
    country: country || undefined,
    parser: parser || undefined,
  };

  return await fetchOlostep('crawls', {
    apiKey,
    baseUrl,
    method: 'POST',
    body,
    signal,
  });
}

export { createCrawl };


