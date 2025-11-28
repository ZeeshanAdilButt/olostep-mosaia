import { createOlostepTools } from './index.js';

// Helper to parse comma-separated strings into arrays
function parseStringArray(value) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

// Helper to parse string to number
function parseNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

// Helper to parse string to boolean
function parseBoolean(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return value === 'true';
}

export async function handler(event) {
  let parsed;
  try {
    parsed = JSON.parse(event?.body ?? '{}');
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const args = parsed.args || {};
  const secrets = parsed.secrets || {};

  const apiKey = secrets.OLOSTEP_API_KEY || process.env.OLOSTEP_API_KEY;
  const tools = createOlostepTools({ apiKey });

  const operation = args.operation;

  try {
    let result;
    switch (operation) {
      case 'scrape_website':
        result = await tools.scrapeWebsite({
          url_to_scrape: args.url_to_scrape,
          formats: parseStringArray(args.formats),
          country: args.country,
          wait_before_scraping: parseNumber(args.wait_before_scraping),
          parser: args.parser,
        });
        break;
      case 'batch_scrape':
        // Parse urls string into batch_array format
        const urls = parseStringArray(args.urls);
        const batchArray = urls ? urls.map((url, i) => ({ url, custom_id: `item_${i}` })) : undefined;
        result = await tools.batchScrape({
          batch_array: batchArray,
          formats: parseStringArray(args.formats),
          country: args.country,
          wait_before_scraping: parseNumber(args.wait_before_scraping),
          parser: args.parser,
        });
        break;
      case 'create_crawl':
        result = await tools.createCrawl({
          start_url: args.start_url,
          max_pages: parseNumber(args.max_pages),
          follow_links: parseBoolean(args.follow_links),
          formats: parseStringArray(args.formats),
          country: args.country,
          parser: args.parser,
        });
        break;
      case 'create_map':
        result = await tools.createMap({
          url: args.url,
          search_query: args.search_query,
          top_n: parseNumber(args.top_n),
          include_urls: parseStringArray(args.include_urls),
          exclude_urls: parseStringArray(args.exclude_urls),
        });
        break;
      case 'ask_ai_answer':
        result = await tools.askAnswer({
          task: args.task || args.question,
          json: args.json,
        });
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid or missing operation' }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result ?? {}),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      statusCode: error?.status || 500,
      body: JSON.stringify({ error: message }),
    };
  }
}


