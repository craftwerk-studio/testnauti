/**
 * AI-powered data extraction using Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from './config';
import { ExtractedData, ScrapedContent } from './types';
import { NauticalSchool } from './exam-types';
import { logger } from './logger';

/**
 * Initialize Anthropic client
 */
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(apiKey: string): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey,
    });
  }
  return anthropicClient;
}

/**
 * Build system prompt (cached for cost savings)
 */
function buildSystemPrompt(): string {
  return `You are a data extraction specialist for Spanish nautical schools (escuelas náuticas).

Your task is to extract structured information from school website content. Look CAREFULLY throughout ALL the content including footer, contact sections, and social links.

Extract ONLY the following fields if they are present:
- address: Physical address (street, number, city, postal code) - Look in footer, contact, "dónde estamos", "ubicación"
- city: City name - May be in address, meta tags, or content
- province: Province name - Usually part of address
- region: Autonomous community - "Comunidad de Madrid", "Cataluña", "Andalucía", "Comunidad Valenciana"
- description: Brief description (1-3 sentences, Spanish) - Use "Sobre nosotros", "Quiénes somos"
- courses: ALL nautical courses found - PER, PNB, Patrón de Yate, Capitán de Yate, Licencia de Navegación, Patrón Costero Polivalente
- phone: Phone number - Look in footer, contact, "teléfono"
- email: Email address - Look in footer, contact, "email"
- facebook: Facebook URL - Extract from "Social links:" or facebook.com URLs
- instagram: Instagram URL - Extract from "Social links:" or instagram.com URLs
- linkedin: LinkedIn URL - Extract from "Social links:" or linkedin.com URLs
- twitter: Twitter/X URL - Extract from "Social links:" or twitter.com/x.com URLs

IMPORTANT RULES:
1. Return ONLY valid JSON with exact field names
2. If not found, use null
3. Extract ALL courses found as array
4. URLs must start with http:// or https://
5. Look in footer and contact sections
6. Parse "Social links:" section carefully
7. Only extract what is clearly stated

Example:
{
  "address": "Calle Marina 123, 28001 Madrid",
  "city": "Madrid",
  "province": "Madrid",
  "region": "Comunidad de Madrid",
  "description": "Escuela náutica con más de 20 años de experiencia.",
  "courses": ["PER", "PNB", "Patrón de Yate"],
  "phone": "+34 91 123 4567",
  "email": "info@escuela.com",
  "facebook": "https://www.facebook.com/escuela",
  "instagram": "https://www.instagram.com/escuela",
  "linkedin": null,
  "twitter": null
}`;
}

/**
 * Build user prompt for a specific school
 */
function buildUserPrompt(
  school: NauticalSchool,
  content: ScrapedContent
): string {
  const existingFields = [];
  if (school.city) existingFields.push(`city: ${school.city}`);
  if (school.region) existingFields.push(`region: ${school.region}`);
  if (school.address) existingFields.push(`address: ${school.address}`);
  if (school.description)
    existingFields.push(`description: ${school.description}`);

  const existingFieldsText =
    existingFields.length > 0
      ? `\n\nExisting data (do not extract these unless better info found):\n${existingFields.join('\n')}`
      : '';

  return `School name: ${school.name}
Website URL: ${school.website}${existingFieldsText}

Page title: ${content.title}
${content.metaDescription ? `Meta description: ${content.metaDescription}\n` : ''}

Website content:
${content.text.substring(0, 50000)}

Extract the missing fields and return valid JSON.`;
}

/**
 * Validate extracted data structure
 */
function validateExtractedData(data: any): ExtractedData {
  const validated: ExtractedData = {};

  // Validate string fields
  const stringFields = [
    'address',
    'city',
    'province',
    'region',
    'description',
    'phone',
    'email',
    'facebook',
    'instagram',
    'linkedin',
    'twitter',
  ];

  for (const field of stringFields) {
    if (data[field] && typeof data[field] === 'string') {
      const value = data[field].trim();
      if (value.length > 0 && value !== 'null' && value !== 'N/A') {
        validated[field as keyof ExtractedData] = value;
      }
    }
  }

  // Validate courses array
  if (Array.isArray(data.courses)) {
    const courses = data.courses
      .filter((c: any) => typeof c === 'string' && c.trim().length > 0)
      .map((c: string) => c.trim());
    if (courses.length > 0) {
      validated.courses = courses;
    }
  }

  return validated;
}

/**
 * Calculate cost for API call
 */
function calculateCost(usage: {
  input_tokens: number;
  output_tokens: number;
}): number {
  const inputCost =
    (usage.input_tokens / 1_000_000) * CONFIG.COST_PER_MILLION_INPUT_TOKENS;
  const outputCost =
    (usage.output_tokens / 1_000_000) * CONFIG.COST_PER_MILLION_OUTPUT_TOKENS;
  return inputCost + outputCost;
}

/**
 * Extract school data using Claude API
 */
export async function extractSchoolData(
  school: NauticalSchool,
  content: ScrapedContent,
  apiKey: string
): Promise<{
  data: ExtractedData | null;
  tokensUsed?: { input: number; output: number };
  cost?: number;
}> {
  try {
    const client = getAnthropicClient(apiKey);

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(school, content);

    logger.debug('Calling Claude API for extraction', {
      school: school.name,
      contentLength: content.text.length,
    });

    const response = await client.messages.create({
      model: CONFIG.CLAUDE_MODEL,
      max_tokens: CONFIG.CLAUDE_MAX_TOKENS,
      temperature: CONFIG.CLAUDE_TEMPERATURE,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      logger.error('No text content in Claude response', { school: school.name });
      return { data: null };
    }

    // Parse JSON response
    let extractedData: any;
    try {
      // Remove markdown code blocks if present
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      extractedData = JSON.parse(jsonText);
    } catch (parseError) {
      logger.error('Failed to parse JSON from Claude', {
        school: school.name,
        response: textContent.text,
      });
      return { data: null };
    }

    // Validate and clean data
    const validatedData = validateExtractedData(extractedData);

    // Calculate usage and cost
    const usage = response.usage;
    const tokensUsed = {
      input: usage.input_tokens,
      output: usage.output_tokens,
    };
    const cost = calculateCost(usage);

    // Warn if cost is high
    if (cost > CONFIG.WARNING_COST_PER_SCHOOL) {
      logger.warn('High cost for school extraction', {
        school: school.name,
        cost,
        tokens: tokensUsed,
      });
    }

    logger.info('Successfully extracted school data', {
      school: school.name,
      fieldsExtracted: Object.keys(validatedData).length,
      cost,
      tokensUsed,
    });

    return {
      data: validatedData,
      tokensUsed,
      cost,
    };
  } catch (error: any) {
    // Handle specific API errors
    if (error.status === 429) {
      logger.error('Claude API rate limit exceeded', { school: school.name });
      throw new Error('RATE_LIMIT');
    } else if (error.status >= 500) {
      logger.error('Claude API server error', { school: school.name }, error);
      throw new Error('API_ERROR');
    } else {
      logger.error(
        'Unexpected error during extraction',
        { school: school.name },
        error
      );
      throw error;
    }
  }
}
