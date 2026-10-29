import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'

// Datos falsos del API
const productoAgotado = {
  id: 7, nombre: 'Máscara de prueba', precio: '25.00', stock: 0,
  categoria_id: 1, categoria_nombre: 'Madera', imagenes: []
}

const otroDestacado = {
  id: 8, nombre: 'Sol de madera', precio: '40.00', stock: 3,
  categoria_id: 1, categoria_nombre: 'Madera', imagenes: []
}

vi.mock('axios', () => ({
  default: {
    get: vi.fn(async (url, config = {}) => {
      const params = config.params || {}
      if (url.includes('/productos/7')) return { data: productoAgotado }
      if (url.includes('/productos')) {
        const lista = params.destacado ? [productoAgotado, otroDestacado] : [productoAgotado]
        return { data: { productos: lista, paginacion: {} } }
      }
      if (url.endsWith('/categorias')) {
        return {
          data: [
            { id: 2, nombre: 'Cerámica', imagen_url: null, total_productos: 3 },
            { id: 1, nombre: 'Madera', imagen_url: null, total_productos: 10 },
            { id: 5, nombre: 'Vacía', imagen_url: null, total_productos: 0 }
          ]
        }
      }
      if (url.includes('/categorias/')) return { data: { id: 1, nombre: 'Madera' } }
      // Las pruebas de Promociones ponen aquí sus datos
      if (url.endsWith('/promociones')) return { data: globalThis.__promos ?? [] }
      return { data: [] }
    }),
    defaults: { headers: { common: {} } }
  }
}))

let App, router

beforeAll(async () => {
  // APIs del navegador que jsdom no trae
  globalThis.IntersectionObserver = class {
    observe() {} unobserve() {} disconnect() {}
  }
  window.scrollTo = () => {}
  ;({ default: App } = await import('./App.vue'))
  ;({ default: router } = await import('./router'))
})

const esperar = async () => {
  for (let i = 0; i < 10; i++) {
    await nextTick()
    await new Promise((r) => setTimeout(r, 20))
  }
}

let app, root

const montarEn = async (ruta) => {
  root = document.createElement('div')
  document.body.appendChild(root)
  app = createApp(App)
  app.use(createPinia())
  app.use(router)
  await router.push(ruta)
  await router.isReady()
  app.mount(root)
  await esperar()
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  app?.unmount()
  root?.remove()
})

describe('Layout compartido', () => {
  it.each(['/', '/categoria/1', '/producto/7', '/no-existe'])(
    'en %s hay un solo header, footer y carrito',
    async (ruta) => {
      await montarEn(ruta)
      expect(root.querySelectorAll('header.header')).toHaveLength(1)
      expect(root.querySelectorAll('footer.footer')).toHaveLength(1)
      expect(root.querySelectorAll('.carrito-sidebar')).toHaveLength(1)
      expect(root.querySelectorAll('.whatsapp-float')).toHaveLength(1)
    }
  )

  it('el panel admin no muestra el layout de la tienda', async () => {
    await montarEn('/admin')
    expect(root.querySelector('header.header')).toBeNull()
    expect(root.querySelector('.carrito-sidebar')).toBeNull()
  })

  it('el botón del carrito abre y Escape cierra el carrito', async () => {
    await montarEn('/')
    root.querySelector('.cart-toggle').click()
    await nextTick()
    expect(root.querySelector('.carrito-sidebar').classList).toContain('open')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(root.querySelector('.carrito-sidebar').classList).not.toContain('open')
  })
})

