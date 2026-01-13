// Script para crear la base de datos de Personas y relacionarla con Escuelas

// CONFIGURACIÓN - Completa estos valores
const NOTION_TOKEN = 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO'; // Token de tu integración
const PARENT_PAGE_ID = '2da1dd90bfd6809596e0c1d958f62b99'; // ID de la página donde crear las bases de datos
const ESCUELAS_DB_ID = '2da1dd90bfd681469a7ae6813a5e08cc'; // Database ID de "Escuelas Náuticas" (Page ID, no View ID)
const SOLICITUDES_DB_ID = '2da1dd90bfd681a9bd17e46e840deb19'; // Database ID de "Solicitudes de Cambios" (Page ID, no View ID)

// Helper function to resolve page ID to database ID if needed
async function resolveDatabaseId(possibleId, name) {
  // First, try to retrieve it as a database
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${possibleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name}: Es un Database ID válido`);
      return possibleId;
    }
    
    const errorData = await response.json();
    // If it's a 404, try as a page
    if (response.status === 404) {
      throw new Error('Not found as database');
    }
    throw new Error(errorData.message || 'Unknown error');
  } catch (error) {
    // Not a database, try as a page
    if (error.message.includes('Not found as database') || error.message.includes('Could not find')) {
      try {
        const response = await fetch(`https://api.notion.com/v1/pages/${possibleId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          }
        });

        if (response.ok) {
          const page = await response.json();
          
          // In Notion, if a page IS a database, the object type will be "database"
          // and we can use the same ID
          if (page.object === 'database') {
            console.log(`✅ ${name}: Es una página que es una base de datos (usando el mismo ID)`);
            return possibleId;
          }

          // If it's a regular page, search for child_database blocks
          // Note: For inline databases, we need to get the database ID from the block
          const childrenResponse = await fetch(`https://api.notion.com/v1/blocks/${possibleId}/children`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${NOTION_TOKEN}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28'
            }
          });

          if (childrenResponse.ok) {
            const children = await childrenResponse.json();
            for (const child of children.results) {
              if (child.type === 'child_database') {
                // For child_database blocks, try to get the database ID
                // The database ID might be in child.child_database.id or we use the block ID
                const dbId = child.child_database?.id || child.id;
                console.log(`✅ ${name}: Encontrado Database ID desde página (child_database): ${dbId}`);
                return dbId;
              }
            }
          }

          throw new Error(`${name}: La página no contiene una base de datos. Asegúrate de usar el Database ID, no el Page ID.`);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Page not found');
        }
      } catch (pageError) {
        throw new Error(`${name}: No se pudo encontrar como Database ID ni como Page ID. Error: ${pageError.message}`);
      }
    } else {
      throw error;
    }
  }
}

