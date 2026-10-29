-- =============================================================================
-- Migración 005: Promociones por temporada
-- =============================================================================
-- mes_inicio / mes_fin (1–12): meses en que va la promoción; se repite cada año.
--   Si mes_fin < mes_inicio, cruza el año (ej. 12 → 1 = diciembre a enero).
-- categoria_id: categoría a la que lleva la promoción en el inicio.
-- Además carga las 8 temporadas del año UNA sola vez (marca en datos_iniciales),
-- para que borrar una desde el panel admin no la haga volver en el próximo deploy.
-- Idempotente: se puede ejecutar en cada deploy.
-- =============================================================================

ALTER TABLE promociones ADD COLUMN IF NOT EXISTS mes_inicio SMALLINT;
ALTER TABLE promociones ADD COLUMN IF NOT EXISTS mes_fin SMALLINT;
ALTER TABLE promociones ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'promociones_meses_validos') THEN
    ALTER TABLE promociones ADD CONSTRAINT promociones_meses_validos CHECK (
      (mes_inicio IS NULL OR mes_inicio BETWEEN 1 AND 12) AND
      (mes_fin IS NULL OR mes_fin BETWEEN 1 AND 12)
    );
  END IF;
END $$;

-- Promociones que ya existían: se deduce el mes del texto «temporada» (ej. «Diciembre»)
UPDATE promociones p
SET mes_inicio = m.num, mes_fin = m.num
FROM (VALUES
  ('enero', 1), ('febrero', 2), ('marzo', 3), ('abril', 4), ('mayo', 5), ('junio', 6),
  ('julio', 7), ('agosto', 8), ('septiembre', 9), ('octubre', 10), ('noviembre', 11), ('diciembre', 12)
) AS m(nombre, num)
WHERE p.mes_inicio IS NULL
  AND lower(p.temporada) LIKE m.nombre || '%';

-- Registro de datos que se cargan una sola vez
CREATE TABLE IF NOT EXISTS datos_iniciales (
  clave VARCHAR(100) PRIMARY KEY,
  aplicado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM datos_iniciales WHERE clave = 'temporadas_promociones') THEN
    -- Cada temporada solo se crea si no hay ya una promoción con ese nombre
    -- (en producción pueden existir las 4 de ejemplo antiguas)
    INSERT INTO promociones (nombre, temporada, tema, imagen_url, orden, activa, mes_inicio, mes_fin, categoria_id)
    SELECT t.nombre, t.temporada, t.tema, t.imagen, t.orden, true, t.inicio, t.fin,
           (SELECT id FROM categorias WHERE nombre = t.categoria)
    FROM (VALUES
      ('San Valentín',           'Febrero',          'general',  '/imagenes/promo3.jpg',               1,  2,  2, 'Tejidos',  '%valent%'),
      ('Carnaval',               'Febrero – Marzo',  'cultural', '/imagenes/masc1.jpg',                2,  2,  3, 'Madera',   '%carnaval%'),
      ('Día de la Madre',        'Mayo',             'madre',    '/imagenes/caja de te.jpeg',          3,  5,  5, 'Cerámica', '%madre%'),
      ('Día del Padre',          'Junio',            'general',  '/imagenes/destapadores.jpg',         4,  6,  6, 'Madera',   '%padre%'),
      ('Inti Raymi',             'Junio',            'inti',     '/imagenes/sol madera.jpg',           5,  6,  6, 'Madera',   '%inti%'),
      ('Día de Difuntos',        'Noviembre',        'cultural', '/imagenes/cuadros varios.jpg',       6, 11, 11, 'Otros',    '%difunto%'),
      ('Fiestas de Quito',       'Diciembre',        'cultural', '/imagenes/promo4.jpg',               7, 12, 12, 'Cerámica', '%quito%'),
      ('Navidad y Fin de Año',   'Diciembre',        'navidad',  '/imagenes/nac1.jpg',                 8, 12, 12, 'Cerámica', '%navidad%')
    ) AS t(nombre, temporada, tema, imagen, orden, inicio, fin, categoria, patron)
    WHERE NOT EXISTS (SELECT 1 FROM promociones p WHERE lower(p.nombre) LIKE t.patron);

    -- Las que ya existían sin categoría toman la de su temporada
    UPDATE promociones p
    SET categoria_id = (SELECT id FROM categorias WHERE nombre = t.categoria)
    FROM (VALUES
      ('%valent%', 'Tejidos'), ('%carnaval%', 'Madera'), ('%madre%', 'Cerámica'), ('%padre%', 'Madera'),
      ('%inti%', 'Madera'), ('%difunto%', 'Otros'), ('%quito%', 'Cerámica'), ('%navidad%', 'Cerámica')
    ) AS t(patron, categoria)
    WHERE p.categoria_id IS NULL AND lower(p.nombre) LIKE t.patron;

    INSERT INTO datos_iniciales (clave) VALUES ('temporadas_promociones');
  END IF;
END $$;