describe('Navbar', () => {
  it('sobre el inicio va transparente y toma el acento del fondo activo', async () => {
    await montarEn('/')
    const header = root.querySelector('header.header')
    const hero = root.querySelector('#inicio')
    expect(header.classList).toContain('header--transparente')
    expect(header.style.getPropertyValue('--nav-acento')).toBe(hero.style.getPropertyValue('--hero-acento'))

    hero.querySelectorAll('.hero__indicador')[1].click()
    await nextTick()
    expect(header.style.getPropertyValue('--nav-acento')).toBe(hero.style.getPropertyValue('--hero-acento'))
  })

  it('en otras páginas es sólida', async () => {
    await montarEn('/producto/7')
    expect(root.querySelector('header.header').classList).not.toContain('header--transparente')
  })

  it('el menú móvil es una ventana con las 4 secciones y se cierra con un enlace, fuera o con Escape', async () => {
    await montarEn('/')
    const boton = root.querySelector('.menu-toggle')
    boton.click()
    await esperar()
    let menu = document.getElementById('nav-menu')
    expect(menu.getAttribute('role')).toBe('dialog')
    expect(boton.getAttribute('aria-expanded')).toBe('true')
    const titulos = [...menu.querySelectorAll('.menu-movil__enlace strong')].map((n) => n.textContent)
    expect(titulos).toEqual(['Inicio', 'Categorías', 'Promociones', 'Nosotros'])
    expect(menu.textContent).not.toMatch(/0[1-4]/)
    expect(menu.textContent).not.toContain('WhatsApp')
    expect(document.documentElement.style.overflow).toBe('hidden')

    menu.querySelectorAll('.menu-movil__enlace')[1].click()
    await esperar()
    expect(document.getElementById('nav-menu')).toBeNull()
    expect(document.documentElement.style.overflow).toBe('')

    boton.click()
    await esperar()
    document.querySelector('.menu-fondo').click()
    await esperar()
    expect(document.getElementById('nav-menu')).toBeNull()

    boton.click()
    await esperar()
    menu = document.getElementById('nav-menu')
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await esperar()
    expect(document.getElementById('nav-menu')).toBeNull()
  })
})

describe('Títulos de sección', () => {
  it('el título de destacados está traducido', async () => {
    localStorage.setItem('ideancestral_lang', 'en')
    await montarEn('/')
    const titulos = [...root.querySelectorAll('.seccion-encabezado__titulo')].map((h) => h.textContent.trim())
    expect(titulos).toContain('Featured pieces')
    expect(root.textContent).not.toContain('Selección especial')
  })
})

describe('Carrito en pasos', () => {
  const conPiezas = () =>
    localStorage.setItem('ideancestral_carrito', JSON.stringify([
      { id: 7, nombre: 'Máscara de prueba', precio: 20, imagen: '/x.jpg', cantidad: 2, stock: 5 },
      { id: 8, nombre: 'Sol de prueba', precio: 15, imagen: '/y.jpg', cantidad: 1, stock: null }
    ]))

  const abrirCarrito = async () => {
    conPiezas()
    await montarEn('/')
    root.querySelector('.cart-toggle').click()
    await esperar()
    return root.querySelector('.carrito-sidebar')
  }

  const continuar = async (carrito) => {
    carrito.querySelector('.carrito-btn--principal').click()
    await esperar()
  }

  it('paso 1: muestra las piezas y el total', async () => {
    const carrito = await abrirCarrito()
    expect(carrito.classList).toContain('open')
    expect(carrito.querySelectorAll('.carrito-pasos li')).toHaveLength(3)
    expect(carrito.querySelectorAll('.carrito-item')).toHaveLength(2)
    expect(carrito.querySelector('.carrito-total strong').textContent).toBe('$55.00')
    expect(carrito.textContent).toContain('3 piezas')
  })

  it('Continuar lleva a la entrega y luego al pago', async () => {
    const carrito = await abrirCarrito()
    await continuar(carrito)
    expect(carrito.querySelector('input[name="entrega"]')).not.toBeNull()
    await continuar(carrito)
    expect(carrito.querySelector('input[name="pago"]')).not.toBeNull()
    expect(carrito.querySelector('[aria-current="step"]').textContent).toContain('Pago')
  })

  it('sin pasarela activa, el pago se coordina solo por WhatsApp', async () => {
    const carrito = await abrirCarrito()
    await continuar(carrito)
    await continuar(carrito)
    expect(carrito.querySelectorAll('input[name="pago"]')).toHaveLength(1)
    expect(carrito.textContent).toContain('Coordinar por WhatsApp')
    expect(carrito.textContent).not.toContain('Pagar en línea')
  })

  it('la entrega, el nombre y la nota van en el mensaje de WhatsApp', async () => {
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => null)
    const carrito = await abrirCarrito()
    await continuar(carrito)
    carrito.querySelector('input[value="envio"]').click()
    const nombre = carrito.querySelector('.carrito-campo input')
    nombre.value = 'Ana'
    nombre.dispatchEvent(new Event('input'))
    await esperar()
    await continuar(carrito)
    expect(carrito.querySelector('.carrito-resumen-entrega').textContent).toContain('Envío a domicilio')
    carrito.querySelector('.carrito-btn--whatsapp').click()
    const mensaje = decodeURIComponent(abrir.mock.calls[0][0])
    expect(mensaje).toContain('Máscara de prueba x2')
    expect(mensaje).toContain('Entrega: Envío a domicilio')
    expect(mensaje).toContain('Nombre: Ana')
    abrir.mockRestore()
  })

  it('Volver regresa al paso anterior', async () => {
    const carrito = await abrirCarrito()
    await continuar(carrito)
    await continuar(carrito)
    ;[...carrito.querySelectorAll('.carrito-enlace')].find((b) => b.textContent.includes('Volver')).click()
    await esperar()
    expect(carrito.querySelector('input[name="entrega"]')).not.toBeNull()
  })
})

