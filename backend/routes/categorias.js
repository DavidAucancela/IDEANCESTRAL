import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

// GET /api/categorias - Obtener todas las categorías activas
router.get('/', async (req, res) => {
  try {
    const { incluir_inactivas } = req.query;
    let query = 'SELECT * FROM categorias';
    
    if (incluir_inactivas !== 'true') {
      query += ' WHERE activa = true';
    }
    
    query += ' ORDER BY nombre';

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /api/categorias/:id - Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// POST /api/categorias - Crear nueva categoría (requiere autenticación)
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, imagen_url, activa } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const result = await pool.query(`
      INSERT INTO categorias (nombre, descripcion, imagen_url, activa)
      VALUES ($1, $2, $3, COALESCE($4, true))
      RETURNING *
    `, [nombre, descripcion, imagen_url, activa]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Violación de unique constraint
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error creando categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// PUT /api/categorias/:id - Actualizar categoría (requiere autenticación)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, imagen_url, activa } = req.body;

    const result = await pool.query(`
      UPDATE categorias
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          imagen_url = COALESCE($3, imagen_url),
          activa = COALESCE($4, activa),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [nombre, descripcion, imagen_url, activa, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// DELETE /api/categorias/:id - Eliminar categoría (requiere autenticación)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

export default router;
