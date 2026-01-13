/**
 * Configuration constants for school enrichment script
 */

export const CONFIG = {
  // Rate limiting delays (in milliseconds)
  WEB_REQUEST_DELAY_MS: 2000, // 2 seconds between web requests
  CLAUDE_API_DELAY_MS: 1200, // 1.2 seconds between API calls (50 req/min)
  NOTION_API_DELAY_MS: 300, // 300ms between Notion updates

  // Retry settings
  MAX_WEB_RETRIES: 3,
  MAX_CLAUDE_RETRIES: 2,
  MAX_NOTION_RETRIES: 3,

  // Timeouts (in milliseconds)
  WEB_TIMEOUT_MS: 30000, // 30 seconds
  CLAUDE_TIMEOUT_MS: 60000, // 60 seconds

  // Claude API settings
  CLAUDE_MODEL: 'claude-3-haiku-20240307',
  CLAUDE_MAX_TOKENS: 1500,
  CLAUDE_TEMPERATURE: 0.0, // Deterministic extraction

  // Content limits
  MAX_HTML_LENGTH: 100000, // Truncate large pages to 100KB

  // User-Agent for web scraping
  USER_AGENT:
    'Mozilla/5.0 (compatible; TestNautiBot/1.0; +https://testnauti.co)',

  // Cost thresholds
  WARNING_COST_PER_SCHOOL: 0.5, // Warn if single school exceeds $0.50
  MAX_COST_PER_SCHOOL: 1.0, // Hard limit per school

  // Cost calculation (per million tokens)
  COST_PER_MILLION_INPUT_TOKENS: 1.0, // $1 per 1M input tokens
  COST_PER_MILLION_OUTPUT_TOKENS: 5.0, // $5 per 1M output tokens
} as const;
