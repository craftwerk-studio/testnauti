# Notion CRM Setup - Context Documentation

This document provides a comprehensive overview of the Notion CRM setup for TestNauti.co, including database structures, relationships, and setup scripts.

## Overview

The Notion CRM consists of three interconnected databases that manage nautical schools, people, and change requests:

1. **Escuelas Náuticas** - Main database of nautical schools
2. **Personas** - Database of people (owners, directors, instructors, students, etc.)
3. **Solicitudes de Cambios** - Database of change requests for school information

## Database Structure

### 1. Escuelas Náuticas (Nautical Schools)

**Purpose**: Main database containing all nautical schools in the directory.

**Database ID**: `2da1dd90bfd681469a7ae6813a5e08cc`  
**URL**: https://www.notion.so/2da1dd90bfd681469a7ae6813a5e08cc?v=2da1dd90bfd681458930000c454a4ca4

**Properties**:
- `Nombre` (Title) - School name
- `ID` (Rich Text) - Internal school ID
- `Ciudad` (Select) - City options: A Coruña, Alicante, Barcelona, Bilbao, Cádiz, Cartagena, Las Palmas de Gran Canaria, Madrid, Málaga, Palma de Mallorca, Santander, Sevilla, Tarragona, Valencia, Vigo
- `Provincia` (Select) - Province options: A Coruña, Alicante, Barcelona, Cantabria, Cádiz, Islas Baleares, Las Palmas, Madrid, Málaga, Murcia, Pontevedra, Sevilla, Tarragona, Valencia, Vizcaya
- `Región` (Select) - Region options: Andalucía, Cantabria, Cataluña, Comunidad de Madrid, Comunidad Valenciana, Galicia, Islas Baleares, Islas Canarias, País Vasco, Región de Murcia
- `Dirección` (Rich Text) - Address
- `Teléfono` (Phone Number) - Phone number
- `Email` (Email) - Email address
- `Website` (URL) - Website URL
- `Cursos` (Multi-select) - Available courses: Buceo, Capitán de Yate, Motor y Vela, Moto Náutica, Navegación Costera, Navegación Oceánica, Patrón de Yate, PER, PNB, Radiotelefonista, Vela, Vela Crucero
- `Descripción` (Rich Text) - Description
- `Destacada` (Checkbox) - Featured school flag
- `Imagen` (URL) - School image URL
- `Equipo` (Relation) - **RELATION TO PERSONAS** - Dual property synced with "Escuela" in Personas
- `Fecha creación` (Created Time) - Auto-generated creation date
- `Última modificación` (Last Edited Time) - Auto-generated last edit date

### 2. Personas (People)

**Purpose**: Database of all people associated with nautical schools (owners, directors, instructors, students, etc.).

**Database ID**: (Created by `crear-personas.js` - save this ID after running the script)

**Properties**:
- `Nombre completo` (Title) - Full name
- `Email` (Email) - Email address
- `Teléfono` (Phone Number) - Phone number
- `Rol` (Select) - Role options: Dueño (red), Director (orange), Instructor (blue), Administrativo (green), Alumno (purple), Otro (gray)
- `Escuela` (Relation) - **RELATION TO ESCUELAS** - Single property linking to Escuelas Náuticas
- `Cargo/Posición` (Rich Text) - Job title/position
- `DNI/NIE` (Rich Text) - ID number
- `Fecha de nacimiento` (Date) - Birth date
- `Dirección` (Rich Text) - Address
- `Ciudad` (Rich Text) - City
- `Código postal` (Rich Text) - Postal code
- `Notas` (Rich Text) - Notes
- `Activo` (Checkbox) - Active status
- `Fecha de alta` (Date) - Start date
- `Fecha de baja` (Date) - End date
- `Solicitudes enviadas` (Relation) - **RELATION TO SOLICITUDES** - Dual property synced with "Persona contacto" in Solicitudes
- `Fecha creación` (Created Time) - Auto-generated creation date
- `Última modificación` (Last Edited Time) - Auto-generated last edit date

