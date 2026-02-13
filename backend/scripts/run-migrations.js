#!/usr/bin/env node
/**
 * Ejecuta migraciones pendientes en la base de datos.
 * Para bases de datos existentes (antes de las migraciones).
 * Uso: node scripts/run-migrations.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'catalogo_artesanias',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../database/migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('No hay migraciones.');
    process.exit(0);
  }

  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const m of migrations) {
    try {
      const sql = fs.readFileSync(path.join(migrationsDir, m), 'utf8');
      await pool.query(sql);
      console.log(`✅ ${m}`);
    } catch (err) {
      if (err.code === '42P07') {
        console.log(`⏭️  ${m} (tablas ya existen)`);
      } else {
        console.error(`❌ ${m}:`, err.message);
        process.exit(1);
      }
    }
  }
  await pool.end();
  console.log('Migraciones completadas.');
}

runMigrations();
