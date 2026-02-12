import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pino from 'pino';
import productosRoutes from './routes/productos.js';
import categoriasRoutes from './routes/categorias.js';
import imagenesRoutes from './routes/imagenes.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined
});

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'secret_key' || process.env.JWT_SECRET.length < 32) {
  logger.warn('JWT_SECRET debe ser configurado con un valor seguro (min. 32 caracteres). Ver backend/.env.example');
}

// CORS - en desarrollo permitir varios puertos de Vite
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(u => u.trim());

if (process.env.NODE_ENV !== 'production') {
  for (let p = 5173; p <= 5180; p++) {
    const url = `http://localhost:${p}`;
    if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
  }
}

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

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

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
