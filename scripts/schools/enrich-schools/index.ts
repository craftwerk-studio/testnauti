#!/usr/bin/env tsx
/**
 * Main orchestrator for school enrichment script
 *
 * Usage:
 *   npm run enrich-schools                    # Dry run (default)
 *   npm run enrich-schools -- --execute       # Actually update Notion
 *   npm run enrich-schools -- --limit 10      # Test on 10 schools
 *   npm run enrich-schools -- --school-id ID  # Single school
 */

// IMPORTANT: Load environment variables BEFORE any imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

// Now import other modules
import { notion, ESCUELAS_DB_ID } from './notion-client';
import { logger } from './logger';
import { scrapeWebsite } from './scraper';
import { extractSchoolData } from './ai-extractor';
import { updateSchoolInNotion } from './notion-updater';
import { generateReport, generatePartialReport } from './report-generator';
import { CONFIG } from './config';
import { ProcessResult, ScriptConfig, SchoolWithPageId } from './types';
import { NauticalSchool } from './exam-types';

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse CLI arguments
 */
function parseCliArgs(): ScriptConfig {
  const args = process.argv.slice(2);

  const dryRun = !args.includes('--execute');
  const execute = args.includes('--execute');
  const useBrowser = args.includes('--use-browser');

  let limit: number | undefined;
  const limitIndex = args.indexOf('--limit');
  if (limitIndex !== -1 && args[limitIndex + 1]) {
    limit = parseInt(args[limitIndex + 1], 10);
  }

  let schoolId: string | undefined;
  const schoolIdIndex = args.indexOf('--school-id');
  if (schoolIdIndex !== -1 && args[schoolIdIndex + 1]) {
    schoolId = args[schoolIdIndex + 1];
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY not found in environment variables. Please add it to .env.local'
    );
  }

  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    throw new Error(
      'NOTION_TOKEN not found in environment variables. Please add it to .env.local'
    );
  }

  const notionDatabaseId = ESCUELAS_DB_ID;
  if (!notionDatabaseId) {
    throw new Error(
      'NOTION_ESCUELAS_DB_ID not found in environment variables. Please add it to .env.local'
    );
  }

  return {
    dryRun,
    execute,
    limit,
    schoolId,
    useBrowser,
    anthropicApiKey,
    notionToken,
    notionDatabaseId,
  };
}

/**
 * Fetch schools from Notion with page IDs
 */
async function fetchSchoolsFromNotion(): Promise<SchoolWithPageId[]> {
  const schools: SchoolWithPageId[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  logger.info('Fetching schools from Notion...');

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: ESCUELAS_DB_ID,
      start_cursor: startCursor,
      sorts: [
        {
          property: 'Title',
          direction: 'ascending',
        },
      ],
      page_size: 100,
    });

    for (const page of response.results) {
      const school = mapNotionPageToSchool(page);
      if (school) {
        schools.push(school);
      }
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;

    if (hasMore) {
      await sleep(300);
    }
  }

  logger.info(`Fetched ${schools.length} schools from Notion`);
  return schools;
}

/**
 * Map Notion page to SchoolWithPageId
 */
function mapNotionPageToSchool(page: any): SchoolWithPageId | null {
  try {
    const props = page.properties;

    const id = props.ID?.rich_text?.[0]?.plain_text || '';
    const name = props.Title?.title?.[0]?.plain_text || '';
    const city = props.City?.select?.name || '';
    const region = props.Area?.select?.name || '';
    const address = props.Location?.rich_text?.[0]?.plain_text || '';
    const phone = props.Phone?.phone_number || undefined;
    const email = props.Email?.email || undefined;
    const website = props.Website?.url || undefined;
    const description = props.Description?.rich_text?.[0]?.plain_text || '';
    const featured = props.Featured?.checkbox || false;
    const courses = props.Services?.multi_select?.map((s: any) => s.name) || [];

    let image: string | undefined = undefined;
    if (props['Featured Picture']?.files?.[0]) {
      image =
        props['Featured Picture'].files[0].file?.url ||
        props['Featured Picture'].files[0].external?.url;
    }

    const facebook = props.Facebook?.url || undefined;
    const instagram = props.Instagram?.url || undefined;
    const linkedin = props.LinkedIn?.url || undefined;
    const twitter = props.Twitter?.url || undefined;

    if (!id || !name) {
      return null;
    }

    // Derive province from city (simplified mapping)
    const province = city || '';

    return {
      id,
      name,
      city: city || '',
      province,
      region: region || '',
      address: address || '',
      phone,
      email,
      website,
      courses: courses.length > 0 ? courses : [],
      description: description || '',
      featured,
      image,
      facebook,
      instagram,
      linkedin,
      twitter,
      notionPageId: page.id,
    };
  } catch (error) {
    logger.error('Error mapping Notion page to school:', {}, error as Error);
    return null;
  }
}

/**
 * Process a single school
 */
