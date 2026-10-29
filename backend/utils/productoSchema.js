import { z } from 'zod';
import { sanitizeString } from './sanitize.js';

// Los formularios envían '' para campos vacíos y números como texto.
const vacioANull = (v) => (typeof v === 'string' && v.trim() === '' ? null : v);
const aNumero = (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v);
const numeroOpcional = (v) => aNumero(vacioANull(v));

const textoOpcional = (max) => z.preprocess(vacioANull, z.string().max(max).nullable()).optional();

export const productoSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  precio: z.preprocess(aNumero, z.number().positive().max(99999999)),
  descripcion: textoOpcional(5000),
  material: textoOpcional(200),
  peso: textoOpcional(50),
  categoria_id: z.preprocess(numeroOpcional, z.number().int().positive().nullable()).optional(),
  // null = no se controla stock (pieza bajo pedido)
  stock: z.preprocess(numeroOpcional, z.number().int().min(0).max(100000).nullable()).optional(),
  publicado: z.boolean().optional(),
  destacado: z.boolean().optional()
});

// En PUT todos los campos son opcionales; un campo con null o '' se vacía.
export const productoUpdateSchema = productoSchema.partial();

const CAMPOS_TEXTO = ['nombre', 'descripcion', 'material', 'peso'];

/**
 * Sanitiza los textos ya validados. Los textos que quedan vacíos tras
 * sanitizar se guardan como null (nombre nunca queda vacío: lo valida Zod antes).
 */
export const sanitizarProducto = (data) => {
  const result = { ...data };
  for (const campo of CAMPOS_TEXTO) {
    if (typeof result[campo] === 'string') {
      result[campo] = sanitizeString(result[campo]) || null;
    }
  }
  return result;
};
