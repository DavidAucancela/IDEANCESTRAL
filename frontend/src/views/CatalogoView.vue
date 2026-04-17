<template>
  <div class="catalogo-view">
    <!-- Header -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <nav class="nav">
        <div class="nav-container">
          <router-link to="/" class="logo">
            <span 
              class="logo-icon"
              @mousedown.prevent="iniciarLongPress"
              @mouseup="cancelarLongPress"
              @mouseleave="cancelarLongPress"
              @touchstart.prevent="iniciarLongPress"
              @touchend="cancelarLongPress"
              @touchcancel="cancelarLongPress"
            >IA</span>
            <span class="logo-text">Ideancestral</span>
          </router-link>
          <ul class="nav-links" :class="{ open: menuOpen }">
            <li><a href="#inicio" @click.prevent="scrollTo('inicio')">{{ t('nav.inicio') }}</a></li>
            <li><a href="#categorias" @click.prevent="scrollTo('categorias')">{{ t('nav.categorias') }}</a></li>
            <li><a href="#promociones" @click.prevent="scrollTo('promociones')">{{ t('nav.promociones') }}</a></li>
            <li><a href="#nosotros" @click.prevent="scrollTo('nosotros')">{{ t('nav.nosotros') }}</a></li>
            <li class="nav-utilities">
              <ThemeToggle />
              <LanguageSwitcher />
            </li>
            <li>
              <button class="cart-toggle" @click="toggleCarrito" :title="t('cart.miCarrito')" :class="{ 'cart-bounce': cartBouncing }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                <span v-if="carritoCount > 0" class="cart-badge">{{ carritoCount }}</span>
              </button>
            </li>
          </ul>
          <button class="menu-toggle" @click="toggleMenu" :class="{ active: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section id="inicio" class="hero" ref="heroRef">
      <div class="hero-bg" :style="{ transform: `translateY(${parallaxOffset}px)` }">
        <img src="/imagenes/hero-cover.jpeg" alt="Ideancestral" />
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-text" data-animate>
          <span class="hero-badge">✦ {{ t('hero.bienvenido') }} ✦</span>
          <h1 class="hero-title">Ideancestral</h1>
          <p class="hero-description">{{ t('hero.descripcion') }}</p>
          <div class="hero-actions">
            <a href="#categorias" @click.prevent="scrollTo('categorias')" class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              {{ t('hero.explorar') }}
            </a>
            <a :href="whatsappGeneral" target="_blank" class="btn btn-whatsapp btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {{ t('hero.contactanos') }}
            </a>
          </div>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <span></span>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">15<sup>+</sup></span>
            <span class="stat-label">Años de tradición</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">18</span>
            <span class="stat-label">Tipos de artesanía</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100<sup>+</sup></span>
            <span class="stat-label">Piezas únicas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100<sup>%</sup></span>
            <span class="stat-label">Hecho a mano</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Productos Destacados -->
    <section class="destacados-section" v-if="loadingDestacados || productosDestacados.length > 0">
      <div class="container">
        <div class="section-header" data-animate>
          <span class="section-label">✦ Selección especial</span>
          <h2>Productos Destacados</h2>
          <p>Piezas únicas seleccionadas por su calidad artesanal</p>
        </div>
        <div v-if="loadingDestacados" class="destacados-grid">
          <div v-for="i in 5" :key="i" class="skeleton-card" :class="i === 1 ? 'skeleton-card-main' : ''">
            <div class="skeleton-img"></div>
            <div class="skeleton-info">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line xshort"></div>
            </div>
          </div>
        </div>
        <div v-else class="destacados-grid">
          <router-link
            v-for="(prod, i) in productosDestacados"
            :key="prod.id"
            :to="`/producto/${prod.id}`"
            class="destacado-card"
            :class="i === 0 ? 'destacado-card-main' : ''"
            @mousemove="(e) => onCardMouseMove(e, prod.id)"
            @mouseleave="onCardMouseLeave(prod.id)"
          >
            <span class="destacado-badge">✦ Destacado</span>
            <img class="destacado-img" :src="obtenerImagenDestacado(prod)" :alt="prod.nombre"
              :style="parallaxStyle(prod.id)" loading="lazy" @error="handleImageError" />
            <div class="destacado-info-overlay">
              <span class="destacado-cat">{{ prod.categoria_nombre || 'Artesanía' }}</span>
              <h3>{{ prod.nombre }}</h3>
              <div class="destacado-precio-row">
                <span class="destacado-precio">${{ Number(prod.precio).toFixed(2) }}</span>
                <span class="destacado-hover-btn">Ver producto →</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Banner Central - Carrusel -->
    <section class="banner-central">
      <div class="banner-carousel">
        <div class="banner-carousel-track" :style="{ transform: `translateX(-${bannerIndex * 100}%)` }">
          <div 
            v-for="(src, i) in bannerImagesSrc" 
            :key="i" 
            class="banner-carousel-slide"
            :style="{ backgroundImage: `url('${src}')` }"
          ></div>
        </div>
        <button class="banner-carousel-btn banner-carousel-prev" @click="bannerPrev" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="banner-carousel-btn banner-carousel-next" @click="bannerNext" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div class="banner-carousel-dots">
          <button 
            v-for="(_, i) in bannerImagesSrc" 
            :key="i" 
            class="banner-dot" 
            :class="{ active: bannerIndex === i }"
            @click="bannerIndex = i"
            :aria-label="`Ir a imagen ${i + 1}`"
          ></button>
        </div>
      </div>
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <p class="banner-pre">{{ t('banner.pre') }}</p>
        <h2 class="banner-title-main">{{ t('banner.titulo') }}</h2>
        <div class="banner-divider"></div>
        <p class="banner-subtitle">-Mary Cecy-</p>
        <p class="banner-tagline">{{ t('banner.tagline') }}</p>
      </div>
    </section>

    <!-- Navegacion de Categorias -->
    <section id="categorias" class="categorias-nav-section">
      <div class="container">
        <div class="section-header" data-animate>
          <span class="section-label">{{ t('categories.label') }}</span>
          <h2>{{ t('categories.title') }}</h2>
          <p>{{ t('categories.subtitle') }}</p>
        </div>
        <div class="categorias-nav-grid">
          <router-link
            v-for="(cat, index) in categoriasParaMostrar"
            :key="cat.id"
            :to="`/categoria/${cat.id}`"
            class="categoria-nav-card"
            :class="index === 0 ? 'categoria-nav-card-featured' : ''"
          >
            <img class="cat-nav-bg" :src="imagenCategoria(cat)" :alt="cat.nombre" loading="lazy" @error="handleImageError" />
            <div class="cat-nav-overlay">
              <h3>{{ cat.nombre }}</h3>
              <div class="cat-nav-reveal">
                <span class="cat-nav-btn">Ver colección →</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Promociones por Temporada -->
    <section id="promociones" class="promociones-section">
      <div class="container">
        <div class="section-header" data-animate>
          <span class="section-label">{{ t('promos.label') }}</span>
          <h2>{{ t('promos.title') }}</h2>
        </div>

        <div class="promos-grid-horizontal">
          <a 
            v-for="promo in promociones" 
            :key="promo.id"
            :href="whatsappPromo(promo.nombre)"
            target="_blank"
            class="promo-card-horizontal"
            :class="'promo-' + promo.tema"
          >
            <div class="promo-image">
              <img :src="promo.imagen" :alt="promo.nombre" loading="lazy" @error="handleImageError" />
              <span class="promo-badge">{{ promo.temporada }}</span>
            </div>
            <h3>{{ promo.nombre }}</h3>
          </a>
        </div>
      </div>
    </section>

    <!-- Nosotros / Ubicacion -->
    <section id="nosotros" class="nosotros-section">
      <div class="container">
        <div class="section-header" data-animate>
          <span class="section-label">{{ t('about.label') }}</span>
          <h2>{{ t('about.title') }}</h2>
          <p>{{ t('about.subtitle') }}</p>
        </div>
        <div class="nosotros-counters" ref="contadoresRef">
          <div class="nosotros-counter" v-for="(c, i) in contadores" :key="i">
            <span class="counter-num">{{ c.display }}<sup v-if="c.suffix">{{ c.suffix }}</sup></span>
            <span class="counter-label">{{ c.label }}</span>
          </div>
        </div>

        <div class="nosotros-grid">
          <div class="nosotros-info">
            <div class="info-cards">
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <strong>{{ t('about.ubicacion') }}</strong>
                  <p>Jorge Washington y Juan Leon Mera</p>
                  <p>"MERCADO ARTESANAL - LA MARISCAL"</p>
                  <p>Quito, Ecuador</p>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <strong>{{ t('about.telefono') }}</strong>
                  <p>(02) 2227781</p>
                  <p>+593 987 999 136</p>
                  <p>+593 978 752 422</p>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <strong>{{ t('about.email') }}</strong>
                  <p>mary_cecy_ma@hotmail.com</p>
                </div>
              </div>
            </div>
            <div class="nosotros-social">
              <a href="https://www.instagram.com/ideancestral/" target="_blank" class="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a :href="whatsappGeneral" target="_blank" class="social-btn social-whatsapp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
          <div class="nosotros-mapa">
            <iframe 
              src="https://maps.google.com/maps?q=Mercado+Artesanal+La+Mariscal,+Jorge+Washington+y+Juan+Leon+Mera,+Quito,+Ecuador&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style="border:0; border-radius: var(--radius-md);" 
              allowfullscreen="" 
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="t('about.ubicacion')"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-icon">IA</span>
              <span class="logo-text">Ideancestral</span>
            </div>
            <p>{{ t('footer.slogan') }}</p>
          </div>
          <div class="footer-links-grid">
            <div>
              <h4>{{ t('footer.navegacion') }}</h4>
              <ul>
                <li><a href="#inicio" @click.prevent="scrollTo('inicio')">{{ t('nav.inicio') }}</a></li>
                <li><a href="#categorias" @click.prevent="scrollTo('categorias')">{{ t('nav.categorias') }}</a></li>
                <li><a href="#promociones" @click.prevent="scrollTo('promociones')">{{ t('nav.promociones') }}</a></li>
                <li><a href="#nosotros" @click.prevent="scrollTo('nosotros')">{{ t('nav.nosotros') }}</a></li>
              </ul>
            </div>
            <div>
              <h4>{{ t('footer.contacto') }}</h4>
              <ul>
                <li>(02) 2227781</li>
                <li>+593 987 999 136</li>
                <li>+593 978 752 422</li>
                <li>mary_cecy_ma@hotmail.com</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>Idea Ancestral &copy; {{ new Date().getFullYear() }}. {{ t('footer.derechos') }}</p>
        </div>
      </div>
    </footer>

    <!-- Carrito Sidebar -->
    <div class="carrito-overlay" :class="{ visible: carritoAbierto }" @click="toggleCarrito"></div>
    <aside class="carrito-sidebar" :class="{ open: carritoAbierto }">
      <div class="carrito-header">
        <h3>{{ t('cart.miCarrito') }} <span v-if="carritoCount > 0" class="carrito-count">({{ carritoCount }})</span></h3>
        <button class="carrito-close" @click="toggleCarrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div v-if="carrito.length === 0" class="carrito-empty">
        <p>{{ t('cart.vacio') }}</p>
        <router-link to="/#categorias" @click="toggleCarrito" class="btn btn-primary">{{ t('cart.explorar') }}</router-link>
      </div>
      <div v-else class="carrito-body">
        <div class="carrito-items">
          <div v-for="item in carrito" :key="item.id" class="carrito-item">
            <img :src="item.imagen" :alt="item.nombre" class="carrito-item-img" @error="handleImageError" />
            <div class="carrito-item-info">
              <h4>{{ item.nombre }}</h4>
              <span class="carrito-item-precio">${{ item.precio.toFixed(2) }}</span>
              <div class="carrito-item-qty">
                <button @click="actualizarCantidad(item.id, item.cantidad - 1)">−</button>
                <span>{{ item.cantidad }}</span>
                <button @click="actualizarCantidad(item.id, item.cantidad + 1)">+</button>
              </div>
            </div>
            <button class="carrito-item-remove" @click="quitarDelCarrito(item.id)">×</button>
          </div>
        </div>
        <div class="carrito-footer">
          <div class="carrito-total">
            <span>{{ t('cart.total') }}</span>
            <strong>${{ carritoTotal.toFixed(2) }}</strong>
          </div>
          <button class="btn btn-whatsapp carrito-btn-pedido" @click="enviarPedidoWhatsApp">
            {{ t('cart.enviarWhatsApp') }}
          </button>
          <button class="btn btn-secondary carrito-btn-vaciar" @click="vaciarCarrito">{{ t('cart.vaciar') }}</button>
        </div>
      </div>
    </aside>

    <!-- WhatsApp floating button -->
    <a :href="whatsappGeneral" target="_blank" class="whatsapp-float" :title="t('whatsapp.escribenos')">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCarrito } from '../composables/useCarrito'
