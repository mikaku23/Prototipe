(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else fn();
  };

  const buildMobileMenu = () => {
    const header = document.querySelector('.tn-topbar');
    const desktopNav = document.querySelector('.tn-nav');
    const mobileBtn = document.querySelector('[data-mobile-menu]');
    let mobilePanel = document.querySelector('[data-mobile-panel]');
    let backdrop = document.querySelector('[data-mobile-backdrop]');

    if (!header || !desktopNav || !mobileBtn) return;

    if (!mobilePanel) {
      mobilePanel = document.createElement('aside');
      mobilePanel.className = 'tn-mobile-panel';
      mobilePanel.setAttribute('data-mobile-panel', '');

      const title = document.querySelector('.tn-brand strong')?.textContent || 'TechNote App 2.0 Demo';
      const subtitle = document.querySelector('.tn-brand span')?.textContent || 'Demo panel';
      const menuHtml = desktopNav.innerHTML;

      mobilePanel.innerHTML = `
        <div class="tn-mobile-panel-head">
          <div class="tn-side-head">
            <div class="tn-avatar"><i data-lucide="menu"></i></div>
            <div>
              <h3 style="margin:0">${title}</h3>
              <p style="margin-top:4px">${subtitle}</p>
            </div>
          </div>
          <button class="tn-btn small" type="button" data-mobile-close>Close</button>
        </div>
        <nav class="tn-sidemenu">${menuHtml}</nav>
      `;
      header.insertAdjacentElement('afterend', mobilePanel);
    }

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'tn-mobile-backdrop';
      backdrop.setAttribute('data-mobile-backdrop', '');
      header.insertAdjacentElement('afterend', backdrop);
    }

    const openMenu = () => {
      mobilePanel.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobilePanel.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    mobileBtn.addEventListener('click', () => {
      mobilePanel.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);
    mobilePanel.addEventListener('click', (e) => {
      if (e.target.closest('[data-mobile-close]') || e.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  };

  onReady(() => {
    const current = location.pathname.replace(/\/+$/, '') || '/';

    document.querySelectorAll('a[data-nav], a[data-quick]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const normalized = new URL(href, location.href).pathname.replace(/\/+$/, '') || '/';
      if (normalized === current) a.classList.add('active');
    });

    buildMobileMenu();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
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
