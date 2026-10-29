import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken, authenticateIf, optionalAuth } from '../middleware/auth.js';
import { promocionSchema, promocionUpdateSchema, sanitizarPromocion } from '../utils/promocionSchema.js';
import { logAudit } from '../middleware/auditLog.js';

const router = express.Router();

// incluir_inactivas solo para admins autenticados
const pideInactivas = (req) => req.query.incluir_inactivas === 'true';

const esIdValido = (id) => /^\d+$/.test(id) && Number(id) <= 2147483647;

// Errores de BD que son culpa de los datos enviados, no del servidor
const errorDeDatos = (error, res) => {
  if (error.code === '23503') {
    res.status(400).json({ error: 'La categoría indicada no existe' });
    return true;
  }
  if (error.code === '23514') {
    res.status(400).json({ error: 'Datos inválidos' });
    return true;
  }
  return false;
};

// GET /api/promociones - Obtener todas las promociones activas
router.get('/', authenticateIf(pideInactivas), async (req, res) => {
  try {
    const { incluir_inactivas } = req.query;
    let query = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM promociones p
      LEFT JOIN categorias c ON c.id = p.categoria_id`;

    if (incluir_inactivas !== 'true') {
      query += ' WHERE p.activa = true';
    }

    query += ' ORDER BY p.orden ASC, p.id ASC';

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo promociones:', error);
    res.status(500).json({ error: 'Error al obtener promociones' });
  }
});

// GET /api/promociones/:id - Obtener una promoción por ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id) || Number(id) > 2147483647) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }
    const result = await pool.query(
      'SELECT * FROM promociones WHERE id = $1 AND (activa = true OR $2)',
      [id, Boolean(req.user)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo promoción:', error);
    res.status(500).json({ error: 'Error al obtener promoción' });
  }
});

// POST /api/promociones - Crear nueva promoción (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const parsed = promocionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten() });
    }
    const data = sanitizarPromocion(parsed.data);
    if (!data.nombre || !data.temporada) {
      return res.status(400).json({ error: 'Nombre y temporada son requeridos' });
    }

    const result = await pool.query(`
      INSERT INTO promociones (nombre, temporada, tema, imagen_url, orden, activa, mes_inicio, mes_fin, categoria_id)
      VALUES ($1, $2, COALESCE($3, 'general'), $4, COALESCE($5, 0), COALESCE($6, true), $7, $8, $9)
      RETURNING *
    `, [
      data.nombre, data.temporada, data.tema ?? null, data.imagen_url ?? null, data.orden ?? null,
      data.activa ?? null, data.mes_inicio ?? null, data.mes_fin ?? null, data.categoria_id ?? null
    ]);

    await logAudit({ adminId: req.user.id, action: 'create', entity: 'promociones', entityId: result.rows[0].id, req });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (errorDeDatos(error, res)) return;
    console.error('Error creando promoción:', error);
    res.status(500).json({ error: 'Error al crear promoción' });
  }
});

// PUT /api/promociones/:id - Actualizar promoción (requiere autenticación)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    const parsed = promocionUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten() });
    }
    const data = sanitizarPromocion(parsed.data);
    if (('nombre' in data && !data.nombre) || ('temporada' in data && !data.temporada)) {
      return res.status(400).json({ error: 'Nombre y temporada son requeridos' });
    }

    // Solo se actualizan los campos enviados; las columnas salen del schema (lista cerrada).
    // null vacía el campo (por ejemplo, quitar la categoría o los meses).
    const campos = Object.entries(data).filter(([, valor]) => valor !== undefined);
    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    const sets = campos.map(([campo], i) => `${campo} = $${i + 1}`);
    const valores = campos.map(([, valor]) => valor);

    const result = await pool.query(`
      UPDATE promociones
      SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${valores.length + 1}
      RETURNING *
    `, [...valores, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    await logAudit({ adminId: req.user.id, action: 'update', entity: 'promociones', entityId: result.rows[0].id, req });
    res.json(result.rows[0]);
  } catch (error) {
    if (errorDeDatos(error, res)) return;
    console.error('Error actualizando promoción:', error);
    res.status(500).json({ error: 'Error al actualizar promoción' });
  }
});

// DELETE /api/promociones/:id - Eliminar promoción (requiere autenticación)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }
    const result = await pool.query('DELETE FROM promociones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    await logAudit({ adminId: req.user.id, action: 'delete', entity: 'promociones', entityId: parseInt(id), req });
    res.json({ message: 'Promoción eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando promoción:', error);
    res.status(500).json({ error: 'Error al eliminar promoción' });
  }
});

export default router;
