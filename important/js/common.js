// Inject common header & footer
(async () => {
  const headerMount = document.getElementById('site-header');
  const footerMount = document.getElementById('site-footer');

  if (headerMount) {
    const res = await fetch('/partials/header.html', { cache: 'no-store' });
    headerMount.innerHTML = await res.text();
    window.initThemeSwitcher && window.initThemeSwitcher(); // after header is in DOM
  }

  if (footerMount) {
    const res = await fetch('/partials/footer.html', { cache: 'no-store' });
    footerMount.innerHTML = await res.text();
    const y = document.getElementById('yearNow');
    if (y) y.textContent = new Date().getFullYear();
  }
})();
