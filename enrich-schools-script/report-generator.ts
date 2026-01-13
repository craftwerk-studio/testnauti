/**
 * Report generation module for school enrichment results
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { ProcessResult, ScriptConfig } from './types';
import { logger } from './logger';

/**
 * Generate summary statistics from results
 */
function generateStats(results: ProcessResult[]) {
  const total = results.length;
  const successful = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failure').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  const totalTokensUsed = results.reduce(
    (acc, r) => {
      if (r.tokensUsed) {
        acc.input += r.tokensUsed.input;
        acc.output += r.tokensUsed.output;
      }
      return acc;
    },
    { input: 0, output: 0 }
  );

  const totalCost = results.reduce((acc, r) => acc + (r.cost || 0), 0);

  const avgTimePerSchool =
    results.length > 0
      ? results.reduce(
          (acc, r) =>
            acc + r.scrapeDurationMs + r.extractionDurationMs + r.updateDurationMs,
          0
        ) / results.length
      : 0;

  // Count updated fields distribution
  const fieldDistribution: Record<string, number> = {};
  results.forEach((r) => {
    r.updatedFields.forEach((field) => {
      fieldDistribution[field] = (fieldDistribution[field] || 0) + 1;
    });
  });

  return {
    total,
    successful,
    failed,
    skipped,
    successRate: total > 0 ? (successful / total) * 100 : 0,
    totalTokensUsed,
    totalCost,
    avgTimePerSchool,
    fieldDistribution,
  };
}

/**
 * Generate Markdown report
 */
function generateMarkdownReport(
  results: ProcessResult[],
  config: ScriptConfig
): string {
  const stats = generateStats(results);
  const timestamp = new Date().toISOString();

  let markdown = `# School Enrichment Report

**Generated:** ${timestamp}
**Mode:** ${config.dryRun ? 'DRY RUN (Preview)' : 'EXECUTE (Live Update)'}
**Schools Processed:** ${stats.total}

## Summary

| Metric | Value |
|--------|-------|
| Total Processed | ${stats.total} |
| Successful | ${stats.successful} |
| Failed | ${stats.failed} |
| Skipped | ${stats.skipped} |
| Success Rate | ${stats.successRate.toFixed(1)}% |

## Cost Analysis

| Metric | Value |
|--------|-------|
| Total API Calls | ${stats.successful + stats.failed} |
| Total Tokens (Input) | ${stats.totalTokensUsed.input.toLocaleString()} |
| Total Tokens (Output) | ${stats.totalTokensUsed.output.toLocaleString()} |
| Estimated Cost | $${stats.totalCost.toFixed(2)} |
| Average Time/School | ${(stats.avgTimePerSchool / 1000).toFixed(1)}s |

## Updated Fields Distribution

`;

  const sortedFields = Object.entries(stats.fieldDistribution).sort(
    (a, b) => b[1] - a[1]
  );

  if (sortedFields.length > 0) {
    markdown += '| Field | Schools Updated |\n';
    markdown += '|-------|----------------|\n';
    sortedFields.forEach(([field, count]) => {
      markdown += `| ${field} | ${count} |\n`;
    });
  } else {
    markdown += '_No fields were updated._\n';
  }

  markdown += '\n## Successful Updates\n\n';

  const successfulResults = results.filter((r) => r.status === 'success');
  if (successfulResults.length > 0) {
    markdown += '| School Name | Fields Updated | Cost | Duration |\n';
    markdown += '|-------------|----------------|------|----------|\n';
    successfulResults.forEach((r) => {
      const totalDuration =
        (r.scrapeDurationMs + r.extractionDurationMs + r.updateDurationMs) / 1000;
      markdown += `| ${r.school.name} | ${r.updatedFields.join(', ') || 'none'} | $${(r.cost || 0).toFixed(3)} | ${totalDuration.toFixed(1)}s |\n`;
    });
  } else {
    markdown += '_No successful updates._\n';
  }

  markdown += '\n## Failures\n\n';

  const failedResults = results.filter((r) => r.status === 'failure');
  if (failedResults.length > 0) {
    markdown += '| School Name | Error | Website |\n';
    markdown += '|-------------|-------|----------|\n';
    failedResults.forEach((r) => {
      markdown += `| ${r.school.name} | ${r.error || 'Unknown error'} | ${r.school.website || 'N/A'} |\n`;
    });
  } else {
    markdown += '_No failures._\n';
  }

  markdown += '\n## Skipped Schools\n\n';

  const skippedResults = results.filter((r) => r.status === 'skipped');
  if (skippedResults.length > 0) {
    markdown += '| School Name | Reason |\n';
    markdown += '|-------------|--------|\n';
    skippedResults.forEach((r) => {
      markdown += `| ${r.school.name} | ${r.error || 'No website URL'} |\n`;
    });
  } else {
    markdown += '_No schools were skipped._\n';
  }

  markdown += '\n## Recommendations\n\n';

  if (config.dryRun) {
    markdown += `- This was a dry run. Review the results above.\n`;
    markdown += `- If satisfied, run with \`--execute\` flag to apply changes:\n`;
    markdown += `  \`\`\`\n  npm run enrich-schools -- --execute${config.limit ? ` --limit ${config.limit}` : ''}\n  \`\`\`\n`;
  }

  if (failedResults.length > 0) {
    markdown += `- ${failedResults.length} schools need manual review (see failures above)\n`;
  }

  const browserNeeded = failedResults.filter((r) =>
    r.error?.toLowerCase().includes('empty')
  );
  if (browserNeeded.length > 0) {
    markdown += `- ${browserNeeded.length} websites may require JavaScript rendering (try --use-browser)\n`;
  }

  return markdown;
}

