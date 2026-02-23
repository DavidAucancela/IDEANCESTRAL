import bcrypt from 'bcryptjs';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Credenciales desde variables de entorno (NO usar valores por defecto inseguros)
const usuario = process.env.ADMIN_USER || 'admin';
const email = process.env.ADMIN_EMAIL || 'admin@ideancestral.com';
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 8) {
  console.error('❌ Error: ADMIN_PASSWORD debe configurarse en .env con mínimo 8 caracteres');
  console.error('\n📝 Ejemplo:');
  console.error('   ADMIN_USER=admin');
  console.error('   ADMIN_EMAIL=admin@ideancestral.com');
  console.error('   ADMIN_PASSWORD=TuContraseñaSegura123\n');
  process.exit(1);
}

// Rechazar contraseñas débiles
const WEAK_PASSWORDS = ['admin123', 'admin', 'password', '12345678', 'password123'];
if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
  console.error('❌ Error: ADMIN_PASSWORD no puede ser una contraseña débil (admin123, password, etc.)');
  process.exit(1);
}

/** Parsea DATABASE_URL a config object (evita "Invalid URL" en pg con ciertos formatos) */
function parseDatabaseUrl(url) {
  const u = (url || '').trim().replace(/^postgresql:\/\//, '');
  const at = u.indexOf('@');
  if (at === -1) return null;
  const auth = u.substring(0, at);
  const hostDb = u.substring(at + 1);
  const colon = auth.lastIndexOf(':');
  const user = auth.substring(0, colon);
  const pass = decodeURIComponent(auth.substring(colon + 1));
  const slash = hostDb.indexOf('/');
  const hostPort = hostDb.substring(0, slash);
  const database = hostDb.substring(slash + 1).split('?')[0];
  const [host, port] = hostPort.includes(':') ? hostPort.split(':') : [hostPort, '5432'];
  return { host, port: parseInt(port) || 5432, database, user, password: pass };
}

let poolConfig;
if (process.env.DATABASE_URL) {
  const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
  if (parsed) {
    poolConfig = {
      ...parsed,
      ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    };
  } else {
    poolConfig = {
      connectionString: process.env.DATABASE_URL.trim(),
      ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    };
  }
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'catalogo_artesanias',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || undefined,
  };
}
const pool = new Pool(poolConfig);

async function createAdmin() {
  try {
    const hash = await bcrypt.hash(password, 10);

    try {
      const result = await pool.query(
        'INSERT INTO administradores (usuario, email, password_hash) VALUES ($1, $2, $3) RETURNING id, usuario, email',
        [usuario, email, hash]
      );
      console.log('Usuario admin creado exitosamente:');
      console.log(result.rows[0]);
    } catch (e) {
      if (e.code === '23505') {
        await pool.query(
          'UPDATE administradores SET password_hash = $1 WHERE usuario = $2',
          [hash, usuario]
        );
        console.log('Usuario admin ya existía. Contraseña actualizada.');
      } else {
        throw e;
      }
    }

    console.log('\n--- CREDENCIALES ---');
    console.log('Usuario: ' + usuario);
    console.log('Contraseña: (configurada en .env)');
    console.log('URL: http://localhost:5173/admin');
    console.log('--------------------');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
