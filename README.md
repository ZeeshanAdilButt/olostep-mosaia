# Olostep Mosaia Tools

The most reliable and cost-effective web search, scraping and crawling API for AI. Build intelligent agents that can search, scrape, analyze, and structure data from any website.
- Includes:
- Scrape Website
- Batch Scrape URLs
- Create Crawl
- Create Map
- Ask AI Answer

Production-ready Node.js wrappers around the Olostep REST API, suitable for direct integration in Mosaia under Tools/Agents.

## Prerequisites

- Node.js 18+ (for built-in `fetch`)
- Olostep API key (`OLOSTEP_API_KEY`)

## Installation

```bash
cd olostep-mosaia
npm install
```

## Quick Start

```bash
# Windows PowerShell
$env:OLOSTEP_API_KEY="YOUR_KEY"; node src/examples/smoke-test.js
```

## Usage

```js
import { createOlostepTools } from 'olostep-mosaia';
// or: import { scrapeWebsite, batchScrape, createCrawl, createMap, askAnswer } from 'olostep-mosaia';

const tools = createOlostepTools({ apiKey: process.env.OLOSTEP_API_KEY });

// 1) Scrape Website
await tools.scrapeWebsite({
  url_to_scrape: 'https://example.com',
  formats: ['markdown'],        // html | markdown | json | text
  country: 'US',                // optional
  wait_before_scraping: 1000,   // optional (ms)
  parser: '@olostep/amazon-product' // optional
});

// 2) Batch Scrape
await tools.batchScrape({
  batch_array: [{ url: 'https://example.com', custom_id: 'site1' }],
  formats: ['markdown'],
});

// 3) Create Crawl
await tools.createCrawl({
  start_url: 'https://example.com',
  max_pages: 50,
  follow_links: true,
  formats: ['markdown'],
});

// 4) Create Map
await tools.createMap({
  url: 'https://example.com',
  search_query: 'pricing OR plan',
  top_n: 200,
  include_urls: ['https://example.com/*'],
  exclude_urls: ['https://example.com/blog/*'],
});

// 5) Ask AI Answer
await tools.askAnswer({
  question: 'Summarize pricing from these URLs',
  context_urls: ['https://example.com/pricing'],
  format: 'markdown',           // markdown | text | json
  include_citations: true,
  top_k_sources: 3,
});
```

## API Endpoints (used)

- POST `https://api.olostep.com/v1/scrapes`
- POST `https://api.olostep.com/v1/batches`
- POST `https://api.olostep.com/v1/crawls`
- POST `https://api.olostep.com/v1/maps`
- POST `https://api.olostep.com/v1/answers`

## Add to Mosaia (Console → Tools/Agents)

Since Mosaia’s exact publishing flow can vary by account/plan, here’s the typical approach:

1. Open Mosaia Console → Tools (or Agents) → Add Tool.
2. Choose “Custom/HTTP/JS Tool” (whichever lets you call functions or HTTP).
3. Provide:
   - Name: “Olostep”
   - Description: “The most reliable and cost-effective web search, scraping and crawling API for AI. Build intelligent agents that can search, scrape, analyze, and structure data from any website.”
   - Auth: API Key (env var `OLOSTEP_API_KEY`)
4. Map each tool to an action:
   - scrape_website → POST /v1/scrapes
   - batch_scrape_urls → POST /v1/batches
   - create_crawl → POST /v1/crawls
   - create_map → POST /v1/maps
   - ask_ai_answer → POST /v1/answers
5. Test each action in the Mosaia console with your API key.
6. Save/Publish so the tools appear under Tools/Agents.

If your Mosaia workspace supports linking a GitHub repo for tools, point it to this repository and ensure `OLOSTEP_API_KEY` is configured in project secrets. Otherwise, paste the HTTP definitions or use serverless functions that import this package and forward requests to Olostep.

## Project Structure

```
olostep-mosaia/
├─ src/
│  ├─ lib/http.js           # shared HTTP helpers
│  ├─ tools/
│  │  ├─ scrapeWebsite.js
│  │  ├─ batchScrape.js
│  │  ├─ createCrawl.js
│  │  ├─ createMap.js
│  │  └─ askAnswer.js
│  ├─ index.js              # exports + factory
│  └─ examples/smoke-test.js
├─ package.json
└─ README.md
```

## License

MIT


