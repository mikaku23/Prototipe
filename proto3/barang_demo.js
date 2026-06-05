(() => {
  const state = {
    role: 'admin',
    activeView: 'login',
    chartRendered: false
  };

  const data = {
    barang: [
      ['1', 'BRG-001', 'Proyektor Epson', '8', 'Tersedia'],
      ['2', 'BRG-002', 'Laptop Acer', '5', 'Dipinjam'],
      ['3', 'BRG-003', 'Mouse Wireless', '22', 'Tersedia'],
      ['4', 'BRG-004', 'Keyboard USB', '11', 'Tersedia']
    ],
    peminjaman: [
      ['1', 'Aulia', 'Laptop Acer', '05 Jun 2026', 'Dipinjam'],
      ['2', 'Rizky', 'Proyektor Epson', '04 Jun 2026', 'Selesai'],
      ['3', 'Nadia', 'Mouse Wireless', '03 Jun 2026', 'Dipinjam']
    ],
    pengelola: [
      ['Muhammad Haliq', 'haliqadmin', 'Admin', 'Aktif'],
      ['Andi Saputra', 'andi01', 'Pengelola', 'Aktif'],
      ['Siti Rahma', 'siti02', 'Pengelola', 'Aktif']
    ],
    pengembalian: [
      ['1', 'Aulia', 'Laptop Acer', '05 Jun 2026', 'Diterima'],
      ['2', 'Rizky', 'Proyektor Epson', '04 Jun 2026', 'Diterima'],
      ['3', 'Nadia', 'Mouse Wireless', '03 Jun 2026', 'Proses']
    ],
    user: [
      ['1', 'Muhammad Haliq', 'haliqadmin', 'admin', 'Aktif'],
      ['2', 'Andi Saputra', 'andi01', 'pengelola', 'Aktif'],
      ['3', 'Aulia', 'aulia01', 'user', 'Aktif']
    ]
  };

  const el = {
    body: document.body,
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    themeToggle: document.getElementById('themeToggle'),
    loginForm: document.getElementById('loginForm'),
    loginUser: document.getElementById('loginUser'),
    loginPass: document.getElementById('loginPass'),
    togglePass: document.getElementById('togglePass'),
    searchInput: document.getElementById('searchInput'),
    pageTitle: document.getElementById('pageTitle'),
    pageSub: document.getElementById('pageSub'),
    userName: document.getElementById('userName'),
    userRole: document.getElementById('userRole'),
    avatar: document.getElementById('avatar'),
    toast: document.getElementById('toast'),
    views: {
      login: document.getElementById('loginView'),
      register: document.getElementById('registerView'),
      dashboard: document.getElementById('dashboardView'),
      barang: document.getElementById('barangView'),
      peminjaman: document.getElementById('peminjamanView'),
      pengelola: document.getElementById('pengelolaView'),
      pengembalian: document.getElementById('pengembalianView'),
      user: document.getElementById('userView')
    }
  };

  const labels = {
    login: ['Login', 'Masuk ke demo inventaris barang'],
    register: ['Register', 'Buat akun demo'],
    dashboard: ['Dashboard', 'Ringkasan inventaris barang'],
    barang: ['Barang', 'Daftar aset barang'],
    peminjaman: ['Peminjaman', 'Data peminjaman barang'],
    pengelola: ['Pengelola', 'Data pengelola inventaris'],
    pengembalian: ['Pengembalian', 'Data pengembalian barang'],
    user: ['User', 'Daftar pengguna sistem']
  };

  function showToast(text) {
    el.toast.textContent = text;
    el.toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.toast.classList.remove('show'), 1800);
  }

  function setRole(role) {
    state.role = role;
    el.userName.textContent = role;
    el.userRole.textContent = role;
    el.avatar.textContent = role[0]?.toUpperCase() || 'A';
    document.querySelectorAll('.role-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === role);
    });
  }

  function setView(view) {
    state.activeView = view;
    Object.entries(el.views).forEach(([key, node]) => {
      node.classList.toggle('active', key === view);
    });
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    el.pageTitle.textContent = labels[view][0];
    el.pageSub.textContent = labels[view][1];

    if (window.innerWidth < 1200) {
      el.sidebar.classList.remove('open');
    }

    if (view === 'dashboard' && !state.chartRendered) {
      renderDashboard();
      state.chartRendered = true;
    }
  }

  function renderRows(id, rows, mode = 'status') {
    const tb = document.getElementById(id);
    if (!tb) return;
    tb.innerHTML = rows.map(r => {
      const last = r[r.length - 1];
      const statusCls = /aktif|tersedia|diterima|selesai/i.test(last)
        ? 'ok'
        : /dipinjam|proses/i.test(last)
          ? 'warn'
          : /tolak|rusak/i.test(last)
            ? 'bad'
            : 'info';
      return `<tr>${r.map((c, i) => i === r.length - 1 ? `<td><span class="badge ${statusCls}">${c}</span></td>` : `<td>${c}</td>`).join('')}</tr>`;
    }).join('');
  }

  function renderDashboard() {
    const chart = document.getElementById('chartBox');
    const bars = [
      ['Barang', 84],
      ['Peminjaman', 58],
      ['Pengembalian', 73],
      ['User', 92],
    ];
    chart.innerHTML = bars.map(([label, val]) => `
      <div class="chart-row">
        <div class="chart-label">${label}</div>
        <div class="chart-track"><div class="chart-fill" style="width:${val}%"></div></div>
      </div>
    `).join('');

    const acts = [
      ['08:12', 'Login admin', 'Dashboard dibuka'],
      ['09:00', 'Tambah barang', 'Proyektor Epson'],
      ['10:25', 'Peminjaman', 'Laptop Acer'],
      ['11:45', 'Pengembalian', 'Mouse Wireless']
    ];
    const list = document.getElementById('activityList');
    list.innerHTML = acts.map(([time, t, d]) => `
      <div class="timeline-item">
        <div>
          <strong>${t}</strong>
          <small>${d}</small>
        </div>
        <div class="text-end">
          <div>${time}</div>
          <small>demo</small>
        </div>
      </div>
    `).join('');

    renderRows('barangTable', data.barang);
    renderRows('peminjamanTable', data.peminjaman);
    renderRows('pengelolaTable', data.pengelola);
    renderRows('pengembalianTable', data.pengembalian);
    renderRows('userTable', data.user);
  }

  function normalizeRoleInput(value) {
    const v = value.trim().toLowerCase();
    if (v === 'pengelola' || v === 'petugas' || v === 'admin' || v === 'user') return v;
    return v;
  }

  function login() {
    const u = normalizeRoleInput(el.loginUser.value);
    const p = el.loginPass.value.trim();

    const valid =
      (u === 'admin' && p === 'admin123') ||
      (u === 'pengelola' && p === 'pengelola123') ||
      (u === 'user' && p === 'user123');

    if (!valid) {
      showToast('Login gagal');
      return;
    }

    setRole(u);
    setView('dashboard');
    showToast(`Login ${u} berhasil`);
  }

  function applySearch(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('tbody tr, .timeline-item, .info-box, .form-card, .panel-note').forEach(elm => {
      const hit = elm.textContent.toLowerCase().includes(q);
      elm.style.display = hit ? '' : 'none';
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('barang-theme');
    if (saved === 'dark') el.body.classList.add('dark');
    renderThemeIcon();
  }

  function renderThemeIcon() {
    el.themeToggle.textContent = el.body.classList.contains('dark') ? '☼' : '◐';
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderDashboard();
    setRole('admin');
    setView('login');

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => setView(btn.dataset.view));
    });

    document.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => setView(btn.dataset.jump));
    });

    document.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        setRole(btn.dataset.role);
        showToast(`Mode ${btn.dataset.role} siap`);
      });
    });

    el.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      login();
    });

    el.togglePass.addEventListener('click', () => {
      const isPwd = el.loginPass.type === 'password';
      el.loginPass.type = isPwd ? 'text' : 'password';
      el.togglePass.textContent = isPwd ? '🙈' : '👁';
    });

    el.searchInput.addEventListener('input', (e) => applySearch(e.target.value));

    el.sidebarToggle.addEventListener('click', () => {
      el.sidebar.classList.toggle('open');
    });

    el.themeToggle.addEventListener('click', () => {
      el.body.classList.toggle('dark');
      localStorage.setItem('barang-theme', el.body.classList.contains('dark') ? 'dark' : 'light');
      renderThemeIcon();
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth < 1200 && el.sidebar.classList.contains('open')) {
        if (!el.sidebar.contains(e.target) && !el.sidebarToggle.contains(e.target)) {
          el.sidebar.classList.remove('open');
        }
      }
    });
  });
})();