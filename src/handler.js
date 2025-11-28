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

// Helper to normalize keys: convert spaces to underscores and lowercase
function normalizeArgs(args) {
  const normalized = {};
  for (const [key, value] of Object.entries(args)) {
    const normalizedKey = key.replace(/\s+/g, '_').toLowerCase();
    normalized[normalizedKey] = value;
  }
  return normalized;
}

// Helper to normalize operation name
function normalizeOperation(op) {
  if (!op) return op;
  return op.replace(/\s+/g, '_').toLowerCase();
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

  // Normalize all argument keys (spaces -> underscores)
  const rawArgs = parsed.args || {};
  const args = normalizeArgs(rawArgs);
  const secrets = parsed.secrets || {};

  const apiKey = secrets.OLOSTEP_API_KEY || process.env.OLOSTEP_API_KEY;
  const tools = createOlostepTools({ apiKey });

  // Normalize operation name (e.g., "ask ai answer" -> "ask_ai_answer")
  const operation = normalizeOperation(args.operation);

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
          include_citations: parseBoolean(args.include_citations),
          top_k_sources: parseNumber(args.top_k_sources),
          format: args.format,
          context_urls: parseStringArray(args.context_urls),
        });
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Invalid or missing operation: "${operation}". Valid operations: scrape_website, batch_scrape, create_crawl, create_map, ask_ai_answer` }),
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


