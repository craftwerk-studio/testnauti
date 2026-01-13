// ⚠️⚠️⚠️ ESTE SCRIPT NO FUNCIONA ⚠️⚠️⚠️
//
// La API de Notion NO soporta la creación de vistas programáticamente.
// El endpoint /databases/{id}/views NO EXISTE en la API de Notion.
//
// ✅ SOLUCIÓN: Usa el archivo GUIA-CREAR-VISTAS-MANUAL.md
//
// Este archivo se mantiene solo como referencia de las configuraciones
// que deberías usar al crear las vistas manualmente en Notion.
//
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

console.error('❌ ERROR: Este script no puede ejecutarse.');
console.error('❌ La API de Notion no soporta la creación de vistas.');
console.error('');
console.error('✅ SOLUCIÓN: Lee el archivo GUIA-CREAR-VISTAS-MANUAL.md');
console.error('✅ Ahí encontrarás instrucciones para crear las vistas manualmente.');
console.error('');
process.exit(1);

// Script para crear vistas personalizadas en la base de datos Escuelas Náuticas
// Genera vistas organizadas por región, ciudad, estado, y propósito
// Requisitos: Node.js 18+ (fetch nativo)

const NOTION_VERSION = '2022-06-28'; // Versión de la API de Notion

// CONFIGURACIÓN - Completa estos valores
const NOTION_TOKEN = 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO'; // Token de tu integración
const PARENT_PAGE_ID = '2da1dd90bfd6809596e0c1d958f62b99'; // ID de la página donde crear las bases de datos
const ESCUELAS_DB_ID = '2da1dd90bfd681469a7ae6813a5e08cc'; // Database ID de "Escuelas Náuticas" (Page ID, no View ID)
const SOLICITUDES_DB_ID = '2da1dd90bfd681a9bd17e46e840deb19'; //

/**
 * Crea una vista en la base de datos de Escuelas Náuticas
 */
async function crearVista(config) {
  const { name, type, filter, sorts, properties } = config;

  console.log(`📋 Creando vista: ${name} (${type})...`);

  const payload = {
    type: type || 'table',
    name: name
  };

  // Agregar filtro si existe
  if (filter) {
    payload.filter = filter;
  }

  // Agregar ordenamiento si existe
  if (sorts) {
    payload.sorts = sorts;
  }

  // Agregar configuración de propiedades visibles si existe
  if (properties) {
    payload.properties = properties;
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${ESCUELAS_DB_ID}/views`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': NOTION_VERSION
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${data.message || JSON.stringify(data)}`);
    }

    console.log(`✅ Vista "${name}" creada!`);
    console.log(`🔗 View ID: ${data.id}\n`);

    return data;
  } catch (error) {
    console.error(`❌ Error creando vista "${name}":`, error.message);
    throw error;
  }
}

/**
 * Vistas principales por propósito
 */
async function crearVistasPrincipales() {
  console.log('\n=== 📊 CREANDO VISTAS PRINCIPALES ===\n');

  const vistas = [];

  // 1. Vista completa (tabla con todas las columnas)
  vistas.push(await crearVista({
    name: '📋 Todas las Escuelas',
    type: 'table',
    sorts: [
      {
        property: 'Title',
        direction: 'ascending'
      }
    ]
  }));

  // 2. Vista de galería con imágenes destacadas
  vistas.push(await crearVista({
    name: '🖼️ Galería de Escuelas',
    type: 'gallery',
    filter: {
      property: 'Featured Picture',
      files: {
        is_not_empty: true
      }
    },
    sorts: [
      {
        property: 'Featured',
        direction: 'descending'
      },
      {
        property: 'Title',
        direction: 'ascending'
      }
    ]
  }));

  // 3. Vista de escuelas destacadas
  vistas.push(await crearVista({
    name: '⭐ Escuelas Destacadas',
    type: 'table',
    filter: {
      property: 'Featured',
      checkbox: {
        equals: true
      }
    },
    sorts: [
      {
        property: 'Title',
        direction: 'ascending'
      }
    ]
  }));

  // 4. Vista para revisión (pendientes de aprobación)
  vistas.push(await crearVista({
    name: '🔍 Pendientes de Revisión',
    type: 'table',
    filter: {
      property: 'Status',
      select: {
        equals: 'Pending Review'
      }
    },
    sorts: [
      {
        property: 'Created Time',
        direction: 'descending'
      }
    ]
  }));

  // 5. Vista de escuelas publicadas
  vistas.push(await crearVista({
    name: '✅ Publicadas',
    type: 'table',
    filter: {
      property: 'Status',
      select: {
        equals: 'Published'
      }
    },
    sorts: [
      {
        property: 'Last Edited Time',
        direction: 'descending'
      }
    ]
  }));

  // 6. Vista de borradores
  vistas.push(await crearVista({
    name: '📝 Borradores',
    type: 'table',
    filter: {
      property: 'Status',
      select: {
        equals: 'Draft'
      }
    }
  }));

  return vistas;
}

