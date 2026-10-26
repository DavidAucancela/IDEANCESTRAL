// Fondos de la sección de inicio. Rotan solos y cada uno trae su paleta:
//   acento → título en cursiva, etiqueta, lupa, chips y cursor
//   texto  → título y descripción (un blanco teñido con el tono de la foto)
//   fondo  → color oscuro del degradado sobre la foto y de la lista de resultados (r, g, b)
//   posicion / posicionMovil → qué parte de la foto se ve (object-position)
export const HERO_FONDOS = [
  {
    id: 'diablo-huma',
    imagenes: { 900: '/imagenes/inicio/diablo-huma-900.jpg', 1600: '/imagenes/inicio/diablo-huma-1600.jpg' },
    ancho: 1600,
    alto: 1068,
    alt: 'hero.altDiablo',
    posicion: '28% 40%',
    posicionMovil: '16% 50%',
    acento: '#E8C38C',
    texto: '#FFF6EC',
    fondo: '20, 14, 8'
  },
  {
    id: 'diablo-mascara',
    imagenes: { 900: '/imagenes/inicio/diablo-mascara-900.jpg', 1600: '/imagenes/inicio/diablo-mascara-1600.jpg' },
    ancho: 1600,
    alto: 1068,
    alt: 'hero.altMascara',
    posicion: '20% 35%',
    posicionMovil: '45% 25%',
    acento: '#FFA25C',
    texto: '#FFEDE2',
    fondo: '28, 10, 4'
  },
  {
    id: 'mascaras-mercado',
    imagenes: { 900: '/imagenes/inicio/mascaras-mercado-900.jpg', 1600: '/imagenes/inicio/mascaras-mercado-1600.jpg' },
    ancho: 1600,
    alto: 1200,
    alt: 'hero.altMercado',
    posicion: '30% 30%',
    posicionMovil: '40% 20%',
    acento: '#FFD166',
    texto: '#FFF8E1',
    fondo: '10, 12, 30'
  },
  {
    id: 'cuadros',
    imagenes: { 900: '/imagenes/inicio/cuadros-900.jpg', 1600: '/imagenes/inicio/cuadros-1600.jpg' },
    ancho: 1600,
    alto: 1200,
    alt: 'hero.altCuadros',
    posicion: '25% 50%',
    posicionMovil: '20% 50%',
    acento: '#6EE7D2',
    texto: '#E6FBF6',
    fondo: '6, 22, 22'
  },
  {
    id: 'paisaje-andino',
    imagenes: { 900: '/imagenes/inicio/paisaje-andino-900.jpg', 1440: '/imagenes/inicio/paisaje-andino-1440.jpg' },
    ancho: 1440,
    alto: 1080,
    alt: 'hero.altPaisaje',
    posicion: '30% 40%',
    posicionMovil: '50% 35%',
    acento: '#D9B8FF',
    texto: '#F3EAFF',
    fondo: '20, 10, 36'
  }
]

// Segundos que se muestra cada fondo
export const HERO_SEGUNDOS_POR_FONDO = 7
