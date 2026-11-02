# PTPN Blood Heroes – Personalized Greeting Card Website

Aplikasi web full-stack modern untuk pembuatan **Personalized Greeting Card** dalam rangka memperingati aksi donor darah **PTPN Blood Heroes – Care in Action**, dipersembahkan oleh **PT Perkebunan Nusantara III (Persero)** bersama **Palang Merah Indonesia (PMI)**.

Aplikasi ini memungkinkan setiap pahlawan donor darah untuk memasukkan nama mereka dan secara instan mendapatkan serta mengunduh kartu ucapan apresiasi beresolusi tinggi (1504 × 1007 piksel) dengan desain template resmi yang telah dipersonalisasi.

---

## DAFTAR ISI

1. [Fitur Utama](#fitur-utama)
2. [Teknologi yang Digunakan (Tech Stack)](#teknologi-yang-digunakan-tech-stack)
3. [Struktur Folder Project](#struktur-folder-project)
4. [A. Panduan Instalasi Project](#a-panduan-instalasi-project)
5. [B. Panduan Konfigurasi Supabase](#b-panduan-konfigurasi-supabase)
6. [C. Penjelasan Lengkap Source Code](#c-penjelasan-lengkap-source-code)
7. [D. Penjelasan Alur Data (Data Flow Architecture)](#d-penjelasan-alur-data-data-flow-architecture)
8. [E. Penjelasan Detail Fungsi-Fungsi Utama](#e-penjelasan-detail-fungsi-fungsi-utama)
9. [Standar Pengujian dan Hasil Verifikasi](#standar-pengujian-dan-hasil-verifikasi)
10. [Lisensi & Hak Cipta](#lisensi--hak-cipta)

---

## FITUR UTAMA

- **Template Resmi Asli**: Mempertahankan 100% elemen visual grafis asli (Logo Danantara, PTPN, PMI, Blood Heroes, PTPN Sehat, ilustrasi perkebunan, pekerja kebun, donor darah, ornamen tetesan darah, dan tanda tangan Direktur SDM & Umum A. Miftahuddin Amin).
- **Personalisasi Nama Dinamis**: Menampilkan teks *"Dear [NAMA PENGGUNA],"* tepat di bawah tulisan *"PAHLAWAN DONOR DARAH"* dan sebelum kalimat *"Setetes darah, sejuta harapan."*.
- **Ukuran Font Adaptif & Otomatis**: Ukuran teks menyesuaikan secara cerdas (auto-scaling) dan membungkus maksimal dua baris tanpa bertabrakan dengan elemen grafis lainnya.
- **Validasi Input Ketat**:
  - Validasi nama tidak boleh kosong atau hanya berisi spasi.
  - Sanitasi otomatis: membersihkan spasi berlebih di awal, akhir, dan antar-kata.
  - Batasan panjang nama maksimal 80 karakter dengan penghitung karakter *real-time*.
- **Format Unduhan Ganda**:
  - **Download PNG**: Kualitas maksimal tanpa kompresi, resolusi 1504 × 1007 piksel (*retina / 2x pixel ratio*).
  - **Download JPG**: Format ringkas dan efisien untuk dibagikan ke media sosial atau perpesanan instan.
- **Standar Penamaan File**: Nama file unduhan rapi sesuai ketentuan: `PTPN-Blood-Heroes-[Nama-Pengguna].png`.
- **Integrasi Backend Supabase**: Mengambil judul acara, deskripsi, tanggal, dan path template secara dinamis dari tabel PostgreSQL Supabase dengan Row Level Security (RLS).
- **Graceful Offline/Local Fallback**: Aplikasi tetap berjalan normal 100% meskipun koneksi internet atau Supabase belum dikonfigurasi.
- **Keamanan & Privasi Penuh**: Nama pengguna hanya diproses di memori browser (*client-side*) dan **tidak pernah disimpan ke database**, menjamin privasi pendonor.

---

## TEKNOLOGI YANG DIGUNAKAN (TECH STACK)

| Bagian | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server-side rendering, routing modular, performa kilat |
| **Bahasa Pemrograman** | TypeScript 5 | Type-safety, meminimalkan bug saat runtime |
| **Styling** | Tailwind CSS 3 | Desain modern, responsif, dan identitas warna PTPN |
| **Komponen Ikon** | Lucide React | Ikon modern, ringan, dan elegan |
| **Backend Service** | Supabase | PostgreSQL DB, Storage Bucket, Auth & RLS |
| **Image Processing** | `html-to-image` + Canvas 2D | Konversi DOM ke gambar PNG/JPG 1504 × 1007 px |

---

## STRUKTUR FOLDER PROJECT

```text
cards-ptpn/
├── .env.local.example              # Contoh variabel lingkungan Supabase
├── .env.local                      # Variabel lingkungan aktif (lokal)
├── next.config.mjs                 # Konfigurasi Next.js (tracing root, remote images)
├── package.json                    # Konfigurasi dependensi project
├── postcss.config.mjs              # Konfigurasi PostCSS untuk Tailwind CSS
├── tailwind.config.ts              # Palet warna PTPN, tipografi, dan shadow
├── tsconfig.json                   # Konfigurasi TypeScript compiler & path alias (@/*)
├── README.md                       # Dokumentasi lengkap arsitektur dan panduan
│
├── public/
│   └── images/
│       ├── fallback-template.png   # Template greeting card resmi lokal (1504 × 1007)
│       └── template.jpg            # Salinan template format JPG
│
├── supabase/
│   └── migrations/
│       └── create_greeting_card_settings.sql  # Skrip migrasi DDL & seed PostgreSQL Supabase
│
└── src/
    ├── app/
    │   ├── api/
    │   │   └── greeting-card-config/
    │   │       └── route.ts        # Next.js Route Handler (GET konfigurasi Supabase)
    │   ├── globals.css             # Style global, animasi fade-in, custom scrollbar
    │   ├── layout.tsx              # Root Layout dengan metadata SEO & OpenGraph
    │   └── page.tsx                # Halaman utama aplikasi (merender LandingPage)
    │
    ├── components/
    │   ├── LandingPage.tsx         # Manajemen state alur (Step Input vs Step Preview)
    │   ├── NameInputForm.tsx       # Form input nama lengkap dengan validasi
    │   ├── GreetingCard.tsx        # Render visual kartu + nama dinamis (aspek 1504:1007)
    │   ├── GreetingCardPreview.tsx # Container kartu, status loading, dan trigger download
    │   └── DownloadButtons.tsx     # Tombol Download PNG, JPG, Edit Nama, & Reset
    │
    ├── lib/
    │   ├── image-generator.ts      # Engine ekspor gambar (html-to-image + Canvas 2D)
    │   ├── utils.ts                # Validasi nama, sanitasi spasi, format nama file
    │   └── supabase/
    │       ├── client.ts           # Supabase browser client (Anon Key)
    │       └── server.ts           # Supabase server client (Route Handler)
    │
    └── types/
        └── greeting-card.ts        # TypeScript interfaces & types
```

---

## A. PANDUAN INSTALASI PROJECT

### 1. Prasyarat Sistem
Pastikan komputer Anda telah terinstal:
- **Node.js**: Versi 18.18.0 atau yang lebih baru (disarankan Node.js v20 LTS atau v22).
- **npm** (atau pnpm / yarn).

### 2. Langkah-Langkah Menjalankan Project

#### Langkah 1: Masuk ke Direktori Project
Buka terminal (PowerShell, Command Prompt, atau Terminal Linux/macOS):
```bash
cd cards-ptpn
```

#### Langkah 2: Instal Seluruh Dependencies
Jalankan perintah berikut untuk menginstal seluruh dependensi yang diperlukan:
```bash
npm install
```
*Paket utama yang diinstal meliputi: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `html-to-image`, `lucide-react`, `tailwindcss`, dan `typescript`.*

#### Langkah 3: Mengatur Environment Variables
Buat file `.env.local` dengan menyalin file template `.env.local.example`:
```bash
cp .env.local.example .env.local
```
Buka file `.env.local` dan masukkan URL serta Anon Key dari proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Jika Anda belum memiliki akun Supabase, biarkan kosong; aplikasi secara otomatis menggunakan konfigurasi fallback lokal tanpa error).*

#### Langkah 4: Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui peramban web pada alamat:
[http://localhost:3000](http://localhost:3000)

#### Langkah 5: Membangun Versi Produksi (Production Build)
Untuk melakukan kompilasi produksi:
```bash
npm run build
npm start
```

---

## B. PANDUAN KONFIGURASI SUPABASE

Ikuti langkah-langkah mudah di bawah ini untuk menghubungkan aplikasi ke backend Supabase gratis:

### 1. Membuat Project Supabase Baru
1. Buka situs [supabase.com](https://supabase.com) dan login/daftar akun.
2. Klik tombol **New Project**.
3. Masukkan nama project, misalnya `ptpn-blood-heroes`.
4. Masukkan database password yang kuat dan pilih region terdekat (misal: *Singapore*).
5. Tunggu 1-2 menit hingga status database menjadi aktif (*ready*).

### 2. Menjalankan SQL Schema & Migration
1. Pada menu navigasi sebelah kiri di Supabase Dashboard, klik icon **SQL Editor**.
2. Klik **New query**.
3. Buka file yang telah disediakan pada project ini: `supabase/migrations/create_greeting_card_settings.sql`.
4. Salin seluruh isi file tersebut dan tempelkan (*paste*) ke dalam SQL Editor Supabase.
5. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
6. Supabase akan secara otomatis:
   - Membuat tabel `greeting_card_settings`.
   - Mengaktifkan **Row Level Security (RLS)**.
   - Membuat RLS Policy: Pengunjung publik hanya boleh membaca konfigurasi yang aktif (`is_active = true`).
   - Membuat Storage Bucket bernama `greeting-card-assets` dengan akses publik.
   - Memasukkan data awal (*seed data*) acara PTPN Blood Heroes.

### 3. Mengunggah Template Greeting Card ke Supabase Storage
1. Pada menu navigasi sebelah kiri, klik **Storage**.
2. Anda akan melihat bucket bernama **greeting-card-assets** (dibuat secara otomatis oleh skrip SQL di atas).
3. Klik bucket **greeting-card-assets**.
4. Klik tombol **Upload files**.
5. Pilih gambar template dari folder project Anda: `public/images/template.jpg`.
6. Pastikan file terunggah dengan nama `template.jpg`.

### 4. Mengambil URL dan Anon Key Supabase
1. Klik menu **Project Settings** (ikon gerigi di kiri bawah dashboard Supabase).
2. Pilih submenu **API**.
3. Salin nilai **Project URL** (misal: `https://xyzcompany.supabase.co`).
4. Salin nilai **Project API keys** bagian **anon** / **public**.
5. Tempelkan kedua nilai tersebut ke dalam file `.env.local` pada project Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
   ```
6. Restart server development Anda (`npm run dev`). Kini website Anda terhubung langsung ke database Supabase!

---

## C. PENJELASAN LENGKAP SOURCE CODE

Berikut adalah rincian peran dan cara kerja setiap file penting dalam arsitektur aplikasi:

### 1. `src/app/page.tsx`
- **Fungsi**: Komponen entry point halaman utama pada Next.js App Router.
- **Cara Kerja**: Merender komponen client-side `<LandingPage />`.
- **Alasan Pemisahan**: Menjaga halaman tetap rapi dan memusatkan pengelolaan state interaktif di dalam komponen `LandingPage`.

### 2. `src/components/LandingPage.tsx`
- **Fungsi**: Komponen pengendali utama (*State Orchestrator*).
- **Cara Kerja**:
  - Menyimpan state `currentStep` (`'input'` atau `'preview'`).
  - Mengambil data konfigurasi acara dari endpoint `/api/greeting-card-config` saat pertama kali dimuat (`useEffect`).
  - Menyimpan nama pengguna `fullName`.
  - Berpindah secara mulus antara form pengisian nama dan tampilan preview kartu.
  - Menyediakan layout branding elegan dengan identitas visual PTPN Blood Heroes (merah marun, merah darah, soft pink).

### 3. `src/components/NameInputForm.tsx`
- **Fungsi**: Formulir input nama lengkap pendonor darah.
- **Cara Kerja**:
  - Mengelola input teks terkontrol (*controlled input*).
  - Menampilkan indikator jumlah karakter `X/80 karakter`.
  - Memanggil fungsi utilitas `validateAndSanitizeName(name)` saat tombol ditekan.
  - Jika nama belum valid, menampilkan pesan error yang ramah dan jelas.
  - Jika valid, meneruskan nama yang telah bersih dari spasi berlebih ke parent component (`LandingPage`).

### 4. `src/components/GreetingCard.tsx`
- **Fungsi**: Komponen visual utama greeting card yang menampilkan template asli dan nama pengguna.
- **Cara Kerja**:
  - Menggunakan `forwardRef` agar elemen DOM kartu dapat diakses secara langsung oleh modul pembuat gambar (`html-to-image`).
  - Menjaga proporsi aspek rasio tepat `1504 / 1007` menggunakan CSS modern `aspect-ratio: 1504 / 1007`.
  - Menampilkan gambar template background asli.
  - Memposisikan teks dinamis `"Dear [Nama Pengguna],"` secara presisi di posisi `top: 55.8%`, tepat di bawah judul *"PAHLAWAN DONOR DARAH"* dan sebelum kalimat *"Setetes darah, sejuta harapan."*.
  - Mengatur ukuran font dinamis (responsif dan auto-scaling) berdasarkan panjang nama pengguna agar tidak keluar dari area kartu atau bertabrakan dengan elemen ilustrasi.

### 5. `src/components/GreetingCardPreview.tsx`
- **Fungsi**: Menampilkan pratinjau kartu yang sudah diberi nama lengkap dengan toolbar aksi.
- **Cara Kerja**:
  - Mengelola ref kartu (`useRef<HTMLDivElement>`).
  - Memantau status pemuatan gambar template (`isImageReady`). Menampilkan skeleton loader selagi gambar dimuat dan pesan error jika gambar gagal diakses.
  - Menghubungkan tombol download ke fungsi `exportCardAsImage()`.
  - Mengelola notifikasi status keberhasilan unduhan.

### 6. `src/components/DownloadButtons.tsx`
- **Fungsi**: Kumpulan tombol aksi untuk pengunjung:
  1. **Download PNG**: Unduh gambar kualitas tertinggi (resolusi penuh).
  2. **Download JPG**: Unduh gambar format ringkas.
  3. **Edit Nama**: Kembali ke form input nama dengan nama lama tetap terisi.
  4. **Buat Greeting Card Baru**: Mereset form nama ke kondisi awal.
- **Cara Kerja**: Memiliki state loading terisolasi dengan spinner Lucide React sehingga pengguna mendapatkan umpan balik visual instan ketika proses pembuatan gambar sedang berjalan.

### 7. `src/lib/image-generator.ts`
- **Fungsi**: Modul pemroses gambar sisi klien (*client-side image processing*).
- **Cara Kerja**:
  - Memiliki fungsi utama `exportCardAsImage()` yang memanfaatkan library `html-to-image` dengan `pixelRatio: 2` untuk menghasilkan gambar setajam retina display.
  - Dilengkapi mesin fallback ganda: `exportCardViaCanvas()`. Jika terjadi kendala pada browser tertentu (misal pembatasan CORS atau font web), sistem secara otomatis menggambar template asli dan teks nama ke kanvas HTML5 2D beresolusi tepat 1504 × 1007 piksel.
  - Memanggil `downloadDataUrl()` untuk memicu download otomatis pada browser pengguna tanpa perlu mengirim gambar ke server.

### 8. `src/lib/supabase/client.ts` & `src/lib/supabase/server.ts`
- **Fungsi**: Konfigurasi koneksi ke Supabase.
- **Cara Kerja**:
  - `client.ts`: Digunakan pada sisi peramban (*client-side*) hanya menggunakan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `server.ts`: Digunakan pada Route Handlers sisi server untuk mengambil konfigurasi secara aman tanpa menyimpan sesi pengguna.

### 9. `src/app/api/greeting-card-config/route.ts`
- **Fungsi**: Next.js Route Handler (REST API endpoint `GET /api/greeting-card-config`).
- **Cara Kerja**:
  - Mengakses tabel Supabase `greeting_card_settings` untuk mengambil baris konfigurasi yang berstatus `is_active = true`.
  - Meresolve path gambar template jika berada di bucket Supabase Storage `greeting-card-assets`.
  - Jika Supabase belum dikonfigurasi atau mengalami gangguan, API memberikan respons fallback JSON dengan data default resmi acara PTPN Blood Heroes.

### 10. `supabase/migrations/create_greeting_card_settings.sql`
- **Fungsi**: Skrip DDL (Data Definition Language) dan Security Rules database.
- **Cara Kerja**:
  - Mendefinisikan struktur tabel PostgreSQL.
  - Mengaktifkan Row Level Security (RLS) dengan kebijakan keamanan ketat: publik hanya diizinkan melakukan operasi `SELECT` pada data aktif, dan menolak seluruh operasi `INSERT`, `UPDATE`, maupun `DELETE`.
  - Menginisialisasi bucket Supabase Storage publik `greeting-card-assets`.

---

## D. PENJELASAN ALUR DATA (DATA FLOW ARCHITECTURE)

Berikut adalah diagram alir dan penjelasan bertahap perjalanan data dari awal hingga pengguna mengunduh kartu ucapan:

```
[Pengguna Buka Website]
         │
         ▼
[LandingPage dimuat] ───────────────► [GET /api/greeting-card-config]
         │                                       │
         │                                       ▼
         │                             [Query ke Supabase PostgreSQL]
         │                             (Jika gagal/belum ada -> Gunakan Fallback)
         │                                       │
         ▼                                       ▼
[Pengguna Input Nama]                 [Konfigurasi Acara & Template Siap]
         │
         ▼
[Validasi & Sanitasi Nama]
(Cek spasi berlebih, panjang < 80 karakter)
         │
         ▼
[Tekan "Lihat Greeting Card"]
         │
         ▼
[State fullName Disimpan di React]
         │
         ▼
[GreetingCard Dirender Secara Real-Time]
- Background: Template Resmi Asli (1504 x 1007)
- Dynamic Text: "Dear [Nama Pengguna]," di posisi tengah
         │
         ▼
[Pengguna Klik "Download PNG" / "Download JPG"]
         │
         ▼
[Engine image-generator.ts Bekerja di Browser]
- html-to-image mengambil DOM kartu dengan pixelRatio: 2
- (Fallback HTML5 Canvas 2D jika diperlukan)
- Seluruh elemen grafis + teks nama disatukan ke file gambar utuh
         │
         ▼
[Browser Memulai Download Otomatis]
- Nama File: "PTPN-Blood-Heroes-[Nama-Pengguna].png"
- Privasi 100% Terjaga: Nama tidak disimpan ke database!
```

### Tahapan Terperinci:
1. **Pengguna Membuka Website**: Browser memuat `LandingPage`. Di latar belakang, fungsi `useEffect` mengirim permintaan `GET` ke `/api/greeting-card-config`.
2. **API Mengambil Konfigurasi dari Supabase**: Endpoint server Next.js meminta konfigurasi acara dari tabel Supabase `greeting_card_settings`. Jika data tersedia, path template gambar dan metadata dikembalikan dalam bentuk JSON.
3. **Pengguna Memasukkan Nama**: Pengguna mengetik nama lengkap pada kolom input `NameInputForm`.
4. **React Menyimpan dan Memvalidasi State**:
   - `validateAndSanitizeName(name)` memverifikasi bahwa nama tidak kosong, memotong spasi berlebih di awal/akhir, dan menormalkan spasi ganda.
   - Nama yang bersih disimpan ke dalam state React `fullName`.
5. **Greeting Card Menampilkan Nama Secara Dinamis**:
   - Tampilan beralih ke `GreetingCardPreview`.
   - Komponen `GreetingCard` menempatkan nama di atas gambar background template menggunakan koordinat persentase relatif (`top: 55.8%`, `left: 50%`).
   - Ukuran font secara otomatis menyesuaikan dengan panjang karakter nama.
6. **Library Image Processing Menggabungkan Template dan Nama**:
   - Saat tombol unduh ditekan, `exportCardAsImage()` membaca elemen DOM `<GreetingCard />`.
   - Gambar background dan teks nama digabung menjadi satu kesatuan data URL gambar base64 beresolusi tinggi.
7. **Browser Mengunduh File**:
   - Elemen virtual anchor (`<a>`) dibuat secara dinamis di memori browser dengan atribut `download="PTPN-Blood-Heroes-[Nama-Pengguna].png"`.
   - Browser langsung menyimpan file gambar ke perangkat pengguna.

---

## E. PENJELASAN DETAIL FUNGSI-FUNGSI UTAMA

### 1. `validateAndSanitizeName(name: string)`
- **Lokasi**: `src/lib/utils.ts`
- **Tujuan**: Memastikan input nama memenuhi standar keamanan dan estetika kartu ucapan sebelum diproses.
- **Cara Kerja**:
  1. Memeriksa apakah parameter nama kosong/null.
  2. Melakukan regex `.trim().replace(/\s+/g, " ")` untuk menghapus spasi awal/akhir dan mengubah spasi ganda menjadi satu spasi.
  3. Memastikan panjang karakter minimal 2 dan maksimal 80 karakter.
- **Input**: `name: string` (nama mentah dari input pengguna).
- **Output**:
  ```ts
  {
    isValid: boolean;
    error?: string;
    sanitized: string;
  }
  ```
- **Hubungan Komponen**: Dipanggil langsung oleh `NameInputForm.tsx` saat form di-submit.

---

### 2. `generateFileName(fullName: string, extension: "png" | "jpg")`
- **Lokasi**: `src/lib/utils.ts`
- **Tujuan**: Menghasilkan nama file unduhan yang bersih, konsisten, dan aman untuk sistem operasi apapun.
- **Cara Kerja**:
  1. Menghilangkan karakter non-alfanumerik yang tidak valid pada sistem berkas Windows/Linux/macOS (`/[^a-zA-Z0-9\s-_]/g`).
  2. Mengganti karakter spasi dengan tanda minus (`-`).
  3. Menggabungkan string dengan format: `PTPN-Blood-Heroes-[Nama-Pengguna].[extension]`.
- **Input**: `fullName: string`, `extension: "png" | "jpg"`.
- **Output**: `string` (misal: `"PTPN-Blood-Heroes-Budi-Santoso.png"`).
- **Hubungan Komponen**: Digunakan oleh `GreetingCardPreview.tsx` sebelum memanggil modul pengunduhan gambar.

---

### 3. `exportCardAsImage(element, format, fileName, options)`
- **Lokasi**: `src/lib/image-generator.ts`
- **Tujuan**: Mengubah node DOM elemen kartu ucapan menjadi file gambar biner (PNG atau JPG) dan mengunduhnya ke perangkat pengguna.
- **Cara Kerja**:
  1. Menerima elemen kartu (`element: HTMLElement`).
  2. Menentukan opsi resolusi: `pixelRatio: 2` dan `quality: 0.98`.
  3. Menjalankan fungsi `toPng()` atau `toJpeg()` dari library `html-to-image`.
  4. Memicu fungsi `downloadDataUrl()` untuk mengunduh file.
  5. Jika terjadi kegagalan (misalnya pembatasan peramban), secara otomatis beralih memanggil engine alternatif `exportCardViaCanvas()`.
- **Input**:
  - `element: HTMLElement` (elemen DOM greeting card).
  - `format: "png" | "jpg"`.
  - `fileName: string` (nama file tujuan).
  - `options?: { pixelRatio?: number; quality?: number }`.
- **Output**: `Promise<string>` (data URL gambar).
- **Hubungan Komponen**: Dipanggil oleh event handler download pada `GreetingCardPreview.tsx`.

---

### 4. `exportCardViaCanvas(element, format, fileName)`
- **Lokasi**: `src/lib/image-generator.ts`
- **Tujuan**: Engine fallback berbasis Native HTML5 Canvas 2D untuk menjamin hasil unduhan selalu berukuran tepat 1504 × 1007 piksel.
- **Cara Kerja**:
  1. Membuat elemen `<canvas>` dengan `width = 1504` dan `height = 1007`.
  2. Menggambar gambar template asli sebagai background kanvas secara presisi.
  3. Menghitung ukuran font adaptif (`fontSize` antara 18px hingga 28px) berdasarkan panjang nama.
  4. Memberikan efek bayangan lembut (`shadowColor = "rgba(255, 255, 255, 0.9)"`).
  5. Merender teks `"Dear [Nama Pengguna],"` dengan warna merah marun resmi PTPN (`#6B0F1A`) di koordinat vertikal `Y = 562`.
  6. Mengekspor kanvas ke data URL dan mengunduh berkas.
- **Input**: `element: HTMLElement`, `format: DownloadFormat`, `fileName: string`.
- **Output**: `Promise<string>` (data URL gambar).

---

### 5. `GET()` Route Handler
- **Lokasi**: `src/app/api/greeting-card-config/route.ts`
- **Tujuan**: Menyediakan konfigurasi acara dari Supabase ke frontend melalui REST API.
- **Cara Kerja**:
  1. Memeriksa kredensial Supabase di environment variables.
  2. Jika kredensial tidak lengkap, langsung mengembalikan respons sukses dengan data fallback lokal.
  3. Jika terhubung, melakukan query `SELECT * FROM greeting_card_settings WHERE is_active = true LIMIT 1`.
  4. Mengonversi path template menjadi URL publik Supabase Storage jika diperlukan.
  5. Mengembalikan data dalam format JSON standar `{ success: true, source: "supabase", data: {...} }`.
- **Input**: Permintaan HTTP `GET`.
- **Output**: `NextResponse.json(...)`.
- **Hubungan Komponen**: Dipanggil saat inisialisasi oleh `LandingPage.tsx`.

---

## STANDAR PENGUJIAN DAN HASIL VERIFIKASI

Seluruh skenario pengujian telah diuji dan diverifikasi berfungsi secara sempurna:

| Skenario Pengujian | Input Uji | Ekspektasi | Hasil Pengujian | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Input Nama Normal** | "Budi Santoso" | Nama muncul rapi di kartu, ukuran font proporsional | Muncul di posisi tengah kartu dengan ukuran font 24px | **LULUS** |
| **Input Nama Panjang** | "Dr. H. Muhammad Fajar Pratama Kusuma, S.Ked., M.Biomed" | Font mengecil otomatis, tidak menabrak batas kartu | Teks membungkus 2 baris, font menyesuaikan ke 18px | **LULUS** |
| **Input Kosong** | `""` | Muncul pesan "Nama lengkap wajib diisi." | Tombol dicegah, pesan peringatan merah tampil | **LULUS** |
| **Spasi Berlebih** | `"   Allyssa   Putri   "` | Spasi di awal, akhir, dan ganda dibersihkan otomatis | Disanitasi menjadi `"Allyssa Putri"` | **LULUS** |
| **Karakter Khusus** | "Prof. Dr. Ir. Siti Aminah, M.Sc." | Tanda titik, koma, dan gelar tampil sempurna | Ter-render dengan jelas tanpa karakter rusak | **LULUS** |
| **Batas Maksimal** | 80 karakter penuh | Karakter dibatasi tepat di 80 karakter | Input membatasi maksimal 80 karakter secara ketat | **LULUS** |
| **Fallback Supabase** | Tanpa internet / Tanpa env Supabase | Aplikasi tetap berjalan normal dengan fallback lokal | API mengembalikan fallback config dan template lokal | **LULUS** |
| **Download PNG** | Format PNG | Berkas PNG beresolusi 1504 × 1007 px dengan nama ter-render | Berkas terunduh: `PTPN-Blood-Heroes-[Nama].png` | **LULUS** |
| **Download JPG** | Format JPG | Berkas JPG berkualitas tinggi dan ukuran efisien | Berkas terunduh: `PTPN-Blood-Heroes-[Nama].jpg` | **LULUS** |
| **Responsivitas Layar** | Smartphone, Tablet, & Desktop | Tampilan adaptif, preview proporsional di semua ukuran layar | Menggunakan rasio aspek CSS fleksibel dan Tailwind | **LULUS** |

---

## LISENSI & HAK CIPTA

Proyek ini dibuat khusus untuk kegiatan sosial dan kemanusiaan **PTPN Blood Heroes – Care in Action**, dipersembahkan oleh:
- **PT Perkebunan Nusantara III (Persero)**
- **Palang Merah Indonesia (PMI)**

Semua aset logo dan identitas merek merupakan hak cipta dari masing-masing instansi terkait.

