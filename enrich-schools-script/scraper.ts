/**
 * Web scraping module for fetching school website content
 */

import * as cheerio from 'cheerio';
import { CONFIG } from './config';
import { ScrapedContent } from './types';
import { logger } from './logger';

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a URL with retry logic and exponential backoff
 */
async function fetchWithRetry(
  url: string,
  maxRetries: number = CONFIG.MAX_WEB_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        CONFIG.WEB_TIMEOUT_MS
      );

      const response = await fetch(url, {
        headers: {
          'User-Agent': CONFIG.USER_AGENT,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('Page not found (404)');
      }
      if (response.status === 403) {
        throw new Error('Access forbidden (403)');
      }
      if (response.status === 429) {
        // Rate limited - wait longer before retry
        const retryDelay = Math.min(10000 * Math.pow(2, attempt), 30000);
        logger.warn(
          `Rate limited (429), waiting ${retryDelay}ms before retry`,
          { url, attempt: attempt + 1 }
        );
        await sleep(retryDelay);
        continue;
      }
      if (response.status >= 500) {
        throw new Error(`Server error (${response.status})`);
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error.message.includes('404') ||
        error.message.includes('403') ||
        error.name === 'AbortError'
      ) {
        throw error;
      }

      // Exponential backoff for retries
      if (attempt < maxRetries - 1) {
        const delay = CONFIG.WEB_REQUEST_DELAY_MS * Math.pow(2, attempt);
        logger.debug(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`, {
          url,
          error: error.message,
        });
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Failed to fetch URL after retries');
}

/**
 * Extract content from HTML using Cheerio
 */
function extractWithCheerio(html: string): ScrapedContent {
  const $ = cheerio.load(html);

  // Remove scripts, styles, and non-content elements
  $('script, style, noscript, iframe, svg, path').remove();

  // Extract title
  const title = $('title').text().trim() || $('h1').first().text().trim();

  // Extract meta description
  const metaDescription =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Extract structured data (JSON-LD)
  let structuredData: any = null;
  $('script[type="application/ld+json"]').each((_, elem) => {
    try {
      const json = $(elem).html();
      if (json) {
        structuredData = JSON.parse(json);
      }
    } catch (e) {
      // Ignore malformed JSON-LD
    }
  });

  // Extract text content from body
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  // Extract text from specific semantic elements (prioritize)
  const semanticText = [
    $('main').text(),
    $('article').text(),
    $('.content').text(),
    $('#content').text(),
  ]
    .filter((text) => text.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract contact information from footer and contact sections
  const contactText = [
    $('footer').text(),
    $('.footer').text(),
    $('#footer').text(),
    $('[class*="contact"]').text(),
    $('[id*="contact"]').text(),
    $('.contacto').text(),
    $('#contacto').text(),
  ]
    .filter((text) => text.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract all links (for social media detection)
  const links: string[] = [];
  $('a[href]').each((_, elem) => {
    const href = $(elem).attr('href');
    if (href && (
      href.includes('facebook.com') ||
      href.includes('instagram.com') ||
      href.includes('linkedin.com') ||
      href.includes('twitter.com') ||
      href.includes('x.com')
    )) {
      links.push(href);
    }
  });

  // Combine all text, prioritizing semantic content
  const text = [semanticText || bodyText, contactText, `Social links: ${links.join(', ')}`]
    .filter(t => t.length > 0)
    .join('\n\n')
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate if too long
  const truncatedHtml =
    html.length > CONFIG.MAX_HTML_LENGTH
      ? html.substring(0, CONFIG.MAX_HTML_LENGTH)
      : html;

  return {
    html: truncatedHtml,
    text: text.substring(0, CONFIG.MAX_HTML_LENGTH),
    title,
    metaDescription,
    structuredData,
  };
}

/**
 * Main function to scrape a website
 */
export async function scrapeWebsite(
  url: string,
  useBrowser: boolean = false
): Promise<ScrapedContent> {
  try {
    logger.debug('Scraping website', { url });

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // For now, we only support fetch + Cheerio
    // Browser support (Playwright) can be added later if needed
    if (useBrowser) {
      logger.warn(
        'Browser mode not yet implemented, falling back to fetch',
        { url }
      );
    }

    const response = await fetchWithRetry(normalizedUrl);
    const html = await response.text();

    if (!html || html.length < 100) {
      return {
        html: '',
        text: '',
        title: '',
        error: 'Empty or invalid response',
      };
    }

    const content = extractWithCheerio(html);
    logger.debug('Successfully scraped website', {
      url,
      textLength: content.text.length,
      title: content.title,
    });

    return content;
  } catch (error: any) {
    logger.error('Failed to scrape website', { url }, error);

    let errorMessage = 'Unknown error';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout';
    } else if (error.message.includes('404')) {
      errorMessage = 'Page not found';
    } else if (error.message.includes('403')) {
      errorMessage = 'Access forbidden';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Domain not found';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Connection refused';
    } else if (error.message.includes('certificate')) {
      errorMessage = 'SSL certificate error';
    } else {
      errorMessage = error.message;
    }

    return {
      html: '',
      text: '',
      title: '',
      error: errorMessage,
    };
  }
}
