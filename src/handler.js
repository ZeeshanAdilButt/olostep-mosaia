import { createOlostepTools } from './index.js';

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
          formats: args.formats,
          country: args.country,
          wait_before_scraping: args.wait_before_scraping,
          parser: args.parser,
        });
        break;
      case 'batch_scrape':
        result = await tools.batchScrape({
          batch_array: args.batch_array,
          formats: args.formats,
          country: args.country,
          wait_before_scraping: args.wait_before_scraping,
          parser: args.parser,
        });
        break;
      case 'create_crawl':
        result = await tools.createCrawl({
          start_url: args.start_url,
          max_pages: args.max_pages,
          follow_links: args.follow_links,
          formats: args.formats,
          country: args.country,
          parser: args.parser,
        });
        break;
      case 'create_map':
        result = await tools.createMap({
          url: args.url,
          search_query: args.search_query,
          top_n: args.top_n,
          include_urls: args.include_urls,
          exclude_urls: args.exclude_urls,
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


