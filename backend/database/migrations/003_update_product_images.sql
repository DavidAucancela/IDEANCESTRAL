-- =============================================================================
-- Migración 003: Actualizar URLs de imágenes de productos con archivos reales
-- =============================================================================
-- Esta migración es idempotente: se puede ejecutar múltiples veces sin daño.
-- Solo reemplaza entradas que aún usan el placeholder logo-principal.jpg.
-- Las imágenes subidas desde el panel admin NO se tocan.
-- =============================================================================

-- 1. Eliminar únicamente las entradas placeholder (logo-principal.jpg)
--    Las imágenes reales subidas por admin quedan intactas.
DELETE FROM imagenes_productos
WHERE url = '/imagenes/logo-principal.jpg'
  AND producto_id IN (
    SELECT id FROM productos WHERE nombre IN (
      'Máscara Diablo Huma','Máscara Ciervo','Marco de Madera',
      'Nacimiento Tejido','Nacimiento Base de Madera','Sol de Madera',
      'Tazas Cerámica','Árbol de Cuarzos','Caballo Botero',
      'Cucharas Artesanales','Destapadores Artesanales','Cuadro Diablo Huma',
      'Cuadro Paisaje Grande','Portallaves de Piedra','Pulseras Artesanales',
      'Muñeca de Cerámica','Máscara de Jesús','Caja de Té'
    )
  );

-- 2. Insertar imágenes reales (ON CONFLICT DO NOTHING protege contra re-ejecución)
INSERT INTO imagenes_productos (producto_id, url, orden, es_principal)
SELECT p.id, img.url, img.orden, img.es_principal
FROM (VALUES
  -- Máscara Diablo Huma
  ('Máscara Diablo Huma',    '/imagenes/mascara diablo huma - corregida.jpg', 0, true),
  ('Máscara Diablo Huma',    '/imagenes/diablo PRINCIPAL.jpg',                1, false),
  ('Máscara Diablo Huma',    '/imagenes/diablo PRINCIPAL2.jpg',               2, false),
  -- Máscara Ciervo
  ('Máscara Ciervo',         '/imagenes/masc1.jpg',                           0, true),
  ('Máscara Ciervo',         '/imagenes/masc2.jpg',                           1, false),
  ('Máscara Ciervo',         '/imagenes/masc3 larga.jpg',                     2, false),
  -- Marco de Madera
  ('Marco de Madera',        '/imagenes/marco madera.jpg',                    0, true),
  -- Nacimiento Tejido
  ('Nacimiento Tejido',      '/imagenes/nac1.jpg',                            0, true),
  ('Nacimiento Tejido',      '/imagenes/nac4 pequeño.jpg',                    1, false),
  -- Nacimiento Base de Madera
  ('Nacimiento Base de Madera', '/imagenes/nac2.jpg',                         0, true),
  ('Nacimiento Base de Madera', '/imagenes/nac3.jpg',                         1, false),
  ('Nacimiento Base de Madera', '/imagenes/nacimiento pareja gorditos.jpg',   2, false),
  ('Nacimiento Base de Madera', '/imagenes/naciemientos nuez.jpg',            3, false),
  ('Nacimiento Base de Madera', '/imagenes/nacimiento tallado 5 piezas.jpg',  4, false),
  -- Sol de Madera
  ('Sol de Madera',          '/imagenes/sol madera.jpg',                      0, true),
  -- Tazas Cerámica
  ('Tazas Cerámica',         '/imagenes/vasos.jpg',                           0, true),
  ('Tazas Cerámica',         '/imagenes/canoa con productos en cerámica.png', 1, false),
  -- Árbol de Cuarzos
  ('Árbol de Cuarzos',       '/imagenes/arbol de cuarzos.jpg',                0, true),
  -- Caballo Botero
  ('Caballo Botero',         '/imagenes/caballo.jpg',                         0, true),
  -- Cucharas Artesanales
  ('Cucharas Artesanales',   '/imagenes/cucharas PRINCIPAL.jpg',              0, true),
  -- Destapadores Artesanales
  ('Destapadores Artesanales', '/imagenes/destapadores.jpg',                  0, true),
  -- Cuadro Diablo Huma
  ('Cuadro Diablo Huma',     '/imagenes/cuadro diablohuma.jpg',               0, true),
  ('Cuadro Diablo Huma',     '/imagenes/cuadros varios.jpg',                  1, false),
  -- Cuadro Paisaje Grande
  ('Cuadro Paisaje Grande',  '/imagenes/cuadro paisaje grande.jpg',           0, true),
  -- Portallaves de Piedra
  ('Portallaves de Piedra',  '/imagenes/portallaves piedra.jpg',              0, true),
  -- Pulseras Artesanales
  ('Pulseras Artesanales',   '/imagenes/pulseras_varias.jpg',                 0, true),
  -- Muñeca de Cerámica
  ('Muñeca de Cerámica',     '/imagenes/muñeca cermica.jpg',                  0, true),
  -- Máscara de Jesús
  ('Máscara de Jesús',       '/imagenes/mascara-Jesus.jpg',                   0, true),
  ('Máscara de Jesús',       '/imagenes/mascaras pequeñas.jpg',               1, false),
  -- Caja de Té
  ('Caja de Té',             '/imagenes/caja de te.jpeg',                     0, true)
) AS img(nombre_producto, url, orden, es_principal)
JOIN productos p ON p.nombre = img.nombre_producto
WHERE NOT EXISTS (
  SELECT 1 FROM imagenes_productos ip
  WHERE ip.producto_id = p.id AND ip.url = img.url
);

-- 3. Actualizar imágenes de categorías
UPDATE categorias SET imagen_url = '/imagenes/diablo PRINCIPAL.jpg'   WHERE nombre = 'Madera'   AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
UPDATE categorias SET imagen_url = '/imagenes/vasos.jpg'              WHERE nombre = 'Cerámica' AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
UPDATE categorias SET imagen_url = '/imagenes/pulseras_varias.jpg'    WHERE nombre = 'Tejidos'  AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
UPDATE categorias SET imagen_url = '/imagenes/arbol de cuarzos.jpg'   WHERE nombre = 'Otros'    AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');

-- 4. Actualizar promociones con imágenes reales
UPDATE promociones SET imagen_url = '/imagenes/promo1.jpg' WHERE temporada = 'Diciembre' AND tema = 'navidad'  AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
UPDATE promociones SET imagen_url = '/imagenes/promo2.jpg' WHERE temporada = 'Mayo'      AND tema = 'madre'    AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
UPDATE promociones SET imagen_url = '/imagenes/promo3.jpg' WHERE temporada = 'Diciembre' AND tema = 'cultural' AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
UPDATE promociones SET imagen_url = '/imagenes/promo4.jpg' WHERE temporada = 'Junio'     AND tema = 'inti'     AND (imagen_url IS NULL OR imagen_url = '/imagenes/logo-principal.jpg');
