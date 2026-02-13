import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';
import { sanitizeString } from '../utils/sanitize.js';
import { logAudit } from '../middleware/auditLog.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de inicio de sesión. Intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiadas solicitudes de renovación. Intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const usuario = sanitizeString(req.body.usuario || '');
    const password = req.body.password;

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

    const accessToken = jwt.sign(
      { id: admin.id, usuario: admin.usuario },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    try {
      await pool.query(`
        INSERT INTO refresh_tokens (admin_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
      `, [admin.id, refreshTokenHash, expiresAt]);
    } catch (dbErr) {
      if (dbErr.code === '42P01') {
        return res.status(500).json({ error: 'Sistema de tokens no configurado. Ejecuta la migración 002_security.sql' });
      }
      throw dbErr;
    }

    await logAudit({ adminId: admin.id, action: 'login', entity: 'auth', req });

    res.json({
      token: accessToken,
      refreshToken,
      expiresIn: 3600,
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

// POST /api/auth/refresh - Renovar access token con refresh token
router.post('/refresh', refreshLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requerido' });
    }

    const tokenHash = hashToken(refreshToken);

    const result = await pool.query(`
      SELECT rt.admin_id, a.usuario
      FROM refresh_tokens rt
      JOIN administradores a ON a.id = rt.admin_id AND a.activo = true
      WHERE rt.token_hash = $1 AND rt.expires_at > NOW() AND rt.revoked = false
    `, [tokenHash]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }

    const { admin_id, usuario } = result.rows[0];

    const accessToken = jwt.sign(
      { id: admin_id, usuario },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: accessToken,
      expiresIn: 3600
    });
  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(500).json({ error: 'Error al renovar token' });
  }
});

// POST /api/auth/logout - Revocar refresh token (opcional, si el frontend envía el refresh token)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await pool.query(
        'UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1 AND admin_id = $2',
        [tokenHash, req.user.id]
      );
    }
    res.json({ message: 'Sesión cerrada' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
});

// GET /api/auth/me - Obtener usuario actual (verificar token)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, usuario, email FROM administradores WHERE id = $1 AND activo = true',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /api/auth/register - Registrar nuevo administrador (solo desarrollo)
router.post('/register', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'El registro está deshabilitado en producción' });
  }
  next();
}, async (req, res) => {
  try {
    const usuario = sanitizeString(req.body.usuario || '');
    const email = sanitizeString(req.body.email || '');
    const password = req.body.password;

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
