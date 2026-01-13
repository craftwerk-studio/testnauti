# School Enrichment Script - Detailed Usage Guide

Comprehensive documentation for the AI-powered Notion database enrichment tool.

## Table of Contents

- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Configuration](#configuration)
- [Field Mapping](#field-mapping)
- [AI Extraction Details](#ai-extraction-details)
- [Cost Optimization](#cost-optimization)
- [Customization](#customization)
- [Error Handling](#error-handling)
- [Reports](#reports)

## Architecture

The enrichment script consists of several modular components:

```
enrich-schools-script/
├── index.ts              # Main orchestrator
├── config.ts             # Configuration constants
├── types.ts              # TypeScript types
├── scraper.ts            # Web scraping logic
├── ai-extractor.ts       # Claude AI extraction
├── notion-updater.ts     # Notion API integration
├── notion-client.ts      # Notion client setup
├── report-generator.ts   # Report generation
├── logger.ts             # Structured logging
└── run.sh                # Bash wrapper for env loading
```

### Component Responsibilities

**index.ts** (Main Orchestrator)
- Parses CLI arguments
- Fetches schools from Notion
- Filters schools needing enrichment
- Processes each school with rate limiting
- Generates final reports

**scraper.ts** (Web Scraping)
- Fetches HTML from school websites
- Extracts text content with Cheerio
- Captures footer and contact sections
- Finds social media links
- Implements retry logic with exponential backoff

**ai-extractor.ts** (AI Extraction)
- Builds system prompts for Claude
- Sends scraped content to Claude API
- Parses JSON responses
- Validates extracted data
- Tracks token usage and costs

**notion-updater.ts** (Notion Updates)
- Determines which fields to update
- Formats data for Notion API
- Handles multi-select fields (courses)
- Implements retry logic
- Validates responses

**report-generator.ts** (Reporting)
- Aggregates statistics
- Generates markdown reports
- Exports CSV data
- Calculates success rates

## How It Works

### Step-by-Step Flow

1. **Initialization**
   - Load environment variables from `.env`
   - Parse CLI arguments (`--execute`, `--limit`)
   - Connect to Notion API
   - Initialize Claude AI client

2. **Fetch Schools**
   ```typescript
   const schools = await fetchSchoolsFromNotion()
   // Returns schools with: name, website, pageId, existing fields
   ```

3. **Filter Schools**
   - Only process schools with missing fields
   - Skip schools without websites
   - Apply `--limit` if specified

4. **Process Each School** (with rate limiting)

   a. **Scrape Website**
   ```typescript
   const content = await scrapeWebsite(url)
   // Extracts: title, text, footer, contact, socialLinks
   ```

   b. **AI Extraction**
   ```typescript
   const data = await extractSchoolData(content, school)
   // Returns: { address, city, area, services, social media, etc. }
   ```

   c. **Update Notion**
   ```typescript
   await updateSchoolInNotion(pageId, data, dryRun)
   // Updates only empty fields, merges multi-select values
   ```

   d. **Track Results**
   - Success: Record updated fields, cost, duration
   - Failure: Log error message and reason
   - Skip: Count schools with no empty fields

5. **Generate Reports**
   - Create markdown report with statistics
   - Export CSV with per-school results
   - Save to timestamped files

### Rate Limiting

To avoid overwhelming servers and APIs:
- **2000ms** between website requests
- **1200ms** between Claude API calls
- Exponential backoff on failures

## Configuration

All configuration is centralized in `config.ts`:

```typescript
export const CONFIG = {
  // Rate limiting
  RATE_LIMIT_WEB_MS: 2000,
  RATE_LIMIT_CLAUDE_MS: 1200,

  // Retries
  MAX_WEB_RETRIES: 3,
  MAX_CLAUDE_RETRIES: 2,
  MAX_NOTION_RETRIES: 3,

  // Timeouts
  WEB_TIMEOUT_MS: 30000,
  CLAUDE_TIMEOUT_MS: 60000,

  // Claude settings
  CLAUDE_MODEL: 'claude-3-haiku-20240307',
  CLAUDE_MAX_TOKENS: 1500,
  CLAUDE_TEMPERATURE: 0.0,

  // Content limits
  MAX_HTML_LENGTH: 100000,

  // Cost thresholds
  WARNING_COST_PER_SCHOOL: 0.5,
  MAX_COST_PER_SCHOOL: 1.0,

  // Pricing (per million tokens)
  COST_PER_MILLION_INPUT_TOKENS: 1.0,
  COST_PER_MILLION_OUTPUT_TOKENS: 5.0,
}
```

## Field Mapping

### Notion → Script → Claude

The script maps Notion database fields to extraction targets:

| Notion Field | Script Key | Claude Output | Type |
|--------------|-----------|---------------|------|
| Address | `address` | Physical address | Rich text |
| City | `city` | City name | Select |
| Area | `area` | Comunidad Autónoma | Select |
| Location | `location` | Formatted address | Rich text |
| Description | `description` | Brief description | Rich text |
| Email | `email` | Contact email | Email |
| Services | `services` | Course array | Multi-select |
| Facebook | `facebook` | Facebook URL | URL |
| Instagram | `instagram` | Instagram URL | URL |
| LinkedIn | `linkedin` | LinkedIn URL | URL |
| Twitter | `twitter` | Twitter/X URL | URL |

### Field Types

**Rich Text**: Plain text strings
```typescript
{ type: 'text', text: { content: 'Value' } }
```

**Select**: Single-choice dropdown
```typescript
{ select: { name: 'Madrid' } }
```

**Multi-select**: Multiple-choice tags
```typescript
{ multi_select: [{ name: 'PER' }, { name: 'PNB' }] }
```

**URL**: Web links
```typescript
{ url: 'https://example.com' }
```

**Email**: Email addresses
```typescript
{ email: 'info@school.com' }
```

## AI Extraction Details

### System Prompt

The AI receives a carefully crafted system prompt:

```
You are a data extraction specialist for Spanish nautical schools.

Your task is to extract structured information from school website content.
Look CAREFULLY throughout ALL the content including footer, contact sections,
and social links.

Extract ONLY the following fields if they are present:
- address: Physical address - Look in footer, contact, "dónde estamos", "ubicación"
- city: City name - May be in address, meta tags, or content
- area: Comunidad Autónoma (region) - Andalucía, Cataluña, Madrid, etc.
- location: Full formatted address for Google Maps
- description: Brief school description (1-2 sentences)
- email: Contact email address
- courses: ALL nautical courses found as array - PER, PNB, PY, CY, Titulín, etc.
- facebook: Facebook URL from links
- instagram: Instagram URL from links
- linkedin: LinkedIn URL from links
- twitter: Twitter/X URL from links

IMPORTANT RULES:
1. Return ONLY valid JSON with exact field names above
2. If field not found, use null
3. Extract ALL courses found as array
4. URLs must start with http:// or https://
5. Look thoroughly in footer and contact sections
6. Parse social media links carefully
7. For courses, include variations: "Patrón de Embarcaciones de Recreo" → "PER"
```

### Input Format

Claude receives:
```json
{
  "school_name": "Example Nautical School",
  "website": "https://example.com",
  "page_title": "Example School - Home",
  "content": "...[HTML text content]...",
  "footer": "...[Footer text]...",
  "contact": "...[Contact section]...",
  "social_links": ["https://facebook.com/...", "https://instagram.com/..."]
}
```

### Output Format

Claude returns:
```json
{
  "address": "Calle Marina 123",
  "city": "Barcelona",
  "area": "Cataluña",
  "location": "Calle Marina 123, 08001 Barcelona",
  "description": "Escuela náutica con 20 años de experiencia...",
  "email": "info@example.com",
  "courses": ["PER", "PNB", "Patrón de Yate", "Capitán de Yate"],
  "facebook": "https://facebook.com/example",
  "instagram": "https://instagram.com/example",
  "linkedin": null,
  "twitter": null
}
```

### Prompt Caching

The system prompt is cached to reduce costs:
- First request: ~1,200 tokens (input)
- Cached requests: ~120 tokens (input) - **90% savings**
- Average savings: ~$0.001 per school

## Cost Optimization

### Token Usage

Typical token consumption per school:
- **Input tokens**: 1,000-5,000 (content + prompt)
  - System prompt: 1,200 tokens (cached after first use)
  - Website content: 500-4,000 tokens
- **Output tokens**: 150-400 (extracted JSON)

### Cost Calculation

```typescript
const inputCost = (inputTokens / 1_000_000) * 1.0   // $1 per 1M
const outputCost = (outputTokens / 1_000_000) * 5.0 // $5 per 1M
const totalCost = inputCost + outputCost
```

### Optimization Strategies

1. **Use Haiku instead of Sonnet** - 20x cheaper, similar accuracy for extraction
2. **Enable prompt caching** - 90% reduction in repeated prompt costs
3. **Truncate large pages** - Limit to 100KB of content
4. **Skip unnecessary requests** - Only process schools with empty fields
5. **Batch processing** - Process multiple schools in one session for cache benefits

### Cost Comparison

| Model | Per School | 100 Schools | 137 Schools |
|-------|-----------|-------------|-------------|
| Claude Opus 4 | $0.05 | $5.00 | $6.85 |
| Claude Sonnet 3.5 | $0.015 | $1.50 | $2.06 |
| **Claude Haiku 3** | **$0.004** | **$0.40** | **$0.55** |

## Customization

### Adding New Fields

1. **Update Notion database** - Add the property
2. **Update types.ts** - Add to `ExtractedData` interface
3. **Update AI prompt** - Add field to system prompt in `ai-extractor.ts`
4. **Update field mapping** - Add to `buildNotionProperties()` in `notion-updater.ts`

Example: Adding "Phone" field:

```typescript
// types.ts
export interface ExtractedData {
  // ... existing fields
  phone?: string | null;
}

// ai-extractor.ts (system prompt)
- phone: Phone number - Look for "teléfono", "tel:", "llamar"

// notion-updater.ts
if (data.phone && isEmpty.phone) {
  properties.Phone = {
    phone_number: data.phone
  };
}
```

### Modifying AI Behavior

Edit `buildSystemPrompt()` in `ai-extractor.ts`:

```typescript
// More detailed extraction
return `You are an expert at extracting data...
IMPORTANT: Look very carefully for social media links...`

// Stricter validation
return `...
VALIDATION RULES:
- Addresses must include street number
- Courses must be official Spanish nautical titles
- Social media URLs must be complete (not just usernames)`

// Different format
return `...
Return data in this exact JSON structure:
{
  "contact": { "email": "...", "phone": "..." },
  "location": { "city": "...", "address": "..." },
  ...
}`
```

### Changing Models

In `config.ts`:

```typescript
// Use Sonnet for better accuracy (20x more expensive)
CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',

// Use Opus for highest quality (100x more expensive)
CLAUDE_MODEL: 'claude-opus-4-5-20251101',

// Increase output tokens for longer descriptions
CLAUDE_MAX_TOKENS: 2000,

// Make extraction less deterministic
CLAUDE_TEMPERATURE: 0.3,
```

## Error Handling

### Web Scraping Errors

**404 Not Found**
```
Error: Page not found (404)
Reason: Website is offline or URL is incorrect
Action: Mark as failed, needs manual review
```

**403 Forbidden**
```
Error: Access forbidden (403)
Reason: Firewall blocking automated requests
Action: Mark as failed, try manual browser check
```

**Fetch Failed**
```
Error: fetch failed
Reason: DNS failure, timeout, or connection refused
Action: Retry with exponential backoff (up to 3 times)
```

### AI Extraction Errors

**Invalid JSON**
```
Error: Failed to parse Claude response
Reason: AI returned malformed JSON
Action: Log raw response, mark as failed
```

**Empty Response**
```
Error: No data extracted
Reason: Website content insufficient or in wrong language
Action: Skip school, log for manual review
```

### Notion Update Errors

**Validation Error**
```
Error: Invalid select option, commas not allowed
Reason: Multi-select value contains commas
Example: "PER, PNB, PY" → Should be array ["PER", "PNB", "PY"]
Action: Log validation error, skip field
```

**Rate Limit**
```
Error: Rate limited by Notion API
Reason: Too many requests per second
Action: Retry with exponential backoff
```

## Reports

### Markdown Report

Generated as `enrich-schools-report-YYYY-MM-DD.md`:

**Sections:**
1. **Summary** - Total, successful, failed, skipped, success rate
2. **Cost Analysis** - API calls, tokens, estimated cost, avg time
3. **Updated Fields Distribution** - Which fields were updated most
4. **Successful Updates** - Per-school breakdown with cost and duration
5. **Failures** - Schools that failed with error messages
6. **Skipped Schools** - Schools with no empty fields
7. **Recommendations** - Actions needed (manual review, fixes)

### CSV Export

Generated as `enrich-schools-results-YYYY-MM-DD.csv`:

**Columns:**
- School Name
- Status (success/failed/skipped)
- Fields Updated (comma-separated)
- Error (if failed)
- Cost (USD)
- Duration (seconds)
- Website URL

**Usage:**
- Import to Google Sheets / Excel for analysis
- Filter by status to find failures
- Sort by cost to find expensive schools
- Track which fields are most commonly missing

### Example Report

```markdown
# School Enrichment Report

**Generated:** 2026-01-12T22:42:31Z
**Mode:** EXECUTE (Live Update)
**Schools Processed:** 137

## Summary

| Metric | Value |
|--------|-------|
| Total Processed | 137 |
| Successful | 102 |
| Failed | 17 |
| Skipped | 18 |
| Success Rate | 74.5% |

## Cost Analysis

| Metric | Value |
|--------|-------|
| Total API Calls | 137 |
| Total Tokens (Input) | 342,567 |
| Total Tokens (Output) | 41,823 |
| Estimated Cost | $0.59 |
| Average Time/School | 6.3s |

## Updated Fields Distribution

| Field | Schools Updated |
|-------|----------------|
| Services | 102 |
| Description | 98 |
| City | 82 |
| Area | 82 |
| Location | 82 |
| Facebook | 72 |
| Instagram | 58 |
| Email | 23 |
| LinkedIn | 15 |
| Twitter | 12 |
```

## Advanced Scenarios

### Processing Specific Schools

Edit index.ts to filter by specific criteria:

```typescript
// Only schools in Madrid
const filteredSchools = schools.filter(s =>
  s.city === 'Madrid'
);

// Only schools without social media
const filteredSchools = schools.filter(s =>
  !s.facebook && !s.instagram
);

// Specific school by name
const filteredSchools = schools.filter(s =>
  s.name.includes('Náutica Barcelona')
);
```

### Monitoring Progress

The script logs structured JSON for monitoring:

```json
{
  "level": "info",
  "timestamp": "2026-01-12T22:30:15.000Z",
  "message": "Successfully updated school in Notion",
  "school": "Example School",
  "updatedFields": ["City", "Services", "Facebook"],
  "cost": 0.004,
  "duration": "5.2s"
}
```

Pipe to analysis tools:
```bash
npm run execute | jq 'select(.level == "error")'
```

### Resuming After Failure

The script processes schools sequentially. If interrupted:

1. Check the last entry in the log
2. Note which school was being processed
3. Use `--limit` to skip already-processed schools manually

Future enhancement: Add `--resume-from` flag to automatically skip completed schools.

---

For questions or issues, refer to the main SKILL.md or check the generated reports for specific error details.
