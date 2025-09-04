// Page-specific helpers (landing animations or form UX)
document.addEventListener('DOMContentLoaded', () => {
  // ===== helper: perform action after offcanvas is closed =====
  function performNavigation(href) {
    const isHashOnly   = href && href.startsWith('#');
    const isIndexHash  = href && href.includes('index.html#');
    const onIndexPage  = location.pathname.endsWith('/index.html') || location.pathname === '/';

    // 1) Same-page section scroll
    if ((isHashOnly && onIndexPage) || (isIndexHash && onIndexPage)) {
      const id = href.split('#')[1];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.href = '/index.html#' + id; // fallback
      return;
    }

    // 2) Link is "#section" but we're NOT on index → go to index with hash
    if (isHashOnly && !onIndexPage) {
      window.location.href = '/index.html' + href;
      return;
    }

    // 3) Normal navigation (e.g., /contact.html or /index.html#section from other page)
    window.location.href = href || '/';
  }

  // ===== A) Offcanvas links: close then navigate/scroll =====
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('.offcanvas a.nav-link');
    if (!link) return;

    const href = link.getAttribute('href') || '#';
    const canvasEl = link.closest('.offcanvas');
    const off = canvasEl
      ? bootstrap.Offcanvas.getInstance(canvasEl) || new bootstrap.Offcanvas(canvasEl)
      : null;

    e.preventDefault(); // we will handle navigation

    if (off) {
      canvasEl.addEventListener('hidden.bs.offcanvas', () => {
        performNavigation(href);
      }, { once: true });
      off.hide();
    } else {
      performNavigation(href);
    }
  });

  // ===== B) Normal (non-offcanvas) smooth scroll for header/desktop links =====
  document.querySelectorAll('a[href^="/index.html#"], a[href^="#"]').forEach(a => {
    // skip if inside offcanvas; we already handle those above
    if (a.closest('.offcanvas')) return;

    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '#';
      const onIndexPage  = location.pathname.endsWith('/index.html') || location.pathname === '/';

      if (href.startsWith('#') && onIndexPage) {
        const id = href.split('#')[1];
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});


// navabr scroll hide show
let lastScroll = 0;
const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 80) {
    // scroll down → hide
    header.classList.add("hide");
  } else {
    // scroll up → show
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});
