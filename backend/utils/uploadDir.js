import path from 'path';
import { fileURLToPath } from 'url';

const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Carpeta donde se guardan las imágenes subidas desde el admin.
 * Usa UPLOAD_DIR si está definida (relativa a backend/ o absoluta);
 * por defecto backend/uploads. En Railway debe apuntar a un Volume.
 */
export const UPLOAD_DIR = path.resolve(backendDir, process.env.UPLOAD_DIR || 'uploads');

/**
 * Ruta en disco de una URL pública /uploads/<archivo>.
 * Usa solo el nombre del archivo para evitar salir de la carpeta.
 */
export const uploadPathFromUrl = (url) => path.join(UPLOAD_DIR, path.basename(url));
