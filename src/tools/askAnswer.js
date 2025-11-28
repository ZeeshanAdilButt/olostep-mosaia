import { fetchOlostep } from '../lib/http.js';

async function askAnswer(params) {
  const {
    apiKey,
    task,
    json,
    include_citations,
    top_k_sources,
    format,
    context_urls,
    baseUrl,
    signal,
  } = params || {};

  if (!task || typeof task !== 'string') {
    throw new Error('askAnswer: "task" is required and must be a string.');
  }

  const body = {
    task,
    json_format: typeof json !== 'undefined' ? json : undefined,
    include_citations: typeof include_citations !== 'undefined' ? include_citations : undefined,
    top_k_sources: typeof top_k_sources !== 'undefined' ? top_k_sources : undefined,
    format: typeof format !== 'undefined' ? format : undefined,
    context_urls: typeof context_urls !== 'undefined' ? context_urls : undefined,
  };

  // Remove undefined keys
  Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

  return await fetchOlostep('answers', {
    apiKey,
    baseUrl,
    method: 'POST',
    body,
    signal,
  });
}

export { askAnswer };


