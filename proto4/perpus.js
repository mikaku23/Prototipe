(() => {
  const sections = [...document.querySelectorAll('.section')];
  const navItems = [...document.querySelectorAll('.nav-item')];
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggle');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');
  const toast = document.getElementById('toast');
  const globalSearch = document.getElementById('globalSearch');

  const titles = {
    dashboard: ['Dashboard Perpustakaan', 'Ringkas, responsif, dan siap dipakai sebagai mockup statik.'],
    buku: ['Data Buku', 'Daftar katalog contoh yang bisa difilter dan dicari.'],
    siswa: ['Data Siswa', 'Daftar anggota perpustakaan yang disusun untuk tampilan statik.'],
    pegawai: ['Data Pegawai', 'Petugas perpustakaan, kepala unit, dan admin.'],
    peminjaman: ['Peminjaman', 'Form ringkas untuk transaksi keluar.'],
    pengembalian: ['Pengembalian', 'Form statik untuk simulasi pengembalian buku.'],
    login: ['Login', 'Halaman masuk statik yang ringan untuk desktop dan mobile.']
  };

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.hidden = true, 2200);
  }

  function openSection(name) {
    sections.forEach(sec => sec.classList.toggle('active', sec.dataset.section === name));
    navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.section === name));

    if (titles[name]) {
      pageTitle.textContent = titles[name][0];
      pageSubtitle.textContent = titles[name][1];
    }

    if (window.innerWidth <= 1080) {
      sidebar.classList.remove('open');
      overlay.hidden = true;
    }

    const active = document.querySelector(`.section[data-section="${name}"]`);
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', () => openSection(btn.dataset.section));
  });

  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => openSection(btn.dataset.jump));
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const next = !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', next);
      overlay.hidden = !next;
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.hidden = true;
    });
  }

  function setupTableSearch(input, table) {
    const rows = [...table.querySelectorAll('tbody tr')];
    const labels = ['Kode', 'Judul', 'Penulis', 'Kategori', 'Stok', 'Status'];

    rows.forEach(row => {
      [...row.children].forEach((td, i) => td.setAttribute('data-label', labels[i] || ''));
    });

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  document.querySelectorAll('.table-search').forEach(input => {
    const table = document.getElementById(input.dataset.target);
    if (table) setupTableSearch(input, table);
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const targetId = chip.dataset.target;
      const filter = chip.dataset.filter;
      const table = document.getElementById(targetId);
      const rows = [...table.querySelectorAll('tbody tr')];
      const chips = document.querySelectorAll(`.chip[data-target="${targetId}"]`);
      chips.forEach(el => el.classList.remove('active'));
      chip.classList.add('active');

      rows.forEach(row => {
        const match = filter === 'all' || row.dataset.category === filter;
        row.style.display = match ? '' : 'none';
      });
    });
  });

  globalSearch.addEventListener('input', () => {
    const q = globalSearch.value.toLowerCase().trim();
    document.querySelectorAll('tbody tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(q)) row.style.display = '';
    });
  });

  document.getElementById('borrowForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Peminjaman disimpan sebagai simulasi.');
    e.target.reset();
  });

  document.getElementById('returnForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Pengembalian diproses sebagai simulasi.');
    e.target.reset();
  });

  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Login demo berhasil. Ini hanya tampilan statik.');
    e.target.reset();
  });

  openSection('dashboard');
})();
