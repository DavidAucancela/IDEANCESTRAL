import express from 'express';
import { z } from 'zod';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const productoSchema = z.object({
  nombre: z.string().min(1).max(200),
  precio: z.number().positive(),
  descripcion: z.string().optional(),
  material: z.string().max(200).optional(),
  peso: z.string().max(50).optional(),
  categoria_id: z.number().int().positive().optional().nullable(),
  publicado: z.boolean().optional(),
  destacado: z.boolean().optional()
});

// GET /api/productos - Obtener productos (paginación, búsqueda, filtros, ordenamiento)
router.get('/', async (req, res) => {
  try {
    const { categoria_id, destacado, publicado, buscar, ordenar, page = 1, limit = 12, incluir_ocultos } = req.query;
    const limitNum = incluir_ocultos === 'true' ? 9999 : Math.min(50, Math.max(1, parseInt(limit) || 12));
    const pageNum = incluir_ocultos === 'true' ? 1 : Math.max(1, parseInt(page) || 1);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = ' WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (incluir_ocultos === 'true') {
    } else if (publicado !== undefined) {
      whereClause += ` AND p.publicado = $${paramCount}`;
      params.push(publicado === 'true');
      paramCount++;
    } else {
      whereClause += ' AND p.publicado = true';
    }

    if (categoria_id) {
      whereClause += ` AND p.categoria_id = $${paramCount}`;
      params.push(categoria_id);
      paramCount++;
    }

    if (destacado === 'true') {
      whereClause += ' AND p.destacado = true';
    }

    if (buscar && buscar.trim()) {
      whereClause += ` AND (p.nombre ILIKE $${paramCount} OR p.descripcion ILIKE $${paramCount} OR p.material ILIKE $${paramCount})`;
      params.push(`%${buscar.trim()}%`);
      paramCount++;
    }

    const ordenValido = { precio_asc: 'p.precio ASC', precio_desc: 'p.precio DESC', nombre: 'p.nombre ASC', reciente: 'p.created_at DESC' };
    const orderBy = ordenValido[ordenar] || 'p.destacado DESC, p.created_at DESC';

    const countParams = [...params];
    params.push(limitNum, offset);

    const baseFrom = `FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id`;
    const mainQuery = `
      SELECT p.*, c.nombre as categoria_nombre,
        (SELECT json_agg(json_build_object('id', i.id, 'url', i.url, 'orden', i.orden, 'es_principal', i.es_principal) ORDER BY i.orden, i.es_principal DESC)
         FROM imagenes_productos i WHERE i.producto_id = p.id) as imagenes
      ${baseFrom} ${whereClause} ORDER BY ${orderBy} LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    const countQuery = `SELECT COUNT(*)::int as total ${baseFrom} ${whereClause}`;

    const [result, countResult] = await Promise.all([
      pool.query(mainQuery, params),
      pool.query(countQuery, countParams)
    ]);

    const total = countResult.rows[0]?.total ?? 0;

    if (incluir_ocultos === 'true') {
      res.json(result.rows);
    } else {
      res.json({
        productos: result.rows,
        paginacion: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPaginas: Math.ceil(total / limitNum)
        }
      });
    }
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
router.post('/', authenticateToken, async (req, res) => {
  try {
    const parsed = productoSchema.safeParse({
      ...req.body,
      precio: typeof req.body.precio === 'string' ? parseFloat(req.body.precio) : req.body.precio,
      categoria_id: req.body.categoria_id ? parseInt(req.body.categoria_id) : null
    });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten() });
    }
    const { nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado } = parsed.data;

    const result = await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [nombre, descripcion ?? null, precio, material ?? null, peso ?? null, categoria_id || null, publicado ?? true, destacado ?? false]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id - Actualizar producto (requiere autenticación)
router.put('/:id', authenticateToken, async (req, res) => {
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
router.delete('/:id', authenticateToken, async (req, res) => {
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
