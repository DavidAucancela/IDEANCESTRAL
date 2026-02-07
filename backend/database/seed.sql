-- Datos de ejemplo para desarrollo
-- Limpiar datos previos para re-seed limpio
DELETE FROM imagenes_productos;
DELETE FROM productos;

-- Insertar productos de ejemplo
INSERT INTO productos (id, nombre, descripcion, precio, material, peso, categoria_id, publicado, destacado) VALUES
(1, 'Máscara Diablo Huma', 'Máscara artesanal tallada en madera de cedro con detalles tradicionales del Diablo Huma, icono de las fiestas de Inti Raymi. Cada pieza es única, pintada a mano con colores vibrantes.', 20.00, 'Madera de cedro', '2 lbs', 1, true, true),
(2, 'Máscara Ciervo', 'Máscara de ciervo tallada a mano en madera de cedro. Pieza decorativa con acabado rústico ideal para decorar espacios con estilo ancestral.', 20.00, 'Madera de cedro', '1 lb', 1, true, false),
(3, 'Marco de Madera', 'Marco decorativo elaborado en madera de cedro con tallado artesanal. Perfecto para enmarcar fotos o como pieza decorativa de pared.', 20.00, 'Madera de cedro', '2 lbs', 1, true, false),
(4, 'Nacimiento Tejido', 'Nacimiento artesanal tejido con fibras naturales y detalles de cerámica. Cada figura está elaborada con técnicas ancestrales de tejido andino.', 8.00, 'Fibras naturales', '0.5 lbs', 3, true, true),
(5, 'Nacimiento Base de Madera', 'Nacimiento con base de madera y figuras de cerámica pintadas a mano. Un detalle perfecto para la decoración navideña.', 20.00, 'Madera y cerámica', '1 lb', 2, true, false),
(6, 'Sol de Madera', 'Imponente decoración de sol tallada en madera de cedro. Pieza de gran formato ideal como centro de pared.', 150.00, 'Madera de cedro', '10 lbs', 1, true, true),
(7, 'Tazas Cerámica', 'Set de tazas de cerámica pintadas a mano con motivos andinos. Aptas para microondas y lavavajillas.', 8.00, 'Cerámica', '1 lb', 2, true, false),
(8, 'Árbol de Cuarzos', 'Árbol decorativo con base de madera y ramas adornadas con cuarzos naturales. Cada piedra es seleccionada por su brillo y energía.', 25.00, 'Madera y cuarzo', '3 lbs', 4, true, false),
(9, 'Caballo Botero', 'Figura de caballo en estilo Botero elaborada en cerámica y pintada a mano. Pieza de colección con acabado artístico.', 25.00, 'Cerámica', '1.5 lbs', 2, true, false),
(10, 'Cucharas Artesanales', 'Set de cucharas talladas a mano en madera. Funcionales y decorativas, perfectas para la cocina o como souvenir.', 12.00, 'Madera', '0.5 lbs', 1, true, false),
(11, 'Destapadores Artesanales', 'Destapadores con figuras artesanales talladas en madera. Prácticos y con un toque de arte popular.', 5.00, 'Madera y metal', '0.3 lbs', 1, true, false),
(12, 'Cuadro Diablo Huma', 'Cuadro decorativo pintado a mano con la figura del Diablo Huma. Colores vibrantes sobre lienzo con marco artesanal.', 35.00, 'Lienzo y madera', '3 lbs', 1, true, true),
(13, 'Cuadro Paisaje Grande', 'Cuadro de gran formato con paisaje andino pintado a mano. Cada pieza captura la belleza de los Andes ecuatorianos.', 80.00, 'Lienzo y madera', '5 lbs', 1, true, false),
(14, 'Portallaves de Piedra', 'Portallaves elaborado con piedra natural tallada. Funcional y decorativo, ideal para la entrada del hogar.', 15.00, 'Piedra natural', '2 lbs', 4, true, false),
(15, 'Pulseras Artesanales', 'Colección de pulseras tejidas a mano con hilos de colores y mostacillas. Diseños únicos inspirados en la cosmovisión andina.', 3.00, 'Hilo y mostacillas', '0.1 lbs', 3, true, false),
(16, 'Muñeca de Cerámica', 'Muñeca decorativa de cerámica pintada a mano con vestimenta tradicional ecuatoriana. Pieza de colección.', 18.00, 'Cerámica', '1 lb', 2, true, true),
(17, 'Máscara de Jesús', 'Máscara artesanal representando el rostro de Jesús, tallada en madera de cedro con detalles finos.', 30.00, 'Madera de cedro', '2.5 lbs', 1, true, false),
(18, 'Caja de Té', 'Caja organizadora de té con 3 compartimentos elaborada en madera con tapa decorada a mano.', 15.00, 'Madera', '1 lb', 1, true, false)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  material = EXCLUDED.material,
  peso = EXCLUDED.peso,
  categoria_id = EXCLUDED.categoria_id,
  publicado = EXCLUDED.publicado,
  destacado = EXCLUDED.destacado;

