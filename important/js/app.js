/* ===== Unified Navigation + UX Helpers =====
 * Requires: Bootstrap 5 JS loaded on the page
 * Works for:
 *   - Offcanvas nav on mobile (closes first, then scrolls/navigates)
 *   - Desktop/header links
 *   - Same-page smooth scroll (#section / /index.html#section)
 *   - Cross-page navigation (contact.html, privacy.html, etc.)
 * Safe-guarded against double init.
 */
(() => {
  if (window.__GW_NAV_INIT__) return;
  window.__GW_NAV_INIT__ = true;

  // ---------- small helpers ----------
  const isIndexPath = (path) =>
    path === '/' || path.endsWith('/index.html');

  const pathOf = (u) => u.pathname.replace(/\/+$/, '') || '/';

  const smoothScrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // optional: focus for a11y (won't steal focus if not focusable)
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    return true;
  };

  const navigate = (href, canvasEl) => {
    const url = new URL(href, location.origin);
    const samePage = pathOf(url) === pathOf(location);

    // 1) Same page + has hash -> smooth scroll
    if (samePage && url.hash) {
      const id = url.hash.replace('#', '');
      if (smoothScrollToId(id)) return;

      // if target not found, still update hash so a later-loaded element can use it
      location.hash = url.hash;
      return;
    }

    // 2) Link is "#section" but we are NOT on index -> go to index with hash
    if (url.hash && !samePage && isIndexPath('/index.html')) {
      window.location.href = '/index.html' + url.hash;
      return;
    }

    // 3) Normal navigation
    window.location.href = url.href;
  };

  // Close a specific offcanvas and then run cb
  const closeOffcanvasThen = (canvasEl, cb) => {
    if (!canvasEl) { cb(); return; }
    const inst = bootstrap.Offcanvas.getOrCreateInstance(canvasEl);
    const onceHidden = () => { canvasEl.removeEventListener('hidden.bs.offcanvas', onceHidden); cb(); };
    canvasEl.addEventListener('hidden.bs.offcanvas', onceHidden, { once: true });
    inst.hide();
  };

  // ---------- A) Delegated handler for OFFCANVAS nav links ----------
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('.offcanvas a.nav-link, .offcanvas a[data-scroll]');
    if (!link) return;

    const rawHref = link.getAttribute('href') || '#';
    const canvasEl = e.target.closest('.offcanvas');
    e.preventDefault();

    closeOffcanvasThen(canvasEl, () => navigate(rawHref, canvasEl));
  });

  // ---------- B) Smooth scroll for NON-offcanvas links on the same page ----------
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-scroll], a[href^="/index.html#"], a[href^="#"]');
    if (!a) return;
    if (a.closest('.offcanvas')) return; // handled above

    const href = a.getAttribute('href') || '#';
    const url = new URL(href, location.origin);

    // Only intercept if same page & has hash
    if (pathOf(url) === pathOf(location) && url.hash) {
      e.preventDefault();
      const id = url.hash.replace('#', '');
      smoothScrollToId(id);
    }
  });

  // ---------- C) Hide/Show header on scroll ----------
  (function headerScrollHide() {
    const header = document.getElementById('site-header');
    if (!header) return;
    let last = window.pageYOffset || document.documentElement.scrollTop || 0;

    window.addEventListener('scroll', () => {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y > last && y > 80) header.classList.add('hide');
      else header.classList.remove('hide');
      last = y;
    }, { passive: true });
  })();

  // ---------- D) Hero typing effect (optional; runs if #typeText exists) ----------
  document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.getElementById('typeText');
    if (!textEl) return;

    const items = [
      "Kolkata FF Website design",
      "Kolkata Fatafat Application development",
      "Fast, Secure & SEO-ready FF Apps",
      "WhatsApp BOT Integration",
      "Bookie & Agent Panel Solutions"
    ];

    let i = 0, j = 0, del = false;

    const tick = () => {
      const txt = items[i];

      if (!del) {
        textEl.textContent = txt.substring(0, j + 1);
        j++;
        if (j === txt.length) { del = true; setTimeout(tick, 1800); return; }
      } else {
        textEl.textContent = txt.substring(0, j - 1);
        j--;
        if (j === 0) { del = false; i = (i + 1) % items.length; }
      }
      setTimeout(tick, del ? 50 : 100);
    };

    tick();
  });
})();


function updateThemeColor() {
    const meta = document.getElementById("theme-color-meta");
    const val = getComputedStyle(document.documentElement).getPropertyValue("--theme-header-color").trim();
    meta.setAttribute("content", val);
  }

  // Run on load
  updateThemeColor();

  // Observe Bootstrap theme changes
  const observer = new MutationObserver(updateThemeColor);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });
