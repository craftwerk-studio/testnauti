import { notion, ESCUELAS_DB_ID } from '@/lib/notion';
import { NauticalSchool } from '@/types/directory';

// City to Province mapping for Spanish geography
const cityToProvince: Record<string, string> = {
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

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch all active schools from Notion database with retry logic
 */
export async function fetchSchoolsFromNotion(): Promise<NauticalSchool[]> {
  const schools: NauticalSchool[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  console.log('🔄 Fetching schools from Notion...');

  while (hasMore) {
    let retries = 0;
    let success = false;
    let response: any;

    // Retry logic with exponential backoff
    while (!success && retries < maxRetries) {
      try {
        response = await notion.databases.query({
          database_id: ESCUELAS_DB_ID,
          start_cursor: startCursor,
          // Remove filter to get all schools initially
          // We'll filter client-side if needed
          sorts: [
            {
              property: 'Title',
              direction: 'ascending',
            },
          ],
          page_size: 100,
        });
        success = true;
      } catch (error: any) {
        retries++;
        if (retries < maxRetries) {
          const delay = baseDelay * Math.pow(2, retries - 1);
          console.log(`⚠️  Retry ${retries}/${maxRetries} after ${delay}ms...`);
          await sleep(delay);
        } else {
          throw error; // Rethrow after max retries
        }
      }
    }

    for (const page of response.results) {
      const school = mapNotionPageToSchool(page);
      if (school) {
        schools.push(school);
      }
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;

    // Small delay between pagination requests to avoid rate limits
    if (hasMore) {
      await sleep(300);
    }
  }

  console.log(`✅ Fetched ${schools.length} schools from Notion`);
  return schools;
}

/**
 * Map a Notion page to NauticalSchool interface
 */
function mapNotionPageToSchool(page: any): NauticalSchool | null {
  try {
    const props = page.properties;

    // Extract ID (required)
    const id = props.ID?.rich_text?.[0]?.plain_text || '';

    // Extract name/title (required) - using "Title" property
    const name = props.Title?.title?.[0]?.plain_text || '';

    // Extract city (required for our interface) - using "City" property
    const city = props.City?.select?.name || '';

    // Extract region from Area property (Comunidad Autónoma)
    const region = props.Area?.select?.name || '';

    // Map city to province using lookup table
    const province = cityToProvince[city] || city || '';

    // Extract address from Location field
    const address = props.Location?.rich_text?.[0]?.plain_text || '';

    // Extract contact info
    const phone = props.Phone?.phone_number || undefined;
    const email = props.Email?.email || undefined;
    const website = props.Website?.url || undefined;

    // Extract description
    const description = props.Description?.rich_text?.[0]?.plain_text || '';

    // Extract featured flag
    const featured = props.Featured?.checkbox || false;

    // Extract courses from Services multi-select
    const courses = props.Services?.multi_select?.map((s: any) => s.name) || [];

    // Extract image from Featured Picture property (Files type)
    let image: string | undefined = undefined;
    if (props['Featured Picture']?.files?.[0]) {
      image = props['Featured Picture'].files[0].file?.url || props['Featured Picture'].files[0].external?.url;
    } else if (props['Featured Picture']?.url) {
      // Fallback to URL type if it exists
      image = props['Featured Picture'].url;
    }

    // Extract social media links
    const facebook = props.Facebook?.url || undefined;
    const instagram = props.Instagram?.url || undefined;
    const linkedin = props.LinkedIn?.url || undefined;
    const twitter = props.Twitter?.url || undefined;

    // Extract status (default to 'Active' if not set)
    const status = props.Status?.select?.name || 'Active';

    // Validation: must have at least id, name, and city
    if (!id || !name) {
      console.warn(`⚠️  Skipping incomplete school: ${name || 'Unknown'} (missing ID or name)`);
      return null;
    }

    // If city is missing, log warning but continue
    if (!city) {
      console.warn(`⚠️  School "${name}" (${id}) is missing city - using empty string`);
    }

    return {
      id,
      name,
      city: city || '',
      province: province || city || '',
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
      status,
    };
  } catch (error) {
    console.error('❌ Error mapping Notion page to school:', error);
    return null;
  }
}
