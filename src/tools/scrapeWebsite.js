import { fetchOlostep, normalizeFormats } from '../lib/http.js';

async function scrapeWebsite(params) {
  const {
    apiKey,
    url_to_scrape,
    formats,
    country,
    wait_before_scraping,
    parser,
    baseUrl,
    signal,
  } = params || {};

  if (!url_to_scrape || typeof url_to_scrape !== 'string') {
    throw new Error('scrapeWebsite: "url_to_scrape" is required and must be a string.');
  }

  const body = {
    url_to_scrape,
    formats: normalizeFormats(formats) ?? ['markdown'],
    country: country || undefined,
    wait_before_scraping: typeof wait_before_scraping === 'number' ? wait_before_scraping : undefined,
    parser: parser || undefined,
  };

  return await fetchOlostep('scrapes', {
    apiKey,
    baseUrl,
    method: 'POST',
    body,
    signal,
  });
}

export { scrapeWebsite };