describe('Stock en la tienda', () => {
  it('la página de un producto agotado bloquea el botón de agregar', async () => {
    await montarEn('/producto/7')
    const boton = root.querySelector('.btn-agregar')
    expect(boton.disabled).toBe(true)
    expect(boton.textContent).toContain('Agotado')
  })

  it('la tarjeta de categoría muestra la insignia de agotado', async () => {
    await montarEn('/categoria/1')
    expect(root.querySelector('.badge-agotado-card')?.textContent).toContain('Agotado')
  })
})

describe('Sección de inicio (HeroSection)', () => {
  it('muestra un solo h1 y el buscador, sin botones ni la ubicación', async () => {
    await montarEn('/')
    const hero = root.querySelector('#inicio')
    expect(root.querySelectorAll('h1')).toHaveLength(1)
    expect(hero.querySelector('#hero-buscar')).not.toBeNull()
    expect(hero.querySelector('.btn')).toBeNull()
    expect(hero.textContent).not.toContain('Mariscal')
  })

  it('sugiere primero las categorías con más productos y omite las vacías', async () => {
    await montarEn('/')
    const chips = [...root.querySelectorAll('.hero__chip')]
    expect(chips.map((c) => c.textContent.trim())).toEqual(['Madera', 'Cerámica'])
    expect(chips[0].getAttribute('href')).toBe('/categoria/1')
    expect(root.querySelector('label[for="hero-buscar"]').textContent).toBe('Busca tu producto')
  })

  it('los indicadores cambian el fondo y la paleta de colores', async () => {
    await montarEn('/')
    const hero = root.querySelector('#inicio')
    const indicadores = hero.querySelectorAll('.hero__indicador')
    expect(indicadores.length).toBeGreaterThan(1)
    expect(indicadores[0].getAttribute('aria-current')).toBe('true')
    const acentoInicial = hero.style.getPropertyValue('--hero-acento')

    indicadores[1].click()
    await nextTick()
    expect(indicadores[1].getAttribute('aria-current')).toBe('true')
    expect(hero.querySelectorAll('.hero__slide')[1].classList).toContain('hero__slide--activa')
    expect(hero.style.getPropertyValue('--hero-acento')).not.toBe(acentoInicial)
  })

  it('el tema claro u oscuro cambia la paleta del inicio y de la navbar', async () => {
    const { HERO_FONDOS } = await import('./config/inicio')
    await montarEn('/')
    const hero = root.querySelector('#inicio')
    const header = root.querySelector('header.header')
    expect(hero.classList).toContain('hero--claro')
    expect(hero.style.getPropertyValue('--hero-texto')).toBe(HERO_FONDOS[0].claro.texto)

    header.querySelector('.theme-toggle').click()
    await nextTick()
    expect(hero.classList).toContain('hero--oscuro')
    expect(hero.style.getPropertyValue('--hero-texto')).toBe(HERO_FONDOS[0].oscuro.texto)
    expect(header.style.getPropertyValue('--nav-texto')).toBe(HERO_FONDOS[0].oscuro.texto)
    expect(hero.querySelector('.hero__slide').style.getPropertyValue('--slide-fondo')).toBe(HERO_FONDOS[0].oscuro.fondo)
    document.documentElement.setAttribute('data-theme', 'light')
  })

  it('buscador: muestra resultados y Enter abre el producto', async () => {
    await montarEn('/')
    const input = root.querySelector('#hero-buscar')
    input.dispatchEvent(new Event('focus'))
    input.value = 'más'
    input.dispatchEvent(new Event('input'))
    await new Promise((r) => setTimeout(r, 400))
    await esperar()
    const opciones = root.querySelectorAll('[role="option"]')
    expect(opciones).toHaveLength(1)
    expect(opciones[0].textContent).toContain('Máscara de prueba')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await nextTick()
    expect(input.getAttribute('aria-activedescendant')).toBe('hero-resultado-0')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await esperar()
    expect(router.currentRoute.value.path).toBe('/producto/7')
  })
})

