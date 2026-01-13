// Script para crear la estructura MEJORADA de la base de datos Escuelas Náuticas en Notion
// Versión 2.0 - Actualizada para mejor alineación con la aplicación TestNauti.co
// Requisitos: Node.js 18+ (fetch nativo)

// CONFIGURACIÓN - Completa estos valores
// const NOTION_TOKEN = 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO'; // Token de tu integración
// const PARENT_PAGE_ID = '2da1dd90bfd6809596e0c1d958f62b99'; // ID de la página donde crear las bases de datos
const NOTION_VERSION = '2022-06-28'; // Versión de la API de Notion

// CONFIGURACIÓN - Completa estos valores
const NOTION_TOKEN = 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO'; // Token de tu integración
const PARENT_PAGE_ID = '2da1dd90bfd6809596e0c1d958f62b99'; // ID de la página donde crear las bases de datos
const ESCUELAS_DB_ID = '2da1dd90bfd681469a7ae6813a5e08cc'; // Database ID de "Escuelas Náuticas" (Page ID, no View ID)
const SOLICITUDES_DB_ID = '2da1dd90bfd681a9bd17e46e840deb19'; // Database ID de "Solicitudes de Cambios" (Page ID, no View ID)

async function crearBaseEscuelasNauticasV2() {
  console.log('📚 Creando base de datos: Escuelas Náuticas V2...');

  const payload = {
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID
    },
    title: [
      {
        type: 'text',
        text: { content: 'Escuelas Náuticas V2' }
      }
    ],
    properties: {
      // ===== IDENTIFICACIÓN =====
      'Title': {
        title: {}
      },
      'Slug': {
        rich_text: {}
      },
      'ID': {
        rich_text: {}
      },

      // ===== INFORMACIÓN DE CONTACTO =====
      'Phone': {
        phone_number: {}
      },
      'Email': {
        email: {}
      },
      'Website': {
        url: {}
      },

      // ===== UBICACIÓN =====
      'City': {
        select: {
          options: [
            { name: 'A Coruña', color: 'blue' },
            { name: 'Algeciras', color: 'blue' },
            { name: 'Alicante', color: 'blue' },
            { name: 'Almería', color: 'blue' },
            { name: 'Barcelona', color: 'blue' },
            { name: 'Bilbao', color: 'blue' },
            { name: 'Cádiz', color: 'blue' },
            { name: 'Cartagena', color: 'blue' },
            { name: 'Castellón', color: 'blue' },
            { name: 'Ceuta', color: 'blue' },
            { name: 'Gijón', color: 'blue' },
            { name: 'Granada', color: 'blue' },
            { name: 'Huelva', color: 'blue' },
            { name: 'Ibiza', color: 'blue' },
            { name: 'Las Palmas de Gran Canaria', color: 'blue' },
            { name: 'Madrid', color: 'blue' },
            { name: 'Málaga', color: 'blue' },
            { name: 'Marbella', color: 'blue' },
            { name: 'Melilla', color: 'blue' },
            { name: 'Menorca', color: 'blue' },
            { name: 'Murcia', color: 'blue' },
            { name: 'Palma de Mallorca', color: 'blue' },
            { name: 'San Sebastián', color: 'blue' },
            { name: 'Santa Cruz de Tenerife', color: 'blue' },
            { name: 'Santander', color: 'blue' },
            { name: 'Sevilla', color: 'blue' },
            { name: 'Tarragona', color: 'blue' },
            { name: 'Valencia', color: 'blue' },
            { name: 'Vigo', color: 'blue' },
            { name: 'Zaragoza', color: 'blue' }
          ]
        }
      },
      'Area': {
        select: {
          options: [
            { name: 'Andalucía', color: 'orange' },
            { name: 'Aragón', color: 'orange' },
            { name: 'Asturias', color: 'orange' },
            { name: 'Cantabria', color: 'orange' },
            { name: 'Cataluña', color: 'orange' },
            { name: 'Ceuta', color: 'orange' },
            { name: 'Comunidad de Madrid', color: 'orange' },
            { name: 'Comunidad Valenciana', color: 'orange' },
            { name: 'Galicia', color: 'orange' },
            { name: 'Islas Baleares', color: 'orange' },
            { name: 'Islas Canarias', color: 'orange' },
            { name: 'Melilla', color: 'orange' },
            { name: 'País Vasco', color: 'orange' },
            { name: 'Región de Murcia', color: 'orange' }
          ]
        }
      },
      'Location': {
        rich_text: {}
      },

      // ===== CONTENIDO Y DESCRIPCIÓN =====
      'Short Description': {
        rich_text: {}
      },
      'Description': {
        rich_text: {}
      },

      // ===== IMÁGENES =====
      'Featured Picture': {
        files: {}
      },
      'Other Pictures': {
        files: {}
      },

      // ===== SERVICIOS Y CARACTERÍSTICAS =====
      'Services': {
        multi_select: {
          options: [
            // Cursos principales
            { name: 'PER', color: 'purple' },
            { name: 'PNB', color: 'purple' },
            { name: 'Patrón de Yate', color: 'purple' },
            { name: 'Capitán de Yate', color: 'purple' },
            { name: 'Patrón de Embarcaciones de Recreo', color: 'purple' },
            { name: 'Patrón para Navegación Básica', color: 'purple' },

            // Especialidades
            { name: 'Radiotelefonista', color: 'pink' },
            { name: 'Moto Náutica', color: 'pink' },
            { name: 'Vela', color: 'pink' },
            { name: 'Vela Crucero', color: 'pink' },
            { name: 'Motor', color: 'pink' },
            { name: 'Motor y Vela', color: 'pink' },
            { name: 'Navegación Costera', color: 'pink' },
            { name: 'Navegación Oceánica', color: 'pink' },

            // Otros servicios
            { name: 'Buceo', color: 'blue' },
            { name: 'Prácticas de navegación', color: 'blue' },
            { name: 'Prácticas de maniobras', color: 'blue' },
            { name: 'Cursos online', color: 'blue' },
            { name: 'Cursos presenciales', color: 'blue' },
            { name: 'Alquiler de embarcaciones', color: 'blue' },
            { name: 'Preparación exámenes', color: 'blue' },
            { name: 'Clases particulares', color: 'blue' }
          ]
        }
      },
      'Featured': {
        checkbox: {}
      },

      // ===== GESTIÓN Y PERMISOS =====
      'Owners': {
        people: {}
      },
      'Editors': {
        people: {}
      },

      // ===== REVIEWS Y VALORACIONES =====
      'Reviews Count': {
        number: {
          format: 'number'
        }
      },
      'Average Rating': {
        number: {
          format: 'number'
        }
      },
      'Reviews': {
        rich_text: {}
      },

      // ===== METADATA =====
      'Status': {
        select: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'Pending Review', color: 'yellow' },
            { name: 'Draft', color: 'gray' },
            { name: 'Inactive', color: 'red' }
          ]
        }
      },
      'Verified': {
        checkbox: {}
      },
      'Created Time': {
        created_time: {}
      },
      'Last Edited Time': {
        last_edited_time: {}
      },
      'Published Date': {
        date: {}
      },

      // ===== INFORMACIÓN ADICIONAL =====
      'Address': {
        rich_text: {}
      },
      'Postal Code': {
        rich_text: {}
      },
      'Social Media': {
        rich_text: {}
      },
      'Opening Hours': {
        rich_text: {}
      },
      'Price Range': {
        select: {
          options: [
            { name: '€', color: 'green' },
            { name: '€€', color: 'yellow' },
            { name: '€€€', color: 'orange' },
            { name: '€€€€', color: 'red' }
          ]
        }
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

    console.log('✅ Base de datos "Escuelas Náuticas V2" creada!');
    console.log('🔗 Database ID:', data.id);
    console.log('🔗 URL:', data.url);

    return data.id;
  } catch (error) {
    console.error('❌ Error creando Escuelas Náuticas V2:', error.message);
    throw error;
  }
}

