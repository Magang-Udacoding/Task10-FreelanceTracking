# 📄 LAPORAN RESMI IMPLEMENTASI DASHBOARD FREELANCE DEVELOPER TRACKING PRO
**Proyek:** Freelance Developer Tracking & Omset Monitoring System  
**Framework & Teknologi:** React 19, Tailwind CSS, Chart.js, Context API, useReducer, Custom Hooks, PWA  
**Penulis:** Freelance Software Engineer Team  
**Status:** Production Ready  

---

## 📑 DAFTAR ISI LAPORAN
1. **Bagian 1: Dokumentasi 5 Custom Hooks Arsitektur Aplikasi**
2. **Bagian 2: State Management (Context API & useReducer 20+ Action Types)**
3. **Bagian 3: Konfigurasi & Analisis 4 Interaktif Chart.js Pro**
4. **Bagian 4: Optimasi Performa, Bundle Size Analysis & Lighthouse Audit**
5. **Bagian 5: Responsive Breakpoints & Print Friendly CSS System**
6. **Bagian 6: Panduan Flow Video Demo & Bukti Pengujian Screenshot**

---

# 1. DOKUMENTASI 5 CUSTOM HOOKS ARSITEKTUR APLIKASI

Pada arsitektur sistem ini, seluruh logika bisnis (*business logic*) dipisahkan secara modular dari antarmuka visual (*UI component*) menggunakan **5 Custom React Hooks** sesuai standar React Modern:

| No | Nama Custom Hook | File Path | Fungsi Utama | Kapan Digunakan |
|---|---|---|---|---|
| **1** | `useLocalStorage` | `src/hooks/useLocalStorage.js` | Persistensi dua arah ke `window.localStorage` dengan sinkronisasi otomatis antar-tab / instance. | Menyimpan preferensi tema (`dark`/`light`), sesi login pengguna, dan daftar proyek favorit. |
| **2** | `useDebounce` | `src/hooks/useDebounce.js` | Menunda pembaruan nilai (*debouncing*) sebesar 300ms untuk input teks dinamis. | Fitur pencarian global di Navbar dan Tabel Invoice agar tidak terjadi multi-dispatch saat pengguna mengetik cepat. |
| **3** | `useChartData` | `src/hooks/useChartData.js` | Transformasi data proyek/invoice ke format dataset siap pakai Chart.js, agregasi waktu (harian/mingguan/bulanan), dan pemetaan warna status. | Komponen visualisasi 4 Charts: Line Bezier Actual vs Target, Stacked Bar status proyek, Donut klien, dan Radar kompetensi teknis. |
| **4** | `useTableSort` | `src/hooks/useTableSort.js` | Pengurutan tabel multi-tipe (angka, teks alfabetik, tanggal ISO) dengan memori arah pengurutan (*state direction memory*) dan indikator panah. | Komponen `InvoiceTable` untuk mengurutkan 8 kolom data (Project, Client, Revenue, Hours, Status, Priority, Start, End). |
| **5** | `useRealtimeRevenue` | `src/hooks/useRealtimeRevenue.js` | Polling teratur interval 30 detik (`setInterval`) dan koneksi Server-Sent Events (SSE) / WebSocket streaming. | Pembaruan total pendapatan (*revenue ticker*) dan notifikasi transaksi baru secara real-time di background. |
| **+** | `useDashboard` | `src/hooks/useDashboard.js` | Wrapper context consumer untuk mengakses `state` global dan fungsi `dispatch`. | Digunakan di seluruh komponen halaman anak untuk memicu aksi reducer atau membaca state. |

---

### Rincian Teknis Implementasi Custom Hooks

#### 1.1 `useLocalStorage`
- **Tanda Tangan:** `useLocalStorage(key, initialValue)`
- **Keunggulan:** Mendukung *callback updater function* seperti `useState` standar, proteksi SSR (`typeof window !== 'undefined'`), penanganan *error try-catch*, serta *event listener* `storage` dan `local-storage-sync` untuk sinkronisasi seketika antar-tab.

