const OLOSTEP_API_BASE = "https://api.olostep.com/v1";

interface OlostepResponse {
    [key: string]: unknown;
}

async function callOlostepAPI(
    endpoint: string,
    apiKey: string,
    body: Record<string, unknown>
): Promise<OlostepResponse> {
    const response = await fetch(`${OLOSTEP_API_BASE}/${endpoint}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Olostep API error ${response.status}: ${errorText}`);
    }

    return response.json();
}

// Helper to parse comma-separated strings into arrays
function parseArray(value: string | undefined): string[] | undefined {
    if (!value) return undefined;
    return value.split(',').map(s => s.trim()).filter(Boolean);
}

// Helper to parse string to number
function parseNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
}

// Helper to parse string to boolean
function parseBoolean(value: string | undefined): boolean | undefined {
    if (!value) return undefined;
    return value.toLowerCase() === 'true';
}

export async function executeOperation(
    args: Record<string, string>,
    apiKey: string
): Promise<OlostepResponse> {
    const operation = args.operation;

    switch (operation) {
        case "scrape_website": {
            const body: Record<string, unknown> = {
                url_to_scrape: args.url_to_scrape,
            };
            if (args.formats) body.formats = parseArray(args.formats);
            if (args.country) body.country = args.country;
            if (args.wait_before_scraping) body.wait_before_scraping = parseNumber(args.wait_before_scraping);
            if (args.parser) body.parser = args.parser;
            return callOlostepAPI("scrapes", apiKey, body);
        }

        case "batch_scrape": {
            const urls = parseArray(args.urls);
            if (!urls || urls.length === 0) {
                throw new Error("batch_scrape requires 'urls' parameter");
            }
            const body: Record<string, unknown> = {
                batch_array: urls.map((url, i) => ({ url, custom_id: `item_${i}` })),
            };
            if (args.formats) body.formats = parseArray(args.formats);
            if (args.country) body.country = args.country;
            if (args.wait_before_scraping) body.wait_before_scraping = parseNumber(args.wait_before_scraping);
            if (args.parser) body.parser = args.parser;
            return callOlostepAPI("batches", apiKey, body);
        }

        case "create_crawl": {
            const body: Record<string, unknown> = {
                start_url: args.start_url,
            };
            if (args.max_pages) body.max_pages = parseNumber(args.max_pages);
            if (args.follow_links) body.follow_links = parseBoolean(args.follow_links);
            if (args.formats) body.formats = parseArray(args.formats);
            if (args.country) body.country = args.country;
            if (args.parser) body.parser = args.parser;
            return callOlostepAPI("crawls", apiKey, body);
        }

        case "create_map": {
            const body: Record<string, unknown> = {
                url: args.url,
            };
            if (args.search_query) body.search_query = args.search_query;
            if (args.top_n) body.top_n = parseNumber(args.top_n);
            if (args.include_urls) body.include_urls = parseArray(args.include_urls);
            if (args.exclude_urls) body.exclude_urls = parseArray(args.exclude_urls);
            return callOlostepAPI("maps", apiKey, body);
        }

        case "ask_ai_answer": {
            const body: Record<string, unknown> = {
                task: args.task,
            };
            if (args.json) {
                try {
                    body.json_format = JSON.parse(args.json);
                } catch {
                    body.json_format = { result: "" };
                }
            }
            return callOlostepAPI("answers", apiKey, body);
        }

        default:
            throw new Error(`Unknown operation: ${operation}. Valid: scrape_website, batch_scrape, create_crawl, create_map, ask_ai_answer`);
    }
}

