/**
 * Nautical School directory data structure
 */
export interface NauticalSchool {
  id: string;
  name: string;
  city: string;
  province: string;
  region: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  courses: string[];
  description: string;
  featured: boolean;
  image?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  status?: string;
}
