import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'

// Datos falsos del API
const productoAgotado = {
  id: 7, nombre: 'Máscara de prueba', precio: '25.00', stock: 0,
  categoria_id: 1, categoria_nombre: 'Madera', imagenes: []
}

vi.mock('axios', () => ({
  default: {
    get: vi.fn(async (url) => {
      if (url.includes('/productos/7')) return { data: productoAgotado }
      if (url.includes('/productos')) return { data: { productos: [productoAgotado], paginacion: {} } }
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
  const casos = [
    ['editorial', '.hero__collage'],
    ['inmersivo', '.hero__fondo'],
    ['ilustrado', '.hero__ilustracion'],
    ['minimal', '.hero__tira']
  ]

  it.each(casos)('variante %s: un solo h1, su visual propio y los dos botones', async (variante, visual) => {
    await montarEn(`/?hero=${variante}`)
    const hero = root.querySelector('#inicio')
    expect(hero.classList).toContain(`hero--${variante}`)
    expect(root.querySelectorAll('h1')).toHaveLength(1)
    expect(hero.querySelector(visual)).not.toBeNull()
    // Las otras variantes no dejan su visual en el DOM
    for (const [, otro] of casos.filter(([v]) => v !== variante)) {
      expect(hero.querySelector(otro)).toBeNull()
    }
    expect(hero.querySelector('.btn-primary').getAttribute('href')).toBe('/#categorias')
    expect(hero.querySelector('.btn-whatsapp').getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+/)
  })

  it('una variante desconocida usa la de por defecto', async () => {
    await montarEn('/?hero=no-existe')
    expect(root.querySelector('#inicio').classList).toContain('hero--editorial')
  })

  it('las imágenes con contenido tienen texto alternativo', async () => {
    for (const [variante] of casos) {
      await montarEn(`/?hero=${variante}`)
      root.querySelectorAll('#inicio img').forEach((img) => {
        const decorativa = img.closest('[aria-hidden="true"]')
        if (!decorativa) expect(img.getAttribute('alt')).toBeTruthy()
      })
      app.unmount()
      root.remove()
    }
  })
})