import { useLanguageStore } from '../stores/language'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import ThemeToggle from '../components/ThemeToggle.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const WHATSAPP_NUMBER = '593987999136'

export default {
  name: 'CatalogoView',
  components: { ThemeToggle, LanguageSwitcher },
  setup() {
    const router = useRouter()
    const { carrito, carritoAbierto, carritoCount, carritoTotal, toggleCarrito, actualizarCantidad, quitarDelCarrito, vaciarCarrito, enviarPedidoWhatsApp } = useCarrito()
    const { t } = useLanguageStore()
    const menuOpen = ref(false)
    const isScrolled = ref(false)
    const heroRef = ref(null)
    const parallaxOffset = ref(0)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const productosDestacados = ref([])
    const loadingDestacados = ref(true)
    const whatsappGeneral = computed(() => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.saludoGeneral'))}`)

    // Categorias desde API (para cards de navegacion)
    const categoriasParaMostrar = ref([])
    const categoriasPorNombreImagen = {
      'Madera': '/imagenes/sol madera.jpg',
      'Cerámica': '/imagenes/vasos.jpg',
      'Ceramica': '/imagenes/vasos.jpg',
      'Mascaras': '/imagenes/diablo PRINCIPAL.jpg',
      'Nacimientos': '/imagenes/nac1.jpg',
      'Otros': '/imagenes/pulseras_varias.jpg',
      'Tejidos': '/imagenes/logo-principal.jpg'
    }
    const imagenCategoria = (cat) => {
      if (cat.imagen_url) {
        return cat.imagen_url.startsWith('http') ? cat.imagen_url : `${API_URL.replace('/api', '')}${cat.imagen_url}`
      }
      return categoriasPorNombreImagen[cat.nombre] || '/imagenes/logo-principal.jpg'
    }

    // Cargar categorias desde API
    const cargarCategorias = async () => {
      try {
        const res = await axios.get(`${API_URL}/categorias`)
        categoriasParaMostrar.value = res.data || []
      } catch {
        categoriasParaMostrar.value = []
      }
    }

    // Promociones desde API (con fallback local)
    const promociones = ref([])
    const promocionesFallback = [
      { id: 'navidad', nombre: 'Navidad y Fin de Año', temporada: 'Diciembre', tema: 'navidad', imagen: '/imagenes/promo1.jpg' },
      { id: 'madre', nombre: 'Día de la Madre', temporada: 'Mayo', tema: 'madre', imagen: '/imagenes/promo2.jpg' },
      { id: 'cultural', nombre: 'Fiestas de Quito', temporada: 'Diciembre', tema: 'cultural', imagen: '/imagenes/promo3.jpg' },
      { id: 'inti', nombre: 'Inti Raymi - Fiesta del Sol', temporada: 'Junio', tema: 'inti', imagen: '/imagenes/promo4.jpg' }
    ]
    const cargarPromociones = async () => {
      try {
        const res = await axios.get(`${API_URL}/promociones`)
        promociones.value = (res.data || []).map(p => ({
          id: p.id,
          nombre: p.nombre,
          temporada: p.temporada,
          tema: p.tema || 'general',
          imagen: p.imagen_url ? (p.imagen_url.startsWith('http') ? p.imagen_url : `${API_URL.replace('/api', '')}${p.imagen_url}`) : '/imagenes/logo-principal.jpg'
        }))
        if (promociones.value.length === 0) promociones.value = promocionesFallback
      } catch {
        promociones.value = promocionesFallback
      }
    }

    // Banner carrusel
    const bannerImagesSrc = [
      '/imagenes/masc1.jpg', '/imagenes/nac2.jpg',
      '/imagenes/vasos.jpg', '/imagenes/caballo.jpg'
    ]
    const bannerIndex = ref(0)
    let bannerInterval = null

    const bannerNext = () => {
      bannerIndex.value = (bannerIndex.value + 1) % bannerImagesSrc.length
      resetBannerAutoAdvance()
    }
    const bannerPrev = () => {
      bannerIndex.value = (bannerIndex.value - 1 + bannerImagesSrc.length) % bannerImagesSrc.length
      resetBannerAutoAdvance()
    }
    const resetBannerAutoAdvance = () => {
      if (bannerInterval) clearInterval(bannerInterval)
      bannerInterval = setInterval(bannerNext, 5000)
    }

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
      parallaxOffset.value = window.scrollY * 0.4
    }

    const handleImageError = (event) => {
      event.target.src = '/imagenes/logo-principal.jpg'
    }

    const scrollTo = (elementId) => {
      const element = document.getElementById(elementId)
      if (element) {
        const offset = 80
        const y = element.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
      menuOpen.value = false
    }

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    // WhatsApp helpers
    const whatsappProducto = (nombre) => {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.saludoProducto', { nombre }))}`
    }

    const whatsappPromo = (nombre) => {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.saludoPromo', { nombre }))}`
    }

    // Long press para acceso admin
    let longPressTimer = null

    const iniciarLongPress = () => {
      longPressTimer = setTimeout(() => {
        router.push('/admin')
      }, 5000)
    }

    const cancelarLongPress = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
    }

    const cargarDestacados = async () => {
      try {
        loadingDestacados.value = true
        const res = await axios.get(`${API_URL}/productos`, { params: { destacado: true, limit: 5 } })
        const data = res.data
        productosDestacados.value = (data.productos || data || []).slice(0, 5)
      } catch (e) {
        console.error('Error cargando destacados:', e)
      } finally {
        loadingDestacados.value = false
      }
    }

    const obtenerImagenDestacado = (prod) => {
      if (prod.imagenes && prod.imagenes.length > 0) {
        const principal = prod.imagenes.find(img => img.es_principal) || prod.imagenes[0]
        return principal.url?.startsWith('http') ? principal.url : `${API_URL.replace('/api', '')}${principal.url}`
      }
      return '/imagenes/logo-principal.jpg'
    }

    // Parallax en cards destacados
    const cardParallax = ref({})
    const onCardMouseMove = (e, id) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18
      cardParallax.value = { ...cardParallax.value, [id]: { x, y } }
    }
    const onCardMouseLeave = (id) => {
      cardParallax.value = { ...cardParallax.value, [id]: { x: 0, y: 0 } }
    }
    const parallaxStyle = (id) => {
      const p = cardParallax.value[id]
      if (!p) return { transition: 'transform 0.5s ease' }
      const isResting = p.x === 0 && p.y === 0
      return {
        transform: `translate(${p.x}px, ${p.y}px) scale(1.12)`,
        transition: isResting ? 'transform 0.5s ease' : 'transform 0.08s linear'
      }
    }

    const cartBouncing = ref(false)
    const handleCartAdded = () => {
      cartBouncing.value = true
      setTimeout(() => { cartBouncing.value = false }, 600)
    }

    // Contadores animados en la sección Nosotros
    const contadoresRef = ref(null)
    const contadores = ref([
      { target: 15, display: '0', suffix: '+', label: 'Años de tradición' },
      { target: 18, display: '0', suffix: '', label: 'Tipos de artesanía' },
      { target: 100, display: '0', suffix: '+', label: 'Piezas únicas' },
      { target: 1000, display: '0', suffix: '+', label: 'Clientes satisfechos' },
    ])
    let contadoresAnimados = false
    const animarContadores = () => {
      if (contadoresAnimados) return
      contadoresAnimados = true
      contadores.value.forEach((c) => {
        const duration = 1800
        const start = performance.now()
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          c.display = Math.round(eased * c.target).toLocaleString()
          if (progress < 1) requestAnimationFrame(update)
          else c.display = c.target.toLocaleString()
        }
        requestAnimationFrame(update)
      })
    }

    useScrollAnimation()

    onMounted(() => {
      resetBannerAutoAdvance()
      cargarCategorias()
      cargarPromociones()
      cargarDestacados()
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('cart-item-added', handleCartAdded)
      const observer = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) animarContadores() },
        { threshold: 0.3 }
      )
      if (contadoresRef.value) observer.observe(contadoresRef.value)
    })

    onUnmounted(() => {
      if (bannerInterval) clearInterval(bannerInterval)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('cart-item-added', handleCartAdded)
      cancelarLongPress()
    })

    return {
      t,
      menuOpen,
      isScrolled,
      heroRef,
      parallaxOffset,
      whatsappGeneral,
      categoriasParaMostrar,
      imagenCategoria,
      promociones,
      bannerImagesSrc,
      bannerIndex,
      bannerPrev,
      bannerNext,
      handleImageError,
      scrollTo,
      toggleMenu,
      whatsappProducto,
      whatsappPromo,
      iniciarLongPress,
      cancelarLongPress,
      carrito,
      carritoAbierto,
      carritoCount,
      carritoTotal,
      toggleCarrito,
      actualizarCantidad,
      quitarDelCarrito,
      vaciarCarrito,
      enviarPedidoWhatsApp,
      productosDestacados,
      loadingDestacados,
      obtenerImagenDestacado,
      onCardMouseMove,
      onCardMouseLeave,
      parallaxStyle,
      contadoresRef,
      contadores,
      cartBouncing
    }
  }
}
</script>

