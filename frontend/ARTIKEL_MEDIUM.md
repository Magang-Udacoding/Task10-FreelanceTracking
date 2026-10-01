# Membangun Freelance Developer Tracking Dashboard dengan React, Context API, useReducer, dan Chart.js: Studi Kasus Task 10 Magang Udacoding

> *Bagaimana mengombinasikan arsitektur state management yang solid, 5 custom hooks, visualisasi data interaktif, dan sentuhan retro UI untuk memantau performa freelance developer secara profesional.*

---

## 📌 Pengantar

Sebagai seorang *freelance developer*, mengelola banyak proyek, memantau *cash flow* tagihan (*invoices*), mengevaluasi target omset, serta mendokumentasikan performa klien merupakan tantangan tersendiri. Seringkali data proyek tercecer di spreadsheet terpisah, catatan manual, atau pesan instan.

Dalam penugasan **Task 10 Magang Udacoding**, saya membangun sebuah aplikasi web modern berskala *production-ready*: **Freelance Developer Tracking Dashboard** (diberi nama *Freelancebook Tracker*). 

Aplikasi ini tidak hanya menyajikan angka mentah, tetapi juga menyajikan visualisasi data yang mendalam, pelacakan target dinamis, fitur pencarian instan dengan *match highlighting*, sistem notifikasi *toast* otomatis, serta manajemen state tingkat lanjut menggunakan **React Context API** dan **useReducer**.

Berikut adalah ulasan komprehensif mengenai konsep, arsitektur, tantangan teknis, dan implementasi kode di balik proyek ini.

---

## 🛠️ Tech Stack & Ekosistem Teknologi

Aplikasi ini dibangun menggunakan kombinasi teknologi modern:

- **React 18 & Vite**: Fondasi utama aplikasi yang cepat, modular, dan efisien dengan *Hot Module Replacement* (HMR).
- **Tailwind CSS**: Untuk tata letak (*layout*) yang responsif, *fluid padding*, dan konsistensi token desain.
- **Context API & useReducer**: Arsitektur manajemen state terpusat tanpa memerlukan dependensi eksternal seperti Redux.
- **Chart.js & react-chartjs-2**: Engine visualisasi data untuk grafik batang (*bar chart*), kurva tren (*line chart*), distribusi (*donut chart*), dan matriks keahlian (*radar chart*).
- **Lucide React**: Ikonografi vektor yang ringan dan ekspresif.
- **PapaParse**: Pustaka untuk mengekspor data ke format CSV dan Excel Spreadsheet (*dengan penanganan UTF-8 BOM*).

---

## 🏛️ Arsitektur State Management: Context API + useReducer

Salah satu persyaratan terpenting dalam proyek ini adalah menghindari *prop drilling* serta memusatkan mutasi data (*state transitions*) secara terprediksi. Kami menerapkan kombinasi `createContext` dan `useReducer`.

### 1. 10+ Action Types yang Terstruktur
Reducer menangani lebih dari 10 aksi diskrit:
- `SET_DATA`: Inisialisasi data dari backend/mock data.
- `ADD_PROJECT`: Menambahkan proyek baru dengan kalkulasi omset otomatis.
- `DELETE_PROJECT` & `BULK_DELETE`: Menghapus satu atau banyak data terpilih secara massal.
- `UPDATE_PROJECT`: Memperbarui status, omset, atau jam kerja.
- `SET_FILTER`: Menyaring berdasarkan status, klien, prioritas, dan kata kunci pencarian.
- `TOGGLE_THEME`: Beralih antara *Light Mode* dan *Dark Mode*.
- `TOGGLE_FAVORITE`: Menandai proyek penting dengan bintang.
- `TOGGLE_COLUMN`: Mengatur visibilitas kolom tabel secara dinamis.
- `ADD_TOAST` & `REMOVE_TOAST`: Memunculkan pesan pop-up notifikasi otomatis.

