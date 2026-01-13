# Guía para Crear Vistas Manualmente en Escuelas Náuticas

**⚠️ Nota Importante**: La API de Notion no permite crear vistas programáticamente. Esta guía te ayudará a crear las vistas manualmente de forma rápida y eficiente.

## 🎯 Cómo Crear una Vista en Notion

1. Abre la base de datos "Escuelas Náuticas"
2. Haz clic en "+ Add a view" en la parte superior
3. Selecciona el tipo de vista (Table, Gallery, etc.)
4. Dale un nombre a la vista
5. Configura los filtros y ordenamiento según las especificaciones abajo

---

## 📊 VISTAS PRINCIPALES

### 1. 📋 Todas las Escuelas
- **Tipo**: Table
- **Filtros**: Ninguno
- **Ordenar por**: Title (A → Z)

### 2. 🖼️ Galería de Escuelas
- **Tipo**: Gallery
- **Filtros**:
  - Featured Picture → Is not empty
- **Ordenar por**:
  1. Featured (Checked → Unchecked)
  2. Title (A → Z)
- **Card Preview**: Featured Picture
- **Card Size**: Medium

### 3. ⭐ Escuelas Destacadas
- **Tipo**: Table
- **Filtros**:
  - Featured → Is checked
- **Ordenar por**: Title (A → Z)

### 4. 🔍 Pendientes de Revisión
- **Tipo**: Table
- **Filtros**:
  - Status → Is → Pending Review
- **Ordenar por**: Created Time (Newest → Oldest)

### 5. ✅ Publicadas
- **Tipo**: Table
- **Filtros**:
  - Status → Is → Published
- **Ordenar por**: Last Edited Time (Newest → Oldest)

### 6. 📝 Borradores
- **Tipo**: Table
- **Filtros**:
  - Status → Is → Draft
- **Ordenar por**: Last Edited Time (Newest → Oldest)

---

## 🗺️ VISTAS POR REGIÓN

**Instrucciones generales para todas las vistas de región:**
- **Tipo**: Table
- **Filtros**:
  1. Area → Is → [Nombre de la Región]
  2. Status → Is → Published
- **Ordenar por**:
  1. City (A → Z)
  2. Title (A → Z)

### Lista de vistas a crear:

1. **📍 Andalucía** → Area: Andalucía
2. **📍 Aragón** → Area: Aragón
3. **📍 Asturias** → Area: Asturias
4. **📍 Cantabria** → Area: Cantabria
5. **📍 Cataluña** → Area: Cataluña
6. **📍 Ceuta** → Area: Ceuta
7. **📍 Comunidad de Madrid** → Area: Comunidad de Madrid
8. **📍 Comunidad Valenciana** → Area: Comunidad Valenciana
9. **📍 Extremadura** → Area: Extremadura
10. **📍 Galicia** → Area: Galicia
11. **📍 Islas Baleares** → Area: Islas Baleares
12. **📍 Islas Canarias** → Area: Islas Canarias
13. **📍 La Rioja** → Area: La Rioja
14. **📍 Melilla** → Area: Melilla
15. **📍 Navarra** → Area: Navarra
16. **📍 País Vasco** → Area: País Vasco
17. **📍 Región de Murcia** → Area: Región de Murcia

---

## 🎓 VISTAS POR SERVICIO/CURSO

**Instrucciones generales para todas las vistas de servicio:**
- **Tipo**: Table
- **Filtros**:
  1. Services → Contains → [Nombre del Servicio]
  2. Status → Is → Published
- **Ordenar por**:
  1. Featured (Checked → Unchecked)
  2. Area (A → Z)
  3. Title (A → Z)

### Lista de vistas a crear:

1. **⛵ PER** → Services contains: PER
2. **🚤 PNB** → Services contains: PNB
3. **🛥️ Patrón de Yate** → Services contains: Patrón de Yate
4. **⚓ Capitán de Yate** → Services contains: Capitán de Yate
5. **📻 Radiotelefonista** → Services contains: Radiotelefonista
6. **🏍️ Moto Náutica** → Services contains: Moto Náutica
7. **⛵ Vela** → Services contains: Vela
8. **🤿 Buceo** → Services contains: Buceo

---

## 🔧 VISTAS DE GESTIÓN INTERNA

### 1. ⚠️ Sin Descripción
- **Tipo**: Table
- **Filtros**:
  - Description → Is empty
- **Ordenar por**: Last Edited Time (Newest → Oldest)

### 2. 📷 Sin Imagen
- **Tipo**: Table
- **Filtros**:
  - Featured Picture → Is empty
- **Ordenar por**: Last Edited Time (Newest → Oldest)

### 3. 📞 Sin Contacto
- **Tipo**: Table
- **Filtros** (usar "Or" entre estos):
  - Phone → Is empty
  - Email → Is empty
- **Ordenar por**: Last Edited Time (Newest → Oldest)

**Cómo configurar filtro "Or":**
1. Añade el primer filtro (Phone → Is empty)
2. Haz clic en "+ Add filter"
3. En la parte superior de los filtros, cambia "And" a "Or"
4. Añade el segundo filtro (Email → Is empty)

### 4. 🌐 Sin Website
- **Tipo**: Table
- **Filtros**:
  - Website → Is empty
- **Ordenar por**: Last Edited Time (Newest → Oldest)

