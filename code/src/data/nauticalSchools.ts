import { NauticalSchool } from '@/types/exam';
import { fetchSchoolsFromNotion } from '@/lib/notion/fetchSchools';
import { nauticalSchools as backupSchools } from './nauticalSchools.backup';
import fs from 'fs';
import path from 'path';

// Global cache that persists across module imports within a single worker
let cachedSchools: NauticalSchool[] | null = null;

// File-based cache path (shared across all build workers)
const CACHE_FILE = path.join(process.cwd(), '.schools-cache.json');
const CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes

/**
 * Get all nautical schools from Notion
 * Uses file-based cache to share data across Next.js build workers
 * This prevents rate limiting during parallel static page generation
 * Falls back to backup data if Notion is unavailable
 */
export async function getNauticalSchools(): Promise<NauticalSchool[]> {
  // Return in-memory cached data if available
  if (cachedSchools) {
    return cachedSchools;
  }

  // Try to read from file cache first
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      const age = Date.now() - stats.mtimeMs;

      // Use cache if it's less than 5 minutes old and has content
      if (age < CACHE_MAX_AGE) {
        const cached: NauticalSchool[] = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        if (cached && cached.length > 0) {
          console.log(`📦 Using cached schools data (${cached.length} schools, ${Math.round(age / 1000)}s old)`);
          cachedSchools = cached;
          return cached;
        }
      }
    }
  } catch (error) {
    // Cache read failed, continue to fetch from Notion
    console.log('⚠️  Cache read failed, will try Notion or backup');
  }

  // Try to fetch from Notion
  try {
    cachedSchools = await fetchSchoolsFromNotion();

    // Write to cache file for other workers to use
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cachedSchools, null, 2), 'utf-8');
      console.log(`💾 Saved ${cachedSchools.length} schools to cache file`);
    } catch (error) {
      console.warn('⚠️  Failed to write cache file:', error);
    }

    return cachedSchools;
  } catch (error) {
    console.warn('⚠️  Failed to fetch schools from Notion, using backup data:', error);
    
    // Fall back to backup data
    cachedSchools = backupSchools;
    console.log(`📋 Using backup schools data (${backupSchools.length} schools)`);
    
    return cachedSchools;
  }
}

/**
 * Get unique list of regions (Comunidades Autónomas)
 */
export async function getRegions(): Promise<string[]> {
  const schools = await getNauticalSchools();
  return [...new Set(schools.map(school => school.region).filter(Boolean))].sort();
}

/**
 * Get unique list of provinces
 */
export async function getProvinces(): Promise<string[]> {
  const schools = await getNauticalSchools();
  return [...new Set(schools.map(school => school.province).filter(Boolean))].sort();
}

/**
 * Get unique list of cities
 */
export async function getCities(): Promise<string[]> {
  const schools = await getNauticalSchools();
  return [...new Set(schools.map(school => school.city).filter(Boolean))].sort();
}
