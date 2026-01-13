const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({
  auth: 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO',
});

const ESCUELAS_DB_ID = '2dc1dd90bfd6818b9a53ff9c88490ebb';

// Load raw school data
const rawDataPath = path.join(__dirname, '../escuelas/extracciones/schools-list_lista-escuelas-manual_captured-list_2026-01-12_12-34-45_019bb1fc-161f-79be-9b67-4d09d9b6bb81.json');
const rawSchools = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// City to Province mapping for Spanish geography
const cityToProvince = {
  'Madrid': 'Madrid',
  'Barcelona': 'Barcelona',
  'Valencia': 'Valencia',
  'Alicante': 'Alicante',
  'Sevilla': 'Sevilla',
  'Málaga': 'Málaga',
  'Murcia': 'Murcia',
  'Palma': 'Islas Baleares',
  'Palma de Mallorca': 'Islas Baleares',
  'Las Palmas': 'Las Palmas',
  'Las Palmas de Gran Canaria': 'Las Palmas',
  'Bilbao': 'Vizcaya',
  'A Coruña': 'A Coruña',
  'Vigo': 'Pontevedra',
  'Gijón': 'Asturias',
  'Santander': 'Cantabria',
  'Granada': 'Granada',
  'Cádiz': 'Cádiz',
  'Tarragona': 'Tarragona',
  'Cartagena': 'Murcia',
  'Almería': 'Almería',
  'San Sebastián': 'Guipúzcoa',
  'Donostia': 'Guipúzcoa',
  'Zaragoza': 'Zaragoza',
  'Valladolid': 'Valladolid',
  'Castellón': 'Castellón',
  'Getxo': 'Vizcaya',
  'Marbella': 'Málaga',
  'Huelva': 'Huelva',
};

// City to Region (Comunidad Autónoma) mapping
const cityToRegion = {
  'Madrid': 'Comunidad de Madrid',
  'Barcelona': 'Cataluña',
  'Valencia': 'Comunidad Valenciana',
  'Alicante': 'Comunidad Valenciana',
  'Sevilla': 'Andalucía',
  'Málaga': 'Andalucía',
  'Murcia': 'Región de Murcia',
  'Palma': 'Islas Baleares',
  'Palma de Mallorca': 'Islas Baleares',
  'Las Palmas': 'Islas Canarias',
  'Las Palmas de Gran Canaria': 'Islas Canarias',
  'Bilbao': 'País Vasco',
  'A Coruña': 'Galicia',
  'Vigo': 'Galicia',
  'Gijón': 'Principado de Asturias',
  'Santander': 'Cantabria',
  'Granada': 'Andalucía',
  'Cádiz': 'Andalucía',
  'Tarragona': 'Cataluña',
  'Cartagena': 'Región de Murcia',
  'Almería': 'Andalucía',
  'San Sebastián': 'País Vasco',
  'Donostia': 'País Vasco',
  'Zaragoza': 'Aragón',
  'Valladolid': 'Castilla y León',
  'Castellón': 'Comunidad Valenciana',
  'Getxo': 'País Vasco',
  'Marbella': 'Andalucía',
  'Huelva': 'Andalucía',
};

// Common Spanish cities for pattern matching
const spanishCities = Object.keys(cityToRegion);

/**
 * Generate a URL-friendly slug from school title
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique ID for school
 */
function generateId(title, index) {
  const slug = slugify(title);
  return `${slug}-${index}`;
}

/**
 * Extract city from Info field or school title
 */
function extractCity(school) {
  const searchText = `${school.Title} ${school.Info}`.toLowerCase();

  // Try to find city name in text
  for (const city of spanishCities) {
    if (searchText.includes(city.toLowerCase())) {
      return city;
    }
  }

  // Check for common variations
  if (searchText.includes('coruña')) return 'A Coruña';
  if (searchText.includes('donosti')) return 'Donostia';
  if (searchText.includes('san sebastian')) return 'San Sebastián';

  return null; // Mark for manual review
}

/**
 * Extract region from city
 */
function extractRegion(city) {
  return city ? cityToRegion[city] : null;
}

/**
 * Extract province from city
 */
function extractProvince(city) {
  return city ? cityToProvince[city] : city;
}

/**
 * Clean URL - remove UTM parameters and ensure protocol
 */
function cleanUrl(url) {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    // Remove UTM and tracking parameters
    urlObj.searchParams.delete('utm_source');
    urlObj.searchParams.delete('utm_medium');
    urlObj.searchParams.delete('utm_campaign');
    return urlObj.toString();
  } catch {
    // If invalid URL, try to fix it
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }
}

