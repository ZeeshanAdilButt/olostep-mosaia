import { fetchOlostep } from '../lib/http.js';

async function askAnswer(params) {
  const {
    apiKey,
    question,
    context_urls,
    format,
    include_citations,
    top_k_sources,
    baseUrl,
    signal,
  } = params || {};

  if (!question || typeof question !== 'string') {
    throw new Error('askAnswer: "question" is required and must be a string.');
  }

  const body = {
    question,
    context_urls: Array.isArray(context_urls) ? context_urls : undefined,
    format: format || 'markdown',
    include_citations: typeof include_citations === 'boolean' ? include_citations : undefined,
    top_k_sources: typeof top_k_sources === 'number' ? top_k_sources : undefined,
  };

  return await fetchOlostep('answers', {
    apiKey,
    baseUrl,
    method: 'POST',
    body,
    signal,
  });
}

export { askAnswer };


