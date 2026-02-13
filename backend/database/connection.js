import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Configurar pool de conexión
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'catalogo_artesanias',
  user: process.env.DB_USER || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Solo agregar password si está definido y no está vacío - pendiente/inecesario implementar 
const dbPassword = process.env.DB_PASSWORD;
if (dbPassword && dbPassword.trim() !== '' && dbPassword !== 'tu_password' && dbPassword !== 'tu_password_aqui') {
  poolConfig.password = dbPassword;
}

// Validar que todas las variables requeridas existan
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`❌ Variable de entorno ${varName} no definida`);
  }
});

const pool = new Pool(poolConfig);

// Test de conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la conexión a PostgreSQL:', err);
  process.exit(-1);
});

export default pool;
