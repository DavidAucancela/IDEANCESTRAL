/**
 * Migración: crea la tabla promociones e inserta datos iniciales.
 * No borra productos ni categorías existentes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'IdeaAncestralDB',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || undefined
});

const SQL_CREATE = `
CREATE TABLE IF NOT EXISTS promociones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    temporada VARCHAR(50) NOT NULL,
    tema VARCHAR(50) DEFAULT 'general',
    imagen_url VARCHAR(255),
    orden INTEGER DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_promociones_activa ON promociones(activa);
CREATE INDEX IF NOT EXISTS idx_promociones_orden ON promociones(orden);
`;

async function migrate() {
  try {
    console.log('🔄 Ejecutando migración de promociones...');
    await pool.query(SQL_CREATE);
    console.log('✅ Tabla promociones creada o ya existía');
    
    const check = await pool.query('SELECT COUNT(*) as n FROM promociones');
    if (parseInt(check.rows[0].n) === 0) {
      await pool.query(`
        INSERT INTO promociones (nombre, temporada, tema, imagen_url, orden, activa) VALUES
        ('Navidad y Fin de Año', 'Diciembre', 'navidad', '/imagenes/promo1.jpg', 1, true),
        ('Día de la Madre', 'Mayo', 'madre', '/imagenes/promo2.jpg', 2, true),
        ('Fiestas de Quito', 'Diciembre', 'cultural', '/imagenes/promo3.jpg', 3, true),
        ('Inti Raymi - Fiesta del Sol', 'Junio', 'inti', '/imagenes/promo4.jpg', 4, true)
      `);
      console.log('✅ Promociones iniciales insertadas');
    } else {
      console.log('ℹ️  Ya hay promociones, no se insertan duplicados');
    }
    
    await pool.end();
    console.log('✅ Migración completada');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
