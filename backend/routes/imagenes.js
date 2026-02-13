import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../database/connection.js';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// POST /api/imagenes - Subir imagen para un producto
router.post('/', authenticateToken, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const { producto_id, es_principal, orden } = req.body;

    if (!producto_id) {
      // Eliminar archivo si no hay producto_id
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'producto_id es requerido' });
    }

    const url = `/uploads/${req.file.filename}`;

    // Si es principal, desmarcar otras imágenes principales del mismo producto
    if (es_principal === 'true' || es_principal === true) {
      await pool.query(
        'UPDATE imagenes_productos SET es_principal = false WHERE producto_id = $1',
        [producto_id]
      );
    }

    const result = await pool.query(`
      INSERT INTO imagenes_productos (producto_id, url, orden, es_principal)
      VALUES ($1, $2, COALESCE($3, 0), COALESCE($4, false))
      RETURNING *
    `, [producto_id, url, orden || 0, es_principal === 'true' || es_principal === true]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// DELETE /api/imagenes/:id - Eliminar imagen
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la imagen antes de eliminarla
    const imagenResult = await pool.query('SELECT url FROM imagenes_productos WHERE id = $1', [id]);

    if (imagenResult.rows.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const url = imagenResult.rows[0].url;
    const filePath = path.join(__dirname, '..', url);

    // Eliminar de la base de datos
    await pool.query('DELETE FROM imagenes_productos WHERE id = $1', [id]);

    // Eliminar archivo físico
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
});

// PUT /api/imagenes/:id - Actualizar imagen (orden, es_principal)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { orden, es_principal } = req.body;

    if (es_principal === true || es_principal === 'true') {
      // Obtener producto_id de la imagen
      const imgResult = await pool.query('SELECT producto_id FROM imagenes_productos WHERE id = $1', [id]);
      if (imgResult.rows.length > 0) {
        // Desmarcar otras imágenes principales
        await pool.query(
          'UPDATE imagenes_productos SET es_principal = false WHERE producto_id = $1 AND id != $2',
          [imgResult.rows[0].producto_id, id]
        );
      }
    }

    const result = await pool.query(`
      UPDATE imagenes_productos
      SET orden = COALESCE($1, orden),
          es_principal = COALESCE($2, es_principal)
      WHERE id = $3
      RETURNING *
    `, [orden, es_principal, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando imagen:', error);
    res.status(500).json({ error: 'Error al actualizar imagen' });
  }
});

export default router;