<style scoped>
/* ===== BASE ===== */
.catalogo-view {
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== HEADER ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: var(--transition);
}

.header.scrolled {
  background: var(--color-header-bg-scrolled);
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.8rem 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 6px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 12px;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
  align-items: center;
}

.nav-links a {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--color-primary);
  background: var(--color-bg-warm);
}

.nav-utilities {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 4px;
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  transition: var(--transition);
  border-radius: 2px;
}

.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.menu-toggle.active span:nth-child(2) { opacity: 0; }
.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-dark);
}
.hero-bg {
  position: absolute;
  inset: -10%;
  will-change: transform;
}
.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 0.55;
  filter: saturate(0.85);
  image-rendering: auto;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(44, 34, 24, 0.75) 0%,
    rgba(123, 63, 0, 0.5) 50%,
    rgba(44, 34, 24, 0.8) 100%
  );
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
  max-width: 800px;
}
.hero-badge {
  display: inline-block;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  font-family: var(--font-sans);
}
.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 30px rgba(0,0,0,0.4);
  letter-spacing: -0.02em;
}
.hero-description {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255,255,255,0.85);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.hero-scroll-indicator span {
  display: block;
  width: 1.5px;
  height: 50px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
  margin: 0 auto;
  animation: scrollLine 1.8s ease-in-out infinite;
}
@keyframes scrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

