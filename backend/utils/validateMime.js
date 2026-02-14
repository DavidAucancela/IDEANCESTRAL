import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Valida el tipo MIME real del archivo leyendo los magic bytes.
 * No confía en la extensión ni en el Content-Type del cliente.
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise<{valid: boolean, mime?: string}>}
 */
export async function validateImageMime(filePath) {
  try {
    const buffer = fs.readFileSync(filePath, { start: 0, end: 12 });
    const result = await fileTypeFromBuffer(buffer);

    if (!result) {
      return { valid: false };
    }

    if (ALLOWED_MIMES.includes(result.mime)) {
      return { valid: true, mime: result.mime };
    }

    // WebP: file-type puede no detectarlo en buffers pequeños, verificar manualmente
    if (buffer.length >= 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      const webp = buffer.toString('ascii', 8, 12);
      if (webp === 'WEBP') return { valid: true, mime: 'image/webp' };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
}
