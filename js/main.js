/**
 * KINETIX — main.js
 * Arquitectura modular, Vanilla JS, sin dependencias externas.
 * Accesible (WCAG 2.1 AA / EAA): teclado, ARIA, reduced-motion.
 */

'use strict';

/* ============================================================
   1. MOBILE NAVIGATION
   ============================================================ */
const MobileNav = (() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  function open() {
    nav.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
  }

  function close() {
    nav.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
  }

  function toggle_() {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  }

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });

  toggle.addEventListener('click', toggle_);

  // Close on viewport resize to desktop
  const mql = window.matchMedia('(min-width: 768px)');
  mql.addEventListener('change', e => { if (e.matches) close(); });
})();


/* ============================================================
   2. STICKY HEADER — shadow / background intensity on scroll
   ============================================================ */
const StickyHeader = (() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    if (y > 10) {
      header.style.boxShadow = '0 4px 32px rgba(0,0,0,0.6)';
    } else {
      header.style.boxShadow = '';
    }
    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   3. PRODUCT FILTER TABS
   ============================================================ */
const ProductFilter = (() => {
  const tabs  = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.product-card');

  if (!tabs.length || !cards.length) return;

  function filterCards(category) {
    cards.forEach(card => {
      const match = category === 'todos' || card.dataset.category === category;
      if (match) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
    });
  }

  function activateTab(tab) {
    // Update ARIA on all tabs
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('active');
    });
    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('active');

    // Filter
    filterCards(tab.dataset.filter);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));

    // Keyboard: arrow navigation between tabs (ARIA tabs pattern)
    tab.addEventListener('keydown', e => {
      const tabList = [...tabs];
      const idx = tabList.indexOf(tab);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabList[(idx + 1) % tabList.length];
        next.focus();
        activateTab(next);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabList[(idx - 1 + tabList.length) % tabList.length];
        prev.focus();
        activateTab(prev);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        tabList[0].focus();
        activateTab(tabList[0]);
      }
      if (e.key === 'End') {
        e.preventDefault();
        tabList[tabList.length - 1].focus();
        activateTab(tabList[tabList.length - 1]);
      }
    });
  });
})();


/* ============================================================
   4. INTERSECTION OBSERVER — staggered card reveals
      Respects prefers-reduced-motion
   ============================================================ */
const CardReveal = (() => {
  // Skip if user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        // stagger delay based on visible position
        const idx = [...cards].indexOf(card);
        card.style.animationDelay = `${(idx % 3) * 0.08}s`;
        card.classList.add('animate-in');
        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => observer.observe(card));
})();


/* ============================================================
   5. AUDIO DESCRIPTION — page narration for blind users
   ============================================================ */
