-- =============================================================================
-- SEED: Datos iniciales para IdeAncestral
-- =============================================================================
-- Uso: node scripts/init-db.js --seed
--
-- IMÁGENES:
--   - El seed usa /imagenes/logo-principal.jpg como placeholder (existe en frontend/public/imagenes/)
--   - Para imágenes reales: súbelas desde el panel admin (van a backend/uploads/)
--   - O coloca tus archivos en frontend/public/imagenes/ y actualiza las URLs en BD
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LIMPIEZA: Borrar datos previos para re-seed limpio
-- -----------------------------------------------------------------------------
DELETE FROM imagenes_productos;
DELETE FROM productos;
DELETE FROM promociones;

-- -----------------------------------------------------------------------------
-- 2. CATEGORÍAS: Garantizar que existen antes de insertar productos
-- -----------------------------------------------------------------------------
INSERT INTO categorias (nombre, descripcion) VALUES
('Madera',    'Productos artesanales elaborados en madera'),
('Cerámica',  'Piezas de cerámica y barro'),
('Tejidos',   'Productos tejidos a mano'),
('Otros',     'Otras artesanías diversas')
ON CONFLICT (nombre) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. PRODUCTOS: Insertar catálogo usando subqueries para category_id
--    (evita FK error por IDs hardcodeados que pueden diferir entre entornos)
-- -----------------------------------------------------------------------------
INSERT INTO productos (nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado)
SELECT nombre, descripcion, precio, material, peso,
       (SELECT id FROM categorias WHERE categorias.nombre = cat ORDER BY id LIMIT 1),
       publicado, destacado
FROM (VALUES
  ('Máscara Diablo Huma',      'Máscara artesanal tallada en madera de cedro con detalles tradicionales del Diablo Huma, icono de las fiestas de Inti Raymi. Cada pieza es única, pintada a mano con colores vibrantes.',  20.00,  'Madera de cedro',    '2 lbs',   'Madera',   true, true),
  ('Máscara Ciervo',           'Máscara de ciervo tallada a mano en madera de cedro. Pieza decorativa con acabado rústico ideal para decorar espacios con estilo ancestral.',                                               20.00,  'Madera de cedro',    '1 lb',    'Madera',   true, false),
  ('Marco de Madera',          'Marco decorativo elaborado en madera de cedro con tallado artesanal. Perfecto para enmarcar fotos o como pieza decorativa de pared.',                                                        20.00,  'Madera de cedro',    '2 lbs',   'Madera',   true, false),
  ('Nacimiento Tejido',        'Nacimiento artesanal tejido con fibras naturales y detalles de cerámica. Cada figura está elaborada con técnicas ancestrales de tejido andino.',                                             8.00,   'Fibras naturales',   '0.5 lbs', 'Tejidos',  true, true),
  ('Nacimiento Base de Madera','Nacimiento con base de madera y figuras de cerámica pintadas a mano. Un detalle perfecto para la decoración navideña.',                                                                      20.00,  'Madera y cerámica',  '1 lb',    'Cerámica', true, false),
  ('Sol de Madera',            'Imponente decoración de sol tallada en madera de cedro. Pieza de gran formato ideal como centro de pared.',                                                                                  150.00, 'Madera de cedro',    '10 lbs',  'Madera',   true, true),
  ('Tazas Cerámica',           'Set de tazas de cerámica pintadas a mano con motivos andinos. Aptas para microondas y lavavajillas.',                                                                                        8.00,   'Cerámica',           '1 lb',    'Cerámica', true, false),
  ('Árbol de Cuarzos',         'Árbol decorativo con base de madera y ramas adornadas con cuarzos naturales. Cada piedra es seleccionada por su brillo y energía.',                                                         25.00,  'Madera y cuarzo',    '3 lbs',   'Otros',    true, false),
  ('Caballo Botero',           'Figura de caballo en estilo Botero elaborada en cerámica y pintada a mano. Pieza de colección con acabado artístico.',                                                                       25.00,  'Cerámica',           '1.5 lbs', 'Cerámica', true, false),
  ('Cucharas Artesanales',     'Set de cucharas talladas a mano en madera. Funcionales y decorativas, perfectas para la cocina o como souvenir.',                                                                            12.00,  'Madera',             '0.5 lbs', 'Madera',   true, false),
  ('Destapadores Artesanales', 'Destapadores con figuras artesanales talladas en madera. Prácticos y con un toque de arte popular.',                                                                                         5.00,   'Madera y metal',     '0.3 lbs', 'Madera',   true, false),
  ('Cuadro Diablo Huma',       'Cuadro decorativo pintado a mano con la figura del Diablo Huma. Colores vibrantes sobre lienzo con marco artesanal.',                                                                        35.00,  'Lienzo y madera',    '3 lbs',   'Madera',   true, true),
  ('Cuadro Paisaje Grande',    'Cuadro de gran formato con paisaje andino pintado a mano. Cada pieza captura la belleza de los Andes ecuatorianos.',                                                                         80.00,  'Lienzo y madera',    '5 lbs',   'Madera',   true, false),
  ('Portallaves de Piedra',    'Portallaves elaborado con piedra natural tallada. Funcional y decorativo, ideal para la entrada del hogar.',                                                                                  15.00,  'Piedra natural',     '2 lbs',   'Otros',    true, false),
  ('Pulseras Artesanales',     'Colección de pulseras tejidas a mano con hilos de colores y mostacillas. Diseños únicos inspirados en la cosmovisión andina.',                                                               3.00,   'Hilo y mostacillas', '0.1 lbs', 'Tejidos',  true, false),
  ('Muñeca de Cerámica',       'Muñeca decorativa de cerámica pintada a mano con vestimenta tradicional ecuatoriana. Pieza de colección.',                                                                                   18.00,  'Cerámica',           '1 lb',    'Cerámica', true, true),
  ('Máscara de Jesús',         'Máscara artesanal representando el rostro de Jesús, tallada en madera de cedro con detalles finos.',                                                                                         30.00,  'Madera de cedro',    '2.5 lbs', 'Madera',   true, false),
  ('Caja de Té',               'Caja organizadora de té con 3 compartimentos elaborada en madera con tapa decorada a mano.',                                                                                                 15.00,  'Madera',             '1 lb',    'Madera',   true, false)
) AS d(nombre, descripcion, precio, material, peso, cat, publicado, destacado)
ON CONFLICT DO NOTHING;

