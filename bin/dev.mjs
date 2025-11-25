import 'dotenv/config';
import express from 'express';
import { handler } from '../dist/index.js';

const app = express();

const { OLOSTEP_API_KEY, PORT } = process.env;

if (!OLOSTEP_API_KEY) {
  console.log('`OLOSTEP_API_KEY` not set. Please set it in your environment.');
  process.exit(1);
}

app.get('/', async (req, res) => {
  const rawArgs = Object.fromEntries(Object.entries(req.query));
  const args = {};

  const jsonKeys = new Set(['formats', 'batch_array', 'include_urls', 'exclude_urls', 'context_urls']);
  const numberKeys = new Set(['wait_before_scraping', 'max_pages', 'top_n', 'top_k_sources']);
  const booleanKeys = new Set(['follow_links', 'include_citations']);

  for (const [key, value] of Object.entries(rawArgs)) {
    if (jsonKeys.has(key)) {
      try {
        args[key] = JSON.parse(value);
        continue;
      } catch {
        // fallthrough
      }
    }
    if (numberKeys.has(key)) {
      const n = Number(value);
      args[key] = Number.isFinite(n) ? n : undefined;
      continue;
    }
    if (booleanKeys.has(key)) {
      const v = String(value).toLowerCase();
      args[key] = v === 'true' || v === '1';
      continue;
    }
    args[key] = value;
  }

  const event = {
    body: JSON.stringify({
      args,
      secrets: {
        OLOSTEP_API_KEY
      }
    })
  };

  const result = await handler(event);
  res.status(result.statusCode).send(result.body);
});

const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Local development server running on port ${port}`);
});


