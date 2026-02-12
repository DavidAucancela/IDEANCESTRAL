import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('🔍 Verificando configuración...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ El archivo .env no existe\n');
  console.log('📝 Creando archivo .env desde .env.example...\n');
  
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Archivo .env creado\n');
    console.log('⚠️  IMPORTANTE: Edita backend/.env y configura:');
    console.log('   - DB_PASSWORD: Tu contraseña de PostgreSQL');
    console.log('   - JWT_SECRET: Una clave secreta segura\n');
  } else {
    console.log('❌ No se encontró .env.example');
    process.exit(1);
  }
} else {
  console.log('✅ El archivo .env existe\n');
  
  // Verificar contenido
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('tu_password') || envContent.includes('tu_secret_key') || 
      envContent.includes('cambiar_esto_por') || envContent.includes('CONFIGURA_CON') || envContent.includes('GENERA_CON') ||
      (envContent.includes('JWT_SECRET') && envContent.includes('cambiar'))) {
    console.log('⚠️  ADVERTENCIA: El archivo .env tiene valores por defecto\n');
    console.log('📝 Por favor edita backend/.env y configura:');
    console.log('   - DB_PASSWORD: Tu contraseña real de PostgreSQL');
    console.log('   - JWT_SECRET: Una clave secreta segura\n');
  } else {
    console.log('✅ El archivo .env parece estar configurado correctamente\n');
  }
}
