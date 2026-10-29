import { z } from 'zod';
import { sanitizeString } from './sanitize.js';

// Los formularios envían '' para campos vacíos y números como texto.
const vacioANull = (v) => (typeof v === 'string' && v.trim() === '' ? null : v);
const aNumero = (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v);
const numeroOpcional = (v) => aNumero(vacioANull(v));

const mes = z.preprocess(numeroOpcional, z.number().int().min(1).max(12).nullable()).optional();

const base = z.object({
  nombre: z.string().trim().min(1).max(200),
  temporada: z.string().trim().min(1).max(50),
  tema: z.preprocess(vacioANull, z.string().max(50).nullable()).optional(),
  imagen_url: z.preprocess(vacioANull, z.string().max(255).nullable()).optional(),
  orden: z.preprocess(numeroOpcional, z.number().int().min(0).max(10000).nullable()).optional(),
  activa: z.boolean().optional(),
  // Meses en que va la promoción (1–12); si mes_fin < mes_inicio, cruza el año
  mes_inicio: mes,
  mes_fin: mes,
  // Categoría a la que lleva la promoción en el inicio
  categoria_id: z.preprocess(numeroOpcional, z.number().int().positive().max(2147483647).nullable()).optional()
});

// Los dos meses van juntos: o ambos o ninguno
const mesesCompletos = (d) => (d.mes_inicio == null) === (d.mes_fin == null);
const mensajeMeses = { message: 'Indica el mes de inicio y el de fin', path: ['mes_fin'] };

export const promocionSchema = base.refine(mesesCompletos, mensajeMeses);

// En PUT todos los campos son opcionales; si llega un mes, debe llegar el otro.
export const promocionUpdateSchema = base.partial().refine(
  (d) => (!('mes_inicio' in d) && !('mes_fin' in d)) || mesesCompletos(d),
  mensajeMeses
);

const CAMPOS_TEXTO = ['nombre', 'temporada', 'tema', 'imagen_url'];

/** Sanitiza los textos ya validados; los que quedan vacíos pasan a null. */
export const sanitizarPromocion = (data) => {
  const result = { ...data };
  for (const campo of CAMPOS_TEXTO) {
    if (typeof result[campo] === 'string') {
      result[campo] = sanitizeString(result[campo]) || null;
    }
  }
  return result;
};
