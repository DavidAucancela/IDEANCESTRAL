import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pool from '../database/connection.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: { error: 'Demasiados intentos de inicio de sesión. Intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const result = await pool.query(
      'SELECT * FROM administradores WHERE usuario = $1 AND activo = true',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, usuario: admin.usuario },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: admin.id,
        usuario: admin.usuario,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /api/auth/register - Registrar nuevo administrador (solo desarrollo, deshabilitado en producción)
router.post('/register', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'El registro está deshabilitado en producción' });
  }
  next();
}, async (req, res) => {
  try {
    const { usuario, email, password } = req.body;

    if (!usuario || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO administradores (usuario, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, usuario, email, created_at
    `, [usuario, email, passwordHash]);

    res.status(201).json({
      message: 'Administrador creado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }
    console.error('Error registrando administrador:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
  }
});

export default router;