describe('Destacados (vitrina)', () => {
  const seccion = () => root.querySelector('#destacados')

  it('no hay banner central y muestra la primera pieza en grande', async () => {
    await montarEn('/')
    expect(root.querySelector('.banner-central')).toBeNull()
    expect(seccion().querySelector('.vitrina__nombre').textContent).toBe('Máscara de prueba')
    expect(seccion().querySelectorAll('.vitrina__miniatura')).toHaveLength(2)
  })

  it('no muestra el precio (se ve en el carrito) y ofrece «Ver más»', async () => {
    await montarEn('/')
    expect(seccion().textContent).not.toContain('$')
    expect(seccion().querySelector('.boton--secundario').textContent).toContain('Ver más')
  })

  it('una pieza agotada muestra el aviso y no tiene botón de agregar', async () => {
    await montarEn('/')
    expect(seccion().querySelector('.etiqueta-agotado').textContent).toBe('Agotado')
    expect(seccion().querySelector('.boton--principal')).toBeNull()
    expect(seccion().querySelector('.boton--apagado').textContent).toBe('Agotado')
  })

  it('las miniaturas cambian la pieza y el botón la agrega al carrito', async () => {
    await montarEn('/')
    const miniaturas = seccion().querySelectorAll('.vitrina__miniatura')
    miniaturas[1].click()
    await esperar()
    expect(seccion().querySelector('.vitrina__nombre').textContent).toBe('Sol de madera')
    expect(miniaturas[1].getAttribute('aria-pressed')).toBe('true')

    seccion().querySelector('.boton--principal').click()
    await esperar()
    const guardado = JSON.parse(localStorage.getItem('ideancestral_carrito'))
    expect(guardado).toEqual([expect.objectContaining({ id: 8, cantidad: 1, stock: 3 })])
  })

  it('los textos se traducen', async () => {
    localStorage.setItem('ideancestral_lang', 'en')
    await montarEn('/')
    expect(seccion().querySelector('.etiqueta-agotado').textContent).toBe('Sold out')
    expect(seccion().querySelector('.vitrina__miniatura').getAttribute('aria-label')).toBe('Show Máscara de prueba')
    expect(seccion().textContent).toContain('See more')
  })
})

describe('Categorías (paneles)', () => {
  const seccion = () => root.querySelector('#categorias')
  const paneles = () => [...seccion().querySelectorAll('.panel')]

  it('oculta las vacías y ordena de más a menos piezas', async () => {
    await montarEn('/')
    const nombres = paneles().map((p) => p.querySelector('.panel__nombre').textContent)
    expect(nombres).toEqual(['Madera', 'Cerámica'])
    expect(paneles()[0].getAttribute('href')).toBe('/categoria/1')
  })

  it('muestra el número de piezas, «Ver colección» y destaca la principal', async () => {
    await montarEn('/')
    const [madera, ceramica] = paneles()
    expect(madera.querySelector('.panel__cuenta').textContent).toBe('10 piezas')
    expect(ceramica.querySelector('.panel__cuenta').textContent).toBe('3 piezas')
    expect(madera.querySelector('.panel__ver').textContent).toContain('Ver colección')
    expect(madera.querySelector('.panel__sello').textContent).toBe('Más variedad')
    expect(ceramica.querySelector('.panel__sello')).toBeNull()
  })

  it('abre la principal al llegar y el panel señalado al pasar el mouse', async () => {
    await montarEn('/')
    const [madera, ceramica] = paneles()
    expect(madera.classList).toContain('panel--abierto')
    ceramica.dispatchEvent(new Event('mouseenter'))
    await esperar()
    expect(ceramica.classList).toContain('panel--abierto')
    expect(madera.classList).not.toContain('panel--abierto')
    seccion().querySelector('.paneles').dispatchEvent(new Event('mouseleave'))
    await esperar()
    expect(madera.classList).toContain('panel--abierto')
  })

  it('los textos se traducen', async () => {
    localStorage.setItem('ideancestral_lang', 'en')
    await montarEn('/')
    const [madera] = paneles()
    expect(madera.querySelector('.panel__cuenta').textContent).toBe('10 pieces')
    expect(madera.querySelector('.panel__ver').textContent).toContain('View collection')
    expect(madera.querySelector('.panel__sello').textContent).toBe('Most variety')
  })
})

