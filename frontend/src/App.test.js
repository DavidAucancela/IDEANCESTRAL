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
