import xss from 'xss';

/**
 * Opciones estrictas para sanitizar HTML y prevenir XSS.
 */
const xssOptions = {
  whiteList: {}, // No permitir tags HTML
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
};

/**
 * Sanitiza un string para prevenir XSS.
 * @param {string} input - Texto a sanitizar
 * @returns {string} - Texto seguro
 */
export const sanitizeString = (input) => {
  if (input == null || typeof input !== 'string') return '';
  return xss(input, xssOptions).trim();
};

/**
 * Sanitiza un objeto aplicando sanitizeString a los campos de texto.
 * @param {object} obj - Objeto con posibles strings
 * @param {string[]} textFields - Nombres de campos a sanitizar
 * @returns {object} - Objeto con campos sanitizados
 */
export const sanitizeObject = (obj, textFields) => {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  for (const field of textFields) {
    if (result[field] != null && typeof result[field] === 'string') {
      result[field] = sanitizeString(result[field]);
    }
  }
  return result;
};
