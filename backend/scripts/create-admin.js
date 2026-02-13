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

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'catalogo_artesanias',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || undefined,
});

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
