import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/promociones - Obtener todas las promociones activas
router.get('/', async (req, res) => {
  try {
    const { incluir_inactivas } = req.query;
    let query = 'SELECT * FROM promociones';
    
    if (incluir_inactivas !== 'true') {
      query += ' WHERE activa = true';
    }
    
    query += ' ORDER BY orden ASC, id ASC';

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo promociones:', error);
    res.status(500).json({ error: 'Error al obtener promociones' });
  }
});

// GET /api/promociones/:id - Obtener una promoción por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM promociones WHERE id = $1', [id]);

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
    const { nombre, temporada, tema, imagen_url, orden, activa } = req.body;

    if (!nombre || !temporada) {
      return res.status(400).json({ error: 'Nombre y temporada son requeridos' });
    }

    const result = await pool.query(`
      INSERT INTO promociones (nombre, temporada, tema, imagen_url, orden, activa)
      VALUES ($1, $2, COALESCE($3, 'general'), $4, COALESCE($5, 0), COALESCE($6, true))
      RETURNING *
    `, [nombre, temporada, tema, imagen_url || null, orden ?? 0, activa ?? true]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando promoción:', error);
    res.status(500).json({ error: 'Error al crear promoción' });
  }
});

// PUT /api/promociones/:id - Actualizar promoción (requiere autenticación)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, temporada, tema, imagen_url, orden, activa } = req.body;

    const result = await pool.query(`
      UPDATE promociones
      SET nombre = COALESCE($1, nombre),
          temporada = COALESCE($2, temporada),
          tema = COALESCE($3, tema),
          imagen_url = COALESCE($4, imagen_url),
          orden = COALESCE($5, orden),
          activa = COALESCE($6, activa),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [nombre, temporada, tema, imagen_url, orden, activa, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando promoción:', error);
    res.status(500).json({ error: 'Error al actualizar promoción' });
  }
});

// DELETE /api/promociones/:id - Eliminar promoción (requiere autenticación)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM promociones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    res.json({ message: 'Promoción eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando promoción:', error);
    res.status(500).json({ error: 'Error al eliminar promoción' });
  }
});

export default router;