### 3. Solicitudes de Cambios (Change Requests)

**Purpose**: Database tracking change requests for school information (new schools, edits, etc.).

**Database ID**: `2da1dd90bfd681a9bd17e46e840deb19`  
**URL**: https://www.notion.so/2da1dd90bfd681a9bd17e46e840deb19?v=2da1dd90bfd6810f939a000c2246e3b6

**Properties**:
- `Título solicitud` (Title) - Request title
- `Tipo` (Select) - Request type: Nueva escuela (green), Editar escuela (blue)
- `Estado` (Select) - Status: Pendiente (yellow), En revisión (blue), Aprobada (green), Rechazada (red)
- `Escuela relacionada` (Relation) - **RELATION TO ESCUELAS** - Single property linking to Escuelas Náuticas
- `Persona contacto` (Relation) - **RELATION TO PERSONAS** - Dual property synced with "Solicitudes enviadas" in Personas
- `Email solicitante` (Email) - Requester email
- `Nombre contacto` (Rich Text) - Contact name
- `Fecha solicitud` (Created Time) - Auto-generated request date
- `Nombre propuesto` (Rich Text) - Proposed name
- `Ciudad propuesta` (Rich Text) - Proposed city
- `Provincia propuesta` (Rich Text) - Proposed province
- `Región propuesta` (Rich Text) - Proposed region
- `Dirección propuesta` (Rich Text) - Proposed address
- `Teléfono propuesto` (Rich Text) - Proposed phone
- `Email propuesto` (Rich Text) - Proposed email
- `Website propuesto` (Rich Text) - Proposed website
- `Cursos propuestos` (Rich Text) - Proposed courses
- `Descripción propuesta` (Rich Text) - Proposed description
- `Imagen propuesta` (URL) - Proposed image URL
- `Notas internas` (Rich Text) - Internal notes
- `Revisado por` (People) - Reviewer
- `Fecha aprobación` (Date) - Approval date

## Database Relationships

The three databases are interconnected through relation properties:

```
┌─────────────────────┐
│  Escuelas Náuticas  │
│                     │
│  • Equipo (many)    │◄──────┐
└─────────────────────┘       │
         │                     │
         │ (one)               │
         │                     │
         ▼                     │
┌─────────────────────┐       │
│      Personas       │       │
│                     │       │
│  • Escuela (one)    │───────┘
│  • Solicitudes      │
│    enviadas (many)  │◄──────┐
└─────────────────────┘       │
                               │
                               │
┌─────────────────────┐       │
│ Solicitudes Cambios │       │
│                     │       │
│  • Escuela          │       │
│    relacionada (one)│───────┘
│  • Persona contacto│
│    (one)            │───────┐
└─────────────────────┘       │
                               │
                               │
                               │
                               └───────┘
```

**Relationship Details**:

1. **Escuelas ↔ Personas** (Many-to-Many via dual property)
   - `Escuelas.Equipo` ↔ `Personas.Escuela`
   - One school can have many people
   - One person belongs to one school

2. **Personas ↔ Solicitudes** (Many-to-Many via dual property)
   - `Personas.Solicitudes enviadas` ↔ `Solicitudes.Persona contacto`
   - One person can send many requests
   - One request has one contact person

3. **Escuelas ↔ Solicitudes** (One-to-Many)
   - `Solicitudes.Escuela relacionada` → `Escuelas`
   - One school can have many change requests
   - One request relates to one school

## Setup Scripts

### Initial Setup (`setup.js`)

**Purpose**: Creates the initial two databases (Escuelas Náuticas and Solicitudes de Cambios).

**Usage**:
```bash
cd others/notion-setup
node setup.js
```

**What it does**:
1. Creates "Escuelas Náuticas" database with all properties
2. Creates "Solicitudes de Cambios" database with relation to Escuelas
3. Outputs the Database IDs (save these!)

**Configuration Required**:
- `NOTION_TOKEN` - Your Notion integration token
- `PARENT_PAGE_ID` - The page where databases will be created

**Output**: 
- Escuelas Náuticas Database ID
- Solicitudes de Cambios Database ID

