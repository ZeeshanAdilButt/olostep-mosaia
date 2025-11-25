import { fetchOlostep, normalizeFormats } from '../lib/http.js';

async function batchScrape(params) {
  const {
    apiKey,
    batch_array,
    formats,
    country,
    wait_before_scraping,
    parser,
    baseUrl,
    signal,
  } = params || {};

  if (!Array.isArray(batch_array) || batch_array.length === 0) {
    throw new Error('batchScrape: "batch_array" must be a non-empty array of { url, custom_id? }.');
  }

  const body = {
    batch_array,
    formats: normalizeFormats(formats) ?? ['markdown'],
    country: country || undefined,
    wait_before_scraping: typeof wait_before_scraping === 'number' ? wait_before_scraping : undefined,
    parser: parser || undefined,
  };

  return await fetchOlostep('batches', {
    apiKey,
    baseUrl,
    method: 'POST',
    body,
    signal,
  });
}

export { batchScrape };