### Contoh Potongan Kode Reducer:
```javascript
case ACTIONS.ADD_PROJECT: {
  const newProj = action.payload;
  const updatedProjects = [newProj, ...state.projects];
  const totalRev = updatedProjects.reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
  const uniqueClients = [...new Set(updatedProjects.map((p) => p.client))];
  
  const toastItem = {
    id: Date.now() + Math.random(),
    title: 'PROYEK DIBUAT',
    message: `✨ Proyek "${newProj.name}" (${newProj.client}) berhasil ditambahkan!`,
    type: 'success',
    timestamp: Date.now(),
  };

  return {
    ...state,
    projects: updatedProjects,
    revenue: totalRev,
    clients: uniqueClients,
    achievement: Math.min((totalRev / state.target) * 100, 100),
    avgDaily: Math.round(totalRev / 30),
    toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
  };
}
```

---

## 🧩 Penerapan 5 Custom Hooks

Untuk menjaga komponen tetap bersih (*clean code*) dan memisahkan logika bisnis dari UI (*Separation of Concerns*), kami merancang 5 custom hooks:

### 1. `useChartData`
Mengolah data proyek dan invoice menjadi dataset yang siap dikonsumsi Chart.js:
- Akumulasi omset harian per status (*completed*, *pending*, *on-hold*).
- Kurva omset mingguan berbanding target mingguan.
- Agregasi omset per klien beserta pemetaan warna palet kontras.
- Radar matriks keahlian teknis (*Frontend, Backend, DevOps, UI/UX, Mobile, Database*).

### 2. `useTableSort`
Menangani pengurutan multi-kolom (*nama proyek, nama klien, nominal omset, durasi jam, tanggal mulai, tanggal selesai*) baik secara *ascending* maupun *descending*.

### 3. `useDebounce`
Mengoptimalkan performa pencarian dengan menunda eksekusi penyaringan (*filtering*) selama 250–300ms setelah user berhenti mengetik, mencegah kalkulasi berlebih pada setiap *keystroke*.

### 4. `useLocalStorage`
Menyimpan preferensi pengguna secara persisten pada browser, seperti daftar proyek favorit, konfigurasi visibilitas kolom tabel, serta tema warna.

### 5. `useAchievements`
Mengevaluasi pencapaian (*gamification system*) secara otomatis berdasarkan metrik performa freelancer:
- *Century Club*: Total omset menembus Rp 100 Juta.
- *Sprint Master*: Menyelesaikan 50 proyek.
- *Whale Hunter*: Mendapatkan invoice di atas Rp 40 Juta dari satu klien.

---

## 🎨 Visualisasi Data: 4 Jenis Chart Interaktif

Bagian grafik dirancang penuh warna (*vibrant*) untuk mempermudah identifikasi data sekilas pandang:

1. **Omset Harian (Stacked Bar Chart)**:
   - Warna hijau zamrud untuk proyek selesai (*Completed*).
   - Warna kuning amber untuk status menunggu (*Pending*).
   - Warna abu-abu untuk proyek yang ditangguhkan (*On-Hold*).
2. **Tren Mingguan & Target (Line Chart dengan Bezier Curve)**:
   - Garis biru cerah dengan gradasi area fill untuk omset aktual.
   - Garis putus-putus amber sebagai garis acuan target.
3. **Distribusi Klien (Donut Chart Responsif)**:
   - Menyajikan proporsi kontribusi omset dari masing-masing klien.
   - Menggunakan legenda HTML kustom yang dapat digulir (*scrollable*) sehingga tidak terpotong oleh batas kanvas Chart.js.
4. **Skills Matrix (Radar Chart)**:
   - Memetakan tingkat jam terbang dan spesialisasi teknologi freelancer.

---

## 🔍 Fitur Unggulan: Pencarian Pintar Proyek & Klien

Fitur pencarian dirancang intuitif dengan fitur unggulan:

1. **Pilihan Target Kolom (*Scope Selector*)**:
   - `Semua (Proyek & Klien)`
   - `Hanya Nama Proyek`
   - `Hanya Nama Klien`
2. **Penyorotan Teks Real-Time (*Match Highlighting*)**:
   Huruf atau kata yang cocok langsung disorot dengan elemen `<mark>` berwarna kuning kontras:
   ```javascript
   function highlightMatch(text = '', query = '') {
     if (!query || !text) return text;
     const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const parts = String(text).split(new RegExp(`(${escaped})`, 'gi'));
     return parts.map((part, i) =>
       part.toLowerCase() === query.toLowerCase() ? (
         <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white px-0.5 rounded-[1px] font-bold">
           {part}
         </mark>
       ) : (
         part
       )
     );
   }
   ```
3. **Penghitung Hasil & Reset Cepat**:
   Menampilkan jumlah baris yang cocok (misalnya `Ditemukan: 5 / 25 Proyek`) serta tombol `✕` untuk mereset kata kunci secara instan.
4. **Pencarian Cepat Klien di Sidebar**:
   Memungkinkan pencarian nama klien langsung di menu navigasi samping.

---

## 🔔 Sistem Notifikasi Otomatis (Toast Alerts)

Setiap aksi pengguna diberikan umpan balik langsung melalui sistem pop-up notifikasi otomatis:
- Badge tipe aksi: `[SUKSES]`, `[HAPUS]`, `[INFO]`, atau `[PERHATIAN]`.
- Timer otomatis berdurasi 4 detik dengan animasi bilah kemajuan (*progress bar timer*).
- Tombol tutup manual dan tumpukan (*stack*) maksimal 5 notifikasi agar tidak menutupi layar.

---

## 📐 Desain Responsif & Estetika Retro Web 2.0

Dashboard ini mengusung konsep visual unik: perpaduan antarmuka legendaris Facebook klasik era 2000-an (*monokrom, border tegas, tipografi proporsional, tombol dengan bayangan bevel*) yang dipadukan dengan standar kenyamanan aplikasi web modern:
- *Fluid Padding* pada mobile, tablet, maupun desktop layar lebar.
- Pencegahan teks atau card terpotong (*text overflow truncation with tooltips*).
- Dukungan mode cetak (*Print/PDF layout*) yang bersih tanpa elemen tombol navigasi.

---

## 💡 Tantangan Teknis & Solusi

| Tantangan | Solusi yang Diterapkan |
| :--- | :--- |
| **Legenda Donut Chart terpotong** pada Chart.js saat daftar klien berjumlah banyak. | Menonaktifkan legend bawaan canvas (`plugins.legend.display: false`) dan membangun HTML legend responsif dengan scroll internal. |
| **Re-render berlebih** saat mengetik di form pencarian. | Mengombinasikan `useDebounce` hook dengan memoization `React.memo` pada komponen `InvoiceRow`. |
| **Kesesuaian format Excel di berbagai OS**. | Menambahkan *UTF-8 Byte Order Mark (BOM)* saat pembuatan file melalui `Blob` agar karakter dan simbol mata uang terbuka sempurna di Microsoft Excel. |

---

## 🎯 Kesimpulan

Membangun **Freelance Developer Tracking Dashboard** pada penugasan Task 10 Magang Udacoding ini memberikan pemahaman mendalam mengenai pembuatan aplikasi React yang kokoh tanpa bergantung pada library state management yang berat.

Dengan memadukan arsitektur **Context API + useReducer**, **5 Custom Hooks**, **Chart.js interaktif**, serta perhatian mendalam pada **UI/UX responsif**, kita dapat menghasilkan sistem pelacakan kerja mandiri yang sangat fungsional, andal, dan menyenangkan untuk digunakan.

---

*Terima kasih kepada tim mentor dan rekan-rekan di **Magang Udacoding** atas bimbingan serta tantangan studi kasus yang sangat relevan dengan kebutuhan industri riil.*