/**
 * Vistas por región/comunidad autónoma
 */
async function crearVistasPorRegion() {
  console.log('\n=== 🗺️ CREANDO VISTAS POR REGIÓN ===\n');

  const regiones = [
    'Andalucía',
    'Aragón',
    'Asturias',
    'Cantabria',
    'Cataluña',
    'Ceuta',
    'Comunidad de Madrid',
    'Comunidad Valenciana',
    'Extremadura',
    'Galicia',
    'Islas Baleares',
    'Islas Canarias',
    'La Rioja',
    'Melilla',
    'Navarra',
    'País Vasco',
    'Región de Murcia'
  ];

  const vistas = [];

  for (const region of regiones) {
    vistas.push(await crearVista({
      name: `📍 ${region}`,
      type: 'table',
      filter: {
        and: [
          {
            property: 'Area',
            select: {
              equals: region
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      },
      sorts: [
        {
          property: 'City',
          direction: 'ascending'
        },
        {
          property: 'Title',
          direction: 'ascending'
        }
      ]
    }));
  }

  return vistas;
}

/**
 * Vistas por tipo de servicio/curso
 */
async function crearVistasPorServicio() {
  console.log('\n=== 🎓 CREANDO VISTAS POR SERVICIO ===\n');

  const servicios = [
    { nombre: 'PER', emoji: '⛵' },
    { nombre: 'PNB', emoji: '🚤' },
    { nombre: 'Patrón de Yate', emoji: '🛥️' },
    { nombre: 'Capitán de Yate', emoji: '⚓' },
    { nombre: 'Radiotelefonista', emoji: '📻' },
    { nombre: 'Moto Náutica', emoji: '🏍️' },
    { nombre: 'Vela', emoji: '⛵' },
    { nombre: 'Buceo', emoji: '🤿' }
  ];

  const vistas = [];

  for (const servicio of servicios) {
    vistas.push(await crearVista({
      name: `${servicio.emoji} ${servicio.nombre}`,
      type: 'table',
      filter: {
        and: [
          {
            property: 'Services',
            multi_select: {
              contains: servicio.nombre
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Featured',
          direction: 'descending'
        },
        {
          property: 'Area',
          direction: 'ascending'
        },
        {
          property: 'Title',
          direction: 'ascending'
        }
      ]
    }));
  }

  return vistas;
}

/**
 * Vistas de gestión interna
 */
async function crearVistasGestion() {
  console.log('\n=== 🔧 CREANDO VISTAS DE GESTIÓN ===\n');

  const vistas = [];

  // 1. Vista de escuelas sin descripción
  vistas.push(await crearVista({
    name: '⚠️ Sin Descripción',
    type: 'table',
    filter: {
      property: 'Description',
      rich_text: {
        is_empty: true
      }
    }
  }));

  // 2. Vista de escuelas sin imagen
  vistas.push(await crearVista({
    name: '📷 Sin Imagen',
    type: 'table',
    filter: {
      property: 'Featured Picture',
      files: {
        is_empty: true
      }
    }
  }));

  // 3. Vista de escuelas sin contacto
  vistas.push(await crearVista({
    name: '📞 Sin Contacto',
    type: 'table',
    filter: {
      or: [
        {
          property: 'Phone',
          phone_number: {
            is_empty: true
          }
        },
        {
          property: 'Email',
          email: {
            is_empty: true
          }
        }
      ]
    }
  }));

  // 4. Vista de escuelas sin website
  vistas.push(await crearVista({
    name: '🌐 Sin Website',
    type: 'table',
    filter: {
      property: 'Website',
      url: {
        is_empty: true
      }
    }
  }));

  // 5. Vista de datos incompletos
  vistas.push(await crearVista({
    name: '🚨 Datos Incompletos',
    type: 'table',
    filter: {
      or: [
        {
          property: 'Description',
          rich_text: {
            is_empty: true
          }
        },
        {
          property: 'Phone',
          phone_number: {
            is_empty: true
          }
        },
        {
          property: 'Email',
          email: {
            is_empty: true
          }
        },
        {
          property: 'Featured Picture',
          files: {
            is_empty: true
          }
        }
      ]
    },
    sorts: [
      {
        property: 'Last Edited Time',
        direction: 'descending'
      }
    ]
  }));

  // 6. Vista de modificaciones recientes
  vistas.push(await crearVista({
    name: '🕐 Modificadas Recientemente',
    type: 'table',
    sorts: [
      {
        property: 'Last Edited Time',
        direction: 'descending'
      }
    ]
  }));

  // 7. Vista de nuevas escuelas
  vistas.push(await crearVista({
    name: '🆕 Nuevas',
    type: 'table',
    sorts: [
      {
        property: 'Created Time',
        direction: 'descending'
      }
    ]
  }));

  return vistas;
}

/**
 * Vistas por ciudades principales
 */
async function crearVistasCiudadesPrincipales() {
  console.log('\n=== 🏙️ CREANDO VISTAS POR CIUDAD ===\n');

  const ciudades = [
    { nombre: 'Barcelona', emoji: '🏖️' },
    { nombre: 'Madrid', emoji: '🏛️' },
    { nombre: 'Valencia', emoji: '🥘' },
    { nombre: 'Sevilla', emoji: '💃' },
    { nombre: 'Palma de Mallorca', emoji: '🏝️' },
    { nombre: 'Las Palmas de Gran Canaria', emoji: '🌴' },
    { nombre: 'Alicante', emoji: '🌊' },
    { nombre: 'Málaga', emoji: '☀️' },
    { nombre: 'Bilbao', emoji: '🌉' },
    { nombre: 'A Coruña', emoji: '🏰' }
  ];

  const vistas = [];

  for (const ciudad of ciudades) {
    vistas.push(await crearVista({
      name: `${ciudad.emoji} ${ciudad.nombre}`,
      type: 'table',
      filter: {
        and: [
          {
            property: 'City',
            select: {
              equals: ciudad.nombre
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Featured',
          direction: 'descending'
        },
        {
          property: 'Title',
          direction: 'ascending'
        }
      ]
    }));
  }

  return vistas;
}

/**
 * Script principal
 */
async function main() {
  try {
    console.log('🚀 Iniciando creación de vistas en Escuelas Náuticas...\n');

    // Verificar configuración
    if (NOTION_TOKEN === 'TU_TOKEN_AQUI' || ESCUELAS_DB_ID === 'ID_DE_LA_BASE_DE_DATOS') {
      console.error('❌ Error: Debes configurar NOTION_TOKEN y ESCUELAS_DB_ID en el script');
      process.exit(1);
    }

    const todasLasVistas = [];

    // Crear vistas principales
    const vistasPrincipales = await crearVistasPrincipales();
    todasLasVistas.push(...vistasPrincipales);

    // Crear vistas por región
    const vistasPorRegion = await crearVistasPorRegion();
    todasLasVistas.push(...vistasPorRegion);

    // Crear vistas por servicio
    const vistasPorServicio = await crearVistasPorServicio();
    todasLasVistas.push(...vistasPorServicio);

    // Crear vistas de gestión
    const vistasGestion = await crearVistasGestion();
    todasLasVistas.push(...vistasGestion);

    // Crear vistas por ciudades principales
    const vistasCiudades = await crearVistasCiudadesPrincipales();
    todasLasVistas.push(...vistasCiudades);

    console.log('\n✨ ¡Configuración de vistas completada con éxito!');
    console.log(`\n📊 Total de vistas creadas: ${todasLasVistas.length}\n`);
    console.log('📋 RESUMEN DE VISTAS:\n');
    console.log(`   • Vistas principales: ${vistasPrincipales.length}`);
    console.log(`   • Vistas por región: ${vistasPorRegion.length}`);
    console.log(`   • Vistas por servicio: ${vistasPorServicio.length}`);
    console.log(`   • Vistas de gestión: ${vistasGestion.length}`);
    console.log(`   • Vistas por ciudad: ${vistasCiudades.length}`);
    console.log('\n💡 Las vistas están listas para usar en Notion!\n');

  } catch (error) {
    console.error('\n❌ Error general:', error.message);
    if (error.message.includes('Could not find database')) {
      console.error('\n💡 Verifica que:');
      console.error('   1. El ESCUELAS_DB_ID es correcto (usa el Page ID, no el View ID)');
      console.error('   2. Has conectado la base de datos con tu integración (menú "..." → "Add connections")');
    }
    process.exit(1);
  }
}

main();
