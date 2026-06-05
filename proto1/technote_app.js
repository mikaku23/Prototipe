(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navButtons = [...document.querySelectorAll('[data-route]')];
  const subnavButtons = [...document.querySelectorAll('[data-tab]')];
  const routeTitle = document.getElementById('routeTitle');
  const routeDesc = document.getElementById('routeDesc');
  const searchInput = document.getElementById('searchInput');
  const themeBtn = document.getElementById('themeBtn');
  const loginForm = document.getElementById('loginForm');
  const passwordField = document.getElementById('passwordField');
  const togglePassword = document.getElementById('togglePassword');
  const adminNotice = document.getElementById('adminNotice');
  const roleBadge = document.getElementById('roleBadge');
  const roleName = document.getElementById('roleName');
  const userName = document.getElementById('userName');

  const routeInfo = {
    dashboard: { title: 'Dashboard Admin', desc: 'Layout utama admin meniru template_admin.layout, barside, navbar, dan footer.' },
    users: { title: 'Pengguna', desc: 'Pengelolaan user admin sesuai group route dan file view Admin.' },
    software: { title: 'Software', desc: 'Daftar software, filter, dan form pengelolaan.' },
    install: { title: 'Penginstalan', desc: 'Layanan instalasi dengan estimasi dan status.' },
    repair: { title: 'Perbaikan', desc: 'Layanan perbaikan barang dengan status dan waktu.' },
    recap: { title: 'Rekap', desc: 'Rekap harian, bulanan, tahunan, dan ekspor.' },
    rank: { title: 'Score Rank', desc: 'Ranking mahasiswa per semester.' },
    'log-login': { title: 'Log Login', desc: 'Riwayat online dan offline.' },
    activity: { title: 'Log Aktivitas', desc: 'Audit aksi, waktu, dan konteks.' },
    system: { title: 'Sistem', desc: 'Maintenance dan status aplikasi.' },
    profile: { title: 'My Profile', desc: 'Data identitas pengguna.' },
    login: { title: 'Login', desc: 'Masuk sebagai admin, dosen, atau mahasiswa.' },
    dosen: { title: 'Dashboard Dosen', desc: 'Layout halaman dosen sesuai template_dosen dan folder dosen.' },
    mahasiswa: { title: 'Dashboard Mahasiswa', desc: 'Layout halaman mahasiswa sesuai template_mahasiswa dan folder mahasiswa.' }
  };

  const demoData = {
    services: [
      { name: 'Andi Pratama', type: 'Instalasi', detail: 'Microsoft Office, VS Code', status: 'done', eta: '00:24' },
      { name: 'Siti Aisyah', type: 'Perbaikan', detail: 'Laptop mati total', status: 'progress', eta: '01:10' },
      { name: 'Rizky Ramadhan', type: 'Instalasi', detail: 'Driver printer', status: 'done', eta: '00:12' },
      { name: 'Dosen Ahmad', type: 'Perbaikan', detail: 'SSD error', status: 'reject', eta: '00:45' },
      { name: 'Nadia Zahra', type: 'Instalasi', detail: 'XAMPP + Laravel', status: 'progress', eta: '00:31' }
    ],
    logs: [
      ['Mikaku23', 'Login sukses', '08:12', 'Online'],
      ['Aulia Rahman', 'Logout', '09:01', 'Offline'],
      ['Dr. Siti', 'Login sukses', '10:03', 'Online']
    ],
    activities: [
      ['Update status penginstalan', 'Admin', 'dashboard'],
      ['Tambah user', 'Admin', 'pengguna'],
      ['Submit contact', 'Mahasiswa', 'contact']
    ],
    mhs: [
      ['1', '12-05-2026', 'Aulia Rahman', 'XAMPP + Laravel', 'Selesai'],
      ['2', '14-05-2026', 'Nadia Zahra', 'Microsoft Office', 'Proses'],
      ['3', '20-05-2026', 'Rizky Ramadhan', 'VS Code', 'Selesai']
    ],
    dosen: [
      ['1', '11-05-2026', 'Dr. Siti', 'Laptop Acer', 'Selesai'],
      ['2', '18-05-2026', 'Dr. Ahmad', 'Monitor PC', 'Proses'],
      ['3', '21-05-2026', 'Dr. Rina', 'SSD', 'Selesai']
    ]
  };

  function setActiveRoute(route) {
    const target = routeInfo[route] ? route : 'dashboard';
    pages.forEach((page) => page.classList.toggle('active', page.id === target));
    navButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.route === target));
    if (routeTitle) routeTitle.textContent = routeInfo[target].title;
    if (routeDesc) routeDesc.textContent = routeInfo[target].desc;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setRole(role) {
    if (roleBadge) roleBadge.textContent = role.toUpperCase();
    if (roleName) roleName.textContent = role;
    if (userName) userName.textContent = role === 'admin' ? 'Mikaku23' : role === 'dosen' ? 'Dosen Demo' : 'Mahasiswa Demo';
    if (adminNotice) {
      adminNotice.textContent = role === 'admin'
        ? 'Login admin aktif. Panel admin memuat seluruh halaman dari folder Admin dan template_admin.'
        : role === 'dosen'
          ? 'Login dosen aktif. Panel beralih ke layout dosen dan halaman dari folder dosen.'
          : 'Login mahasiswa aktif. Panel beralih ke layout mahasiswa dan halaman dari folder mahasiswa.';
    }
  }

  function renderTables() {
    const serviceBody = document.getElementById('serviceBody');
    const logBody = document.getElementById('logBody');
    const activityBody = document.getElementById('activityBody');
    const mhsBody = document.getElementById('mhsBody');
    const dosenBody = document.getElementById('dosenBody');

    if (serviceBody) {
      serviceBody.innerHTML = demoData.services.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${r.name}</td>
          <td>${r.type}</td>
          <td>${r.detail}</td>
          <td><span class="status ${r.status}">${r.status === 'done' ? 'Selesai' : r.status === 'progress' ? 'Proses' : 'Gagal'}</span></td>
          <td>${r.eta}</td>
        </tr>
      `).join('');
    }

    if (logBody) {
      logBody.innerHTML = demoData.logs.map(([name, action, time, state]) => `
        <tr>
          <td>${name}</td>
          <td>${action}</td>
          <td>${time}</td>
          <td><span class="status ${state === 'Online' ? 'done' : 'progress'}">${state}</span></td>
        </tr>
      `).join('');
    }

    if (activityBody) {
      activityBody.innerHTML = demoData.activities.map(([action, user, ctx]) => `
        <tr>
          <td>${action}</td>
          <td>${user}</td>
          <td>${ctx}</td>
        </tr>
      `).join('');
    }

    if (mhsBody) {
      mhsBody.innerHTML = demoData.mhs.map((r) => `
        <tr>
          <td>${r[0]}</td>
          <td>${r[1]}</td>
          <td>${r[2]}</td>
          <td>${r[3]}</td>
          <td><span class="status ${r[4] === 'Selesai' ? 'done' : 'progress'}">${r[4]}</span></td>
        </tr>
      `).join('');
    }

    if (dosenBody) {
      dosenBody.innerHTML = demoData.dosen.map((r) => `
        <tr>
          <td>${r[0]}</td>
          <td>${r[1]}</td>
          <td>${r[2]}</td>
          <td>${r[3]}</td>
          <td><span class="status ${r[4] === 'Selesai' ? 'done' : 'progress'}">${r[4]}</span></td>
        </tr>
      `).join('');
    }
  }

  function renderCharts() {
    const dashCanvas = document.getElementById('chartDashboard');
    const recapCanvas = document.getElementById('chartRecap');
    if (dashCanvas && window.Chart) {
      new Chart(dashCanvas, {
        type: 'line',
        data: {
          labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
          datasets: [{ label: 'Aktivitas', data: [12, 19, 14, 24, 20, 28, 26], tension: .38, fill: true, borderWidth: 2 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text') } } },
          scales: {
            x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') }, grid: { color: 'rgba(255,255,255,.05)' } },
            y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') }, grid: { color: 'rgba(255,255,255,.05)' } }
          }
        }
      });
    }
    if (recapCanvas && window.Chart) {
      new Chart(recapCanvas, {
        type: 'bar',
        data: {
          labels: ['Harian', 'Mingguan', 'Bulanan', 'Tahunan'],
          datasets: [{ label: 'Total Rekap', data: [11, 58, 214, 982], borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text') } } },
          scales: {
            x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') }, grid: { display: false } },
            y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') }, grid: { color: 'rgba(255,255,255,.05)' } }
          }
        }
      });
    }
  }

  function applyCircleProgress() {
    document.querySelectorAll('.circle-progress-value').forEach((circle) => {
      const r = circle.r.baseVal.value;
      const c = 2 * Math.PI * r;
      const progress = Number(circle.dataset.progress || 0);
      circle.style.strokeDasharray = `${c} ${c}`;
      circle.style.strokeDashoffset = c - (progress / 100) * c;
    });
  }

  function typeText(selector, text) {
    const el = document.querySelector(selector);
    if (!el) return;
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(timer);
    }, 26);
  }

  function setupLogin() {
    if (!loginForm) return;
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = (document.getElementById('usernameField')?.value || '').trim().toLowerCase();
      const p = (passwordField?.value || '').trim();
      if (u === 'dosen' && p === 'dosen123') {
        setRole('dosen');
        setActiveRoute('dosen');
        return;
      }
      if (u === 'mahasiswa' && p === 'mahasiswa123') {
        setRole('mahasiswa');
        setActiveRoute('mahasiswa');
        return;
      }
      if (u === 'admin' && p === 'admin123') {
        setRole('admin');
        setActiveRoute('dashboard');
        return;
      }
      if (window.Swal) {
        Swal.fire({ icon: 'error', title: 'Login gagal', text: 'Username atau password tidak sesuai.' });
      } else {
        alert('Login gagal');
      }
    });
  }

  function setupTheme() {
    if (!themeBtn) return;
    themeBtn.addEventListener('click', () => {
      const light = document.body.dataset.theme !== 'light';
      document.body.dataset.theme = light ? 'light' : 'dark';
      document.documentElement.style.setProperty('--bg', light ? '#f4f7fb' : '#0b1020');
      document.documentElement.style.setProperty('--bg-soft', light ? '#ffffff' : '#0f172a');
      document.documentElement.style.setProperty('--panel', light ? 'rgba(255,255,255,.86)' : 'rgba(17,24,39,.78)');
      document.documentElement.style.setProperty('--panel-2', light ? 'rgba(248,250,252,.95)' : 'rgba(15,23,42,.82)');
      document.documentElement.style.setProperty('--line', light ? 'rgba(16,24,40,.08)' : 'rgba(255,255,255,.09)');
      document.documentElement.style.setProperty('--text', light ? '#101828' : '#e5eefc');
      document.documentElement.style.setProperty('--muted', light ? '#52637c' : '#90a4c3');
      themeBtn.innerHTML = light ? '<i data-lucide="sun-medium"></i>' : '<i data-lucide="moon-star"></i>';
      if (window.lucide) lucide.createIcons();
    });
  }

  function setupSearch() {
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('tbody tr, .event, .mini-box, .progress-card, .quick-card').forEach((el) => {
        const hit = el.textContent.toLowerCase().includes(q);
        el.style.display = hit ? '' : 'none';
      });
    });
  }

  function setupRoutes() {
    navButtons.forEach((btn) => btn.addEventListener('click', () => setActiveRoute(btn.dataset.route)));
    document.querySelectorAll('[data-jump]').forEach((btn) => btn.addEventListener('click', () => setActiveRoute(btn.dataset.jump)));
  }

  function setupTabs() {
    if (!subnavButtons.length) return;
    subnavButtons.forEach((btn) => btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      subnavButtons.forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === id));
    }));
  }

  function setupSidebarNavMobile() {
    document.querySelectorAll('[data-open-role]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.openRole;
        setRole(role);
        setActiveRoute(role === 'admin' ? 'dashboard' : role);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTables();
    renderCharts();
    applyCircleProgress();
    setupLogin();
    setupTheme();
    setupSearch();
    setupRoutes();
    setupTabs();
    setupSidebarNavMobile();
    typeText('#typingMahasiswa', 'Riwayat Penginstalan Software Anda');
    typeText('#typingDosen', 'Riwayat Perbaikan Anda');
    setRole('admin');
    setActiveRoute('dashboard');
    if (window.lucide) lucide.createIcons();
  });
})();