.btn-sm {
  padding: 10px 20px;
  font-size: 14px;
}

/* ===== BANNER CARRUSEL ===== */
.banner-central {
  position: relative;
  padding: 6rem 24px;
  text-align: center;
  overflow: hidden;
}

.banner-carousel {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.banner-carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.4) saturate(0.9);
}

.banner-carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(90, 40, 0, 0.6);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: background 0.3s, color 0.3s, transform 0.2s;
}
.banner-carousel-btn:hover {
  background: rgba(139, 69, 19, 0.85);
  color: #fff;
  transform: translateY(-50%) scale(1.08);
}
.banner-carousel-prev { left: 16px; }
.banner-carousel-next { right: 16px; }

.banner-carousel-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}
.banner-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}
.banner-dot:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.7);
}
.banner-dot.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  transform: scale(1.2);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(135deg, rgba(90, 40, 0, 0.85) 0%, rgba(139, 69, 19, 0.8) 50%, rgba(90, 40, 0, 0.85) 100%);
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
}

.banner-pre {
  font-size: 0.85rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.banner-title-main {
  font-family: var(--font-serif);
  font-size: 4.5rem;
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: 6px;
  margin-bottom: 1rem;
}

.banner-divider {
  width: 60px;
  height: 2px;
  background: var(--color-accent);
  margin: 1.5rem auto;
}

.banner-subtitle {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-accent-light);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.banner-tagline {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 1rem;
}

/* ===== SECTION HEADER (reutilizable) ===== */
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  margin: 1.5rem auto 0;
  padding: 0.6rem 1rem;
  background: var(--color-surface);
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  transition: var(--transition);
}
.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(123, 63, 0, 0.1);
}
.search-bar svg {
  flex-shrink: 0;
  color: var(--color-text-muted);
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;
  color: var(--color-text);
}
.search-input::placeholder {
  color: var(--color-text-muted);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-label {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-secondary);
  margin-bottom: 0.75rem;
}

