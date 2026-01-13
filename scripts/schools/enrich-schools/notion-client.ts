import { Client } from '@notionhq/client';

if (!process.env.NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN is not defined in environment variables');
}

if (!process.env.NOTION_ESCUELAS_DB_ID) {
  throw new Error('NOTION_ESCUELAS_DB_ID is not defined in environment variables');
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const ESCUELAS_DB_ID = process.env.NOTION_ESCUELAS_DB_ID;
export const SOLICITUDES_DB_ID = process.env.NOTION_SOLICITUDES_DB_ID;
