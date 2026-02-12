import bcrypt from 'bcryptjs';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'catalogo_artesanias',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || undefined,
});

async function createAdmin() {
  const usuario = 'admin';
  const email = 'admin@ideancestral.com';
  const password = 'admin123';

  try {
    const hash = await bcrypt.hash(password, 10);

    // Intentar insertar
    try {
      const result = await pool.query(
        'INSERT INTO administradores (usuario, email, password_hash) VALUES ($1, $2, $3) RETURNING id, usuario, email',
        [usuario, email, hash]
      );
      console.log('Usuario admin creado exitosamente:');
      console.log(result.rows[0]);
    } catch (e) {
      if (e.code === '23505') {
        // Ya existe, actualizar password
        await pool.query(
          'UPDATE administradores SET password_hash = $1 WHERE usuario = $2',
          [hash, usuario]
        );
        console.log('Usuario admin ya existia. Password actualizado.');
      } else {
        throw e;
      }
    }

    console.log('\n--- CREDENCIALES ---');
    console.log('Usuario: ' + usuario);
    console.log('Password: ' + password);
    console.log('URL: http://localhost:5173/admin');
    console.log('--------------------');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
