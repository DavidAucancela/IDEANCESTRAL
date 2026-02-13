import pool from '../database/connection.js';

/**
 * Registra una acción de administrador en la tabla de auditoría.
 * @param {object} options
 * @param {number} adminId - ID del administrador
 * @param {string} action - create | update | delete | login
 * @param {string} entity - productos | categorias | imagenes | promociones | auth
 * @param {number} [entityId] - ID del recurso afectado
 * @param {object} [details] - Detalles adicionales (JSON)
 * @param {object} req - Request de Express (para IP y User-Agent)
 */
export async function logAudit({ adminId, action, entity, entityId, details, req }) {
  try {
    const ip = req?.ip || req?.connection?.remoteAddress || req?.get?.('X-Forwarded-For')?.split(',')[0]?.trim();
    const userAgent = req?.get?.('User-Agent');

    await pool.query(`
      INSERT INTO admin_audit_log (admin_id, action, entity, entity_id, details, ip, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [adminId, action, entity, entityId ?? null, details ? JSON.stringify(details) : null, ip ?? null, userAgent ?? null]);
  } catch (err) {
    console.error('Error registrando auditoría:', err);
  }
}

/**
 * Middleware factory: registra la acción después de que el handler termine exitosamente.
 * Usar después del handler - requiere que res.json haya sido llamado.
 * Mejor usar logAudit directamente en las rutas después de operaciones exitosas.
 */
export function withAudit(action, entity) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = req.params?.id ? parseInt(req.params.id) : body?.id;
        logAudit({
          adminId: req.user.id,
          action,
          entity,
          entityId,
          req
        }).catch(() => {});
      }
      return originalJson(body);
    };
    next();
  };
}
