# Notion Database Setup V2 - Escuelas Náuticas

## Overview

This setup script creates an improved Notion database structure for managing nautical schools in the TestNauti.co platform. The V2 version includes enhanced fields that better align with the application's needs.

## What's New in V2

### Enhanced Fields
- **Slug**: URL-friendly identifier for routing
- **Featured Picture & Other Pictures**: Proper support for multiple images using Notion's Files property
- **Short Description**: Brief summary for listings
- **Location**: Detailed location/coordinates information
- **Owners & Editors**: People fields for proper permission management
- **Reviews System**: Separate database for managing reviews with ratings
- **Status & Verified**: Content moderation and verification workflow
- **Social Media & Opening Hours**: Additional business information
- **Price Range**: Quick reference for course pricing

### Three Interconnected Databases

1. **Escuelas Náuticas V2** - Main school directory
2. **Solicitudes de Cambios V2** - Change request management
3. **Reviews** - School reviews and ratings

## Database Structures

### 1. Escuelas Náuticas V2

**Core Fields:**
- **Title** (Title) - School name
- **Slug** (Rich Text) - URL-friendly identifier (e.g., "escuela-nautica-barcelona")
- **ID** (Rich Text) - Internal unique identifier

**Contact Information:**
- **Phone** (Phone Number)
- **Email** (Email)
- **Website** (URL)

**Location:**
- **City** (Select) - 30+ Spanish cities
- **Area** (Select) - Comunidades Autónomas
- **Location** (Rich Text) - Full address or coordinates
- **Address** (Rich Text) - Street address
- **Postal Code** (Rich Text)

**Content:**
- **Short Description** (Rich Text) - Brief summary for cards/listings
- **Description** (Rich Text) - Full detailed description

**Media:**
- **Featured Picture** (Files) - Main image
- **Other Pictures** (Files) - Gallery images

**Services:**
- **Services** (Multi-select) - Courses offered:
  - Main courses: PER, PNB, Patrón de Yate, Capitán de Yate
  - Specialties: Radiotelefonista, Moto Náutica, Vela, etc.
  - Additional: Buceo, Prácticas, Cursos online, Alquiler, etc.
- **Featured** (Checkbox) - Featured school flag

**Management:**
- **Owners** (People) - School owners
- **Editors** (People) - Content editors

**Reviews:**
- **Reviews Count** (Number) - Total number of reviews
- **Average Rating** (Number) - Average rating (1-5)
- **Reviews** (Rich Text) - Summary or notes

**Metadata:**
- **Status** (Select) - Active, Pending Review, Draft, Inactive
- **Verified** (Checkbox) - Verification status
- **Created Time** (Created Time)
- **Last Edited Time** (Last Edited Time)
- **Published Date** (Date)

**Additional:**
- **Social Media** (Rich Text) - Social media links
- **Opening Hours** (Rich Text) - Business hours
- **Price Range** (Select) - €, €€, €€€, €€€€

### 2. Solicitudes de Cambios V2

Enhanced change request tracking with support for multiple request types.

**Fields:**
- **Request Title** (Title)
- **Type** (Select) - New School, Edit School, Delete School, Add Review
- **Status** (Select) - Pending, In Review, Approved, Rejected, Needs Info
- **Related School** (Relation) - Links to Escuelas Náuticas V2
- **Requester Email** (Email)
- **Contact Name** (Rich Text)
- **Request Date** (Created Time)

**Proposed Changes:** (All fields match the school database)
- Proposed Title, Slug, City, Area, Address, etc.

**Review Information:** (For review requests)
- **Review Rating** (Number)
- **Review Text** (Rich Text)
- **Review Author** (Rich Text)

**Administrative:**
- **Internal Notes** (Rich Text)
- **Reviewed By** (People)
- **Approval Date** (Date)
- **Priority** (Select) - Low, Medium, High, Urgent

### 3. Reviews (NEW)

Dedicated database for managing school reviews.

**Fields:**
- **Review Title** (Title)
- **School** (Relation) - Links to Escuelas Náuticas V2
- **Rating** (Number) - 1-5 stars
- **Review Text** (Rich Text)
- **Author Name** (Rich Text)
- **Author Email** (Email)
- **Verified Purchase** (Checkbox) - Confirmed student
- **Course Taken** (Rich Text) - Which course they took
- **Review Date** (Date)
- **Status** (Select) - Pending, Approved, Rejected, Flagged
- **Helpful Count** (Number) - Upvotes
- **Created Time** (Created Time)
- **Published Date** (Date)

## Installation & Usage

### Prerequisites

```bash
cd others/notion-setup
npm install
```

