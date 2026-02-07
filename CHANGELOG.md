# Changelog

## [1.0.0] - 2026-02-07

### ✨ Características Nuevas

#### Frontend (Vue 3)
- ✅ Página principal de catálogo con diseño inspirado en la imagen proporcionada
- ✅ Banner central con título "catálogo ARTESANAL - Siempre Santander"
- ✅ Sistema de filtrado por categorías
- ✅ Página de detalle de producto con galería de imágenes
- ✅ Diseño completamente responsive (móvil, tablet, desktop)
- ✅ Navegación suave entre secciones
- ✅ Panel de administración completo

#### Backend (Node.js/Express)
- ✅ API REST completa para productos (CRUD)
- ✅ API REST para categorías (CRUD)
- ✅ Sistema de gestión de imágenes múltiples por producto
- ✅ Autenticación JWT para administradores
- ✅ Base de datos PostgreSQL con esquema completo
- ✅ Sistema de publicación/ocultación de productos
- ✅ Productos destacados
- ✅ Servicio de archivos estáticos para imágenes

#### Base de Datos
- ✅ Esquema completo con tablas: productos, categorias, imagenes_productos, administradores
- ✅ Índices optimizados para rendimiento
- ✅ Triggers automáticos para updated_at
- ✅ Datos de ejemplo incluidos

### 🎨 Diseño
- Paleta de colores terrosos y cálidos
- Tipografía elegante con serif para títulos
- Grid responsive de productos
- Banner central destacado
- Cards de productos con hover effects

### 🔒 Seguridad
- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Validación de archivos en uploads
- CORS configurado

### 📱 Responsive
- Diseño optimizado para móviles (< 768px)
- Diseño para tablets (768px - 1199px)
- Diseño para desktop (1200px+)
- Menú hamburguesa funcional en móviles

### 📚 Documentación
- README.md completo con instrucciones
- SETUP.md con guía rápida de configuración
- Comentarios en código
- Ejemplos de uso de API

### 🛠️ Mejoras Técnicas
- Estructura modular y escalable
- Separación frontend/backend
- Variables de entorno configuradas
- Scripts de inicialización de BD
- Gitignore configurado

### 🐛 Correcciones
- Menú móvil funcional
- Manejo de errores en carga de imágenes
- Validaciones en formularios

### 📝 Notas
- El sistema está listo para desarrollo
- Requiere configuración de PostgreSQL
- Las imágenes existentes se sirven desde `/imagenes`
- Las nuevas imágenes se suben a `/uploads`