describe('Promociones (banda)', () => {
  const seccion = () => root.querySelector('#promociones')
  const pestanas = () => [...seccion().querySelectorAll('.pestana')]
  const nombres = () => pestanas().map((p) => p.querySelector('.pestana__nombre').textContent)
  const enMes = (mes) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, mes - 1, 15))
  }

  beforeEach(() => {
    globalThis.__promos = [
      { id: 1, nombre: 'Navidad', temporada: 'Diciembre', mes_inicio: 12, mes_fin: 12, categoria_id: 2, imagen_url: null, orden: 2 },
      { id: 2, nombre: 'Día de la Madre', temporada: 'Mayo', mes_inicio: 5, mes_fin: 5, categoria_id: null, imagen_url: null, orden: 1 },
      { id: 3, nombre: 'Difuntos', temporada: 'Noviembre', mes_inicio: 11, mes_fin: 11, categoria_id: 4, imagen_url: null, orden: 3 }
    ]
  })

  afterEach(() => {
    vi.useRealTimers()
    delete globalThis.__promos
  })

  it('sin promociones la sección no aparece', async () => {
    globalThis.__promos = []
    await montarEn('/')
    expect(seccion()).toBeNull()
  })

  it('en octubre ordena por cercanía y muestra la próxima temporada', async () => {
    enMes(10)
    await montarEn('/')
    expect(nombres()).toEqual(['Difuntos', 'Navidad', 'Día de la Madre'])
    expect(pestanas()[0].getAttribute('aria-pressed')).toBe('true')
    expect(seccion().querySelector('.banda__nombre').textContent).toBe('Difuntos')
    expect(seccion().querySelector('.estado').textContent.trim()).toBe('Próxima temporada')
    expect(seccion().querySelector('.banda__meses').textContent).toBe('Noviembre')
    expect(seccion().querySelector('.banda__portada').getAttribute('href')).toBe('/categoria/4')
  })

  it('en diciembre marca Navidad como temporada actual', async () => {
    enMes(12)
    await montarEn('/')
    expect(nombres()[0]).toBe('Navidad')
    expect(seccion().querySelector('.estado').textContent.trim()).toBe('Temporada actual')
  })

  it('una pestaña cambia la foto; sin categoría lleva a la sección Categorías', async () => {
    enMes(10)
    await montarEn('/')
    pestanas()[2].click()
    await esperar()
    expect(seccion().querySelector('.banda__nombre').textContent).toBe('Día de la Madre')
    expect(seccion().querySelector('.estado')).toBeNull()
    expect(seccion().querySelector('.banda__portada').getAttribute('href')).toBe('/#categorias')
  })

  it('los textos y meses se traducen', async () => {
    enMes(10)
    localStorage.setItem('ideancestral_lang', 'en')
    await montarEn('/')
    expect(seccion().querySelector('.estado').textContent.trim()).toBe('Next season')
    expect(seccion().querySelector('.banda__meses').textContent).toBe('November')
    expect(seccion().querySelector('.banda__ver').textContent).toContain('See pieces')
  })
})