async function crearBaseSolicitudesCambiosV2(escuelasDbId) {
  console.log('\n📚 Creando base de datos: Solicitudes de Cambios V2...');

  const payload = {
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID
    },
    title: [
      {
        type: 'text',
        text: { content: 'Solicitudes de Cambios V2' }
      }
    ],
    properties: {
      'Request Title': {
        title: {}
      },
      'Type': {
        select: {
          options: [
            { name: 'New School', color: 'green' },
            { name: 'Edit School', color: 'blue' },
            { name: 'Delete School', color: 'red' },
            { name: 'Add Review', color: 'purple' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'Pending', color: 'yellow' },
            { name: 'In Review', color: 'blue' },
            { name: 'Approved', color: 'green' },
            { name: 'Rejected', color: 'red' },
            { name: 'Needs Info', color: 'orange' }
          ]
        }
      },
      'Related School': {
        relation: {
          database_id: escuelasDbId,
          type: 'single_property',
          single_property: {}
        }
      },
      'Requester Email': {
        email: {}
      },
      'Contact Name': {
        rich_text: {}
      },
      'Request Date': {
        created_time: {}
      },

      // ===== PROPOSED CHANGES =====
      'Proposed Title': {
        rich_text: {}
      },
      'Proposed Slug': {
        rich_text: {}
      },
      'Proposed City': {
        rich_text: {}
      },
      'Proposed Area': {
        rich_text: {}
      },
      'Proposed Address': {
        rich_text: {}
      },
      'Proposed Location': {
        rich_text: {}
      },
      'Proposed Phone': {
        rich_text: {}
      },
      'Proposed Email': {
        rich_text: {}
      },
      'Proposed Website': {
        rich_text: {}
      },
      'Proposed Services': {
        rich_text: {}
      },
      'Proposed Short Description': {
        rich_text: {}
      },
      'Proposed Description': {
        rich_text: {}
      },
      'Proposed Featured Picture': {
        url: {}
      },
      'Proposed Other Pictures': {
        rich_text: {}
      },

      // ===== REVIEW INFORMATION =====
      'Review Rating': {
        number: {
          format: 'number'
        }
      },
      'Review Text': {
        rich_text: {}
      },
      'Review Author': {
        rich_text: {}
      },

      // ===== ADMINISTRATIVE =====
      'Internal Notes': {
        rich_text: {}
      },
      'Reviewed By': {
        people: {}
      },
      'Approval Date': {
        date: {}
      },
      'Priority': {
        select: {
          options: [
            { name: 'Low', color: 'gray' },
            { name: 'Medium', color: 'yellow' },
            { name: 'High', color: 'orange' },
            { name: 'Urgent', color: 'red' }
          ]
        }
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

    console.log('✅ Base de datos "Solicitudes de Cambios V2" creada!');
    console.log('🔗 Database ID:', data.id);
    console.log('🔗 URL:', data.url);

    return data.id;
  } catch (error) {
    console.error('❌ Error creando Solicitudes de Cambios V2:', error.message);
    throw error;
  }
}

async function crearBaseReviewsV2(escuelasDbId) {
  console.log('\n📚 Creando base de datos: Reviews...');

  const payload = {
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID
    },
    title: [
      {
        type: 'text',
        text: { content: 'Reviews' }
      }
    ],
    properties: {
      'Review Title': {
        title: {}
      },
      'School': {
        relation: {
          database_id: escuelasDbId,
          type: 'single_property',
          single_property: {}
        }
      },
      'Rating': {
        number: {
          format: 'number'
        }
      },
      'Review Text': {
        rich_text: {}
      },
      'Author Name': {
        rich_text: {}
      },
      'Author Email': {
        email: {}
      },
      'Verified Purchase': {
        checkbox: {}
      },
      'Course Taken': {
        rich_text: {}
      },
      'Review Date': {
        date: {}
      },
      'Status': {
        select: {
          options: [
            { name: 'Pending', color: 'yellow' },
            { name: 'Approved', color: 'green' },
            { name: 'Rejected', color: 'red' },
            { name: 'Flagged', color: 'orange' }
          ]
        }
      },
      'Helpful Count': {
        number: {
          format: 'number'
        }
      },
      'Created Time': {
        created_time: {}
      },
      'Published Date': {
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

    console.log('✅ Base de datos "Reviews" creada!');
    console.log('🔗 Database ID:', data.id);
    console.log('🔗 URL:', data.url);

    return data.id;
  } catch (error) {
    console.error('❌ Error creando Reviews:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando configuración de Notion V2...\n');

    // Verificar configuración
    if (NOTION_TOKEN === 'TU_TOKEN_AQUI' || PARENT_PAGE_ID === 'ID_DE_LA_PAGINA_PADRE') {
      console.error('❌ Error: Debes configurar NOTION_TOKEN y PARENT_PAGE_ID en el script');
      process.exit(1);
    }

    // Crear base de datos de escuelas V2
    const escuelasDbId = await crearBaseEscuelasNauticasV2();

    // Esperar un momento para asegurar que la primera DB está lista
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Crear base de datos de solicitudes V2 (con relación a escuelas)
    const solicitudesDbId = await crearBaseSolicitudesCambiosV2(escuelasDbId);

    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Crear base de datos de reviews (con relación a escuelas)
    const reviewsDbId = await crearBaseReviewsV2(escuelasDbId);

    console.log('\n✨ ¡Configuración completada con éxito!');
    console.log('\n📋 GUARDA ESTOS DATABASE IDs:\n');
    console.log(`Escuelas Náuticas V2: ${escuelasDbId}`);
    console.log(`Solicitudes de Cambios V2: ${solicitudesDbId}`);
    console.log(`Reviews: ${reviewsDbId}`);
    console.log('\n💡 Las bases de datos están listas para usar!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Verifica que las bases de datos están compartidas con tu integración');
    console.log('   2. Guarda los Database IDs en tus variables de entorno');
    console.log('   3. Actualiza tu aplicación para usar estos nuevos IDs\n');

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
