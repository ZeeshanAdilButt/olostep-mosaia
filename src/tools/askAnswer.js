import { fetchOlostep } from '../lib/http.js';

async function askAnswer(params) {
  const {
    apiKey,
    task,
    json,
    baseUrl,
    signal,
  } = params || {};

  if (!task || typeof task !== 'string') {
    throw new Error('askAnswer: "task" is required and must be a string.');
  }

  const body = {
    task,
    json_format: typeof json !== 'undefined' ? json : undefined,
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


