export { scrapeWebsite } from './tools/scrapeWebsite.js';
export { batchScrape } from './tools/batchScrape.js';
export { createCrawl } from './tools/createCrawl.js';
export { createMap } from './tools/createMap.js';
export { askAnswer } from './tools/askAnswer.js';
export { handler } from './handler.js';

export function createOlostepTools(defaults = {}) {
  const baseOptions = {
    apiKey: defaults.apiKey,
    baseUrl: defaults.baseUrl,
  };

  return {
    scrapeWebsite: (params) => import('./tools/scrapeWebsite.js').then(m => m.scrapeWebsite({ ...baseOptions, ...params })),
    batchScrape: (params) => import('./tools/batchScrape.js').then(m => m.batchScrape({ ...baseOptions, ...params })),
    createCrawl: (params) => import('./tools/createCrawl.js').then(m => m.createCrawl({ ...baseOptions, ...params })),
    createMap: (params) => import('./tools/createMap.js').then(m => m.createMap({ ...baseOptions, ...params })),
    askAnswer: (params) => import('./tools/askAnswer.js').then(m => m.askAnswer({ ...baseOptions, ...params })),
  };
}


