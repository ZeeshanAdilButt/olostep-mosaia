import { createOlostepTools } from '../index.js';

function printSection(title) {
  console.log('\n=== ' + title + ' ===');
}

function summarize(obj, keys) {
  if (!obj || typeof obj !== 'object') return console.log('No object returned');
  const summary = {};
  for (const k of keys) {
    if (k in obj) summary[k] = obj[k];
  }
  console.log(summary);
}

async function main() {
  const apiKey = process.env.OLOSTEP_API_KEY;
  if (!apiKey) {
    console.error('Set OLOSTEP_API_KEY before running this test.');
    process.exit(1);
  }

  const tools = createOlostepTools({ apiKey });

  // 1) Scrape Website
  try {
    printSection('Scrape Website');
    const scrapeRes = await tools.scrapeWebsite({
      url_to_scrape: 'https://example.com',
      formats: ['markdown'],
      wait_before_scraping: 1000,
    });
    summarize(scrapeRes, ['id', 'object', 'created', 'url_to_scrape', 'retrieve_id']);
  } catch (e) {
    console.error('Scrape Website failed:', e?.message || e);
  }

  // 2) Batch Scrape
  try {
    printSection('Batch Scrape');
    const batchRes = await tools.batchScrape({
      batch_array: [
        { url: 'https://example.com', custom_id: 'site1' },
        { url: 'https://www.iana.org/domains/reserved', custom_id: 'site2' },
      ],
      formats: ['markdown'],
    });
    summarize(batchRes, ['batch_id', 'status', 'total_urls', 'created_at']);
  } catch (e) {
    console.error('Batch Scrape failed:', e?.message || e);
  }

  // 3) Create Crawl
  try {
    printSection('Create Crawl');
    const crawlRes = await tools.createCrawl({
      start_url: 'https://example.com',
      max_pages: 3,
      follow_links: false,
      formats: ['markdown'],
    });
    summarize(crawlRes, ['crawl_id', 'status', 'start_url', 'max_pages', 'created_at']);
  } catch (e) {
    console.error('Create Crawl failed:', e?.message || e);
  }

  // 4) Create Map
  try {
    printSection('Create Map');
    const mapRes = await tools.createMap({
      url: 'https://example.com',
      top_n: 50,
    });
    summarize(mapRes, ['map_id', 'status', 'url', 'total_urls', 'created_at']);
  } catch (e) {
    console.error('Create Map failed:', e?.message || e);
  }

  // 5) Ask AI Answer
  try {
    printSection('Ask AI Answer');
    const answerRes = await tools.askAnswer({
      question: 'What is on the homepage of example.com?',
      context_urls: ['https://example.com'],
      format: 'markdown',
      include_citations: true,
      top_k_sources: 2,
    });
    summarize(answerRes, ['id', 'object', 'question', 'format', 'created']);
  } catch (e) {
    console.error('Ask AI Answer failed:', e?.message || e);
  }
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});


