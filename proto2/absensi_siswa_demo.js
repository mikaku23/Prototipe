(() => {
  const state = {
    role: 'admin',
    activeView: 'dashboard',
    chartsRendered: false
  };

  const data = {
    guru: [
      ['1', 'Asep Kurnia', 'Matematika', 'X IPA 1', 'Aktif'],
      ['2', 'Siti Rahmah', 'Bahasa Indonesia', 'XI IPS 2', 'Aktif'],
      ['3', 'Dedi Saputra', 'BK', 'XII RPL', 'Aktif']
    ],
    siswa: [
      ['1', 'Raka Pratama', '12345678', 'X IPA 1', 'Hadir'],
      ['2', 'Nadia Putri', '12345679', 'XI IPS 2', 'Izin'],
      ['3', 'Fahri Maulana', '12345680', 'XII RPL', 'Terlambat']
    ],
    ortu: [
      ['Budi Santoso', 'Raka Pratama', '0812345678', 'Terhubung'],
      ['Maya Sari', 'Nadia Putri', '0812345679', 'Terhubung'],
      ['Andi Wijaya', 'Fahri Maulana', '0812345680', 'Terhubung']
    ],
    walikelas: [
      ['Bu Lina', 'X IPA 1', '32', 'Aktif'],
      ['Pak Arif', 'XI IPS 2', '31', 'Aktif'],
      ['Bu Dewi', 'XII RPL', '28', 'Aktif']
    ],
    local: [
      ['Lab 1', 'Gedung A', 'Siap'],
      ['Lab 2', 'Gedung B', 'Dipakai'],
      ['Ruang Kelas 12', 'Gedung C', 'Siap']
    ],
    jurusan: [
      { name: 'RPL', desc: 'Rekayasa Perangkat Lunak', count: 128 },
      { name: 'TKJ', desc: 'Teknik Komputer dan Jaringan', count: 96 },
      { name: 'AKL', desc: 'Akuntansi dan Keuangan Lembaga', count: 84 }
    ],
    absen: [
      ['1', 'Raka Pratama', 'X IPA 1', '07:01', '13:02', 'Hadir'],
      ['2', 'Nadia Putri', 'XI IPS 2', '07:19', '-', 'Izin'],
      ['3', 'Fahri Maulana', 'XII RPL', '07:44', '13:10', 'Terlambat']
    ],
    pengajuan: [
      ['Raka Pratama', 'Izin Sakit', '05 Jun 2026', 'Disetujui'],
      ['Nadia Putri', 'Surat Keterangan', '05 Jun 2026', 'Menunggu'],
      ['Fahri Maulana', 'Dispensasi', '05 Jun 2026', 'Ditolak']
    ]
  };

  const views = ['login', 'dashboard', 'guru', 'siswa', 'ortu', 'walikelas', 'local', 'jurusan', 'absen', 'pengajuan', 'rekap'];

  const el = {
    body: document.body,
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    themeToggle: document.getElementById('themeToggle'),
    loginForm: document.getElementById('loginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    togglePassword: document.getElementById('togglePassword'),
    searchInput: document.getElementById('searchInput'),
    userName: document.getElementById('userName'),
    userRole: document.getElementById('userRole'),
    pageTitle: document.getElementById('pageTitle'),
    pageDesc: document.getElementById('pageDesc'),
    toastText: document.getElementById('toastText'),
    demoToast: document.getElementById('demoToast'),
    views: Object.fromEntries(views.map(id => [id, document.getElementById(`${id}View`)])),
  };

  const labels = {
    login: ['Sign In', 'Masuk ke demo absensi siswa'],
    dashboard: ['Dashboard Admin', 'Ringkasan layanan absensi siswa'],
    guru: ['Guru', 'Manajemen data guru'],
    siswa: ['Siswa', 'Manajemen data siswa'],
    ortu: ['Orang Tua', 'Data wali murid'],
    walikelas: ['Wali Kelas', 'Data wali kelas'],
    local: ['Local', 'Data ruang / lokal'],
    jurusan: ['Jurusan', 'Data jurusan sekolah'],
    absen: ['Absen Siswa', 'Rekap absensi harian'],
    pengajuan: ['Pengajuan Admin', 'Daftar pengajuan siswa/guru'],
    rekap: ['Rekap', 'Ringkasan kehadiran']
  };

  const toast = bootstrap.Toast.getOrCreateInstance(el.demoToast, { delay: 2400 });

  function showToast(message, isError = false) {
    el.toastText.textContent = message;
    el.demoToast.classList.toggle('text-bg-primary', !isError);
    el.demoToast.classList.toggle('text-bg-danger', isError);
    toast.show();
  }

  function setRole(role) {
    state.role = role;
    if (el.userName) el.userName.textContent = role;
    if (el.userRole) el.userRole.textContent = role;

    document.querySelectorAll('.role-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.demoLogin === role);
    });
  }

  function setView(view) {
    state.activeView = view;
    views.forEach(name => {
      if (el.views[name]) el.views[name].classList.toggle('active', name === view);
    });

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    const label = labels[view] || labels.dashboard;
    if (el.pageTitle) el.pageTitle.textContent = label[0];
    if (el.pageDesc) el.pageDesc.textContent = label[1];

    if (window.innerWidth < 1200) {
      el.sidebar?.classList.remove('open');
    }

    if (view === 'dashboard' && !state.chartsRendered) {
      renderDashboard();
      state.chartsRendered = true;
    }
  }

  function renderTable(id, rows, type = 'status') {
    const tbody = document.getElementById(id);
    if (!tbody) return;

    tbody.innerHTML = rows.map(row => {
      const cells = row.map((cell, index) => {
        if (type === 'jurusan') return '';
        if (index === row.length - 1) {
          const cls = cell.toLowerCase().includes('aktif') || cell.toLowerCase().includes('hadir') || cell.toLowerCase().includes('disetujui')
            ? 'badge-ok'
            : cell.toLowerCase().includes('izin') || cell.toLowerCase().includes('menunggu')
              ? 'badge-warn'
              : cell.toLowerCase().includes('terlambat') || cell.toLowerCase().includes('ditolak')
                ? 'badge-bad'
                : 'badge-info';
          return `<td><span class="badge-status ${cls}">${cell}</span></td>`;
        }
        return `<td>${cell}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
  }

  function renderDashboard() {
    const chart = document.getElementById('chartDashboard');
    if (chart) {
      const rows = [
        ['Sen', 78],
        ['Sel', 91],
        ['Rab', 86],
        ['Kam', 94],
        ['Jum', 88],
        ['Sab', 72]
      ];
      chart.innerHTML = rows.map(([label, value]) => `
        <div class="chart-row">
          <div class="chart-label">${label}</div>
          <div class="chart-track"><div class="chart-fill" style="width:${value}%"></div></div>
        </div>
      `).join('');
    }

    const aktivitas = [
      ['07:00', 'Guru login', 'Terverifikasi'],
      ['07:05', 'Siswa absen masuk', 'Berhasil'],
      ['13:00', 'Siswa absen pulang', 'Berhasil'],
      ['14:10', 'Pengajuan izin', 'Menunggu']
    ];
    const list = document.getElementById('activityList');
    if (list) {
      list.innerHTML = aktivitas.map(([time, title, sub], idx) => `
        <div class="timeline-item">
          <div>
            <strong>${title}</strong>
            <small>${sub}</small>
          </div>
          <div class="text-end">
            <div class="fw-semibold">${time}</div>
            <small>#${idx + 1}</small>
          </div>
        </div>
      `).join('');
    }

    renderTable('guruTable', data.guru);
    renderTable('siswaTable', data.siswa);
    renderTable('ortuTable', data.ortu);
    renderTable('walikelasTable', data.walikelas);
    renderTable('walikelasFullTable', data.walikelas);
    renderTable('localTable', data.local);
    renderTable('absenTable', data.absen);
    renderTable('pengajuanTable', data.pengajuan);

    const jurusanWrap = document.getElementById('jurusanCards');
    if (jurusanWrap) {
      jurusanWrap.innerHTML = data.jurusan.map(item => `
        <div class="col-md-4">
          <div class="stat-card h-100">
            <div class="stat-label">${item.name}</div>
            <div class="stat-value">${item.count}</div>
            <div class="stat-foot">${item.desc}</div>
          </div>
        </div>
      `).join('');
    }

    const bars = document.getElementById('rekapBars');
    if (bars) {
      bars.innerHTML = [
        ['Hadir', 82, 'var(--primary)'],
        ['Izin', 10, '#f0b429'],
        ['Sakit', 5, '#dc3545'],
        ['Alpha', 3, '#6c757d']
      ].map(([label, value]) => `
        <div class="chart-row">
          <div class="chart-label">${label}</div>
          <div class="chart-track"><div class="chart-fill" style="width:${value}%; background: linear-gradient(90deg, ${label === 'Hadir' ? 'var(--primary)' : label === 'Izin' ? '#f0b429' : label === 'Sakit' ? '#dc3545' : '#6c757d'}, rgba(255,255,255,.35));"></div></div>
        </div>
      `).join('');
    }
  }

  function filterContent(q) {
    const query = q.trim().toLowerCase();
    document.querySelectorAll('tbody tr, .timeline-item, .stat-card, .page-card, .panel-card').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  }

  function loginAs(role) {
    const creds = {
      admin: ['admin', 'admin123'],
      guru: ['guru', 'guru123'],
      siswa: ['siswa', 'siswa123'],
      walikelas: ['walikelas', 'wali123'],
      ortu: ['ortu', 'ortu123']
    };

    const [u, p] = creds[role];
    if (el.loginUsername) el.loginUsername.value = u;
    if (el.loginPassword) el.loginPassword.value = p;
    handleLogin();
  }

  function handleLogin() {
    const u = (el.loginUsername?.value || '').trim().toLowerCase();
    const p = (el.loginPassword?.value || '').trim();

    const valid =
      (u === 'admin' && p === 'admin123') ||
      (u === 'guru' && p === 'guru123') ||
      (u === 'siswa' && p === 'siswa123') ||
      (u === 'walikelas' && p === 'wali123') ||
      (u === 'ortu' && p === 'ortu123');

    if (!valid) {
      showToast('Username atau password tidak sesuai.', true);
      return;
    }

    if (u === 'admin') {
      setRole('admin');
      setView('dashboard');
      showToast('Login admin berhasil.');
      return;
    }

    setRole(u);
    // role selain admin diarahkan ke dashboard yang sama dalam demo statis
    setView('dashboard');
    showToast(`Login ${u} berhasil. Demo role aktif.`);
  }

  function initTheme() {
    const stored = localStorage.getItem('absen-theme');
    if (stored === 'dark') document.body.classList.add('theme-dark');
  }

  function renderThemeIcon() {
    const dark = document.body.classList.contains('theme-dark');
    el.themeToggle.innerHTML = dark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderThemeIcon();
    renderDashboard();
    setRole('admin');
    setView('login');

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => setView(btn.dataset.view));
    });

    document.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => setView(btn.dataset.jump));
    });

    document.querySelectorAll('[data-demo-login]').forEach(btn => {
      btn.addEventListener('click', () => loginAs(btn.dataset.demoLogin));
    });

    el.loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });

    el.togglePassword?.addEventListener('click', () => {
      const isPwd = el.loginPassword.type === 'password';
      el.loginPassword.type = isPwd ? 'text' : 'password';
      el.togglePassword.innerHTML = isPwd ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });

    el.searchInput?.addEventListener('input', (e) => filterContent(e.target.value));

    el.sidebarToggle?.addEventListener('click', () => {
      el.sidebar?.classList.toggle('open');
    });

    el.themeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      localStorage.setItem('absen-theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
      renderThemeIcon();
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth < 1200 && el.sidebar?.classList.contains('open')) {
        if (!el.sidebar.contains(e.target) && e.target !== el.sidebarToggle && !el.sidebarToggle.contains(e.target)) {
          el.sidebar.classList.remove('open');
        }
      }
    });
  });
})();