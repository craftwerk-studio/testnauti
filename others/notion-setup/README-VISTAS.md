# Guía de Vistas para Escuelas Náuticas

⚠️ **IMPORTANTE**: La API de Notion no soporta la creación de vistas programáticamente. Las vistas deben crearse manualmente en la interfaz de Notion.

📖 **Usa el archivo `GUIA-CREAR-VISTAS-MANUAL.md`** para instrucciones detalladas paso a paso sobre cómo crear cada vista.

## 🚀 Creación Manual (Recomendado)

Sigue la guía en `GUIA-CREAR-VISTAS-MANUAL.md` que incluye:
- Configuraciones exactas de filtros y ordenamiento
- Checklist de progreso
- Tips para crear vistas más rápido
- Estimación de tiempo (~60 minutos)

## 📊 Vistas Creadas

El script crea **50+ vistas** organizadas en 5 categorías:

### 1. Vistas Principales (6 vistas)

- **📋 Todas las Escuelas** - Vista de tabla completa, ordenada alfabéticamente
- **🖼️ Galería de Escuelas** - Vista de galería mostrando solo escuelas con imágenes
- **⭐ Escuelas Destacadas** - Filtrado por escuelas marcadas como destacadas
- **🔍 Pendientes de Revisión** - Escuelas en estado "Pending Review"
- **✅ Publicadas** - Escuelas ya publicadas, ordenadas por última modificación
- **📝 Borradores** - Escuelas en estado "Draft"

### 2. Vistas por Región (17 vistas)

Una vista filtrada para cada Comunidad Autónoma:

- 📍 Andalucía
- 📍 Aragón
- 📍 Asturias
- 📍 Cantabria
- 📍 Cataluña
- 📍 Ceuta
- 📍 Comunidad de Madrid
- 📍 Comunidad Valenciana
- 📍 Extremadura
- 📍 Galicia
- 📍 Islas Baleares
- 📍 Islas Canarias
- 📍 La Rioja
- 📍 Melilla
- 📍 Navarra
- 📍 País Vasco
- 📍 Región de Murcia

Cada vista muestra solo escuelas publicadas de esa región, ordenadas por ciudad.

### 3. Vistas por Servicio/Curso (8 vistas)

Filtra escuelas que ofrecen cursos específicos:

- ⛵ PER
- 🚤 PNB
- 🛥️ Patrón de Yate
- ⚓ Capitán de Yate
- 📻 Radiotelefonista
- 🏍️ Moto Náutica
- ⛵ Vela
- 🤿 Buceo

Cada vista muestra escuelas publicadas que ofrecen ese servicio, priorizando destacadas.

### 4. Vistas de Gestión Interna (7 vistas)

Para control de calidad y gestión:

- **⚠️ Sin Descripción** - Escuelas que necesitan descripción
- **📷 Sin Imagen** - Escuelas sin imagen destacada
- **📞 Sin Contacto** - Escuelas sin teléfono o email
- **🌐 Sin Website** - Escuelas sin sitio web
- **🚨 Datos Incompletos** - Escuelas con cualquier dato faltante importante
- **🕐 Modificadas Recientemente** - Ordenadas por última edición
- **🆕 Nuevas** - Ordenadas por fecha de creación

### 5. Vistas por Ciudades Principales (10 vistas)

Vistas para las ciudades con más escuelas:

- 🏖️ Barcelona
- 🏛️ Madrid
- 🥘 Valencia
- 💃 Sevilla
- 🏝️ Palma de Mallorca
- 🌴 Las Palmas de Gran Canaria
- 🌊 Alicante
- ☀️ Málaga
- 🌉 Bilbao
- 🏰 A Coruña

## 🎯 Casos de Uso

### Para Editores de Contenido

1. **Completar perfiles incompletos**: Usa las vistas de gestión (⚠️ Sin Descripción, 📷 Sin Imagen, etc.)
2. **Revisar nuevas escuelas**: Vista "🆕 Nuevas" o "🔍 Pendientes de Revisión"
3. **Gestionar por región**: Selecciona la vista de tu región asignada

### Para Administradores

1. **Control de calidad**: Vista "🚨 Datos Incompletos"
2. **Monitorear actividad**: Vista "🕐 Modificadas Recientemente"
3. **Aprobar publicaciones**: Vista "🔍 Pendientes de Revisión"

### Para Usuarios Públicos (futuras integraciones)

1. **Buscar por ciudad**: Vistas de ciudades principales
2. **Buscar por curso**: Vistas por servicio
3. **Ver destacadas**: Vista "⭐ Escuelas Destacadas"
4. **Navegar por región**: Vistas por región

## 🔧 Configuración

El script usa las siguientes constantes (ya configuradas):

```javascript
const NOTION_TOKEN = 'ntn_m80122183267lnLWbNBjMqyVameguPNtOy3jf1zmMhC8kO';
const ESCUELAS_DB_ID = '2da1dd90bfd681469a7ae6813a5e08cc';
const NOTION_VERSION = '2022-06-28';
```

## ⚠️ Prerequisitos

1. **Base de datos creada**: Ejecuta primero `setup-escuelas-v2.js` para crear la estructura de la BD
2. **Integración conectada**: La integración debe tener acceso a la base de datos
3. **Node.js 18+**: El script usa `fetch` nativo

## 📝 Notas Importantes

- Las vistas se crean en la base de datos existente, no la reemplazan
- Si una vista ya existe con el mismo nombre, Notion creará una nueva con sufijo numérico
- Puedes ejecutar el script múltiples veces de forma segura
- Las vistas pueden editarse manualmente en Notion después de crearlas

## 🎨 Personalización

Para crear vistas adicionales o modificar las existentes, edita las funciones en el script:

```javascript
// Agregar una nueva vista de región
vistas.push(await crearVista({
  name: '📍 Tu Nueva Región',
  type: 'table',
  filter: {
    property: 'Area',
    select: {
      equals: 'Nombre de la Región'
    }
  },
  sorts: [
    {
      property: 'Title',
      direction: 'ascending'
    }
  ]
}));
```

## 🔗 Tipos de Vista Disponibles

- `table` - Vista de tabla (por defecto)
- `gallery` - Vista de galería (ideal para imágenes)
- `board` - Vista de tablero (Kanban)
- `list` - Vista de lista
- `calendar` - Vista de calendario
- `timeline` - Vista de línea de tiempo

## 📊 Filtros y Ordenamiento

Cada vista puede incluir:

- **Filtros**: Condiciones para mostrar/ocultar registros
- **Ordenamiento**: Orden de los registros
- **Propiedades visibles**: Qué columnas mostrar (opcional)

## 🆘 Solución de Problemas

### Error: "Could not find database"

**Solución**: Verifica que:
1. El `ESCUELAS_DB_ID` sea correcto (usa el Page ID, no el View ID)
2. La integración esté conectada a la base de datos (menú "..." → "Add connections")

### Error: "API Error: Invalid request"

**Solución**: Verifica que:
1. La base de datos tenga las propiedades correctas (ejecuta `setup-escuelas-v2.js` primero)
2. Los nombres de propiedades coincidan exactamente

### Las vistas se crean con nombres duplicados

**Comportamiento normal**: Notion agrega sufijos numéricos si ya existe una vista con ese nombre. Puedes eliminar las vistas antiguas manualmente.

## 📚 Referencias

- [Notion API - Views](https://developers.notion.com/reference/create-a-database-view)
- [Notion API - Filters](https://developers.notion.com/reference/post-database-query-filter)
- [Notion API - Sorts](https://developers.notion.com/reference/post-database-query-sort)
