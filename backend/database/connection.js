import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Soporte para DATABASE_URL (Render, Heroku, etc.) o variables individuales
let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'catalogo_artesanias',
    user: process.env.DB_USER || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
  const dbPassword = process.env.DB_PASSWORD;
  if (dbPassword && dbPassword.trim() !== '' && dbPassword !== 'tu_password' && dbPassword !== 'tu_password_aqui') {
    poolConfig.password = dbPassword;
  }
  const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER'];
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`❌ Variable de entorno ${varName} no definida`);
    }
  });
}

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
