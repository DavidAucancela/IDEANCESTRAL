# Seguridad Implementada - Resumen

## 1. HTTPS obligatorio en producción

**Implementado:** Middleware `httpsRedirect` en `backend/middleware/httpsRedirect.js`

- En producción (`NODE_ENV=production`), si la petición llega por HTTP (detectado vía `X-Forwarded-Proto`), redirige a HTTPS con 301.
- **En Render:** Render termina TLS y envía `X-Forwarded-Proto: https`. Si alguien accede por `http://`, el middleware redirige.
- **Qué hacer tú:** Nada. Si usas Render u otro host con HTTPS, funciona automático. Solo asegúrate de que `NODE_ENV=production` en producción.

## 2. Sanitización de inputs (XSS)

**Implementado:** Librería `xss` en `backend/utils/sanitize.js`

- `sanitizeString()` elimina scripts y tags HTML de cualquier string.
- Aplicado en: productos, categorías, promociones, auth (usuario, email, búsqueda).
- **Qué hacer tú:** Nada. Ya está integrado en las rutas.

## 3. Validación de tipos MIME en uploads

**Implementado:** `backend/utils/validateMime.js` con `file-type`

- Lee los magic bytes del archivo (no confía en extensión ni Content-Type del cliente).
- Solo permite: JPEG, PNG, GIF, WebP.
- **Qué hacer tú:** Nada. Se ejecuta automáticamente al subir imágenes.

## 4. Refresh tokens

**Implementado:** Tabla `refresh_tokens`, endpoints `/auth/refresh` y `/auth/logout`

- Access token: 1 hora.
- Refresh token: 7 días, almacenado hasheado en BD.
- El frontend guarda ambos y usa el interceptor de axios para renovar cuando recibe 403.
- **Qué hacer tú:** Ejecutar la migración si tienes BD existente: `npm run migrate` (desde backend).

## 5. Auditoría de acciones

**Implementado:** Tabla `admin_audit_log`, función `logAudit()` en rutas protegidas

- Se registra: admin_id, action (create/update/delete/login), entity, entity_id, IP, User-Agent.
- **Qué hacer tú:** Ejecutar la migración: `npm run migrate`.
- Para consultar logs: `SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT 100;`

## Migración de base de datos

Si tu base de datos se creó antes de estas mejoras:

```bash
cd backend
npm run migrate
```

O manualmente:

```bash
psql -U postgres -d catalogo_artesanias -f backend/database/migrations/002_security.sql
```
