import { createOlostepTools } from '../index.js';

async function main() {
  const apiKey = process.env.OLOSTEP_API_KEY;
  if (!apiKey) {
    console.error('Set OLOSTEP_API_KEY environment variable before running this test.');
    process.exit(1);
  }

  const tools = createOlostepTools({ apiKey });

  console.log('Running scrapeWebsite smoke test...');
  const result = await tools.scrapeWebsite({
    url_to_scrape: 'https://example.com',
    formats: ['markdown'],
    wait_before_scraping: 1000,
  });
  console.log('Scrape result keys:', Object.keys(result || {}));
}

main().catch((err) => {
  console.error('Smoke test failed:', err);
  process.exit(1);
});





