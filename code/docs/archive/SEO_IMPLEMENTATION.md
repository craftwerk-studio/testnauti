# SEO Implementation Guide

## Overview

This document outlines the SEO best practices implemented in TestNauti to ensure excellent search engine visibility and discoverability.

## Key SEO Features Implemented

### 1. Dynamic Metadata Generation

Each school detail page uses Next.js 15's `generateMetadata` function to create unique, SEO-optimized metadata:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  // Generates unique title, description, keywords, and Open Graph tags
}
```

**Benefits:**
- Unique title and description for each school
- Proper keywords targeting
- Open Graph tags for social media sharing
- Twitter Card integration
- Canonical URLs to prevent duplicate content

### 2. Static Site Generation (SSG)

Using `generateStaticParams` to pre-render all school pages at build time:

```typescript
export async function generateStaticParams() {
  return nauticalSchools.map((school) => ({
    schoolId: school.id,
  }));
}
```

**Benefits:**
- Lightning-fast page loads
- Better Core Web Vitals scores
- Reduced server load
- Improved crawlability

### 3. Structured Data (JSON-LD)

Each school page includes Schema.org structured data:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  // ... complete organization details
}
```

**Benefits:**
- Rich snippets in search results
- Better understanding by search engines
- Enhanced click-through rates
- Local SEO benefits

### 4. Semantic HTML

Proper use of HTML5 semantic elements:

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- `<h1>` through `<h6>` hierarchy
- `<address>` for contact information
- ARIA labels for accessibility

### 5. Sitemap Generation

Dynamic XML sitemap at `/sitemap.xml`:

```typescript
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  // Includes all static and dynamic pages
}
```

**Includes:**
- Homepage
- Escuelas directory
- All individual school pages
- Test pages
- Priority and change frequency settings

### 6. Robots.txt

Proper robots.txt configuration at `/robots.txt`:

```typescript
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  // Allows crawling of public pages
  // Blocks private/API routes
}
```

### 7. Breadcrumb Navigation

Implemented on school detail pages:

```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li>Inicio</li>
    <li>Escuelas</li>
    <li aria-current="page">{school.name}</li>
  </ol>
</nav>
```

**Benefits:**
- Better user navigation
- Breadcrumb rich snippets
- Improved site structure understanding

### 8. Image Optimization

Using Next.js Image component with proper attributes:

```tsx
<Image
  src={school.image}
  alt={`${school.name} - Escuela náutica en ${school.city}`}
  fill
  sizes="(max-width: 1024px) 100vw, 66vw"
  priority // for LCP optimization
/>
```

**Benefits:**
- Automatic image optimization
- Proper alt text for accessibility
- Responsive images
- Lazy loading

### 9. Internal Linking

Strategic internal linking structure:

- Directory page links to all school details
- School pages link to related schools in the same region
- Quick links to search by city
- CTA links to main conversion pages

### 10. Mobile Responsiveness

Fully responsive design with:

- Mobile-first approach
- Responsive breakpoints
- Touch-friendly UI elements
- Fast mobile load times

## URL Structure

Clean, descriptive URLs:

```
/                           # Homepage
/escuelas                   # Schools directory
/escuelas/[schoolId]        # Individual school
/test                       # Test practice page
/app/dashboard              # User dashboard
```

## Meta Tags Reference

### Standard Meta Tags
- `title` - Unique for each page
- `description` - Compelling, keyword-rich
- `keywords` - Relevant search terms

### Open Graph Tags
- `og:title` - Social media title
- `og:description` - Social media description
- `og:image` - Featured image
- `og:type` - Content type
- `og:locale` - Spanish (es_ES)
- `og:url` - Canonical URL

### Twitter Card Tags
- `twitter:card` - Summary with large image
- `twitter:title` - Twitter-specific title
- `twitter:description` - Twitter-specific description
- `twitter:image` - Twitter image

## Performance Optimizations

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
  - Priority loading for hero images
  - Optimized fonts with `next/font`
  
- **FID (First Input Delay)**: < 100ms
  - Minimal client-side JavaScript
  - Server components where possible
  
- **CLS (Cumulative Layout Shift)**: < 0.1
  - Fixed image dimensions
  - Skeleton loading states

## Local SEO Features

For nautical schools directory:

1. **Location-based metadata**
   - City, province, region in titles
   - Geographic keywords

2. **Contact information**
   - Structured address data
   - Phone, email, website links
   - Schema.org LocalBusiness markup

3. **Local content**
   - Spanish language content
   - Regional terminology
   - Local course names (PER, PNB, etc.)

## Content Strategy

### Content Best Practices
- Unique descriptions for each school
- Natural keyword integration
- Clear, descriptive headings
- Comprehensive course information
- Contact details prominently displayed

### Duplicate Content Prevention
- Canonical URLs on all pages
- Unique metadata per page
- Noindex on authentication pages
- Proper robots.txt configuration

## Monitoring & Maintenance

### Tools to Use
1. **Google Search Console**
   - Monitor indexing status
   - Check for crawl errors
   - Review search performance

2. **Google PageSpeed Insights**
   - Monitor Core Web Vitals
   - Check mobile performance
   - Get optimization suggestions

3. **Schema Markup Validator**
   - Validate structured data
   - Check for errors
   - Test rich snippet preview

### Regular Tasks
- Monthly sitemap review
- Quarterly content updates
- Performance monitoring
- Broken link checks
- Mobile usability testing

## Future Enhancements

Potential SEO improvements:

1. **Blog/Content Marketing**
   - Sailing tips
   - Exam preparation guides
   - School reviews

2. **User Reviews**
   - School ratings
   - Student testimonials
   - Aggregate review schema

3. **Video Content**
   - Course previews
   - Video schema markup
   - YouTube integration

4. **Multilingual Support**
   - English version
   - Catalan/Basque regions
   - hreflang tags

5. **Progressive Web App**
   - Offline functionality
   - App-like experience
   - Better engagement metrics

## Technical SEO Checklist

- ✅ Dynamic metadata generation
- ✅ Static site generation (SSG)
- ✅ Structured data (JSON-LD)
- ✅ XML sitemap
- ✅ Robots.txt
- ✅ Semantic HTML
- ✅ Breadcrumb navigation
- ✅ Image optimization
- ✅ Internal linking
- ✅ Mobile responsive
- ✅ Fast page loads
- ✅ Clean URL structure
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ HTTPS (to be configured in production)
- ✅ Spanish language meta tags
- ✅ 404 error page
- ✅ Custom not-found pages

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Core Web Vitals Guide](https://web.dev/vitals/)

---

**Last Updated:** December 30, 2025
**Version:** 1.0