### Personas Setup (`crear-personas.js`)

**Purpose**: Creates the Personas database and establishes all relationships.

**Usage**:
```bash
cd others/notion-setup
node crear-personas.js
```

**What it does**:
1. Verifies/resolves Database IDs (handles Page IDs vs Database IDs)
2. Creates "Personas" database with relations to Escuelas and Solicitudes
3. Updates Escuelas database to add "Equipo" relation
4. Updates Solicitudes database to add "Persona contacto" relation

**Configuration Required**:
- `NOTION_TOKEN` - Your Notion integration token
- `PARENT_PAGE_ID` - The page where databases will be created
- `ESCUELAS_DB_ID` - Database ID from setup.js output
- `SOLICITUDES_DB_ID` - Database ID from setup.js output

**Output**: 
- Personas Database ID (save this!)

**Important**: This script includes a `resolveDatabaseId()` helper function that automatically handles cases where you might have Page IDs instead of Database IDs.

## Important Notion API Notes

### Page ID vs Database ID vs View ID

**Critical Understanding**: In Notion URLs, there are different ID types:

- **URL Format**: `https://www.notion.so/{PAGE_ID}?v={VIEW_ID}`
- **Page ID** (first part): This is the Database ID for full-page databases
- **View ID** (`v=` parameter): This is just a view configuration, NOT the database ID

**Example**:
```
URL: https://www.notion.so/2da1dd90bfd681469a7ae6813a5e08cc?v=2da1dd90bfd681458930000c454a4ca4
     └─────────────────────────────────────┘  └─────────────────────────────────────┘
              Database ID (use this!)              View ID (ignore this!)
```

**For API calls, always use the Page ID (first part of URL), not the View ID.**

### Sharing with Integrations

**Critical**: All databases and the parent page MUST be shared with your Notion integration.

**How to share**:
1. Open the database/page in Notion
2. Click the "..." menu (top right)
3. Select "Add connections" or "Connections"
4. Select your integration from the list

**What needs to be shared**:
- ✅ Parent page (where databases are created)
- ✅ Escuelas Náuticas database
- ✅ Solicitudes de Cambios database
- ✅ Personas database (after creation)

### Common Issues

1. **"Could not find database" error**
   - **Cause**: Database not shared with integration OR using View ID instead of Database ID
   - **Solution**: Share the database with integration, verify you're using Page ID (not View ID)

2. **"object_not_found" error**
   - **Cause**: Invalid Database ID or database not shared
   - **Solution**: Verify Database ID is correct (use Page ID from URL), ensure database is shared

3. **Relation property creation fails**
   - **Cause**: Target database not shared with integration
   - **Solution**: Share the target database before creating relations

## Current Configuration

**Parent Page**:
- ID: `2da1dd90bfd6809596e0c1d958f62b99`
- URL: https://www.notion.so/Directorio-N-utico-2da1dd90bfd6809596e0c1d958f62b99

**Integration Token**: 
- Stored in setup scripts (update if needed)

**Database IDs**:
- Escuelas Náuticas: `2da1dd90bfd681469a7ae6813a5e08cc`
- Solicitudes de Cambios: `2da1dd90bfd681a9bd17e46e840deb19`
- Personas: (Created by `crear-personas.js` - check script output)

## API Version

All scripts use Notion API version: `2022-06-28`

## Next Steps for Integration

When integrating with the main application:

1. **Store Database IDs** in environment variables or config
2. **Use the Database IDs** (not View IDs) for all API calls
3. **Ensure integration has access** to all databases
4. **Handle relations** using the dual-property sync where applicable

## File Structure

```
others/notion-setup/
├── setup.js                    # Initial database creation
├── crear-personas.js           # Personas database + relationships
├── NOTION_SETUP_CONTEXT.md     # This file
├── package.json                # Dependencies
└── node_modules/               # Installed packages
```

## References

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Reference](https://developers.notion.com/reference)
- [Database Relations Guide](https://developers.notion.com/reference/property-object#relation)