.section-header h2 {
  font-size: 2.2rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.section-header p {
  color: var(--color-text-muted);
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ===== CATEGORIAS NAV ===== */
.categorias-nav-section {
  padding: 5rem 0 3rem;
}

.categorias-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.categoria-nav-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  display: block;
  background: var(--color-dark);
  box-shadow: var(--shadow-sm);
  height: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.categoria-nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 45px rgba(0,0,0,0.28);
}

.categoria-nav-card-featured {
  grid-column: span 2;
  height: 320px;
}

.cat-nav-bg {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s ease;
}

.categoria-nav-card:hover .cat-nav-bg { transform: scale(1.08); }

.cat-nav-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(transparent 30%, rgba(15,8,3,0.88) 100%);
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 1.2rem 1.2rem 1rem;
  transition: background 0.35s ease;
}

.categoria-nav-card:hover .cat-nav-overlay {
  background: linear-gradient(transparent 0%, rgba(15,8,3,0.93) 100%);
}

.cat-nav-overlay h3 {
  font-size: 1rem; font-weight: 700; color: #fff;
  margin: 0 0 0.35rem;
  text-shadow: 0 1px 6px rgba(0,0,0,0.5);
  transition: transform 0.3s ease;
}

.categoria-nav-card-featured .cat-nav-overlay h3 { font-size: 1.35rem; }