describe('Nosotros', () => {
  const seccion = () => root.querySelector('#nosotros')
  // Hora de Quito (UTC−5)
  const aLas = (iso) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(`${iso}-05:00`))
  }

  afterEach(() => vi.useRealTimers())

  it('ya no muestra teléfonos ni correo', async () => {
    await montarEn('/')
    expect(seccion().querySelector('a[href^="tel:"]')).toBeNull()
    expect(seccion().querySelector('a[href^="mailto:"]')).toBeNull()
  })

  it('la tarjeta de ubicación gira al mapa y vuelve', async () => {
    await montarEn('/')
    const frente = seccion().querySelector('.frente')
    expect(frente.textContent).toContain('Mercado Artesanal La Mariscal')
    expect(seccion().querySelector('iframe')).toBeNull() // el mapa no carga hasta girar

    frente.click()
    await esperar()
    expect(seccion().querySelector('.giro').classList).toContain('giro--mapa')
    expect(frente.getAttribute('aria-expanded')).toBe('true')
    expect(seccion().querySelector('iframe').getAttribute('src')).toContain('maps.google.com')
    expect(seccion().querySelector('.dorso a').getAttribute('href')).toContain('google.com/maps/dir')

    seccion().querySelector('.dorso__boton').click()
    await esperar()
    expect(seccion().querySelector('.giro').classList).not.toContain('giro--mapa')
  })

  it('muestra el horario y si está abierto (hora de Quito)', async () => {
    aLas('2026-10-28T10:00') // miércoles
    await montarEn('/')
    const filas = [...seccion().querySelectorAll('.horario__fila')].map((f) => [
      f.querySelector('dt').textContent,
      f.querySelector('dd').textContent
    ])
    expect(filas).toEqual([['Lunes a viernes', '9:00 – 18:00'], ['Sábados y domingos', '10:00 – 17:00']])
    expect(seccion().querySelector('.horario__estado').textContent.trim()).toBe('Abierto ahora')
  })

  it('fuera de horario dice cerrado', async () => {
    aLas('2026-10-31T18:30') // sábado
    await montarEn('/')
    expect(seccion().querySelector('.horario__estado').textContent.trim()).toBe('Cerrado ahora')
  })

  it('destaca WhatsApp e Instagram', async () => {
    await montarEn('/')
    expect(seccion().querySelector('.red--whatsapp').getAttribute('href')).toMatch(/^https:\/\/wa\.me\/593987999136/)
    expect(seccion().querySelector('.red--instagram').getAttribute('href')).toBe('https://www.instagram.com/ideancestral/')
    expect(seccion().querySelector('.red--instagram').textContent).toContain('@ideancestral')
  })

  it('los textos se traducen', async () => {
    localStorage.setItem('ideancestral_lang', 'en')
    await montarEn('/')
    expect(seccion().querySelector('.frente__pista').textContent.trim()).toBe('Tap to see the map')
    expect(seccion().querySelector('.horario__titulo').textContent).toBe('Opening hours')
    expect(seccion().querySelector('.horario__fila dt').textContent).toBe('Monday to Friday')
  })
})

describe('Páginas de categoría, producto y 404 traducidas', () => {
  beforeEach(() => localStorage.setItem('ideancestral_lang', 'en'))

  it('categoría: contador, filtros y orden en inglés', async () => {
    await montarEn('/categoria/1')
    const texto = root.textContent
    expect(texto).toContain('1 product found')
    expect(texto).toContain('Price:')
    const opciones = [...root.querySelectorAll('.sort-select option')].map((o) => o.textContent)
    expect(opciones).toEqual(['Sort', 'Price: low to high', 'Price: high to low', 'Name: A-Z', 'Featured first'])
    expect(texto).not.toMatch(/encontrad|Ordenar|Ver detalle/)
  })

  it('producto: ficha, compartir y proceso en inglés', async () => {
    await montarEn('/producto/7')
    const texto = root.textContent
    expect(texto).toContain('Handmade')
    expect(texto).toContain('Share:')
    expect(texto).toContain('Handmade with tradition')
    expect(texto).not.toMatch(/Hecho a mano|Compartir:|Nuestro proceso|Pasa el cursor/)
  })

  it('404 en inglés', async () => {
    await montarEn('/no-existe')
    expect(root.textContent).toContain('Page not found')
    expect(root.textContent).toContain('Back to the catalog')
  })
})