const AudioDescription = (() => {
  const playBtn = document.querySelector('.audio-desc-play');
  const pauseBtn = document.querySelector('.audio-desc-pause');
  const stopBtn = document.querySelector('.audio-desc-stop');
  const status = document.querySelector('.audio-desc-status');

  if (!playBtn || !pauseBtn || !stopBtn || !status) return;

  const supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let currentUtterance = null;

  const description = [
    'Kinetix, colección primavera 2025.',
    'Página principal de una tienda deportiva con un héroe que presenta el mensaje corre más rápido y un botón para ver la colección.',
    'La sección colección ofrece filtros por categoría y seis productos destacados: Air Runner Pro, Ultraboost 23, Balance 680, Velocity Ultra 2, H200 Phantom y Gel-Repono 30.',
    'Cada producto muestra nombre, categoría, precio y un botón comprar.',
    'La página también incluye una sección de accesibilidad con navegación por teclado, un carrito lateral accesible y un resumen textual para apoyo visual y auditivo.',
    'Usa el botón de carrito para revisar productos y el botón detener para salir de la narración.'
  ].join(' ');

  function setStatus(message) {
    status.textContent = message;
  }

  function stopSpeech() {
    if (supportsSpeech) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  function speakDescription() {
    if (!supportsSpeech) {
      setStatus('La narración por voz no está disponible en este navegador.');
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(description);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setStatus('Narración en reproducción.');
    utterance.onpause = () => setStatus('Narración en pausa.');
    utterance.onresume = () => setStatus('Narración reanudada.');
    utterance.onend = () => {
      currentUtterance = null;
      setStatus('Narración finalizada.');
    };
    utterance.onerror = () => {
      currentUtterance = null;
      setStatus('No se pudo reproducir la narración.');
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  playBtn.addEventListener('click', () => {
    if (!supportsSpeech) {
      setStatus('La narración por voz no está disponible en este navegador.');
      return;
    }

    if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      setStatus('La narración ya se está reproduciendo.');
      return;
    }

    speakDescription();
  });

  pauseBtn.addEventListener('click', () => {
    if (!supportsSpeech || !window.speechSynthesis.speaking) {
      setStatus('No hay narración activa para pausar.');
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }

    window.speechSynthesis.pause();
  });

  stopBtn.addEventListener('click', () => {
    stopSpeech();
    setStatus('Narración detenida.');
  });

  window.addEventListener('beforeunload', stopSpeech);

  if (!supportsSpeech) {
    playBtn.disabled = true;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    setStatus('La narración por voz no está disponible en este navegador.');
  }
})();


/* ============================================================
   5. CART DRAWER — shopping bag interaction
   ============================================================ */
const CartDrawer = (() => {
  const cartBtn = document.querySelector('.cart-btn');
  const cartCount = document.querySelector('.cart-count');
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.cart-overlay');
  const closeBtn = document.querySelector('.cart-drawer__close');
  const itemsWrap = document.querySelector('.cart-drawer__items');
  const drawerCount = document.querySelector('.cart-drawer-count');
  const totalEl = document.querySelector('.cart-drawer-total');
  const checkoutBtn = document.querySelector('.cart-drawer__checkout');
  const buyBtns = document.querySelectorAll('.btn-buy');

  if (!cartBtn || !drawer || !overlay || !closeBtn || !itemsWrap) return;

  const catalog = {
    'Air Runner Pro': {
      name: 'Air Runner Pro',
      tag: 'Stride',
      price: 189,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&auto=format&fit=crop'
    },
    'Ultraboost 23': {
      name: 'Ultraboost 23',
      tag: 'Stride',
      price: 220,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=75&auto=format&fit=crop'
    },
    'Balance 680': {
      name: 'Balance 680',
      tag: 'Stride',
      price: 165,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=75&auto=format&fit=crop'
    },
    'Velocity Ultra 2': {
      name: 'Velocity Ultra 2',
      tag: 'Pulse',
      price: 130,
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=75&auto=format&fit=crop'
    },
    'H200 Phantom': {
      name: 'H200 Phantom',
      tag: 'Pulse',
      price: 460,
      image: 'https://images.unsplash.com/photo-1600185365778-e5c0e72f738a?w=400&q=75&auto=format&fit=crop'
    },
    'Gel-Repono 30': {
      name: 'Gel-Repono 30',
      tag: 'Pulse',
      price: 160,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=75&auto=format&fit=crop'
    }
  };

  let cartItems = [
    {
      ...catalog['Ultraboost 23'],
      quantity: 1
    }
  ];

  let lastFocusedElement = null;

  function getTotals() {
    let count = 0;
    let total = 0;

    cartItems.forEach(item => {
      count += item.quantity;
      total += item.quantity * item.price;
    });

    return { count, total };
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  function syncHeaderBadge() {
    const { count } = getTotals();
    if (cartCount) cartCount.textContent = String(count);
    cartBtn.setAttribute(
      'aria-label',
      `Carrito de compras, ${count} producto${count !== 1 ? 's' : ''}`
    );
    if (drawerCount) drawerCount.textContent = String(count);
  }

  function renderCart() {
    const entries = cartItems;
    const { total } = getTotals();

    if (!entries.length) {
      itemsWrap.innerHTML = `
        <div class="cart-empty">
          <div>
            <strong>Tu carrito está vacío</strong>
            <p>Agrega productos para verlos aquí con el mismo estilo del panel lateral.</p>
          </div>
        </div>
      `;
    } else {
      itemsWrap.innerHTML = entries.map(item => `
        <article class="cart-item" aria-label="${item.name}">
          <img class="cart-item__image" src="${item.image}" alt="${item.name}" width="64" height="64" loading="lazy" />
          <div class="cart-item__meta">
            <span class="cart-item__tag">${item.tag}</span>
            <h3 class="cart-item__name">${item.name}</h3>
            <p class="cart-item__price">${formatMoney(item.price)}</p>
          </div>
          <div class="cart-item__controls">
            <div class="cart-item__qty" aria-label="Cantidad de ${item.name}">
              <button type="button" data-action="decrease" data-item="${item.name}" aria-label="Disminuir cantidad de ${item.name}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-item="${item.name}" aria-label="Aumentar cantidad de ${item.name}">+</button>
            </div>
            <button type="button" class="cart-item__remove" data-action="remove" data-item="${item.name}">Quitar</button>
          </div>
        </article>
      `).join('');
    }

    syncHeaderBadge();
    if (totalEl) totalEl.textContent = formatMoney(total);
  }

  function open() {
    lastFocusedElement = document.activeElement;
    drawer.classList.add('is-open');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
    closeBtn.focus();
  }

  function close() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');

    window.setTimeout(() => {
      if (!drawer.classList.contains('is-open')) overlay.hidden = true;
    }, 280);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function addItem(name) {
    const product = catalog[name];
    if (!product) return;

    const existing = cartItems.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems = [...cartItems, { ...product, quantity: 1 }];
    }

    renderCart();
    open();
  }

  function updateQuantity(name, delta) {
    const item = cartItems.find(entry => entry.name === name);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter(entry => entry.name !== name);
    }

    renderCart();
  }

  itemsWrap.addEventListener('click', event => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    const { action, item } = actionTarget.dataset;
    if (action === 'increase') updateQuantity(item, 1);
    if (action === 'decrease') updateQuantity(item, -1);
    if (action === 'remove') {
      cartItems = cartItems.filter(entry => entry.name !== item);
      renderCart();
    }
  });

  cartBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    isOpen ? close() : open();
  });

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      close();
    }
  });

  buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card?.querySelector('.product-name')?.textContent?.trim();
      if (!name) return;

      addItem(name);

      const original = btn.textContent;
      btn.textContent = '✓ Añadido';
      btn.disabled = true;
      btn.style.background = '#1a7a3b';

      window.setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 1200);
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      checkoutBtn.textContent = 'LISTO PARA PAGO';
    });
  }

  renderCart();
  close();
})();


/* ============================================================
   6. SMOOTH SCROLL for anchor links (fallback for browsers
      not supporting CSS scroll-behavior)
   ============================================================ */
const SmoothScroll = (() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move focus to section for screen readers
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
