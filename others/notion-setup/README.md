# Notion Database Setup for TestNauti.co

This directory contains scripts to set up the Notion databases for the Escuelas Náuticas directory.

## Quick Start

```bash
# Install dependencies
npm install

# Run the V2 setup (recommended)
node setup-escuelas-v2.js
```

## What Gets Created

Running `setup-escuelas-v2.js` creates **3 databases**:

1. **Escuelas Náuticas V2** - Main nautical schools directory
2. **Solicitudes de Cambios V2** - User-submitted change requests
3. **Reviews** - School reviews and ratings

## Files in This Directory

| File | Description |
|------|-------------|
| `setup-escuelas-v2.js` | **Main script** - Creates all 3 databases with complete structure |
| `setup.js` | Original script (legacy, use V2 instead) |
| `crear-personas.js` | Creates Personas database (optional) |
| `DATABASE_STRUCTURE_V2.md` | **Complete documentation** of all database fields |
| `NOTION_SETUP_CONTEXT.md` | Context about original setup |
| `README.md` | This file |

## Configuration

The scripts are pre-configured with:
- **NOTION_TOKEN**: `ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO`
- **PARENT_PAGE_ID**: `2da1dd90bfd6809596e0c1d958f62b99`

If you need to change these, edit the constants at the top of the script files.

## After Running the Script

1. **Save the Database IDs** - The script outputs 3 IDs. Save them!
   ```
   Escuelas Náuticas V2: [copy this]
   Solicitudes de Cambios V2: [copy this]
   Reviews: [copy this]
   ```

2. **Share with Integration**:
   - Open each database in Notion
   - Click the "..." menu (top right)
   - Select "Add connections"
   - Choose your integration

3. **Update Your App**:
   - Add the Database IDs to your environment variables
   - Update your API calls to use the new database

## Database Structure

See `DATABASE_STRUCTURE_V2.md` for complete details. Key highlights:

### Escuelas Náuticas V2 (Main Database)

**Core Fields**:
- Title, Slug, ID
- Phone, Email, Website
- City, Area, Location
- Short Description, Description
- Featured Picture, Other Pictures
- Services (multi-select)
- Featured (checkbox)
- Owners, Editors
- Reviews integration

**Status & Metadata**:
- Status (Active/Pending/Draft/Inactive)
- Verified checkbox
- Created/Modified timestamps

### Solicitudes de Cambios V2 (Change Requests)

Tracks user requests to:
- Add new schools
- Edit existing schools
- Submit reviews
- Report errors

Includes workflow states: Pending → In Review → Approved/Rejected

### Reviews

Full review system with:
- Rating (1-5)
- Review text
- Author information
- Verification status
- Moderation workflow

## Troubleshooting

### "Could not find database" error
- **Solution**: Share the parent page with your Notion integration
  1. Open the parent page in Notion
  2. Click "..." → "Add connections"
  3. Select your integration

### "object_not_found" error
- **Cause**: Invalid page ID or insufficient permissions
- **Solution**: Verify `PARENT_PAGE_ID` and ensure integration has access

### Script runs but databases don't appear
- **Cause**: Created in wrong location
- **Solution**: Check the parent page - databases are created as children

## Next Steps

1. Run the script to create databases
2. Share databases with your integration
3. Test adding a sample school entry
4. Integrate with your Next.js application
5. Set up API routes to read/write from Notion

## Integration with TestNauti.co

The database structure is designed to work seamlessly with the `/escuelas/*` routes in your Next.js app.

Suggested implementation:
- Fetch schools from Notion API
- Cache results for performance
- Use ISR (Incremental Static Regeneration) for school pages
- Form submissions create entries in "Solicitudes de Cambios"
- Reviews submitted through forms create entries in "Reviews"

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Database Relations Guide](https://developers.notion.com/reference/property-object#relation)
- [TestNauti.co Project Documentation](../../code/README.md)
