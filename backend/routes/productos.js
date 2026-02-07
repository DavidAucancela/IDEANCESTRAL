import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

// GET /api/productos - Obtener todos los productos (solo publicados para visitantes)
router.get('/', async (req, res) => {
  try {
    const { categoria_id, destacado, publicado } = req.query;
    let query = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        (
          SELECT json_agg(
            json_build_object(
              'id', i.id,
              'url', i.url,
              'orden', i.orden,
              'es_principal', i.es_principal
            ) ORDER BY i.orden, i.es_principal DESC
          )
          FROM imagenes_productos i
          WHERE i.producto_id = p.id
        ) as imagenes
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (publicado !== undefined) {
      query += ` AND p.publicado = $${paramCount}`;
      params.push(publicado === 'true');
      paramCount++;
    } else {
      // Por defecto solo mostrar publicados
      query += ` AND p.publicado = true`;
    }

    if (categoria_id) {
      query += ` AND p.categoria_id = $${paramCount}`;
      params.push(categoria_id);
      paramCount++;
    }

    if (destacado === 'true') {
      query += ` AND p.destacado = true`;
    }

    query += ` ORDER BY p.destacado DESC, p.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.id as categoria_id,
        (
          SELECT json_agg(
            json_build_object(
              'id', i.id,
              'url', i.url,
              'orden', i.orden,
              'es_principal', i.es_principal
            ) ORDER BY i.orden, i.es_principal DESC
          )
          FROM imagenes_productos i
          WHERE i.producto_id = p.id
        ) as imagenes
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /api/productos - Crear nuevo producto (requiere autenticación)
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const result = await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [nombre, descripcion, precio, material, peso, categoria_id || null, publicado !== undefined ? publicado : true, destacado || false]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id - Actualizar producto (requiere autenticación)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado } = req.body;

    const result = await pool.query(`
      UPDATE productos
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          precio = COALESCE($3, precio),
          material = COALESCE($4, material),
          peso = COALESCE($5, peso),
          categoria_id = COALESCE($6, categoria_id),
          publicado = COALESCE($7, publicado),
          destacado = COALESCE($8, destacado),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/productos/:id - Eliminar producto (requiere autenticación)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