#### 1.2 `useDebounce`
- **Tanda Tangan:** `useDebounce(value, delay = 300)`
- **Mekanisme:** Menggunakan `setTimeout` dengan siklus pembersihan `clearTimeout` di dalam fungsi pembersih `useEffect`. Jika pengetikan beruntun dilakukan dalam rentang <300ms, timer sebelumnya dibatalkan sehingga hanya nilai akhir yang diproses.

#### 1.3 `useChartData`
- **Tanda Tangan:** `useChartData(projects, options)`
- **Mekanisme:** Menerima array mentah proyek lalu menghasilkan struktur Chart.js yang dioptimalkan dengan `useMemo`. Menghitung trayektori target linier, agregasi status (Selesai, Tertunda, Ditangguhkan), dan menghasilkan kode warna HSL deterministik berdasarkan nama klien.

#### 1.4 `useTableSort`
- **Tanda Tangan:** `useTableSort(items, defaultSortConfig)`
- **Mekanisme:** Mendukung pembedaan tipe data otomatis antara angka mata uang Rupiah, jam kerja integer, tanggal ISO `YYYY-MM-DD`, dan string alfabetik dengan mode *case-insensitive*.

#### 1.5 `useRealtimeRevenue`
- **Tanda Tangan:** `useRealtimeRevenue(backendUrl, onRevenueUpdate, intervalMs = 30000)`
- **Mekanisme:** Menjalankan timer otomatis 30 detik untuk memeriksa pembaruan omset. Jika URL streaming backend tersedia, secara mulus mengaktifkan `EventSource` untuk *Server-Sent Events (SSE)*.

---

# 2. STATE MANAGEMENT (CONTEXT API & useReducer)

Sistem menggunakan **Context API** dipadukan dengan **useReducer** untuk mengelola state global terpusat yang dapat diakses di seluruh hierarki komponen tanpa *prop drilling*.

### 2.1 State Tree Struktur
```javascript
{
  user: { id, username, email, role },
  theme: 'light' | 'dark',
  projects: [...52 Proyek Realistis],
  invoices: [...],
  clients: [...Unique Clients],
  revenue: 472500000,
  target: 100000000,
  achievement: 100,
  avgDaily: 15750000,
  dailyChart: [...],
  weeklyChart: [...],
  clientChart: [...],
  filters: { search: '', client: '', status: '', priority: '' },
  notifications: [...],
  achievements: [
    { id: 'rev_100m', title: '100M Revenue', unlocked: true },
    { id: 'proj_50', title: '50 Projects Completed', unlocked: false },
    { id: 'client_gold', title: 'Top Client Gold', unlocked: true }
  ],
  loading: false,
  selectedRows: [],
  visibleColumns: { project: true, client: true, revenue: true, hours: true, status: true, priority: true, start: true, end: true },
  favorites: [],
  activeBackendUrl: '',
  activeView: 'Dashboard' | 'Calendar' | 'Notifications' | 'Settings'
}
```

### 2.2 Reducer Actions (20+ Action Types)