async function processSchool(
  school: SchoolWithPageId,
  config: ScriptConfig
): Promise<ProcessResult> {
  const startTime = Date.now();

  // Check if school has website
  if (!school.website) {
    return {
      school,
      notionPageId: school.notionPageId,
      status: 'skipped',
      updatedFields: [],
      error: 'No website URL',
      scrapeDurationMs: 0,
      extractionDurationMs: 0,
      updateDurationMs: 0,
    };
  }

  // Scrape website
  logger.info(`[${school.name}] Scraping website...`, { url: school.website });
  const scrapeStart = Date.now();
  const content = await scrapeWebsite(school.website, config.useBrowser);
  const scrapeDurationMs = Date.now() - scrapeStart;

  if (content.error) {
    return {
      school,
      notionPageId: school.notionPageId,
      status: 'failure',
      updatedFields: [],
      error: `Scrape failed: ${content.error}`,
      scrapeDurationMs,
      extractionDurationMs: 0,
      updateDurationMs: 0,
    };
  }

  // Extract data with Claude
  logger.info(`[${school.name}] Extracting data with Claude...`);
  const extractStart = Date.now();
  let extractionResult;
  try {
    extractionResult = await extractSchoolData(
      school,
      content,
      config.anthropicApiKey
    );
  } catch (error: any) {
    const extractionDurationMs = Date.now() - extractStart;
    return {
      school,
      notionPageId: school.notionPageId,
      status: 'failure',
      updatedFields: [],
      error: `Extraction failed: ${error.message}`,
      scrapeDurationMs,
      extractionDurationMs,
      updateDurationMs: 0,
    };
  }
  const extractionDurationMs = Date.now() - extractStart;

  if (!extractionResult.data) {
    return {
      school,
      notionPageId: school.notionPageId,
      status: 'failure',
      updatedFields: [],
      error: 'Extraction returned no data',
      scrapeDurationMs,
      extractionDurationMs,
      updateDurationMs: 0,
      tokensUsed: extractionResult.tokensUsed,
      cost: extractionResult.cost,
    };
  }

  // Update Notion
  logger.info(`[${school.name}] Updating Notion...`);
  const updateStart = Date.now();
  const updateResult = await updateSchoolInNotion(
    school.notionPageId,
    school,
    extractionResult.data,
    config.dryRun
  );
  const updateDurationMs = Date.now() - updateStart;

  const totalDuration = Date.now() - startTime;

  if (!updateResult.success) {
    return {
      school,
      notionPageId: school.notionPageId,
      status: 'failure',
      updatedFields: [],
      error: `Notion update failed: ${updateResult.error}`,
      scrapeDurationMs,
      extractionDurationMs,
      updateDurationMs,
      tokensUsed: extractionResult.tokensUsed,
      cost: extractionResult.cost,
    };
  }

  const status = updateResult.updatedFields.length > 0 ? 'success' : 'skipped';
  const successMsg =
    status === 'success'
      ? `✅ Updated fields: ${updateResult.updatedFields.join(', ')}`
      : '⏭️  No fields to update';

  logger.info(`[${school.name}] ${successMsg}`, {
    duration: `${(totalDuration / 1000).toFixed(1)}s`,
    cost: `$${(extractionResult.cost || 0).toFixed(3)}`,
  });

  return {
    school,
    notionPageId: school.notionPageId,
    status,
    updatedFields: updateResult.updatedFields,
    scrapeDurationMs,
    extractionDurationMs,
    updateDurationMs,
    tokensUsed: extractionResult.tokensUsed,
    cost: extractionResult.cost,
  };
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 TestNauti School Enrichment Script');
  console.log('━'.repeat(50));

  try {
    // Parse arguments
    const config = parseCliArgs();

    console.log(`\nMode: ${config.dryRun ? 'DRY RUN (Preview)' : 'EXECUTE (Live Update)'}`);
    console.log(`Anthropic Model: ${CONFIG.CLAUDE_MODEL}`);
    if (config.limit) {
      console.log(`Limit: ${config.limit} schools`);
    }
    if (config.schoolId) {
      console.log(`Target School ID: ${config.schoolId}`);
    }

    // Fetch schools from Notion
    const allSchools = await fetchSchoolsFromNotion();

    // Filter schools that need enrichment
    let needsEnrichment = allSchools.filter(
      (s) =>
        !s.city ||
        !s.region ||
        !s.description ||
        !s.address ||
        s.courses.length === 0 ||
        !s.phone ||
        !s.email
    );

    // Filter by school ID if specified
    if (config.schoolId) {
      needsEnrichment = needsEnrichment.filter((s) => s.id === config.schoolId);
      if (needsEnrichment.length === 0) {
        console.log(`\n❌ School with ID '${config.schoolId}' not found or doesn't need enrichment`);
        return;
      }
    }

    console.log(`\n📊 Found ${needsEnrichment.length} schools needing enrichment`);

    // Apply limit
    const schoolsToProcess = config.limit
      ? needsEnrichment.slice(0, config.limit)
      : needsEnrichment;

    if (schoolsToProcess.length === 0) {
      console.log('\n✨ No schools need enrichment. All done!');
      return;
    }

    console.log(`\nProcessing ${schoolsToProcess.length} schools...`);
    console.log('━'.repeat(50) + '\n');

    // Process schools
    const results: ProcessResult[] = [];
    let processedCount = 0;

    for (const school of schoolsToProcess) {
      processedCount++;
      console.log(`[${processedCount}/${schoolsToProcess.length}] ${school.name}`);

      const result = await processSchool(school, config);
      results.push(result);

      // Rate limiting
      if (processedCount < schoolsToProcess.length) {
        await sleep(CONFIG.WEB_REQUEST_DELAY_MS);
      }
    }

    // Generate report
    console.log('\n' + '━'.repeat(50));
    console.log('Generating reports...');
    await generateReport(results, config);
  } catch (error) {
    logger.error('Fatal error in main script', {}, error as Error);
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Graceful shutdown handler
let isShuttingDown = false;
const results: ProcessResult[] = [];

process.on('SIGINT', async () => {
  if (isShuttingDown) {
    console.log('\n\nForce quitting...');
    process.exit(1);
  }

  isShuttingDown = true;
  console.log('\n\n⚠️  Shutting down gracefully... (Press Ctrl+C again to force quit)');

  if (results.length > 0) {
    console.log('Generating partial report...');
    const config = parseCliArgs();
    await generatePartialReport(results, config);
  }

  process.exit(0);
});

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
