(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else fn();
  };

  onReady(() => {
    const body = document.body;
    const mobileBtn = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-panel]');
    const current = location.pathname.replace(/\/+$/, '') || '/';

    document.querySelectorAll('a[data-nav], a[data-quick]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const normalized = new URL(href, location.href).pathname.replace(/\/+$/, '') || '/';
      if (normalized === current) a.classList.add('active');
    });

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('tn-hide');
      });
    }

    document.querySelectorAll('[data-demo-fill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const user = btn.getAttribute('data-user') || '';
        const pass = btn.getAttribute('data-pass') || '';
        const u = document.querySelector('#username');
        const p = document.querySelector('#password');
        if (u) u.value = user;
        if (p) p.value = pass;
      });
    });
  });
})();