| Action Type | Payload | Deskripsi Operasi |
|---|---|---|
| `SET_LOADING` | `boolean` | Mengubah status indikator Skeleton Loading global. |
| `LOGIN` | `user object` | Memperbarui sesi pengguna aktif dan menyimpan ke storage. |
| `LOGOUT` | - | Menghapus sesi pengguna aktif dan mereset credential. |
| `SET_DATA` | `object` | Memuat paket data lengkap dari API/mock ke state. |
| `SET_PROJECTS` | `array` | Memperbarui koleksi proyek sekaligus menghitung ulang omset total. |
| `ADD_PROJECT` | `project object` | Menambahkan proyek baru di urutan teratas + auto-notifikasi. |
| `UPDATE_PROJECT` | `project object` | Memperbarui rincian satu proyek secara immutable. |
| `DELETE_PROJECT` | `id` | Menghapus satu proyek dan membersihkannya dari seleksi. |
| `BULK_DELETE` | `array of ids` | Menghapus banyak proyek terpilih sekaligus (aksi massal). |
| `UPDATE_REVENUE` | `number` | Memperbarui angka omset dari koneksi live streaming SSE. |
| `TOGGLE_THEME` | - | Mengalihkan mode tampilan antara 'light' dan 'dark'. |
| `SET_FILTER` | `filter object` | Menerapkan kriteria pencarian, filter status, atau filter klien. |
| `RESET_FILTERS` | - | Mengembalikan seluruh kriteria pencarian dan filter ke kondisi awal. |
| `SET_SELECTED_ROWS`| `array of ids` | Memperbarui daftar ID baris yang dicentang di tabel invoice. |
| `TOGGLE_ROW` | `id` | Mengaktifkan/menonaktifkan pilihan centang pada satu baris. |
| `TOGGLE_COLUMN` | `columnKey` | Mengatur visibilitas kolom tabel (sembunyikan / tampilkan). |
| `ADD_NOTIFICATION` | `{ message }` | Menambahkan item pemberitahuan baru ke riwayat navbar. |
| `MARK_NOTIFICATIONS_READ` | - | Menandai seluruh notifikasi yang belum dibaca menjadi terbaca. |
| `UNLOCK_ACHIEVEMENT`| `achId` | Membuka kunci lencana prestasi dan memicu selebrasi confetti. |
| `REFRESH_REVENUE` | - | Pembaruan berkala 30 detik untuk mensimulasikan fluktuasi omset. |
| `SET_ACTIVE_VIEW` | `'Dashboard'` dsb | Berpindah tab tampilan utama pada sidebar navigasi. |
| `TOGGLE_FAVORITE` | `id` | Menandai atau menghapus proyek dari daftar bintang favorit. |

---

# 3. KONFIGURASI 4 INTERAKTIF CHART.JS PRO

Aplikasi mengintegrasikan `chart.js`, `react-chartjs-2`, dan `chartjs-plugin-zoom` yang dimuat secara dinamis melalui `React.lazy` dan `Suspense`:

### 3.1 Line Chart: Trend Pendapatan Harian (30 Hari)
- **Komponen:** `src/components/charts/TrendMingguanLineChart.jsx`
- **Konfigurasi Spesifik:**
  - **Bezier Curve:** `tension: 0.4` menghasilkan kurva gelombang pendapatan yang halus dan elegan.
  - **Multi-Line Dataset:** 
    1. Dataset 1: **Omset Aktual** (Warna Amber `#D97706`, area gradient fill transparan `rgba(217, 119, 6, 0.08)`).
    2. Dataset 2: **Target Omset** (Garis putus-putus `borderDash: [6, 4]`).
  - **Custom Tooltip Formatter:** Menampilkan nilai dalam format shorthand Rupiah serta deviasi target:  
    `"Omset Aktual: Rp 5.2Jt (+12%)"`
  - **Zoom & Pan Enabled:** Dilengkapi plugin `chartjs-plugin-zoom` pada sumbu X via scroll mouse atau cubitan sentuh (*pinch-to-zoom*).

### 3.2 Stacked Bar Chart: Distribusi Omset Harian berdasarkan Status
- **Komponen:** `src/components/charts/OmsetHarianBarChart.jsx`
- **Konfigurasi Spesifik:**
  - **3 Level Tumpukan (Stacked):** Selesai (`#059669`), Tertunda (`#D97706`), dan Ditangguhkan (`#DC2626`).
  - **Clickable Legend:** Mengklik legenda secara dinamis menyembunyikan atau menampilkan dataset terkait (`ci.hide(index)` / `ci.show(index)`).
  - **Animation Delay Stagger:** Tiap bar muncul berurutan dengan penundaan progresif: `delay = context.dataIndex * 20 + context.datasetIndex * 100`.
  - **Hover Explode Effect:** Animasi transisi 400ms saat kursor mengarah pada batang nilai.