async function crearBasePersonas(escuelasDbId, solicitudesDbId) {
  console.log('👥 Creando base de datos: Personas...');
  
  const payload = {
    parent: { 
      type: 'page_id',
      page_id: PARENT_PAGE_ID 
    },
    title: [
      {
        type: 'text',
        text: { content: 'Personas' }
      }
    ],
    properties: {
      'Nombre completo': { 
        title: {} 
      },
      'Email': { 
        email: {} 
      },
      'Teléfono': { 
        phone_number: {} 
      },
      'Rol': {
        select: {
          options: [
            { name: 'Dueño', color: 'red' },
            { name: 'Director', color: 'orange' },
            { name: 'Instructor', color: 'blue' },
            { name: 'Administrativo', color: 'green' },
            { name: 'Alumno', color: 'purple' },
            { name: 'Otro', color: 'gray' }
          ]
        }
      },
      'Escuela': {
        relation: {
          database_id: escuelasDbId,
          type: 'single_property',
          single_property: {}
        }
      },
      'Cargo/Posición': { 
        rich_text: {} 
      },
      'DNI/NIE': { 
        rich_text: {} 
      },
      'Fecha de nacimiento': { 
        date: {} 
      },
      'Dirección': { 
        rich_text: {} 
      },
      'Ciudad': { 
        rich_text: {} 
      },
      'Código postal': { 
        rich_text: {} 
      },
      'Notas': { 
        rich_text: {} 
      },
      'Activo': { 
        checkbox: {} 
      },
      'Fecha de alta': { 
        date: {} 
      },
      'Fecha de baja': { 
        date: {} 
      },
      'Solicitudes enviadas': {
        relation: {
          database_id: solicitudesDbId,
          type: 'dual_property',
          dual_property: {}
        }
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

    console.log('✅ Base de datos "Personas" creada!');
    console.log('🔗 Database ID:', data.id);
    console.log('🔗 URL:', data.url);
    
    return data.id;
  } catch (error) {
    console.error('❌ Error creando Personas:', error.message);
    if (error.message.includes('Could not find database')) {
      console.error('\n💡 SOLUCIÓN: El problema es que la base de datos "Escuelas Náuticas" no está compartida con tu integración.');
      console.error('   Para solucionarlo:');
      console.error('   1. Abre la base de datos "Escuelas Náuticas" en Notion');
      console.error('   2. Haz clic en el menú "..." (arriba a la derecha)');
      console.error('   3. Selecciona "Add connections" o "Connections"');
      console.error('   4. Selecciona tu integración de la lista');
      console.error(`   5. Verifica que el Database ID sea correcto: ${escuelasDbId}`);
    }
    throw error;
  }
}

async function actualizarSolicitudes(personasDbId, solicitudesDbId) {
  console.log('\n🔄 Actualizando base de datos "Solicitudes de Cambios"...');
  
  const payload = {
    properties: {
      'Persona contacto': {
        relation: {
          database_id: personasDbId,
          type: 'dual_property',
          dual_property: {
            synced_property_name: 'Solicitudes enviadas'
          }
        }
      }
    }
  };

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${solicitudesDbId}`, {
      method: 'PATCH',
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

    console.log('✅ Relación añadida en "Solicitudes de Cambios"');
    
  } catch (error) {
    console.error('❌ Error actualizando Solicitudes:', error.message);
    throw error;
  }
}

async function actualizarEscuelas(personasDbId, escuelasDbId) {
  console.log('\n🔄 Actualizando base de datos "Escuelas Náuticas"...');
  
  const payload = {
    properties: {
      'Equipo': {
        relation: {
          database_id: personasDbId,
          type: 'dual_property',
          dual_property: {
            synced_property_name: 'Escuela'
          }
        }
      }
    }
  };

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${escuelasDbId}`, {
      method: 'PATCH',
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

    console.log('✅ Relación añadida en "Escuelas Náuticas"');
    
  } catch (error) {
    console.error('❌ Error actualizando Escuelas:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando creación de base de datos de Personas...\n');
    
    // Verificar configuración
    if (NOTION_TOKEN === 'TU_TOKEN_AQUI' || 
        PARENT_PAGE_ID === 'ID_DE_LA_PAGINA_PADRE' ||
        ESCUELAS_DB_ID === 'ID_DE_BASE_ESCUELAS' ||
        SOLICITUDES_DB_ID === 'ID_DE_BASE_SOLICITUDES') {
      console.error('❌ Error: Debes configurar todos los valores en el script');
      console.error('   - NOTION_TOKEN');
      console.error('   - PARENT_PAGE_ID');
      console.error('   - ESCUELAS_DB_ID');
      console.error('   - SOLICITUDES_DB_ID');
      process.exit(1);
    }
    
    // Resolver Database IDs (pueden ser Page IDs que contienen databases)
    console.log('🔍 Verificando Database IDs...\n');
    const resolvedEscuelasDbId = await resolveDatabaseId(ESCUELAS_DB_ID, 'Escuelas Náuticas');
    const resolvedSolicitudesDbId = await resolveDatabaseId(SOLICITUDES_DB_ID, 'Solicitudes de Cambios');
    console.log('');
    
    // Crear base de datos de personas usando los IDs resueltos
    const personasDbId = await crearBasePersonas(resolvedEscuelasDbId, resolvedSolicitudesDbId);
    
    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar Solicitudes para añadir relación con Personas
    await actualizarSolicitudes(personasDbId, resolvedSolicitudesDbId);
    
    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Actualizar Escuelas para añadir relación con Personas
    await actualizarEscuelas(personasDbId, resolvedEscuelasDbId);
    
    console.log('\n✨ ¡Configuración completada con éxito!');
    console.log('\n📋 GUARDA ESTE DATABASE ID:\n');
    console.log(`Personas: ${personasDbId}`);
    console.log('\n💡 Resumen de relaciones creadas:');
    console.log('   • Personas → Escuela (cada persona puede estar en una escuela)');
    console.log('   • Escuelas → Equipo (cada escuela puede tener múltiples personas)');
    console.log('   • Personas → Solicitudes enviadas (cada persona puede enviar múltiples solicitudes)');
    console.log('   • Solicitudes → Persona contacto (cada solicitud tiene una persona de contacto)\n');
    
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
    if (error.message.includes('object_not_found') || error.message.includes('Could not find database')) {
      console.error('\n💡 Verifica que:');
      console.error('   1. Los Database IDs son correctos');
      console.error('   2. Has compartido TODAS las bases de datos con tu integración:');
      console.error('      - La página padre (donde se crean las bases de datos)');
      console.error('      - La base de datos "Escuelas Náuticas"');
      console.error('      - La base de datos "Solicitudes de Cambios"');
      console.error('   3. Para compartir: abre cada base de datos → "..." → "Add connections" → selecciona tu integración');
    }
    process.exit(1);
  }
}

main();