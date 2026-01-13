// Script para crear la estructura de bases de datos en Notion
// Requisitos: npm install @notionhq/client

const { Client } = require('@notionhq/client');

// CONFIGURACIÓN - Completa estos valores
const NOTION_TOKEN = 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO'; // Token de tu integración
const PARENT_PAGE_ID = '2da1dd90bfd6809596e0c1d958f62b99'; // ID de la página donde crear las bases de datos

async function crearBaseEscuelasNauticas() {
  console.log('📚 Creando base de datos: Escuelas Náuticas...');
  
  const payload = {
    parent: { 
      type: 'page_id',
      page_id: PARENT_PAGE_ID 
    },
    title: [
      {
        type: 'text',
        text: { content: 'Escuelas Náuticas' }
      }
    ],
    properties: {
      'Nombre': { 
        title: {} 
      },
      'ID': { 
        rich_text: {}
      },
      'Ciudad': {
        select: {
          options: [
            { name: 'A Coruña', color: 'blue' },
            { name: 'Alicante', color: 'blue' },
            { name: 'Barcelona', color: 'blue' },
            { name: 'Bilbao', color: 'blue' },
            { name: 'Cádiz', color: 'blue' },
            { name: 'Cartagena', color: 'blue' },
            { name: 'Las Palmas de Gran Canaria', color: 'blue' },
            { name: 'Madrid', color: 'blue' },
            { name: 'Málaga', color: 'blue' },
            { name: 'Palma de Mallorca', color: 'blue' },
            { name: 'Santander', color: 'blue' },
            { name: 'Sevilla', color: 'blue' },
            { name: 'Tarragona', color: 'blue' },
            { name: 'Valencia', color: 'blue' },
            { name: 'Vigo', color: 'blue' }
          ]
        }
      },
      'Provincia': {
        select: {
          options: [
            { name: 'A Coruña', color: 'green' },
            { name: 'Alicante', color: 'green' },
            { name: 'Barcelona', color: 'green' },
            { name: 'Cantabria', color: 'green' },
            { name: 'Cádiz', color: 'green' },
            { name: 'Islas Baleares', color: 'green' },
            { name: 'Las Palmas', color: 'green' },
            { name: 'Madrid', color: 'green' },
            { name: 'Málaga', color: 'green' },
            { name: 'Murcia', color: 'green' },
            { name: 'Pontevedra', color: 'green' },
            { name: 'Sevilla', color: 'green' },
            { name: 'Tarragona', color: 'green' },
            { name: 'Valencia', color: 'green' },
            { name: 'Vizcaya', color: 'green' }
          ]
        }
      },
      'Región': {
        select: {
          options: [
            { name: 'Andalucía', color: 'orange' },
            { name: 'Cantabria', color: 'orange' },
            { name: 'Cataluña', color: 'orange' },
            { name: 'Comunidad de Madrid', color: 'orange' },
            { name: 'Comunidad Valenciana', color: 'orange' },
            { name: 'Galicia', color: 'orange' },
            { name: 'Islas Baleares', color: 'orange' },
            { name: 'Islas Canarias', color: 'orange' },
            { name: 'País Vasco', color: 'orange' },
            { name: 'Región de Murcia', color: 'orange' }
          ]
        }
      },
      'Dirección': { 
        rich_text: {} 
      },
      'Teléfono': { 
        phone_number: {} 
      },
      'Email': { 
        email: {} 
      },
      'Website': { 
        url: {} 
      },
      'Cursos': {
        multi_select: {
          options: [
            { name: 'Buceo', color: 'purple' },
            { name: 'Capitán de Yate', color: 'purple' },
            { name: 'Motor y Vela', color: 'purple' },
            { name: 'Moto Náutica', color: 'purple' },
            { name: 'Navegación Costera', color: 'purple' },
            { name: 'Navegación Oceánica', color: 'purple' },
            { name: 'Patrón de Yate', color: 'purple' },
            { name: 'PER', color: 'purple' },
            { name: 'PNB', color: 'purple' },
            { name: 'Radiotelefonista', color: 'purple' },
            { name: 'Vela', color: 'purple' },
            { name: 'Vela Crucero', color: 'purple' }
          ]
        }
      },
      'Descripción': { 
        rich_text: {} 
      },
      'Destacada': { 
        checkbox: {} 
      },
      'Imagen': { 
        url: {} 
      },
      'Fecha creación': { 
        created_time: {} 
      },
      'Última modificación': { 
        last_edited_time: {} 
      }
    }
  };

  try {
    const response = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${data.message || JSON.stringify(data)}`);
    }

    console.log('✅ Base de datos "Escuelas Náuticas" creada!');
    console.log('🔗 Database ID:', data.id);
    console.log('🔗 URL:', data.url);
    
    return data.id;
  } catch (error) {
    console.error('❌ Error creando Escuelas Náuticas:', error.message);
    throw error;
  }
}

async function crearBaseSolicitudesCambios(escuelasDbId) {
  console.log('\n📚 Creando base de datos: Solicitudes de Cambios...');
  
  const payload = {
    parent: { 
      type: 'page_id',
      page_id: PARENT_PAGE_ID 
    },
    title: [
      {
        type: 'text',
        text: { content: 'Solicitudes de Cambios' }
      }
    ],
    properties: {
      'Título solicitud': { 
        title: {} 
      },
      'Tipo': {
        select: {
          options: [
            { name: 'Nueva escuela', color: 'green' },
            { name: 'Editar escuela', color: 'blue' }
          ]
        }
      },
      'Estado': {
        select: {
          options: [
            { name: 'Pendiente', color: 'yellow' },
            { name: 'En revisión', color: 'blue' },
            { name: 'Aprobada', color: 'green' },
            { name: 'Rechazada', color: 'red' }
          ]
        }
      },
      'Escuela relacionada': {
        relation: {
          database_id: escuelasDbId,
          type: 'single_property',
          single_property: {}
        }
      },
      'Email solicitante': { 
        email: {} 
      },
      'Nombre contacto': { 
        rich_text: {} 
      },
      'Fecha solicitud': { 
        created_time: {} 
      },
      'Nombre propuesto': { 
        rich_text: {} 
      },
      'Ciudad propuesta': { 
        rich_text: {} 
      },
      'Provincia propuesta': { 
        rich_text: {} 
      },
      'Región propuesta': { 
        rich_text: {} 
      },
      'Dirección propuesta': { 
        rich_text: {} 
      },
      'Teléfono propuesto': { 
        rich_text: {} 
      },
      'Email propuesto': { 
        rich_text: {} 
      },
      'Website propuesto': { 
        rich_text: {} 
      },
      'Cursos propuestos': { 
        rich_text: {} 
      },
      'Descripción propuesta': { 
        rich_text: {} 
      },
      'Imagen propuesta': { 
        url: {} 
      },
      'Notas internas': { 
        rich_text: {} 
      },
      'Revisado por': { 
        people: {} 
      },
      'Fecha aprobación': { 
        date: {} 
      }
    }
  };

  try {
    const response = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${data.message || JSON.stringify(data)}`);
    }

    console.log('✅ Base de datos "Solicitudes de Cambios" creada!');
    console.log('🔗 Database ID:', data.id);
    console.log('🔗 URL:', data.url);
    
    return data.id;
  } catch (error) {
    console.error('❌ Error creando Solicitudes de Cambios:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando configuración de Notion...\n');
    
    // Verificar configuración
    if (NOTION_TOKEN === 'TU_TOKEN_AQUI' || PARENT_PAGE_ID === 'ID_DE_LA_PAGINA_PADRE') {
      console.error('❌ Error: Debes configurar NOTION_TOKEN y PARENT_PAGE_ID en el script');
      process.exit(1);
    }
    
    // Crear base de datos de escuelas
    const escuelasDbId = await crearBaseEscuelasNauticas();
    
    // Esperar un momento para asegurar que la primera DB está lista
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Crear base de datos de solicitudes (con relación a escuelas)
    const solicitudesDbId = await crearBaseSolicitudesCambios(escuelasDbId);
    
    console.log('\n✨ ¡Configuración completada con éxito!');
    console.log('\n📋 GUARDA ESTOS DATABASE IDs:\n');
    console.log(`Escuelas Náuticas: ${escuelasDbId}`);
    console.log(`Solicitudes de Cambios: ${solicitudesDbId}`);
    console.log('\n💡 Las bases de datos están listas para usar!\n');
    
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
    if (error.message.includes('object_not_found')) {
      console.error('\n💡 Verifica que:');
      console.error('   1. El PARENT_PAGE_ID es correcto');
      console.error('   2. Has conectado la página con tu integración (menú "..." → "Add connections")');
    }
    process.exit(1);
  }
}

main();