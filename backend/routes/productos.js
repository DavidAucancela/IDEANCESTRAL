import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken, authenticateIf, optionalAuth } from '../middleware/auth.js';
import { sanitizeString } from '../utils/sanitize.js';
import { logAudit } from '../middleware/auditLog.js';
import { productoSchema, productoUpdateSchema, sanitizarProducto } from '../utils/productoSchema.js';

const router = express.Router();

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

// GET /api/productos - Obtener productos (paginación, búsqueda, filtros, ordenamiento)
// incluir_ocultos y publicado=false solo para admins autenticados
const pideOcultos = (req) => req.query.incluir_ocultos === 'true' || req.query.publicado === 'false';

router.get('/', authenticateIf(pideOcultos), async (req, res) => {
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
      if (!esIdValido(String(categoria_id))) {
        return res.status(400).json({ error: 'categoria_id inválido' });
      }
      whereClause += ` AND p.categoria_id = $${paramCount}`;
      params.push(categoria_id);
      paramCount++;
    }

    if (destacado === 'true') {
      whereClause += ' AND p.destacado = true';
    }

    if (buscar && buscar.trim()) {
      const busquedaSegura = sanitizeString(buscar);
      if (busquedaSegura) {
        whereClause += ` AND (p.nombre ILIKE $${paramCount} OR p.descripcion ILIKE $${paramCount} OR p.material ILIKE $${paramCount})`;
        params.push(`%${busquedaSegura}%`);
        paramCount++;
      }
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
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
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
      WHERE p.id = $1 AND (p.publicado = true OR $2)
    `, [id, Boolean(req.user)]);

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
    const parsed = productoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten() });
    }
    const data = sanitizarProducto(parsed.data);
    if (!data.nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const result = await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, material, peso, categoria_id, stock, publicado, destacado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.nombre, data.descripcion ?? null, data.precio, data.material ?? null, data.peso ?? null,
      data.categoria_id ?? null, data.stock ?? null, data.publicado ?? true, data.destacado ?? false
    ]);

    await logAudit({ adminId: req.user.id, action: 'create', entity: 'productos', entityId: result.rows[0].id, req });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (errorDeDatos(error, res)) return;
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id - Actualizar producto (requiere autenticación)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const parsed = productoUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten() });
    }
    const data = sanitizarProducto(parsed.data);
    if ('nombre' in data && !data.nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Solo se actualizan los campos enviados; las columnas salen del schema (lista cerrada)
    const campos = Object.entries(data).filter(([, valor]) => valor !== undefined);
    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    const sets = campos.map(([campo], i) => `${campo} = $${i + 1}`);
    const valores = campos.map(([, valor]) => valor);

    const result = await pool.query(`
      UPDATE productos
      SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${valores.length + 1}
      RETURNING *
    `, [...valores, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await logAudit({ adminId: req.user.id, action: 'update', entity: 'productos', entityId: result.rows[0].id, req });
    res.json(result.rows[0]);
  } catch (error) {
    if (errorDeDatos(error, res)) return;
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/productos/:id - Eliminar producto (requiere autenticación)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await logAudit({ adminId: req.user.id, action: 'delete', entity: 'productos', entityId: parseInt(id), req });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