.categoria-nav-card:hover .cat-nav-overlay h3 { transform: translateY(-2px); }

.cat-nav-reveal {
  overflow: hidden; max-height: 0; opacity: 0;
  transition: max-height 0.35s ease, opacity 0.3s ease;
}

.categoria-nav-card:hover .cat-nav-reveal { max-height: 60px; opacity: 1; }

.cat-nav-btn {
  display: inline-block;
  background: rgba(255,255,255,0.13); backdrop-filter: blur(8px);
  color: #fff; font-size: 0.78rem; font-weight: 600;
  padding: 0.32rem 0.85rem; border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.25);
}

/* ===== CATEGORIA SECTION ===== */
.categoria-section {
  padding: 5rem 0;
}

.categoria-section.bg-alt {
  background: var(--color-bg-warm);
}

.categoria-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3rem;
}

.categoria-header-text {
  max-width: 600px;
}

.categoria-header-text .section-label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
}

.categoria-header-text h2 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.categoria-header-text p {
  color: var(--color-text-light);
  font-size: 1rem;
  line-height: 1.8;
}

.categoria-header-deco {
  flex-shrink: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, var(--color-accent), transparent);
  margin-top: 1.5rem;
}

/* ===== PRODUCTOS GRID ===== */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.producto-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.producto-image {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-color: var(--color-gray-light);
}

.producto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.producto-card:hover .producto-image img {
  transform: scale(1.05);
}

.producto-info {
  padding: 1.5rem;
}

.producto-nombre-link {
  text-decoration: none;
  color: inherit;
}
.producto-nombre-link:hover .producto-nombre {
  color: var(--color-primary);
}
.producto-image a {
  display: block;
  height: 100%;
}
.producto-nombre {
  font-size: 1.1rem;
  color: var(--color-text);
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.producto-material {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.producto-precio {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 0.5rem;
}

/* ===== CATEGORIA ACTIONS ===== */
.categoria-actions {
  text-align: center;
  margin-top: 2.5rem;
}

.btn-ver-todos {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.85rem 2rem;
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 100px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: var(--transition);
}

.btn-ver-todos:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* ===== PROMOCIONES ===== */
.promociones-section {
  padding: 5rem 0;
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-warm) 100%);
}