-- Resetear la secuencia del id
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));

-- Insertar imágenes asociadas a cada producto
INSERT INTO imagenes_productos (producto_id, url, orden, es_principal) VALUES
-- Máscara Diablo Huma (id: 1)
(1, '/imagenes/masc1.jpg', 0, true),
(1, '/imagenes/diablo-PRINCIPAL3.jpg', 1, false),
(1, '/imagenes/didablos-varios.jpg', 2, false),

-- Máscara Ciervo (id: 2)
(2, '/imagenes/masc2.jpg', 0, true),
(2, '/imagenes/masc3 larga.jpg', 1, false),

-- Marco de Madera (id: 3)
(3, '/imagenes/marco madera.jpg', 0, true),

-- Nacimiento Tejido (id: 4)
(4, '/imagenes/nac2.jpg', 0, true),
(4, '/imagenes/nac3.jpg', 1, false),
(4, '/imagenes/nac4 pequeño.jpg', 2, false),

-- Nacimiento Base de Madera (id: 5)
(5, '/imagenes/nac1.jpg', 0, true),

-- Sol de Madera (id: 6)
(6, '/imagenes/sol madera.jpg', 0, true),

-- Tazas Cerámica (id: 7)
(7, '/imagenes/vasos.jpg', 0, true),

-- Árbol de Cuarzos (id: 8)
(8, '/imagenes/arbol de cuarzos.jpg', 0, true),

-- Caballo Botero (id: 9)
(9, '/imagenes/caballo.jpg', 0, true),

-- Cucharas Artesanales (id: 10)
(10, '/imagenes/cucharas PRINCIPAL.jpg', 0, true),

-- Destapadores (id: 11)
(11, '/imagenes/destapadores.jpg', 0, true),

-- Cuadro Diablo Huma (id: 12)
(12, '/imagenes/cuadro diablohuma.jpg', 0, true),
(12, '/imagenes/cuadros varios.jpg', 1, false),

-- Cuadro Paisaje Grande (id: 13)
(13, '/imagenes/cuadro paisaje grande.jpg', 0, true),

-- Portallaves de Piedra (id: 14)
(14, '/imagenes/portallaves piedra.jpg', 0, true),

-- Pulseras Artesanales (id: 15)
(15, '/imagenes/pulseras_varias.jpg', 0, true),

-- Muñeca de Cerámica (id: 16)
(16, '/imagenes/muñeca cermica.jpg', 0, true),

-- Máscara de Jesús (id: 17)
(17, '/imagenes/mascara-Jesus.jpg', 0, true),
(17, '/imagenes/mascaras pequeñas.jpg', 1, false),

-- Caja de Té (id: 18)
(18, '/imagenes/caja de te.jpeg', 0, true)
ON CONFLICT DO NOTHING;
