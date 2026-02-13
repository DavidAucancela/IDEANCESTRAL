import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validar variables de entorno - contraseñas débiles (solo si no usamos DATABASE_URL)
const WEAK_PASSWORDS = ['admin', 'postgres', 'password', '123456', 'root', 'tu_password', 'tu_password_aqui'];
const dbPassword = (process.env.DB_PASSWORD || '').trim();
if (!process.env.DATABASE_URL && dbPassword && WEAK_PASSWORDS.includes(dbPassword.toLowerCase())) {
  console.error('❌ Error: DB_PASSWORD no puede ser una contraseña débil (admin, postgres, etc.)');
  console.error('\n📝 Por favor:');
  console.error('   1. Edita backend/.env');
  console.error('   2. Configura DB_PASSWORD con una contraseña segura');
  console.error('   3. Ejemplo: DB_PASSWORD=MiCl4v3S3gur4_2024\n');
  process.exit(1);
}

async function initDatabase() {
  let dbPool;

  if (process.env.DATABASE_URL) {
    // Render, Heroku, etc.: usar DATABASE_URL directamente
    console.log('🔄 Inicializando base de datos (DATABASE_URL)...');
    dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    });
  } else {
    // Configuración local con variables individuales
    const poolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: 'postgres',
      user: process.env.DB_USER || 'postgres',
    };
    if (dbPassword) poolConfig.password = dbPassword;
    const pool = new Pool(poolConfig);

    console.log('🔄 Inicializando base de datos...');
    console.log(`📊 Configuración:`);
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Puerto: ${process.env.DB_PORT || 5432}`);
    console.log(`   Usuario: ${process.env.DB_USER || 'postgres'}`);
    console.log(`   Base de datos: ${process.env.DB_NAME || 'catalogo_artesanias'}\n`);

    const dbName = process.env.DB_NAME || 'catalogo_artesanias';
    const dbExists = await pool.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (dbExists.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Base de datos '${dbName}' creada`);
    } else {
      console.log(`ℹ️  Base de datos '${dbName}' ya existe`);
    }
    await pool.end();

    const dbPoolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: dbName,
      user: process.env.DB_USER || 'postgres',
    };
    if (dbPassword) dbPoolConfig.password = dbPassword;
    dbPool = new Pool(dbPoolConfig);
  }

  try {
    // Leer y ejecutar schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    await dbPool.query(schemaSQL);
    console.log('✅ Esquema de base de datos creado');

    // Ejecutar migraciones
    const migrationsDir = path.join(__dirname, '../database/migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
      for (const m of migrations) {
        const migrationSQL = fs.readFileSync(path.join(migrationsDir, m), 'utf8');
        await dbPool.query(migrationSQL);
        console.log(`✅ Migración ${m} aplicada`);
      }
    }

    // Opcional: cargar datos de ejemplo
    if (process.argv.includes('--seed')) {
      const seedPath = path.join(__dirname, '../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await dbPool.query(seedSQL);
        console.log('✅ Datos de ejemplo cargados');
      }
    }

    await dbPool.end();
    console.log('✅ Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error inicializando base de datos:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('password') || error.message.includes('authentication')) {
      console.error('💡 Posibles soluciones:');
      console.error('   1. Verifica que la contraseña en .env sea correcta');
      console.error('   2. Verifica que PostgreSQL esté corriendo');
      console.error('   3. Verifica que el usuario tenga permisos para crear bases de datos\n');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Posibles soluciones:');
      console.error('   1. Verifica que PostgreSQL esté corriendo');
      console.error('   2. Verifica el host y puerto en .env\n');
    }
    
    process.exit(1);
  }
}

initDatabase();
