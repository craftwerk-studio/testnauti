/**
 * Notion database update module
 */

import { notion } from '@/lib/notion';
import { CONFIG } from './config';
import { ExtractedData, UpdateResult } from './types';
import { NauticalSchool } from '@/types/exam';
import { logger } from '@/lib/logger';

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Merge multi-select values (keep existing + add new)
 */
function mergeMultiSelectValues(
  existing: string[],
  newValues: string[]
): string[] {
  const merged = new Set([...existing, ...newValues]);
  return Array.from(merged);
}

/**
 * Build Notion properties object for partial update
 * Only includes fields that are:
 * 1. Currently empty in the existing data
 * 2. Successfully extracted from the website
 */
function buildNotionProperties(
  existingData: NauticalSchool,
  extractedData: ExtractedData
): Record<string, any> {
  const properties: Record<string, any> = {};

  // City (select)
  if (
    (!existingData.city || existingData.city.trim() === '') &&
    extractedData.city
  ) {
    properties.City = {
      select: {
        name: extractedData.city,
      },
    };
  }

  // Region/Area (select)
  if (
    (!existingData.region || existingData.region.trim() === '') &&
    extractedData.region
  ) {
    properties.Area = {
      select: {
        name: extractedData.region,
      },
    };
  }

  // Address/Location (rich_text)
  if (
    (!existingData.address || existingData.address.trim() === '') &&
    extractedData.address
  ) {
    properties.Location = {
      rich_text: [
        {
          text: {
            content: extractedData.address,
          },
        },
      ],
    };
  }

  // Description (rich_text)
  if (
    (!existingData.description || existingData.description.trim() === '') &&
    extractedData.description
  ) {
    properties.Description = {
      rich_text: [
        {
          text: {
            content: extractedData.description,
          },
        },
      ],
    };
  }

  // Phone (phone_number)
  if (!existingData.phone && extractedData.phone) {
    properties.Phone = {
      phone_number: extractedData.phone,
    };
  }

  // Email (email)
  if (!existingData.email && extractedData.email) {
    properties.Email = {
      email: extractedData.email,
    };
  }

  // Courses/Services (multi_select) - merge with existing
  if (extractedData.courses && extractedData.courses.length > 0) {
    const existingCourses = existingData.courses || [];
    const mergedCourses = mergeMultiSelectValues(
      existingCourses,
      extractedData.courses
    );

    // Only update if we're adding new courses
    if (mergedCourses.length > existingCourses.length) {
      properties.Services = {
        multi_select: mergedCourses.map((course) => ({ name: course })),
      };
    }
  }

  // Social media links (url)
  if (!existingData.facebook && extractedData.facebook) {
    properties.Facebook = {
      url: extractedData.facebook,
    };
  }

  if (!existingData.instagram && extractedData.instagram) {
    properties.Instagram = {
      url: extractedData.instagram,
    };
  }

  if (!existingData.linkedin && extractedData.linkedin) {
    properties.LinkedIn = {
      url: extractedData.linkedin,
    };
  }

  if (!existingData.twitter && extractedData.twitter) {
    properties.Twitter = {
      url: extractedData.twitter,
    };
  }

  return properties;
}

/**
 * Update a school in Notion with retry logic
 */
async function updateWithRetry(
  pageId: string,
  properties: Record<string, any>,
  maxRetries: number = CONFIG.MAX_NOTION_RETRIES
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await notion.pages.update({
        page_id: pageId,
        properties,
      });
      return;
    } catch (error: any) {
      lastError = error;

      // Handle specific Notion errors
      if (error.code === 'validation_error') {
        logger.error('Notion validation error - invalid property value', {
          pageId,
          error: error.message,
        });
        throw new Error('VALIDATION_ERROR');
      }

      if (error.code === 'object_not_found') {
        logger.error('Notion page not found', { pageId });
        throw new Error('PAGE_NOT_FOUND');
      }

      if (error.code === 'rate_limited' || error.status === 429) {
        const delay = CONFIG.NOTION_API_DELAY_MS * Math.pow(2, attempt);
        logger.warn(`Notion API rate limited, waiting ${delay}ms`, {
          pageId,
          attempt: attempt + 1,
        });
        await sleep(delay);
        continue;
      }

      // Retry on other errors
      if (attempt < maxRetries - 1) {
        const delay = CONFIG.NOTION_API_DELAY_MS * Math.pow(2, attempt);
        logger.warn(`Retrying Notion update after ${delay}ms`, {
          pageId,
          attempt: attempt + 1,
          error: error.message,
        });
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Failed to update Notion after retries');
}

/**
 * Main function to update a school in Notion
 */
export async function updateSchoolInNotion(
  pageId: string,
  existingData: NauticalSchool,
  extractedData: ExtractedData,
  dryRun: boolean = true
): Promise<UpdateResult> {
  try {
    // Build properties object with only fields to update
    const properties = buildNotionProperties(existingData, extractedData);

    const updatedFields = Object.keys(properties);

    if (updatedFields.length === 0) {
      logger.info('No fields to update for school', {
        school: existingData.name,
      });
      return {
        success: true,
        updatedFields: [],
      };
    }

    if (dryRun) {
      logger.info('DRY RUN - Would update fields', {
        school: existingData.name,
        fields: updatedFields,
        values: properties,
      });
      return {
        success: true,
        updatedFields,
      };
    }

    // Actually update Notion
    logger.info('Updating school in Notion', {
      school: existingData.name,
      pageId,
      fields: updatedFields,
    });

    await updateWithRetry(pageId, properties);

    logger.info('Successfully updated school in Notion', {
      school: existingData.name,
      updatedFields,
    });

    return {
      success: true,
      updatedFields,
    };
  } catch (error: any) {
    logger.error(
      'Failed to update school in Notion',
      {
        school: existingData.name,
        pageId,
      },
      error
    );

    return {
      success: false,
      updatedFields: [],
      error: error.message || 'Unknown error',
    };
  }
}