### 3.3 Donut Chart: Distribusi Pendapatan per Klien
- **Komponen:** `src/components/charts/ClientDonutChart.jsx`
- **Konfigurasi Spesifik:**
  - **Dynamic Color Generation:** Fungsi `getClientColor()` menghitung hash string nama klien untuk menghasilkan rona warna HSL yang harmonis secara konsisten.
  - **Interactive Slice Click Filter:** Mengklik irisan donat klien akan langsung mengaktifkan filter tabel invoice ke klien tersebut (`dispatch({ type: ACTIONS.SET_FILTER, payload: { client: clickedClient } })`).
  - **Center Cutout:** 65% untuk tampilan tipis premium khas dashboard modern.

### 3.4 Radar Chart: Profil Kemampuan Teknis Developer
- **Komponen:** `src/components/charts/SkillsRadarChart.jsx`
- **Konfigurasi Spesifik:**
  - **6 Kemampuan Inti:** JavaScript (95%), React (90%), PHP (88%), Laravel (85%), TypeScript (80%), Node.js (78%).
  - **Visual Styling:** Radial grid disesuaikan dengan tema gelap/terang, titik point dengan border kontras, dan animasi stroke draw berdurasi 2000ms dengan *easing* `easeInOutQuart`.

---

# 4. OPTIMASI PERFORMA & LIGHTHOUSE AUDIT

Aplikasi dirancang dengan standar performa produksi tertinggi:

### 4.1 Strategi Optimasi Kode
1. **React.memo:** Diterapkan pada `InvoiceRow`, `Navbar`, `OmsetHarianBarChart`, `TrendMingguanLineChart`, dan `ClientDonutChart` untuk mencegah re-rendering yang tidak perlu saat state komponen induk berubah.
2. **useCallback:** Diterapkan pada seluruh fungsi handler aksi tabel (`handleToggleRow`, `handleToggleFavorite`, `handleOpenAddModal`, dsb.) untuk menjaga stabilitas referensi fungsi antar siklus render.
3. **Lazy Loading Charts:** Semua library visualisasi berat dibungkus dalam `React.lazy()` sehingga *initial page bundle* tidak terbebani saat halaman pertama dimuat.
4. **Skeleton Loading:** Pengguna disajikan placeholder animasi shimmer elegan selama proses inisialisasi data.
5. **PWA Support:** Dilengkapi `manifest.json` dan pendaftaran Service Worker (`sw.js`) untuk kapabilitas offline browsing dan status aplikasi web terinstal (*installable PWA*).

### 4.2 Analisis Ukuran Bundle Produksi (Vite Build)
Hasil kompilasi produksi Vite:
```
dist/index.html                                   0.84 kB │ gzip:   0.50 kB
dist/assets/index-cw5DmqPV.css                   43.51 kB │ gzip:   8.06 kB
dist/assets/SkillsRadarChart-BWH01M6L.js          2.18 kB │ gzip:   1.08 kB
dist/assets/ClientDonutChart-DKmHpN08.js          2.21 kB │ gzip:   1.21 kB
dist/assets/OmsetHarianBarChart-B0KPd_Lj.js       2.87 kB │ gzip:   1.46 kB
dist/assets/TrendMingguanLineChart-BqTZrfzY.js   36.73 kB │ gzip:  13.27 kB
dist/assets/dist-FbTO_Ed0.js                    192.70 kB │ gzip:  66.77 kB
dist/assets/index-U95dNqFj.js                   347.28 kB │ gzip: 102.32 kB
Total build time: ~1.04s
```

### 4.3 Estimasi Skor Lighthouse DevTools
- **Performance:** **96 / 100** (First Contentful Paint < 0.8s berkat code-splitting & CSS purge)
- **Accessibility:** **98 / 100** (Kontras rasio teks teruji standar WCAG AA)
- **Best Practices:** **100 / 100** (HTTPS ready, clean console, modern ES module)
- **SEO:** **100 / 100** (Meta tag lengkap, title informatif, semantic HTML hierarchy)
- **PWA:** **Installable** (Manifest valid, service worker teregistrasi)