/**
 * Generate CSV export
 */
function generateCsvExport(results: ProcessResult[]): string {
  let csv =
    'school_id,school_name,status,fields_updated,error,cost,duration_ms,website\n';

  results.forEach((r) => {
    const totalDuration =
      r.scrapeDurationMs + r.extractionDurationMs + r.updateDurationMs;
    const fieldsUpdated = r.updatedFields.join(';');
    const error = (r.error || '').replace(/,/g, ';');

    csv += `"${r.school.id}","${r.school.name}","${r.status}","${fieldsUpdated}","${error}",${r.cost || 0},${totalDuration},"${r.school.website || ''}"\n`;
  });

  return csv;
}

/**
 * Generate and save reports
 */
export async function generateReport(
  results: ProcessResult[],
  config: ScriptConfig
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const baseDir = process.cwd();

  // Generate Markdown report
  const markdown = generateMarkdownReport(results, config);
  const markdownPath = join(
    baseDir,
    `enrich-schools-report-${timestamp}.md`
  );
  writeFileSync(markdownPath, markdown, 'utf-8');
  logger.info(`Markdown report saved to: ${markdownPath}`);

  // Generate CSV export
  const csv = generateCsvExport(results);
  const csvPath = join(baseDir, `enrich-schools-results-${timestamp}.csv`);
  writeFileSync(csvPath, csv, 'utf-8');
  logger.info(`CSV export saved to: ${csvPath}`);

  // Print summary to console
  const stats = generateStats(results);
  console.log('\n' + '━'.repeat(50));
  console.log('ENRICHMENT COMPLETE');
  console.log('━'.repeat(50));
  console.log(`\nTotal schools: ${stats.total}`);
  console.log(`✅ Successful: ${stats.successful}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`\n💰 Total cost: $${stats.totalCost.toFixed(2)}`);
  console.log(`⏱️  Avg time/school: ${(stats.avgTimePerSchool / 1000).toFixed(1)}s`);
  console.log(`\n📄 Reports saved:`);
  console.log(`  - ${markdownPath}`);
  console.log(`  - ${csvPath}`);
  console.log('━'.repeat(50) + '\n');
}

/**
 * Generate partial report (for graceful shutdown)
 */
export async function generatePartialReport(
  results: ProcessResult[],
  config: ScriptConfig
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseDir = process.cwd();

  const markdown = generateMarkdownReport(results, config);
  const markdownPath = join(
    baseDir,
    `enrich-schools-report-PARTIAL-${timestamp}.md`
  );
  writeFileSync(markdownPath, markdown, 'utf-8');

  logger.info(`Partial report saved to: ${markdownPath}`);
}