### Configuration

Edit `setup-escuelas-v2.js` and update:

```javascript
const NOTION_TOKEN = 'your_token_here';
const PARENT_PAGE_ID = 'your_page_id_here';
```

**Current values:**
- NOTION_TOKEN: `ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO`
- PARENT_PAGE_ID: `2da1dd90bfd6809596e0c1d958f62b99`

### Running the Script

```bash
node setup-escuelas-v2.js
```

### Expected Output

```
🚀 Iniciando configuración de Notion V2...

📚 Creando base de datos: Escuelas Náuticas V2...
✅ Base de datos "Escuelas Náuticas V2" creada!
🔗 Database ID: xxxxx
🔗 URL: https://...

📚 Creando base de datos: Solicitudes de Cambios V2...
✅ Base de datos "Solicitudes de Cambios V2" creada!
🔗 Database ID: xxxxx
🔗 URL: https://...

📚 Creando base de datos: Reviews...
✅ Base de datos "Reviews" creada!
🔗 Database ID: xxxxx
🔗 URL: https://...

✨ ¡Configuración completada con éxito!

📋 GUARDA ESTOS DATABASE IDs:

Escuelas Náuticas V2: xxxxx
Solicitudes de Cambios V2: xxxxx
Reviews: xxxxx
```

**IMPORTANT:** Save the Database IDs - you'll need them for your application integration.

## Database Relationships

```
┌─────────────────────────┐
│  Escuelas Náuticas V2   │
│                         │
└─────────────────────────┘
           │
           │ (one-to-many)
           │
           ├────────────────────────────────┐
           │                                │
           ▼                                ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│ Solicitudes Cambios V2  │    │       Reviews           │
│                         │    │                         │
│ • Related School        │    │ • School                │
└─────────────────────────┘    └─────────────────────────┘
```

## Integration with TestNauti.co

### Environment Variables

Add to your `.env.local`:

```env
NOTION_TOKEN=ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO
NOTION_ESCUELAS_DB_ID=<from_script_output>
NOTION_SOLICITUDES_DB_ID=<from_script_output>
NOTION_REVIEWS_DB_ID=<from_script_output>
```

### Key Improvements for Application

1. **Slug field** - Direct URL routing (`/escuelas/{slug}`)
2. **Files property** - Proper image management instead of URLs
3. **Reviews database** - Structured review system with ratings
4. **People fields** - Native Notion user management for owners/editors
5. **Status workflow** - Content moderation (Draft → Pending → Active)
6. **Verified flag** - Trust indicators for schools
7. **Price range** - Quick filtering option
8. **Social media & hours** - Enhanced business profiles

## Migration from V1

If you have existing data in the old structure:

1. **Don't delete** the old database yet
2. Run the V2 script to create new databases
3. Export data from V1 (CSV or API)
4. Transform and import into V2
5. Update application to use new Database IDs
6. Test thoroughly before archiving V1

## Common Issues

### "object_not_found" error
- Verify PARENT_PAGE_ID is correct
- Ensure the page is shared with your Notion integration
- Use Page ID (first part of URL), not View ID

### "Could not find database" error
- Share all databases with your integration
- Go to database → "..." menu → "Add connections" → Select your integration

### Relation creation fails
- The target database must be created first
- Both databases must be shared with the integration

## Next Steps

1. ✅ Run the script
2. ✅ Save all Database IDs
3. ⬜ Share databases with your integration
4. ⬜ Add Database IDs to environment variables
5. ⬜ Test API access with a simple query
6. ⬜ Build API integration in your app
7. ⬜ Create sync scripts if needed

## File Structure

```
others/notion-setup/
├── setup.js                    # Original V1 setup
├── setup-escuelas-v2.js        # NEW V2 setup (use this!)
├── crear-personas.js           # Personas database (optional)
├── NOTION_SETUP_CONTEXT.md     # V1 documentation
├── README-V2.md                # This file
├── package.json
└── node_modules/
```

## API Version

All scripts use Notion API version: `2022-06-28`

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Reference](https://developers.notion.com/reference)
- [Property Object Types](https://developers.notion.com/reference/property-object)
- [Files Property](https://developers.notion.com/reference/property-object#files)
- [Relations](https://developers.notion.com/reference/property-object#relation)

## Support

For issues or questions:
1. Check the console output for specific error messages
2. Verify all configuration values
3. Ensure proper sharing/permissions in Notion
4. Review the [Notion API docs](https://developers.notion.com/)

---

**Version**: 2.0
**Last Updated**: 2026-01-02
**Compatibility**: Notion API v2022-06-28
