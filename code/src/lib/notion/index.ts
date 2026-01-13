import { Client } from '@notionhq/client';

// Check if Notion credentials are available
const hasNotionCredentials = !!(process.env.NOTION_TOKEN && process.env.NOTION_ESCUELAS_DB_ID);

// Only initialize client if credentials are available
export const notion = hasNotionCredentials
  ? new Client({
      auth: process.env.NOTION_TOKEN,
    })
  : null;

export const ESCUELAS_DB_ID = process.env.NOTION_ESCUELAS_DB_ID || '';
export const SOLICITUDES_DB_ID = process.env.NOTION_SOLICITUDES_DB_ID || '';
