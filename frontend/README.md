# 🚀 Freelance Developer Tracking Dashboard Pro (Task 10)

[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384.svg)](https://www.chartjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Dashboard analitik dan manajemen operasional profesional untuk freelance software engineer. Memungkinkan pelacakan omset real-time, status proyek, alokasi jam kerja, evaluasi klien utama, visualisasi kurva pendapatan, pencapaian target, dan ekspor data invoice dengan antarmuka bertaraf produksi (*production-grade UI/UX*).

---

## 🌟 Fitur Utama & Keunggulan

### 1. 📊 4 Analytical Pro Charts (Chart.js + React-Chartjs-2)
- **Line Bezier Curve (30 Hari):** Kurva halus (`tension: 0.4`) membandingkan **Omset Aktual vs Target Omset**, dilengkapi tooltip kustom format Rupiah & persentase deviasi (*contoh: "Rp 5.2Jt (+12%)"*) serta fitur **Zoom & Pan**.
- **Stacked Bar Chart:** Analisis volume proyek harian berdasarkan 3 status: *Selesai (Completed)*, *Tertunda (Pending)*, dan *Ditangguhkan (On Hold)* dengan efek animasi bertahap (*stagger animation delay*) dan legenda interaktif.
- **Client Distribution Donut Chart:** Menampilkan pangsa omset per klien dengan warna dinamis dari nama klien. **Klik irisan donat** untuk memfilter tabel proyek ke klien tersebut secara instan!
- **Skills Radar Chart:** Visualisasi 6 keahlian teknis developer (*JavaScript 95%, React 90%, PHP 88%, Laravel 85%, TypeScript 80%, Node.js 78%*) dengan animasi stroke draw 2000ms.

### 2. ⚡ 5 Custom React Hooks Modern
- `useLocalStorage`: Sinkronisasi otomatis dua arah state <-> penyimpanan lokal (tema dark/light, favorit, sesi login).
- `useDebounce`: Penundaan 300ms pada pencarian global untuk efisiensi request dan render.
- `useChartData`: Transformasi data mentah ke konfigurasi Chart.js, agregasi waktu (harian/mingguan/bulanan), dan pemetaan warna status.
- `useTableSort`: Pengurutan multi-kolom dengan memori arah pengurutan dan indikator panah dinamis.
- `useRealtimeRevenue`: Pembaruan omset berkala 30 detik (`setInterval`) dan koneksi Server-Sent Events (SSE) / WebSocket streaming.
- `useDashboard`: Custom hook terpadu untuk mengakses state global dan fungsi dispatch.

### 3. 🛡️ Global State Management (Context API + useReducer)
- State terpusat dengan **20+ action types** (`SET_PROJECTS`, `ADD_PROJECT`, `UPDATE_PROJECT`, `DELETE_PROJECT`, `BULK_DELETE`, `TOGGLE_THEME`, `SET_FILTER`, `UNLOCK_ACHIEVEMENT`, `MARK_NOTIFICATIONS_READ`, dll.).
- Fallback data offline lengkap dengan **52 proyek realistis**, 3 notifikasi belum dibaca, dan lencana prestasi dinamis.

### 4. 📋 Advanced Data Grid Table (8 Kolom Lengkap)
- **8 Kolom Data:** Proyek, Klien, Pendapatan, Jam Kerja, Status, Prioritas, Tanggal Mulai, Tanggal Selesai.
- **Pencarian Global Debounced:** Temukan proyek atau klien seketika.
- **Pengurutan Semua Kolom:** Dukungan pengurutan ascending dan descending pada seluruh kolom.
- **Pagination Dinamis:** Pilihan 10, 25, atau 50 baris per halaman.
- **Visibilitas Kolom:** Tombol toggle untuk menampilkan / menyembunyikan kolom sesuai kebutuhan.
- **Row Selection & Bulk Actions:** Pilih beberapa baris untuk hapus massal atau ubah status massal.
- **Ekspor CSV / Excel:** Didukung oleh `PapaParse` dengan penanganan UTF-8 BOM.
- **Print Friendly:** Mode cetak `@media print` untuk mencetak lembar invoice bersih bebas navigasi.

### 5. 🏆 Achievements & Confetti Animation
- Lencana pencapaian otomatis terbuka:
  - 🏆 **100M Revenue:** Tercapai saat total omset melampaui Rp 100 Juta.
  - 🎉 **50 Projects Completed:** Menyelesaikan 50 proyek freelance.
  - ⭐ **Top Client Gold:** Menerima pendapatan > Rp 40 Jt dari klien utama.
- Animasi selebrasi confetti 500 partikel (`react-confetti`) saat pencapaian terbuka atau saat mengklik badge!

### 6. 📱 Responsive Layout & Dark Mode
- Mode Gelap (*Dark Mode*) berpalet *Warm Chocolate Obsidian* yang tersinkronisasi ke `localStorage`.
- Tata letak responsif penuh dari layar ponsel (hamburger menu & drawer off-canvas) hingga layar ultrawide.
- Dukungan PWA (*Progressive Web App*) dengan `manifest.json` dan Service Worker (`sw.js`).

---

## 🛠️ Tech Stack & Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    "chartjs-plugin-zoom": "^2.2.0",
    "hammerjs": "^2.0.8",
    "lucide-react": "^1.16.0",
    "@headlessui/react": "^2.2.10",
    "date-fns": "^4.1.0",
    "uuid": "^14.0.0",
    "papaparse": "^5.5.3",
    "react-confetti": "^6.4.0"
  },
  "devDependencies": {
    "vite": "^8.0.12",
    "tailwindcss": "^3.4.19",
    "@tailwindcss/forms": "^0.5.11",
    "@tailwindcss/typography": "^0.5.19",
    "autoprefixer": "^10.5.0",
    "postcss": "^8.5.14"
  }
}
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Clone & Masuk ke Folder Proyek
```bash
git clone https://github.com/username/react-freelance-dashboard-pro.git
cd react-freelance-dashboard-pro/frontend
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Akses antarmuka di: `http://localhost:5173/`

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build produksi yang telah dioptimasi akan berada di folder `/dist`.