-- Sincronizar secuencia si hubo inserciones con ON CONFLICT DO NOTHING
SELECT setval('productos_id_seq', GREATEST((SELECT MAX(id) FROM productos), 1));

-- -----------------------------------------------------------------------------
-- 4. IMÁGENES: Busca producto por nombre (no por ID) para evitar FK errors
-- -----------------------------------------------------------------------------
INSERT INTO imagenes_productos (producto_id, url, orden, es_principal)
SELECT p.id, img.url, img.orden, img.es_principal
FROM (VALUES
  ('Máscara Diablo Huma',       '/imagenes/mascara diablo huma - corregida.jpg', 0, true),
  ('Máscara Diablo Huma',       '/imagenes/diablo PRINCIPAL.jpg',                1, false),
  ('Máscara Diablo Huma',       '/imagenes/diablo PRINCIPAL2.jpg',               2, false),
  ('Máscara Ciervo',            '/imagenes/masc1.jpg',                           0, true),
  ('Máscara Ciervo',            '/imagenes/masc2.jpg',                           1, false),
  ('Máscara Ciervo',            '/imagenes/masc3 larga.jpg',                     2, false),
  ('Marco de Madera',           '/imagenes/marco madera.jpg',                    0, true),
  ('Nacimiento Tejido',         '/imagenes/nac1.jpg',                            0, true),
  ('Nacimiento Tejido',         '/imagenes/nac4 pequeño.jpg',                    1, false),
  ('Nacimiento Base de Madera', '/imagenes/nac2.jpg',                            0, true),
  ('Nacimiento Base de Madera', '/imagenes/nac3.jpg',                            1, false),
  ('Nacimiento Base de Madera', '/imagenes/nacimiento pareja gorditos.jpg',      2, false),
  ('Nacimiento Base de Madera', '/imagenes/naciemientos nuez.jpg',               3, false),
  ('Nacimiento Base de Madera', '/imagenes/nacimiento tallado 5 piezas.jpg',     4, false),
  ('Sol de Madera',             '/imagenes/sol madera.jpg',                      0, true),
  ('Tazas Cerámica',            '/imagenes/vasos.jpg',                           0, true),
  ('Tazas Cerámica',            '/imagenes/canoa con productos en cerámica.png', 1, false),
  ('Árbol de Cuarzos',          '/imagenes/arbol de cuarzos.jpg',                0, true),
  ('Caballo Botero',            '/imagenes/caballo.jpg',                         0, true),
  ('Cucharas Artesanales',      '/imagenes/cucharas PRINCIPAL.jpg',              0, true),
  ('Destapadores Artesanales',  '/imagenes/destapadores.jpg',                    0, true),
  ('Cuadro Diablo Huma',        '/imagenes/cuadro diablohuma.jpg',               0, true),
  ('Cuadro Diablo Huma',        '/imagenes/cuadros varios.jpg',                  1, false),
  ('Cuadro Paisaje Grande',     '/imagenes/cuadro paisaje grande.jpg',           0, true),
  ('Portallaves de Piedra',     '/imagenes/portallaves piedra.jpg',              0, true),
  ('Pulseras Artesanales',      '/imagenes/pulseras_varias.jpg',                 0, true),
  ('Muñeca de Cerámica',        '/imagenes/muñeca cermica.jpg',                  0, true),
  ('Máscara de Jesús',          '/imagenes/mascara-Jesus.jpg',                   0, true),
  ('Máscara de Jesús',          '/imagenes/mascaras pequeñas.jpg',               1, false),
  ('Caja de Té',                '/imagenes/caja de te.jpeg',                     0, true)
) AS img(nombre_producto, url, orden, es_principal)
JOIN productos p ON p.nombre = img.nombre_producto
WHERE NOT EXISTS (
  SELECT 1 FROM imagenes_productos ip
  WHERE ip.producto_id = p.id AND ip.url = img.url
);


