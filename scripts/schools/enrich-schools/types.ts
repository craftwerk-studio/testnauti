/**
 * Type definitions for school enrichment script
 */

import { NauticalSchool } from './exam-types';

/**
 * Script configuration from CLI arguments
 */
export interface ScriptConfig {
  dryRun: boolean;
  execute: boolean;
  limit?: number;
  schoolId?: string;
  useBrowser: boolean;
  anthropicApiKey: string;
  notionToken: string;
  notionDatabaseId: string;
}

/**
 * Scraped website content
 */
export interface ScrapedContent {
  html: string;
  text: string;
  title: string;
  metaDescription?: string;
  structuredData?: any;
  error?: string;
}

/**
 * Extracted school data from AI
 */
export interface ExtractedData {
  address?: string;
  city?: string;
  province?: string;
  region?: string;
  description?: string;
  courses?: string[];
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

/**
 * Processing result for a single school
 */
export interface ProcessResult {
  school: NauticalSchool;
  notionPageId: string;
  status: 'success' | 'failure' | 'skipped';
  updatedFields: string[];
  error?: string;
  scrapeDurationMs: number;
  extractionDurationMs: number;
  updateDurationMs: number;
  tokensUsed?: {
    input: number;
    output: number;
  };
  cost?: number;
}

/**
 * Failure reasons enum
 */
export enum FailureReason {
  NO_WEBSITE = 'no_website',
  SCRAPE_FAILED = 'scrape_failed',
  EXTRACTION_FAILED = 'extraction_failed',
  NOTION_UPDATE_FAILED = 'notion_update_failed',
  RATE_LIMIT = 'rate_limit',
}

/**
 * Update result from Notion
 */
export interface UpdateResult {
  success: boolean;
  updatedFields: string[];
  error?: string;
}

/**
 * Extended school type with Notion page ID
 */
export interface SchoolWithPageId extends NauticalSchool {
  notionPageId: string;
}