/**
 * Clean email - remove URL encoding
 */
function cleanEmail(email) {
  if (!email) return null;
  return email.replace(/%20/g, '').trim();
}

/**
 * Validate phone number format
 */
function cleanPhone(phone) {
  if (!phone) return null;
  // Ensure Spanish format
  return phone.trim();
}

/**
 * Import a single school to Notion
 */
async function importSchool(school, index) {
  // Skip empty entries
  if (!school.Title || school.Title.trim() === '') {
    console.log(`⊘ Skipping empty entry at position ${index}`);
    return { success: false, reason: 'empty' };
  }

  const id = generateId(school.Title, index);
  const city = extractCity(school);
  const region = extractRegion(city);
  const province = extractProvince(city);
  const website = cleanUrl(school.Website);
  const email = cleanEmail(school.email);
  const phone = cleanPhone(school.Phone);

  // Build properties object - using English property names from Notion database
  const properties = {
    'Title': {
      title: [{ text: { content: school.Title } }],
    },
    'ID': {
      rich_text: [{ text: { content: id } }],
    },
    'Slug': {
      rich_text: [{ text: { content: id } }],
    },
  };

  // Add optional fields only if they exist
  if (city) {
    properties['City'] = { select: { name: city } };
  }

  if (region) {
    properties['Area'] = { select: { name: region } };
  }

  if (phone) {
    properties['Phone'] = { phone_number: phone };
  }

  if (email) {
    properties['Email'] = { email: email };
  }

  if (website) {
    properties['Website'] = { url: website };
  }

  // Add location/address field if we have city info
  if (city || region) {
    const locationParts = [city, region].filter(Boolean);
    properties['Location'] = {
      rich_text: [{ text: { content: locationParts.join(', ') } }],
    };
  }

  // Add Facebook/social media as part of description for now
  if (school.facebook) {
    properties['Description'] = {
      rich_text: [{ text: { content: `Facebook: ${school.facebook}` } }],
    };
  }

  // Set as not featured by default
  properties['Featured'] = { checkbox: false };

  // Set status to pending review
  properties['Status'] = { select: { name: 'Pending Review' } };

  try {
    await notion.pages.create({
      parent: { database_id: ESCUELAS_DB_ID },
      properties: properties,
    });

    console.log(`✓ [${index}/145] ${school.Title}${city ? ` (${city})` : ' (NO CITY - REVIEW NEEDED)'}`);
    return { success: true, city: !!city };
  } catch (error) {
    console.error(`✗ [${index}/145] Failed: ${school.Title}`);
    console.error(`   Error: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

/**
 * Sleep function for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main import function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('📚 TESTNAUTI - SCHOOL IMPORT SCRIPT');
  console.log('='.repeat(60));
  console.log(`\nImporting ${rawSchools.length} schools to Notion...\n`);

  const stats = {
    total: rawSchools.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    needsReview: 0,
  };

  for (let i = 0; i < rawSchools.length; i++) {
    const result = await importSchool(rawSchools[i], i + 1);

    if (result.success) {
      stats.successful++;
      if (!result.city) {
        stats.needsReview++;
      }
    } else if (result.reason === 'empty') {
      stats.skipped++;
    } else {
      stats.failed++;
    }

    // Rate limit: ~3 requests per second
    await sleep(350);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total schools:        ${stats.total}`);
  console.log(`✓ Successfully imported: ${stats.successful}`);
  console.log(`✗ Failed:             ${stats.failed}`);
  console.log(`⊘ Skipped (empty):    ${stats.skipped}`);
  console.log(`⚠ Needs review (no city): ${stats.needsReview}`);
  console.log('='.repeat(60));

  if (stats.needsReview > 0) {
    console.log('\n⚠️  WARNING: Some schools need manual review in Notion');
    console.log('   Please add Ciudad/Región for schools without location data');
  }

  if (stats.failed > 0) {
    console.log('\n❌ Some imports failed. Check errors above for details.');
  }

  console.log('\n✅ Import complete! Next steps:');
  console.log('   1. Open Notion database and review imported schools');
  console.log('   2. Add Ciudad/Región for schools marked for review');
  console.log('   3. Remove non-nautical schools (aviation, etc.)');
  console.log('   4. Mark verified schools as Status: Active');
  console.log('   5. Select 5-10 schools to mark as Featured');
  console.log('   6. Optionally add Services/Courses and Descriptions\n');
}

// Run the import
main().catch(console.error);