### 5. Preview Hasil Build
```bash
npm run preview
```

---

## 🔑 Akun Demo (Default Login Credentials)
Aplikasi telah terisi sesi demo bawaan. Jika logout, Anda dapat masuk kembali menggunakan:
- **Akun Admin:** `admin@example.com` / `admin123` *(Hak akses penuh: tambah proyek, hapus invoice, aksi massal)*
- **Akun Staff:** `staff@example.com` / `staff123` *(Hak akses peninjau data)*

---

## 📁 Struktur Direktori Proyek

```
frontend/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.json              # PWA Web Manifest
│   └── sw.js                      # Service Worker Offline Caching
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ClientDonutChart.jsx        # Donut Chart Klien
│   │   │   ├── OmsetHarianBarChart.jsx     # Stacked Bar Chart
│   │   │   ├── SkillsRadarChart.jsx        # Radar Skills Chart
│   │   │   └── TrendMingguanLineChart.jsx  # Bezier Line Chart
│   │   ├── table/
│   │   │   └── InvoiceTable.jsx            # 8-Kolom Data Table Pro
│   │   ├── views/
│   │   │   ├── CalendarView.jsx
│   │   │   ├── NotificationsView.jsx
│   │   │   └── SettingsView.jsx
│   │   ├── Achievements.jsx                # Badges + Confetti
│   │   ├── AddProjectModal.jsx             # Form Tambah Invoice
│   │   ├── Login.jsx                       # Login & Register
│   │   ├── Navbar.jsx                      # Search + Bell + Theme
│   │   ├── Sidebar.jsx                     # Navigasi & Klien Collapsible
│   │   ├── SkeletonLoader.jsx              # Shimmer Loading Skeleton
│   │   └── StatsGrid.jsx                   # 4 Kartu Statistik 2x2
│   ├── context/
│   │   └── DashboardContext.jsx            # Context API + useReducer
│   ├── data/
│   │   └── mockData.js                     # 52 Realistic Freelance Projects
│   ├── hooks/
│   │   ├── useChartData.js                 # Hook Transformasi Chart.js
│   │   ├── useDashboard.js                 # Hook Akses Global Context
│   │   ├── useDebounce.js                  # Hook 300ms Search Debounce
│   │   ├── useLocalStorage.js              # Hook Generic Storage Sync
│   │   ├── useRealtimeRevenue.js           # Hook Interval 30s + SSE
│   │   └── useTableSort.js                 # Hook Multi-Column Sorting
│   ├── App.css
│   ├── App.jsx
│   ├── index.css                           # Tailwind CSS + Font Outfit
│   └── main.jsx                            # Entry Point & SW Register
├── freelance_projects_sample.csv           # File Sample Ekspor Data
├── REPORT.md                               # Laporan Lengkap 4 Halaman
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📹 Panduan Video Loom Demo Flow (5 Menit)
1. **Theme Toggle:** Beralih ke dark mode, amati perubahan warna token dan CSS variables, lalu refresh untuk membuktikan persistensi `localStorage`.
2. **Skeleton & Charts Load:** Amati transisi skeleton loader ke 4 chart interaktif.
3. **Chart Interactivity:** Hover line chart (Bezier curve + custom tooltip), klik irisan donat untuk memfilter tabel invoice ke klien tertentu.
4. **Table Search & Debounce:** Ketik cepat nama klien, amati hanya 1 siklus update yang dipicu.
5. **Table Sorting & Pagination:** Urutkan kolom pendapatan dan proyek, uji pergantian halaman 10/25/50 per page.
6. **Ekspor CSV & Excel:** Klik ekspor CSV menggunakan PapaParse dan tunjukkan file hasil unduhan.
7. **Real-time Revenue & Confetti:** Tinjau indikator pembaruan 30 detik serta klik tombol selebrasi pencapaian untuk animasi confetti.