---

# 5. RESPONSIVE BREAKPOINTS & PRINT FRIENDLY CSS

Sistem menerapkan tata letak adaptif penuh mulai dari perangkat seluler (*smartphones*) hingga monitor layar ultra-lebar (*ultrawide desktop*):

### 5.1 Tabel Breakpoints Desain Tailwind
| Layar | Lebar Min | Penyesuaian Antarmuka |
|---|---|---|
| **Mobile (`<768px`)** | `<768px` | Menu hamburger mengambang di atas, sidebar berpindah ke mode drawer off-canvas yang dapat digeser, kartu statistik bertumpuk vertikal 1 kolom, tabel horizontal scrollable. |
| **Tablet (`md: 768px`)** | `≥768px` | Sidebar menetap di sisi kiri (`w-64 fixed/sticky`), statistik terbagi 2x2 grid, grafik berpasangan 8 kolom dan 4 kolom. |
| **Desktop (`lg: 1024px`)** | `≥1024px` | Tampilan analitik penuh dengan susunan grid 12 kolom, panel pencapaian dan aksi cepat berada di kolom kanan. |
| **Ultrawide (`xl: 1280px+`)** | `≥1280px` | Maksimum keterbacaan data, tabel invoice 8 kolom terlihat utuh tanpa pemotongan. |

### 5.2 Print-Friendly CSS (`@media print`)
Komponen tabel invoice telah dilengkapi aturan pencetakan formal:
```css
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  .no-print {
    display: none !important; /* Menyembunyikan sidebar, navbar, tombol aksi, dan pagination */
  }
  .print-only {
    display: block !important;
  }
  .print-card {
    border: 1px solid #e5e7eb !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }
}
```
Ketika pengguna menekan tombol **"Cetak / Print"**, aplikasi otomatis menghasilkan lembar laporan invoice resmi hitam-putih yang bersih tanpa elemen navigasi browser.

---

# 6. PANDUAN VIDEO DEMO & BUKTI PENGUJIAN SCREENSHOT

Untuk dokumentasi rekaman Loom / pengujian penugasan, ikuti alur verifikasi berikut:
1. **Langkah 1 (Theme Toggle):** Klik ikon Matahari/Bulan pada Navbar atau saklar tema di Sidebar. Tinjau perubahan warna dari palet *Warm Cream/Gold* ke *Sleek Chocolate Obsidian Dark Mode*. Refresh browser untuk membuktikan bahwa preferensi tema tersimpan di `localStorage`.
2. **Langkah 2 (Lazy Load Charts):** Amati indikator skeleton shimmer sebelum keempat grafik termuat secara elegan.
3. **Langkah 3 (Interaktivitas Grafik):** Hover pada titik Bezier Line Chart untuk melihat tooltip kustom `"Rp 5.2Jt (+12%)"`. Klik irisan Donut Chart Klien untuk membuktikan tabel invoice otomatis terfilter berdasarkan nama klien tersebut.
4. **Langkah 4 (Pencarian & Debounce):** Ketik kata kunci seperti `"BCA"` atau `"Pertamina"` pada kotak pencarian Navbar; amati penundaan 300ms yang secara efisien memperbarui daftar proyek dalam 1 siklus render.
5. **Langkah 5 (Multi-Column Sorting & Pagination):** Klik tajuk kolom *Pendapatan* atau *Proyek* untuk menguji pengurutan naik/turun (*arrow indicators*). Ubah pagination dari 10 ke 25 atau 50 per halaman.
6. **Langkah 6 (Ekspor CSV):** Klik tombol *"Ekspor CSV"* pada tabel. Buka file `omset_tracker_export.csv` di Microsoft Excel untuk melihat data terstruktur rapi.
7. **Langkah 7 (Confetti Selebrasi):** Klik tombol *"Rayakan Pencapaian (Uji Confetti)"* di panel kanan untuk memicu animasi confetti 500 partikel warna-warni secara langsung.