### 5. 🚨 Datos Incompletos
- **Tipo**: Table
- **Filtros** (usar "Or" entre todos):
  - Description → Is empty
  - Phone → Is empty
  - Email → Is empty
  - Featured Picture → Is empty
- **Ordenar por**: Last Edited Time (Newest → Oldest)

### 6. 🕐 Modificadas Recientemente
- **Tipo**: Table
- **Filtros**: Ninguno
- **Ordenar por**: Last Edited Time (Newest → Oldest)

### 7. 🆕 Nuevas
- **Tipo**: Table
- **Filtros**: Ninguno
- **Ordenar por**: Created Time (Newest → Oldest)

---

## 🏙️ VISTAS POR CIUDADES PRINCIPALES

**Instrucciones generales para todas las vistas de ciudad:**
- **Tipo**: Table
- **Filtros**:
  1. City → Is → [Nombre de la Ciudad]
  2. Status → Is → Published
- **Ordenar por**:
  1. Featured (Checked → Unchecked)
  2. Title (A → Z)

### Lista de vistas a crear:

1. **🏖️ Barcelona** → City: Barcelona
2. **🏛️ Madrid** → City: Madrid
3. **🥘 Valencia** → City: Valencia
4. **💃 Sevilla** → City: Sevilla
5. **🏝️ Palma de Mallorca** → City: Palma de Mallorca
6. **🌴 Las Palmas de Gran Canaria** → City: Las Palmas de Gran Canaria
7. **🌊 Alicante** → City: Alicante
8. **☀️ Málaga** → City: Málaga
9. **🌉 Bilbao** → City: Bilbao
10. **🏰 A Coruña** → City: A Coruña

---

## 🎨 TIPS ADICIONALES

### Configuración de Columnas Visibles

Para cada vista, puedes personalizar qué columnas mostrar:

**Vistas de región/ciudad (mostrar):**
- Title
- City
- Services
- Phone
- Email
- Website
- Featured
- Status

**Vistas de gestión (mostrar):**
- Title
- Description
- Phone
- Email
- Featured Picture
- Last Edited Time
- Status

**Vista de Galería (mostrar en card):**
- Title
- City
- Services
- Short Description

### Agrupar Vistas

Puedes agrupar vistas similares:
1. Click derecho en el nombre de una vista
2. Selecciona "Move to" → "New group"
3. Nombra el grupo (ej: "Por Región", "Por Servicio", "Gestión")

### Duplicar Vistas Rápidamente

Para crear vistas similares más rápido:
1. Crea la primera vista con todos los filtros
2. Haz clic en "..." al lado del nombre de la vista
3. Selecciona "Duplicate"
4. Cambia solo el filtro necesario (ej: cambiar de "Barcelona" a "Madrid")

---

## 📋 CHECKLIST DE CREACIÓN

Use esta lista para trackear tu progreso:

### Principales (6)
- [ ] 📋 Todas las Escuelas
- [ ] 🖼️ Galería de Escuelas
- [ ] ⭐ Escuelas Destacadas
- [ ] 🔍 Pendientes de Revisión
- [ ] ✅ Publicadas
- [ ] 📝 Borradores

### Por Región (17)
- [ ] Andalucía
- [ ] Aragón
- [ ] Asturias
- [ ] Cantabria
- [ ] Cataluña
- [ ] Ceuta
- [ ] Comunidad de Madrid
- [ ] Comunidad Valenciana
- [ ] Extremadura
- [ ] Galicia
- [ ] Islas Baleares
- [ ] Islas Canarias
- [ ] La Rioja
- [ ] Melilla
- [ ] Navarra
- [ ] País Vasco
- [ ] Región de Murcia

### Por Servicio (8)
- [ ] PER
- [ ] PNB
- [ ] Patrón de Yate
- [ ] Capitán de Yate
- [ ] Radiotelefonista
- [ ] Moto Náutica
- [ ] Vela
- [ ] Buceo

### Gestión (7)
- [ ] Sin Descripción
- [ ] Sin Imagen
- [ ] Sin Contacto
- [ ] Sin Website
- [ ] Datos Incompletos
- [ ] Modificadas Recientemente
- [ ] Nuevas

### Por Ciudad (10)
- [ ] Barcelona
- [ ] Madrid
- [ ] Valencia
- [ ] Sevilla
- [ ] Palma de Mallorca
- [ ] Las Palmas de Gran Canaria
- [ ] Alicante
- [ ] Málaga
- [ ] Bilbao
- [ ] A Coruña

---

## ⏱️ Estimación de Tiempo

- **Vistas Principales**: ~10 minutos
- **Vistas por Región**: ~20 minutos (usa duplicar)
- **Vistas por Servicio**: ~10 minutos (usa duplicar)
- **Vistas de Gestión**: ~10 minutos
- **Vistas por Ciudad**: ~10 minutos (usa duplicar)

**Total**: ~60 minutos

## 💡 Atajos de Teclado en Notion

- `Cmd/Ctrl + D`: Duplicar bloque/vista
- `Cmd/Ctrl + Shift + L`: Cambiar entre modo claro/oscuro
- `/table`: Crear tabla rápidamente

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas creando las vistas:
1. Asegúrate de estar en la base de datos correcta ("Escuelas Náuticas")
2. Verifica que todos los campos existen (Title, City, Area, etc.)
3. Los filtros deben coincidir exactamente con los valores en los campos Select

¡Buena suerte! 🚀