.promos-grid-horizontal {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.promo-card-horizontal {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
  display: block;
}

.promo-card-horizontal:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.promo-card-horizontal .promo-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.promo-card-horizontal .promo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.promo-card-horizontal:hover .promo-image img {
  transform: scale(1.05);
}

.promo-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.35rem 0.85rem;
  background: var(--color-secondary);
  color: var(--color-white);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.promo-navidad .promo-badge { background: #C0392B; }
.promo-madre .promo-badge { background: #E91E63; }
.promo-cultural .promo-badge { background: #7B3F00; }
.promo-inti .promo-badge { background: #E67E22; }

.promo-card-horizontal h3 {
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.4;
}

/* ===== NOSOTROS ===== */
.nosotros-section {
  padding: 5rem 0;
  background: var(--color-surface);
}

.nosotros-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.info-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.info-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 8px;
}
.info-icon svg { width: 16px; height: 16px; }

.info-card strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}

.info-card p {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.5;
}

.nosotros-social {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  background: var(--color-bg);
  color: var(--color-text);
  transition: var(--transition);
}

.social-btn:hover {
  background: var(--color-gray-light);
  transform: translateY(-2px);
}

.social-whatsapp {
  background: #E8FAF0;
  color: #25D366;
}

.social-whatsapp:hover {
  background: #D1F5E0;
}

.nosotros-mapa {
  width: 100%;
  height: 450px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.nosotros-mapa iframe {
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== FOOTER ===== */
.footer {
  background-color: var(--color-dark);
  color: rgba(255,255,255,0.7);
  padding: 4rem 0 0;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  padding-bottom: 3rem;
}

.footer-brand .logo-icon {
  background: var(--color-accent);
}

.footer-brand .logo-text {
  color: #FFFFFF;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-brand > p {
  margin-top: 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.footer-links-grid h4 {
  color: #FFFFFF;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.footer-links-grid ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links-grid li {
  font-size: 0.9rem;
}

.footer-links-grid a {
  transition: var(--transition);
}

.footer-links-grid a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.85rem;
}

/* ===== WHATSAPP FLOATING ===== */
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.5);
  z-index: 999;
  transition: var(--transition);
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
}

/* ===== LOADING / EMPTY ===== */
.loading-state {
  text-align: center;
  padding: 5rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .banner-title-main { font-size: 3.5rem; }
  .categorias-nav-grid { grid-template-columns: repeat(3, 1fr); }
  .productos-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: var(--color-surface);
    flex-direction: column;
    padding: 5rem 2rem 2rem;
    box-shadow: var(--shadow-xl);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    gap: 0.25rem;
  }

  .nav-links.open { transform: translateX(0); }
  .menu-toggle { display: flex; }

  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions .btn { width: 100%; max-width: 320px; }

  .banner-title-main { font-size: 2.5rem; letter-spacing: 3px; }
  .banner-subtitle { font-size: 1.2rem; }
  .banner-central { padding: 4rem 20px; }
  .banner-carousel-btn { width: 36px; height: 36px; }
  .banner-carousel-prev { left: 8px; }
  .banner-carousel-next { right: 8px; }
  .banner-carousel-dots { bottom: 16px; }

  .categorias-nav-grid { grid-template-columns: repeat(2, 1fr); }
  .categoria-nav-card-featured { grid-column: span 2; height: 260px; }
  .categoria-nav-card { height: 200px; }

  .categoria-header { flex-direction: column; }
  .categoria-header-deco { display: none; }

  .productos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .producto-image { height: 220px; }

  .promos-grid-horizontal { grid-template-columns: repeat(2, 1fr); }

  .nosotros-grid { grid-template-columns: 1fr; }
  .nosotros-mapa { height: 300px; }

  .section-header h2 { font-size: 1.8rem; }
  .categoria-section { padding: 3.5rem 0; }
  .categorias-nav-section { padding: 3.5rem 0 2rem; }
  .promociones-section { padding: 3.5rem 0; }

  .footer-top { grid-template-columns: 1fr; gap: 2rem; }
}

@media (max-width: 480px) {
  .banner-title-main { font-size: 2rem; }
  .banner-carousel-btn { width: 32px; height: 32px; }
  .banner-carousel-prev { left: 4px; }
  .banner-carousel-next { right: 4px; }
  .banner-dot { width: 8px; height: 8px; }

  .categorias-nav-grid { grid-template-columns: 1fr; }
  .categoria-nav-card-featured { grid-column: span 1; height: 240px; }
  .categoria-nav-card { height: 180px; }

  .productos-grid { grid-template-columns: 1fr; }
  .producto-image { height: 260px; }

  .promos-grid-horizontal { grid-template-columns: 1fr; }
  .promo-card-horizontal .promo-image { height: 200px; }

  .nosotros-social { flex-direction: column; }
  .footer-links-grid { grid-template-columns: 1fr; }
  .nosotros-mapa { height: 250px; }
}

/* Carrito */
.cart-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: 1.5px solid var(--color-gray-light);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text);
  transition: var(--transition);
}
.cart-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-bg-warm);
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: var(--color-secondary);
  color: var(--color-white);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carrito-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.carrito-overlay.visible { opacity: 1; visibility: visible; }

.carrito-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  background: var(--color-surface);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 30px rgba(0,0,0,0.15);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.carrito-sidebar.open { transform: translateX(0); }

.carrito-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}
.carrito-header h3 { font-size: 1.1rem; color: var(--color-text); margin: 0; }
.carrito-count { font-weight: 400; color: var(--color-text-muted); font-size: 0.9rem; }
.carrito-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: var(--transition);
}
.carrito-close:hover { background: var(--color-bg); color: var(--color-text); }

.carrito-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--color-text-muted);
}
.carrito-empty p { font-size: 1.05rem; font-weight: 600; color: var(--color-text-light); margin: 0; }

.carrito-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.carrito-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }

