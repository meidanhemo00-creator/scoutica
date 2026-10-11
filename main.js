/* Scoutica landing page. No dependencies. */
(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // The official S symbol, outlined from the supplied brand file (scoutica (1).pdf).
  // Bounding box: x 79.57, y 338.53, w 161.66, h 201.62.
  const S_PATH = 'M85.68 540.15C81.61 540.15 79.57 538.12 79.57 534.05L79.57 503.85C79.57 499.78 81.61 497.75 85.68 497.75L114.96 497.75C116.58 497.75 117.70 497.70 118.31 497.60L119.23 497.45L190.91 497.45C195.99 497.45 198.53 494.90 198.53 489.82L198.53 468.47C198.53 463.38 195.99 460.84 190.91 460.84L125.33 460.84C121.26 460.84 119.23 458.81 119.23 454.74L119.23 428.20C119.23 423.12 116.69 420.58 111.60 420.58L85.68 420.58C81.61 420.58 79.57 418.55 79.57 414.48L79.57 384.28C79.57 380.21 81.61 378.18 85.68 378.18L111.60 378.18C116.69 378.18 119.23 375.64 119.23 370.56L119.23 344.63C119.23 340.56 121.26 338.53 125.33 338.53L235.13 338.53C239.20 338.53 241.24 340.56 241.24 344.63L241.24 375.13C241.24 379.20 239.20 381.23 235.13 381.23L129.91 381.23C124.82 381.23 122.28 383.77 122.28 388.86L122.28 410.51C122.28 415.60 124.82 418.14 129.91 418.14L195.48 418.14C199.55 418.14 201.59 420.17 201.59 424.24L201.59 450.17C201.59 455.25 204.13 457.79 209.21 457.79L235.13 457.79C239.20 457.79 241.24 459.83 241.24 463.89L241.24 494.09C241.24 498.16 239.20 500.19 235.13 500.19L209.21 500.19C204.13 500.19 201.59 502.73 201.59 507.82L201.59 534.05C201.59 538.12 199.55 540.15 195.48 540.15L85.68 540.15Z';
  const S_BOX = { x: 79.57, y: 338.53, w: 161.66, h: 201.62 };

  // The S sits on a 4 x 5 unit grid (unit widths 1-2-1). Each unit is 2 x 2 lattice cells.
  // Rows list the [startUnit, endUnit) spans that are filled.
  const S_UNITS = [[1, 4], [0, 1], [1, 3], [3, 4], [0, 3]];

  const el = (name, attrs = {}) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  // Small seeded random so the field composition is the same on every visit.
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      toggle.closest('.nav').classList.toggle('is-menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  // Lattice cells covered by the S, as "col,row" keys. Each S unit is 2 x 2 cells.
  // Orientation is the supplied one: top bar right, notch left, bottom bar left.
  const sCells = (col0 = 0, row0 = 0, rows = [0, 1, 2, 3, 4]) => {
    const set = new Set();
    S_UNITS.forEach(([a, b], r) => {
      if (!rows.includes(r)) return;
      for (let u = a; u < b; u++) {
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) set.add(`${col0 + u * 2 + dx},${row0 + r * 2 + dy}`);
        }
      }
    });
    return set;
  };

  /* ------------------------------------------------------------------
     1. Hero
     ------------------------------------------------------------------ */
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    // Reveal the imagery once the first plate has decoded (or after a short wait)
    const first = hero.querySelector('.hero__plate--a img');
    let ready = false;
    const markReady = () => { if (!ready) { ready = true; requestAnimationFrame(() => hero.classList.add('is-ready')); } };
    if (first) {
      if (first.complete && first.naturalWidth) markReady();
      else {
        first.addEventListener('load', markReady, { once: true });
        first.addEventListener('error', markReady, { once: true });
      }
    }
    setTimeout(markReady, 1600);
  }

  // The signature S: its forty grid cells gather, then the exact symbol takes over
  const sig = document.querySelector('[data-sig]');
  if (sig) buildSignature(sig);

  function buildSignature(svg) {
    const CELL = 10;
    const g = el('g');
    const cells = [];
    sCells().forEach((key) => {
      const [c, r] = key.split(',').map(Number);
      const rect = el('rect', {
        class: 'cell',
        x: c * CELL + 0.6, y: r * CELL + 0.6,
        width: CELL - 1.2, height: CELL - 1.2, rx: 1.4,
      });
      g.appendChild(rect);
      cells.push(rect);
    });
    const scale = Math.min(80 / S_BOX.w, 100 / S_BOX.h);
    const ox = (80 - S_BOX.w * scale) / 2 - S_BOX.x * scale;
    const oy = (100 - S_BOX.h * scale) / 2 - S_BOX.y * scale;
    // Uniform positive scale only, so the symbol can never be mirrored
    const mark = el('path', {
      class: 'mark',
      d: S_PATH,
      transform: `translate(${ox.toFixed(3)} ${oy.toFixed(3)}) scale(${scale.toFixed(5)})`,
    });
    svg.append(g, mark);

    if (reduceMotion.matches || !('animate' in Element.prototype)) {
      g.style.opacity = 0;
      return;
    }
    mark.style.opacity = 0;
    let done = 0;
    cells.forEach((rect, i) => {
      const fx = (rand() - 0.5) * 220;
      const fy = (rand() - 0.5) * 140;
      rect.style.opacity = 0;
      rect.animate([
        { opacity: 0, transform: `translate(${fx}px, ${fy}px) scale(0.6)` },
        { opacity: 0.9, transform: `translate(${fx * 0.4}px, ${fy * 0.4}px) scale(0.8)`, offset: 0.35 },
        { opacity: 1, transform: 'translate(0, 0) scale(1)', offset: 0.8 },
        { opacity: 0, transform: 'translate(0, 0) scale(1)' },
      ], {
        duration: 2000,
        delay: 500 + rand() * 260 + i * 6,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'backwards',
      }).finished.then(() => { if (++done === cells.length) g.remove(); }).catch(() => {});
    });
    mark.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 600, delay: 2050, easing: 'ease-out', fill: 'forwards',
    }).finished.then(() => { mark.style.opacity = 1; }).catch(() => {});
  }

  /* ------------------------------------------------------------------
     Nav: transparent over the hero, solid elsewhere
     ------------------------------------------------------------------ */
  const nav = document.querySelector('[data-nav]');
  const sentinel = document.querySelector('[data-hero-sentinel]');
  if (nav && sentinel && 'IntersectionObserver' in window) {
    // Transparent at the very top only, so hero type never scrolls beneath an open bar
    new IntersectionObserver(([entry]) => {
      nav.classList.toggle('nav--over', entry.isIntersecting);
    }).observe(sentinel);
  }

  /* ------------------------------------------------------------------
     2. Sector index
     ------------------------------------------------------------------ */
  const sectorsRoot = document.querySelector('[data-sectors]');
  if (sectorsRoot) buildSectors(sectorsRoot);

  function buildSectors(root) {
    const grid = root.querySelector('[data-sector-grid]');
    const sectors = [...root.querySelectorAll('[data-sector]')];
    const buttons = sectors.map((s) => s.querySelector('.sector__btn'));

    const C = 24;
    const COLS = 12;
    const ROWS = 10;
    const PAD = 1.5;
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const rect = el('rect', {
          class: 'cell',
          x: c * C + PAD, y: r * C + PAD,
          width: C - PAD * 2, height: C - PAD * 2, rx: 3,
          'data-state': 'off',
        });
        rect.style.transitionDelay = `${(c + r) * 16}ms`;
        grid.appendChild(rect);
        cells.push({ rect, c, r });
      }
    }

    const span = (set, r, c0, c1) => { for (let c = c0; c <= c1; c++) set.add(`${c},${r}`); };

    // Each pattern is a different arrangement of the same lattice.
    const patterns = {
      // Layers: the three bars of the S as solid layers, its two notches as joints.
      // Built from the same S grid as the logo, so the orientation always matches.
      defense() {
        return { on: sCells(2, 0, [0, 2, 4]), mid: sCells(2, 0, [1, 3]) };
      },
      // Perimeter: a stepped enclosure around a structured interior
      cyber() {
        const on = new Set(); const mid = new Set();
        for (let c = 2; c <= 9; c++) { on.add(`${c},1`); on.add(`${c},8`); }
        for (let r = 1; r <= 8; r++) { on.add(`2,${r}`); on.add(`9,${r}`); }
        on.delete('9,4'); on.delete('9,5');
        on.add('10,4'); on.add('10,5');
        for (let r = 3; r <= 6; r++) for (let c = 4; c <= 7; c++) if ((r + c) % 2 === 0) mid.add(`${c},${r}`);
        return { on, mid };
      },
      // Pathways: connected nodes along a stepped route
      ai() {
        const on = new Set(); const mid = new Set();
        const nodes = [[1, 8], [4, 8], [4, 5], [7, 5], [7, 2], [10, 2]];
        nodes.forEach(([c, r]) => on.add(`${c},${r}`));
        span(mid, 8, 2, 3);
        [6, 7].forEach((r) => mid.add(`4,${r}`));
        span(mid, 5, 5, 6);
        [3, 4].forEach((r) => mid.add(`7,${r}`));
        span(mid, 2, 8, 9);
        ['1,1', '2,4', '10,6', '9,8', '5,1', '11,4'].forEach((k) => mid.add(k));
        return { on, mid };
      },
    };

    const paint = (key) => {
      const { on, mid } = patterns[key]();
      cells.forEach(({ rect, c, r }) => {
        const k = `${c},${r}`;
        rect.setAttribute('data-state', on.has(k) ? 'on' : mid.has(k) ? 'mid' : 'off');
      });
    };

    const activate = (index, focus = false) => {
      sectors.forEach((s, i) => {
        const open = i === index;
        buttons[i].setAttribute('aria-expanded', String(open));
        s.querySelector('.sector__panel').hidden = !open;
        s.classList.toggle('is-active', open);
      });
      paint(sectors[index].dataset.sector);
      if (focus) buttons[index].focus();
    };

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => activate(i));
      btn.addEventListener('keydown', (e) => {
        const n = buttons.length;
        let next = null;
        if (e.key === 'ArrowDown') next = (i + 1) % n;
        else if (e.key === 'ArrowUp') next = (i - 1 + n) % n;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = n - 1;
        if (next !== null) { e.preventDefault(); buttons[next].focus(); }
      });
    });

    activate(0);
  }

  /* ------------------------------------------------------------------
     3. Approach: the pathway follows the stage in view
     ------------------------------------------------------------------ */
  const approach = document.querySelector('[data-approach]');
  if (approach && 'IntersectionObserver' in window) {
    const stages = [...approach.querySelectorAll('[data-stage]')];
    const progress = approach.querySelector('[data-pathway-progress]');
    const nodes = [...approach.querySelectorAll('[data-node]')];
    const last = stages.length - 1;
    const track = approach.querySelector('[data-pathway-track]');
    if (track && track.getTotalLength) {
      const len = track.getTotalLength();
      nodes.forEach((n, k) => {
        const p = track.getPointAtLength((len * k) / last);
        n.setAttribute('x', (p.x - 10).toFixed(1));
        n.setAttribute('y', (p.y - 10).toFixed(1));
      });
    }

    const setActive = (i) => {
      stages.forEach((s, k) => s.classList.toggle('is-active', k === i));
      nodes.forEach((n, k) => n.classList.toggle('is-reached', k <= i));
      if (progress) progress.style.setProperty('--progress-offset', String(1 - i / last));
    };
    setActive(0);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number(entry.target.dataset.stage));
      });
    }, { rootMargin: '-48% 0px -48% 0px' });
    stages.forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------------
     Nav: mark the section in view
     ------------------------------------------------------------------ */
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  if (navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else if (link.getAttribute('aria-current')) {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------------
     Quiet reveals
     ------------------------------------------------------------------ */
  const reveals = document.querySelectorAll('[data-reveal], .value__thread');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      reveals.forEach((r) => r.classList.add('is-in'));
    } else {
      const groups = new Map();
      reveals.forEach((r) => {
        const parent = r.parentElement;
        const idx = groups.get(parent) || 0;
        r.style.setProperty('--reveal-delay', `${idx * 70}ms`);
        groups.set(parent, idx + 1);
      });
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      reveals.forEach((r) => io.observe(r));
    }
  }

  /* ------------------------------------------------------------------
     Enquiry form
     Submission goes to the URL in the form's data-endpoint attribute
     (for example a Formspree or Basin form endpoint, or your own API).
     With no endpoint configured, nothing is sent and the visitor is told so.
     ------------------------------------------------------------------ */
  const form = document.querySelector('[data-form]');
  if (form) setupForm(form);

  function setupForm(f) {
    const status = f.querySelector('.form__status');
    const submit = f.querySelector('[data-submit]');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const rules = {
      name: (v) => (v ? '' : 'Enter your name.'),
      email: (v) => (!v ? 'Enter your work email.' : emailRe.test(v) ? '' : 'Enter an email address in the format name@firm.com.'),
      organization: (v) => (v ? '' : 'Enter your firm or organization.'),
      message: (v) => (v ? '' : 'Tell us about your investment focus.'),
    };

    let attempted = false;

    const check = (input) => {
      const rule = rules[input.name];
      if (!rule) return true;
      const msg = rule(input.value.trim());
      const err = document.getElementById(`${input.id}-err`);
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        err.textContent = msg;
        err.hidden = false;
      } else {
        input.removeAttribute('aria-invalid');
        err.textContent = '';
        err.hidden = true;
      }
      return !msg;
    };

    const fields = [...f.querySelectorAll('input[name], textarea[name]')].filter((i) => rules[i.name]);
    fields.forEach((input) => {
      input.addEventListener('blur', () => { if (attempted || input.value) check(input); });
      input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) check(input); });
    });

    const setStatus = (tone, text) => {
      status.dataset.tone = tone;
      status.textContent = text;
    };

    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      attempted = true;
      setStatus('', '');
      const results = fields.map(check);
      const firstBad = fields[results.indexOf(false)];
      if (firstBad) {
        firstBad.focus();
        return;
      }

      const endpoint = (f.dataset.endpoint || '').trim();
      if (!endpoint) {
        setStatus('info', 'Online enquiries are not connected yet, so this message has not been sent. Your details are still in the form.');
        return;
      }

      submit.setAttribute('aria-busy', 'true');
      submit.disabled = true;
      const original = submit.textContent;
      submit.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(f),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        f.reset();
        attempted = false;
        setStatus('success', 'Thank you. Your message has been sent, and we will reply by email.');
      } catch (err) {
        setStatus('error', 'Your message could not be sent. Check your connection and try again.');
      } finally {
        submit.removeAttribute('aria-busy');
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }
})();
