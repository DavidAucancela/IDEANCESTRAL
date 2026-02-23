import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pino from 'pino';
import pool from './database/connection.js';
import { httpsRedirect } from './middleware/httpsRedirect.js';
import productosRoutes from './routes/productos.js';
import categoriasRoutes from './routes/categorias.js';
import imagenesRoutes from './routes/imagenes.js';
import authRoutes from './routes/auth.js';
import promocionesRoutes from './routes/promociones.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined
});

const app = express();
const PORT = process.env.PORT || 3000;

// --- VALIDACIÓN CRÍTICA: JWT_SECRET ---
const JWT_SECRET = process.env.JWT_SECRET;
const weakSecrets = ['secret_key', 'cambiar_esto_por', 'cambiar_por_secreto', 'CONFIGURA_CON', 'GENERA_CON'];
const isWeakSecret = !JWT_SECRET || JWT_SECRET.length < 32 || weakSecrets.some(w => (JWT_SECRET || '').includes(w));
if (isWeakSecret) {
  logger.fatal('JWT_SECRET debe ser un secreto seguro (min. 32 caracteres). Ejecuta: openssl rand -base64 32');
  process.exit(1);
}

// --- VALIDACIÓN CRÍTICA: DB_PASSWORD (omitir si se usa DATABASE_URL) ---
if (!process.env.DATABASE_URL) {
  const WEAK_DB_PASSWORDS = ['admin', 'postgres', 'password', '123456', 'root'];
  if (WEAK_DB_PASSWORDS.includes((process.env.DB_PASSWORD || '').toLowerCase())) {
    logger.fatal('DB_PASSWORD no puede ser una contraseña débil (admin, postgres, etc.). Configura una contraseña segura en backend/.env');
    process.exit(1);
  }
}

// CORS - orígenes permitidos
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(u => u.trim());

if (process.env.NODE_ENV !== 'production') {
  for (let p = 5173; p <= 5180; p++) {
    const url = `http://localhost:${p}`;
    if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
  }
}

// --- HTTPS obligatorio en producción ---
app.use(httpsRedirect);

// --- HELMET: headers de seguridad ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],   // Vue genera estilos inline
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  }
}));

// --- RATE LIMITING global ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Demasiadas solicitudes. Intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// --- Protección CSRF: validación de Origin para operaciones de escritura ---
const csrfOriginCheck = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('Origin');
  if (!origin) return next();
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  next();
};
app.use(csrfOriginCheck);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS no permitido para: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- /uploads protegido: solo archivos registrados en BD ---
app.use('/uploads', async (req, res, next) => {
  const urlPath = '/uploads' + (req.path === '/' ? '' : req.path);
  try {
    const [img, promo, cat] = await Promise.all([
      pool.query('SELECT 1 FROM imagenes_productos WHERE url = $1', [urlPath]),
      pool.query('SELECT 1 FROM promociones WHERE imagen_url = $1', [urlPath]),
      pool.query('SELECT 1 FROM categorias WHERE imagen_url = $1', [urlPath])
    ]);
    if (img.rows.length > 0 || promo.rows.length > 0 || cat.rows.length > 0) {
      const filePath = path.join(__dirname, 'uploads', path.basename(urlPath));
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }
  } catch (e) {
    logger.error({ err: e }, 'Error validando upload');
  }
  res.status(404).json({ error: 'No encontrado' });
});

// Servir imágenes del frontend (public/imagenes)
const imagenesDir = path.join(__dirname, '..', 'frontend', 'public', 'imagenes');
if (fs.existsSync(imagenesDir)) {
  app.use('/imagenes', express.static(imagenesDir));
}

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/promociones', promocionesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// --- Producción: servir frontend estático (despliegue monolítico) ---
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  logger.error({ err, url: req.url }, err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const server = app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`El puerto ${PORT} ya está en uso.`);
    console.error(`Soluciones:`);
    console.error(`  1. Cierra la otra aplicacion que usa el puerto ${PORT}`);
    console.error(`  2. Usa otro puerto: PORT=${Number(PORT) + 1} npm run dev:backend`);
    console.error(`  3. En Windows: netstat -ano | findstr :${PORT} -> taskkill /PID <pid> /F`);
    process.exit(1);
  } else {
    throw err;
  }
});