.carrito-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-light);
}
.carrito-item:last-child { border-bottom: none; }
.carrito-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.carrito-item-info { flex: 1; min-width: 0; }
.carrito-item-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.carrito-item-precio { font-size: 0.85rem; color: var(--color-primary); font-weight: 600; }
.carrito-item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
.carrito-item-qty button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-surface);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text);
  transition: var(--transition);
}
.carrito-item-qty button:hover { border-color: var(--color-primary); color: var(--color-primary); }
.carrito-item-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
  transition: var(--transition);
  font-size: 1.2rem;
}
.carrito-item-remove:hover { background: #FEE; color: #C0392B; }

.carrito-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-gray-light);
  background: var(--color-bg);
}
.carrito-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.carrito-total span { color: var(--color-text-light); }
.carrito-total strong { font-size: 1.4rem; color: var(--color-primary); }
.carrito-btn-pedido {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.85rem;
  font-size: 0.95rem;
}
.carrito-btn-vaciar { width: 100%; margin-top: 0.5rem; padding: 0.6rem; font-size: 0.85rem; }

@media (max-width: 768px) {
  .carrito-sidebar { width: 100%; max-width: 100vw; }
}

/* ===== DESTACADOS ===== */
.destacados-section { padding: 5rem 0; background: var(--color-bg-warm); }
.destacados-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  grid-template-rows: 270px 270px;
  gap: 1rem;
}
.destacado-card-main {
  grid-column: 1;
  grid-row: 1 / 3;
}
.destacado-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  display: block;
  background: var(--color-dark);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.destacado-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.destacado-badge {
  position: absolute; top: 12px; left: 12px; z-index: 10;
  background: var(--color-secondary); color: #fff;
  font-size: 0.67rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 0.22rem 0.6rem; border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}
.destacado-img {
  position: absolute;
  inset: -8%;
  width: 116%; height: 116%;
  object-fit: cover;
  will-change: transform;
}
.destacado-info-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 5;
  background: linear-gradient(transparent 0%, rgba(15,8,3,0.85) 50%, rgba(15,8,3,0.97) 100%);
  padding: 2.5rem 1.2rem 1.2rem;
}
.destacado-cat {
  display: block; font-size: 0.67rem; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--color-secondary); font-weight: 700;
  margin-bottom: 0.3rem;
}
.destacado-info-overlay h3 {
  font-size: 0.95rem; font-weight: 600; color: #fff;
  margin: 0 0 0.5rem; line-height: 1.3;
}
.destacado-card-main .destacado-info-overlay h3 { font-size: 1.25rem; }
.destacado-precio-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.destacado-precio { font-size: 1rem; font-weight: 700; color: var(--color-secondary); }
.destacado-card-main .destacado-precio { font-size: 1.15rem; }
.destacado-hover-btn {
  display: inline-block;
  background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
  color: #fff; font-size: 0.75rem; font-weight: 600;
  padding: 0.28rem 0.75rem; border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.22);
  transform: translateY(6px); opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.destacado-card:hover .destacado-hover-btn { transform: translateY(0); opacity: 1; }

@media (max-width: 900px) {
  .destacados-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 280px auto;
  }
  .destacado-card-main { grid-column: span 2; grid-row: auto; min-height: 300px; }
  .destacado-card:not(.destacado-card-main) { min-height: 220px; }
}
@media (max-width: 480px) {
  .destacados-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .destacado-card-main { grid-column: span 1; min-height: 260px; }
  .destacado-card { min-height: 220px; }
}

/* ===== CART BOUNCE ===== */
@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.15); }
}
.cart-bounce { animation: cartBounce 0.5s ease; }

/* ===== STATS BAR ===== */
.stats-bar {
  background: var(--color-dark);
  padding: 2.5rem 0;
  border-bottom: 1px solid rgba(212, 167, 106, 0.15);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1rem;
  border-right: 1px solid rgba(255,255,255,0.08);
}
.stat-item:last-child { border-right: none; }

.stat-number {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}
.stat-number sup {
  font-size: 1.2rem;
  vertical-align: super;
  color: var(--color-secondary);
}

.stat-label {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; }
}

/* ===== SKELETON LOADERS ===== */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}
.skeleton-card-main {
  grid-column: span 2;
}

.skeleton-img {
  height: 220px;
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg-warm) 50%, var(--color-gray-light) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skeleton-card-main .skeleton-img { height: 320px; }

.skeleton-info {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--color-gray-light) 25%, var(--color-bg-warm) 50%, var(--color-gray-light) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skeleton-line.short { width: 45%; }
.skeleton-line.xshort { width: 30%; }

/* ===== NOSOTROS COUNTERS ===== */
.nosotros-counters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3.5rem;
  padding: 2rem;
  background: var(--color-bg-warm);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
}

.nosotros-counter {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem;
}

.counter-num {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}
.counter-num sup {
  font-size: 1.1rem;
  vertical-align: super;
  color: var(--color-secondary);
}

.counter-label {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .nosotros-counters { grid-template-columns: repeat(2, 1fr); padding: 1.5rem; }
}
@media (max-width: 480px) {
  .nosotros-counters { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .counter-num { font-size: 2rem; }
}
</style>
