// Bootstrap 5.3 theme switcher with Auto/Light/Dark
(function () {
  const STORAGE_KEY = 'preferred-theme';

  const getStoredTheme = () => localStorage.getItem(STORAGE_KEY);
  const setStoredTheme = (t) => localStorage.setItem(STORAGE_KEY, t);

  const getPreferredTheme = () => getStoredTheme() || 'auto';

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const applyTheme = (theme) => {
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
    // update all theme labels (desktop + mobile)
    document.querySelectorAll('[data-theme-label]').forEach(el => {
      el.textContent = capitalize(theme);
    });
  };

  // initialize switchers
  window.initThemeSwitcher = () => {
    document.querySelectorAll('[data-theme-value]').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-theme-value');
        setStoredTheme(value);
        applyTheme(value);
      });
    });
    applyTheme(getPreferredTheme());
  };

  // listen system theme change (if auto)
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
      if (getStoredTheme() === 'auto') applyTheme('auto');
    });
  } catch (e) {
    // older browsers
  }

  // initial
  applyTheme(getPreferredTheme());
})();