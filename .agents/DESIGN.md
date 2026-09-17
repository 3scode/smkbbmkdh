# DESIGN.md — SMK Bangun Bangsa Mandiri (BBM) Kandanghaur — Website Landing

> **Project:** Website Landing SMK BBM Kandanghaur (SMKS Bangun Bangsa Mandiri)
> **Alamat:** Jl. PU Kemped No.212, Kandanghaur, Indramayu 45254 — NPSN 20233754 — Swasta
> **Platform:** Web Responsive (mobile-first, HP + Desktop)
> **Style:** Modern & Clean
> **Mode:** Light
> **Tanggal:** 2026-09-16
> **Output skill:** create-design Bagian 1-4 (tanpa Stitch prompt sesuai request user)

---

## Hasil Riset (FASE 1 - Ringkasan)

**Target pengguna:**
1. Calon siswa lulusan SMP/MTs di Kec. Kandanghaur, Gabuswetan, Kroya (usia 13-15) + orang tua
2. Siswa aktif & alumni (info, galeri, lowongan)
3. DUDI / mitra industri + instansi (kerjasama, penyerapan lulusan)

**Fitur umum landing SMK (dari riset SMK Muhammadiyah Kandanghaur, SMKN 1 Kandanghaur, SMK Prestasi Prima, SMA Pradita):**
- Hero + CTA SPMB/PPDB + statistik (siswa, jurusan, akreditasi)
- Profil + Visi Misi Tujuan
- Program Keahlian / Konsentrasi Keahlian
- Fasilitas (lab, bengkel, perpus, masjid, lapangan)
- Berita, Pengumuman, Agenda
- Alur PPDB + formulir + kontak WA
- Galeri, Ekstrakurikuler, Testimoni alumni, Mitra DUDI, Kontak & Lokasi

**Kompetitor lokal:**
- SMKN 1 Kandanghaur (Negeri, Akreditasi A) — value: gratis/murah + fasilitas negara
- SMK Muhammadiyah Kandanghaur (Swasta A, Pusat Keunggulan, 1500+ siswa, 6 jurusan, Islami) — value: skala besar + brand Muhammadiyah

**Unique Value Proposition (UVP) SMK BBM Kandanghaur:**
> **"Mandiri Berahlak, Terampil Berwirausaha — Sekolah Terjangkau untuk Pasar Kerja Lokal & Global."**
> Diferensiasi: 1) Keimanan & Ahlak Mulia sebagai fondasi, 2) Keterampilan kejuruan + kewirausahaan + kepemimpinan + longlife education, 3) Bahasa Inggris + bahasa asing sebagai nilai tambah global, 4) Pengawalan bakat seni & olahraga sampai profesional, 5) Kemitraan DUDI untuk penyerapan lulusan, 6) Biaya terjangkau sesuai SNP. UVP ini jadi acuan seluruh Bagian 1-4.

---

## BAGIAN 1: Design System

### Design Style
- **Style:** Modern & Clean — tipografi rapi, white space lega, elemen minimalis, kesan Islami-profesional-terjangkau
- **Platform:** Web Responsive (mobile-first)
- **Mode:** Light
- **Unique Value Proposition:** Mandiri Berahlak, Terampil Berwirausaha (lihat di atas)
- **Mood:** Trustworthy, bersih, ramah orang tua, energik untuk remaja, aksen hijau emerald (Islami + tumbuh) + amber (semangat wirausaha) + slate navy (profesional)

### Color Palette — Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0E7C5B` | Brand utama, CTA, navbar active, heading aksen |
| `--color-primary-hover` | `#0A5F46` | Hover primary button / link |
| `--color-primary-soft` | `#E6F4EE` | Background section highlight, badge soft |
| `--color-secondary` | `#F59E0B` | Aksen wirausaha, CTA sekunder, ikon statistik, underline heading |
| `--color-secondary-hover` | `#D97706` | Hover secondary |
| `--color-surface` | `#FFFFFF` | Card / container bg |
| `--color-background` | `#F8FAFC` | Page background |
| `--color-background-alt` | `#EFF6F3` | Section selang-seling (profil/PPDB) |
| `--color-text-primary` | `#0F172A` | Main text, heading |
| `--color-text-secondary` | `#64748B` | Muted text, meta, caption |
| `--color-border` | `#E2E8F0` | Dividers, card border, input border |
| `--color-success` | `#16A34A` | Success state, status buka PPDB, akreditasi |
| `--color-error` | `#DC2626` | Error state, validasi form |
| `--color-info` | `#0284C7` | Info, link, pengumuman |
| `--color-warning-bg` | `#FEF3C7` | Background peringatan / info PPDB gelombang |

> Kontras: text-primary `#0F172A` on `#FFFFFF` = 15.6:1 ✅, text-secondary `#64748B` on `#FFFFFF` = 4.76:1 ✅ (AA), primary `#0E7C5B` on white = 4.9:1 ✅ untuk button dengan teks putih `#FFFFFF` on `#0E7C5B` = 5.1:1 ✅. Secondary `#F59E0B` hanya untuk aksen/gambar, teks di atasnya pakai `#0F172A`.

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| Font Family | `Plus Jakarta Sans, Inter, System UI, sans-serif` | Seluruh web, mendukung Bahasa Indonesia, modern |
| `--font-h1` | 40px / 700 / 1.15, mobile 30px | Hero title landing |
| `--font-h2` | 30px / 700 / 1.25, mobile 24px | Section title (Visi Misi, Jurusan, dst) |
| `--font-h3` | 20px / 600 / 1.4 | Card title, nama jurusan/berita |
| `--font-body` | 16px / 400 / 1.7 | Body text, deskripsi visi misi |
| `--font-caption` | 13px / 400 / 1.5 | Labels, meta tanggal, footer, helper |
| `--font-button` | 15px / 600 / 1.5, letter-spacing 0.2px | Button text, nav link |

### Spacing (4px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Gap ikon-teks, chip padding |
| `--space-sm` | 8px | Gap antar badge, form field gap kecil |
| `--space-md` | 16px | Padding card mobile, gap grid |
| `--space-lg` | 24px | Padding section mobile, gap antar card |
| `--space-xl` | 32px | Padding section desktop, margin antar section |
| `--space-2xl` | 48px | Hero padding desktop, section spacing besar |
| `--space-3xl` | 80px | Jarak antar section besar desktop (ekstra) |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Input fields, badge kecil |
| `--radius-md` | 12px | Cards jurusan/berita, tombol |
| `--radius-lg` | 20px | Hero image, modal PPDB, galeri feature |
| `--radius-full` | 999px | Chips, avatar, tombol pill WA, step indicator |

### Elevation / Shadow

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,0.06)` | Cards raised ringan |
| `--shadow-md` | `0 4px 16px rgba(15,23,42,0.10)` | Dropdown navbar, sticky header, hover card |
| `--shadow-lg` | `0 12px 40px rgba(14,124,91,0.16)` | Modal, hero floating card, CTA PPDB |

### Icon Style
- **Style:** Outline, 1.8px stroke, rounded linecap
- **Library:** Lucide (School, BookOpenCheck, Wrench, Globe, Mosque→Landmark, Trophy, Briefcase, Phone, MapPin, Megaphone)
- **Size:** 20px default, 24px section icon, 16px inline/meta
- **Warna:** primary `#0E7C5B` untuk fitur, secondary `#F59E0B` untuk highlight, slate untuk netral
- **Skeleton loading style:** Shimmer gradient `#EFF2F5 → #E2E8F0 → #EFF2F5`, animasi 1500ms linear loop, radius mengikuti komponen (text=4px line, image=`--radius-md`, avatar=`--radius-full`), pulse fallback jika prefers-reduced-motion

---

## BAGIAN 2: Screen Map & User Flow

### Information Architecture / Sitemap

```
[Depth 0] / Home (Landing satu halaman + anchor + sub-page)
├── [Depth 1] /profil — Profil, Sejarah, Visi Misi Tujuan
│   └── [Depth 2] /profil#visi, #misi, #tujuan (anchor tab)
├── [Depth 1] /jurusan — Program Keahlian
│   └── [Depth 2] /jurusan/[slug] — Detail jurusan (prospek kerja, kurikulum)
├── [Depth 1] /fasilitas — Lab, Bengkel, Sarana
├── [Depth 1] /berita — Berita, Pengumuman, Agenda
│   └── [Depth 2] /berita/[slug] — Detail artikel
├── [Depth 1] /ppdb — Info PPDB, Gelombang, Biaya, Formulir, FAQ
├── [Depth 1] /galeri — Galeri, Ekstrakurikuler, Prestasi
└── [Depth 1] /kontak — Kontak, Peta, WA, Form pesan
```

**Navigasi Depth:** Maksimal 2 level (L0 Home → L1 Section/Page → L2 Detail). Lebih dalam pakai tab/accordion, bukan halaman baru.
**Breadcrumb:** Ada untuk L2 saja — format `Beranda / Jurusan / [Nama Jurusan]`, `Beranda / Berita / [Judul]`
**Nesting Rules:** Maks 2 klik dari Home ke CTA PPDB; Visi/Misi/Tujuan pakai tab dalam 1 page, tidak dipecah jadi 3 page.

### Screen Inventory

| # | Screen | Route/Page | Module | Depth |
|---|--------|-----------|--------|-------|
| 01 | Home / Hero + Ringkasan | `/` | Landing | L0 |
| 02 | Profil + Visi Misi Tujuan | `/profil` | Profil | L1 |
| 03 | Program Keahlian | `/jurusan` | Akademik | L1 |
| 04 | Fasilitas | `/fasilitas` | Sarana | L1 |
| 05 | Berita & Pengumuman | `/berita` | Informasi | L1 |
| 06 | PPDB / Pendaftaran | `/ppdb` | Admisi | L1 |
| 07 | Galeri & Ekstrakurikuler | `/galeri` | Kesiswaan | L1 |
| 08 | Kontak | `/kontak` | Kontak | L1 |

Detail pages (`/jurusan/[slug]`, `/berita/[slug]`) adalah varian dari Screen 03 & 05, bukan screen baru — spec mengikuti parent + breadcrumb + related content.

### User Flow Diagram

```
        ┌─────────────┐
        │ 01 Home /   │◄──────────────────┐
        │ Hero + CTA  │                   │
        └──────┬──────┘                   │
     ┌─────────┼────────────┬─────────┐   │
     ▼         ▼            ▼         ▼   │ Back/Home
[02 Profil] [03 Jurusan] [05 Berita] [06 PPDB]─┐
  Visi/Misi │ Fasilitas↓      │        │ Form│
  Tujuan    └─→[04 Fasilitas]─┘        │ FAQ ├─→ Success + WA
            └─→[07 Galeri]────────────┘     │
            └─→[08 Kontak]──────────────────┘
```

**Flow Legend:**
- `→` Primary navigation (navbar, CTA)
- `⇢` Alternative path (card click, related link, footer)
- `←` Back navigation (breadcrumb, back button, logo)

### Main Flows

**Flow 1: Calon Siswa Daftar PPDB (primary conversion)**
1. `01 Home` → user lihat hero (headline Mandiri Berahlak + stats + CTA "Daftar PPDB" `--color-primary`)
2. `03 Jurusan` ⇢ user klik card jurusan → baca prospek kerja & biaya → klik "Daftar Jurusan Ini"
3. `06 PPDB` → user baca gelombang/biaya/syarat → isi form (nama, asal SMP, jurusan, WA) → validasi inline
4. Success state → nomor pendaftaran + tombol WA konfirmasi + info daftar ulang → `08 Kontak` jika perlu datang (peta Kemped No.212)

**Flow 2: Orang Tua Validasi Visi Misi & Kepercayaan**
1. `01 Home` → scroll ringkasan profil + testimoni alumni + mitra DUDI
2. `02 Profil` → baca Visi / Misi (7 poin) / Tujuan (7 poin) via tab → cek akreditasi, biaya terjangkau SNP
3. `04 Fasilitas` + `07 Galeri` → lihat lab/bengkel/masjid/lapangan + ekstrakurikuler seni & olahraga
4. `08 Kontak` → hubungi WA / lihat peta / kirim form pesan → atau lanjut Flow 1

### Responsive Behavior (global)
- **Mobile (<768px):** Single column stack, sticky bottom CTA "Daftar PPDB" + hamburger nav, hero 30px H1, card full-width, tab jadi accordion, tabel biaya jadi card list
- **Tablet (768-1024px):** 2-col grid jurusan/berita, side panel untuk pengumuman, navbar collapse sebagian, hero 2-col (teks + gambar)
- **Desktop (>1024px):** Full layout max-width 1200px centered, sticky top navbar + sidebar pengumuman, 3-4 col grid, hover states aktif, hero split + floating stats card `--shadow-lg`

---

## BAGIAN 3: Per-Screen Design

> Semua screen pakai token Bagian 1. Spacing section: mobile `48px`, desktop `80px`. Container `max-width 1200px`.

### Screen 01: Home / Hero + Ringkasan

**Purpose:** First impression + konversi ke PPDB + ringkasan seluruh sekolah dalam 1 scroll
**UVP Highlight:** Headline langsung tampilkan UVP "Mandiri Berahlak, Terampil Berwirausaha" + subheadline biaya terjangkau + pasar kerja lokal & global — ini yang bedakan dari SMKN (negeri) & SMK Muhammadiyah (skala besar).

**Route:** `/` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Topbar (info: telp, email, PPDB) │
│ Navbar: Logo BBM | Home Profil.. │ ← sticky
├──────────────────────────────────┤
│ HERO split:                      │
│ [H1 + sub + CTA Daftar + WA] [Foto sekolah + floating stats] │
│ Trust bar: Akreditasi | NPSN | Motto Mandiri │
├──────────────────────────────────┤
│ Stats band (siswa, guru, DUDI, % serapan) │
│ Ringkasan Profil + Visi snippet + link │
│ Jurusan unggulan (3-4 card preview) │
│ Kenapa BBM? (6 value cards: agama, vokasi, wirausaha, bahasa, seni-olahraga, DUDI)│
│ Fasilitas preview + Galeri preview │
│ Berita terbaru (3 card) + Pengumuman side │
│ Testimoni alumni carousel │
│ CTA PPDB besar + FAQ singkat │
├──────────────────────────────────┤
│ Footer (profil, link, kontak, peta mini) │
│ Floating WA button + sticky bottom CTA (mobile) │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Navbar | Top sticky | Logo, menu anchor + CTA PPDB |
| Button Primary/Secondary | Hero, CTA band | Daftar PPDB, Lihat Jurusan, WA |
| Stats Counter | Hero floating + band | Angka animasi count-up |
| Section Heading | Tiap section | Eyebrow + H2 + desc |
| Jurusan Card preview | Tengah | Foto + nama + prospek singkat |
| Berita Card preview | Bawah | Thumbnail + tanggal + judul |
| Testimoni Carousel | Bawah | Quote alumni + nama + kerja/kuliah |
| Footer | Bottom | 4 kolom + copyright |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Hero penuh, stats terisi, 3 berita tampil | Load sukses |
| **Empty** | Berita kosong → ilustrasi + "Belum ada berita" + CTA Lihat Arsip | API berita kosong |
| **Loading** | Skeleton hero + shimmer cards (lihat spec) | First fetch <2s |
| **Error** | Banner inline merah + Retry, hero statis tetap tampil (graceful) | API gagal / offline |
| **Success** | N/A di home (konversi di PPDB), tapi newsletter/toast "Pesan terkirim" | Form footer/contact mini sukses |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Hero H1 | Line x2 | 80%x28px, 60%x28px | Shimmer 1500ms |
| Hero CTA | Rect | 160x44px `--radius-md` | Shimmer |
| Hero image | Rect | 520x360px `--radius-lg` | Shimmer |
| Stats band | Rect x4 | 120x64px | Pulse |
| Jurusan cards | Rect image + 2 lines | 360x200 + lines | Shimmer |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| **Ilustrasi** | Outline megaphone / newspaper Lucide 96px, `--color-border` |
| **Ukuran** | 120x120px container soft `#EFF6F3` circle |
| **Title** | "Belum ada berita terbaru" |
| **Description** | "Ikuti info PPDB & kegiatan via WhatsApp sekolah agar tidak ketinggalan." maks 2 baris |
| **CTA** | Button Secondary "Hubungi via WA" |
| **Link** | "Lihat arsip berita →" ke `/berita` |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **API Failure** | Inline banner merah muda + icon + "Gagal memuat berita. Coba lagi." + Retry | Tap retry → refetch |
| **Network Offline** | Sticky toast abu + ilustrasi wifi-off, konten statis tetap bisa dibaca | Auto-retry saat online (navigator.onLine) |
| **404** | N/A home (hanya detail slug) | — |
| **500** | Section fallback: tampilkan konten statis cache terakhir | Retry / kontak |
| **Validation** | N/A (form di PPDB/Kontak) | — |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Hero H1 | Text | CMS `hero.title` | Maks 70 char, 2 baris + ellipsis |
| Stats angka | Number | CMS `stats.{siswa,guru,dudi,serapan}` | `1.200+`, `%` tanpa desimal, count-up 1200ms |
| Jurusan preview | Card | API `jurusan?limit=4` | Judul truncate 1 baris, desc 2 baris ellipsis |
| Berita tanggal | Date | API `berita.created_at` | "12 Jan 2026" id-ID |
| Testimoni | Quote | CMS `testimoni` | Nama + angkatan + status (Kerja di X / Kuliah di Y) |
| Gambar hero | Image | CMS `hero.image_url` | 16:10, lazy kecuali hero eager, alt wajib |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| CTA Daftar | Hover | Scale 1.02 + `--shadow-md` | 200ms | ease-out |
| CTA | Click | Scale 0.96 | 100ms | ease-in |
| Jurusan card | Hover (desktop) | Lift 4px + shadow-md | 250ms | ease-out |
| Stats | Masuk viewport | Count-up + fade-up | 1200ms | ease-out |
| Section | Scroll | Fade-up stagger 80ms | 500ms | ease-out |
| Navbar | Scroll >24px | Tambah shadow-sm + blur bg | 200ms | ease-out |
| WA float | Hover | Scale 1.08 + pulse ring | 300ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| CTA Daftar PPDB | Click | Navigate `/ppdb` |
| Card jurusan | Click | Navigate `/jurusan/[slug]` |
| Testimoni dots | Click/swipe | Geser carousel + active dot |
| WA float | Click | Open `wa.me` new tab |

#### Accessibility
- **Keyboard:** Skip-to-content link, tab order Hero CTA → nav → sections, focus-visible ring 2px `--color-primary`
- **ARIA:** `role=banner/main/contentinfo`, hero H1 satu saja, carousel `aria-roledescription`, alt semua gambar
- **Contrast:** Body `#0F172A` on `#F8FAFC` 14:1 ✅, button putih on primary 5.1:1 ✅
- **Touch:** CTA min 44x44px, jarak antar CTA 12px
- **SR:** Stats dibaca "1200 siswa aktif" bukan "1200+", dekorasi `aria-hidden`

#### Responsive Behavior
- **Mobile:** Hero stack (teks di atas, gambar bawah), stats 2x2 grid, jurusan 1-col, sticky bottom CTA PPDB, hamburger
- **Tablet:** Hero 2-col 55/45, jurusan 2-col, berita 2-col + pengumuman full-width di bawah
- **Desktop:** Hero split + floating stats, jurusan 4-col, berita 3-col + sidebar pengumuman sticky

---

### Screen 02: Profil + Visi Misi Tujuan

**Purpose:** Tampilkan identitas, sejarah, dan lengkap Visi + 7 Misi + 7 Tujuan dari user sebagai halaman kepercayaan utama
**UVP Highlight:** Satu-satunya screen yang memuat verbatim Visi/Misi/Tujuan — layout tab + timeline agar 14 poin panjang tetap mudah dibaca orang tua.

**Route:** `/profil` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Navbar (sama)                    │
│ Page header: Breadcrumb + H1 Profil + desc │
├──────────────────────────────────┤
│ [Sejarah + foto + badge NPSN]    │
│ [Tab: Visi | Misi (7) | Tujuan (7)] │
│  - Visi: quote card besar        │
│  - Misi: numbered list 7 + ikon  │
│  - Tujuan: checklist 7 + badge   │
│ [Nilai: Iman, Ilmu, Mandiri, Wirausaha] │
│ [Sambutan Kepsek + foto]         │
│ [CTA: Lihat Jurusan → / Daftar]  │
├──────────────────────────────────┤
│ Footer                           │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Breadcrumb | Header | Beranda / Profil |
| Tabs/Accordion | Center | Visi/Misi/Tujuan switcher |
| Value Card | Tengah | 4 nilai utama + ikon |
| Kepsek Card | Bawah | Foto + quote + nama |
| Button | CTA bawah | Navigasi lanjutan |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Tab Visi aktif, konten tampil | Normal |
| **Empty** | Jika CMS sejarah kosong → tampilkan fallback statis NPSN+alamat | Data kosong |
| **Loading** | Skeleton header + 3 tab shimmer | Fetch profil |
| **Error** | Inline error + konten statis visi (hardcoded) tetap tampil | API gagal |
| **Success** | N/A (read-only) | — |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Header H1 | Line | 60%x32px | Shimmer |
| Tab bar | Rect x3 | 120x40px pill | Shimmer |
| Misi list | Line x7 | 100%x20px + dot circle 32px | Pulse |
| Kepsek | Circle + lines | 120px + 2 lines | Shimmer |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| Ilustrasi | School icon 96px |
| Title | "Profil belum tersedia" |
| Description | "Data profil sedang diperbarui. Hubungi sekolah untuk info." |
| CTA | "Hubungi WA" |
| Link | Kembali ke Beranda |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| API Failure | Banner + Retry, visi fallback hardcoded tampil | Retry |
| Offline | Toast offline, konten cache tampil | Auto-retry |
| 404 | Jika slug salah → redirect `/profil` | Back home |
| 500 | Tampilkan statis + saran tunggu | Retry / kontak |
| Validation | N/A | — |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Visi text | Long text | CMS `profil.visi` | Verbatim user, quote style italic 18px, maks 500 char |
| Misi list | Ordered 1-7 | CMS `profil.misi[]` | Numbered circle primary, tiap item 1-2 kalimat |
| Tujuan list | Ordered 1-7 | CMS `profil.tujuan[]` | Checklist success icon |
| Sejarah | Rich text | CMS `profil.sejarah` | 2-3 paragraf, drop-cap tidak dipakai |
| Kepsek | Profile | CMS `kepsek.{nama,foto,sambutan}` | Foto 1:1 160px circle, sambutan 2 paragraf |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Tab switch | Click | Fade + slide-up konten 12px | 250ms | ease-out |
| Misi item | Scroll | Stagger fade-up 60ms | 400ms | ease-out |
| Number circle | Hover | Scale 1.05 bg soft | 200ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Tab Visi/Misi/Tujuan | Click | Active pill primary + konten ganti |
| CTA Jurusan | Click | Ke `/jurusan` |
| Share | Click | Copy link profil |

#### Accessibility
- Keyboard: Tab pakai arrow keys (roving tabindex), `role=tablist/tab/tabpanel`
- ARIA: `aria-selected`, `aria-controls`, heading hierarchy H1→H2→H3
- Contrast: Quote visi 16px+ agar lolos AA
- Touch: Tab min 44px height
- SR: "Misi 3 dari 7" dibacakan

#### Responsive Behavior
- Mobile: Tab jadi accordion vertikal (Visi terbuka default), misi 1-col
- Tablet: Tab horizontal scroll, misi 2-col
- Desktop: Tab centered pill + misi 2-col grid + sticky sub-nav

---

### Screen 03: Program Keahlian

**Purpose:** Tampilkan jurusan/konsentrasi keahlian + prospek kerja + link daftar per jurusan
**UVP Highlight:** Tiap card tekankan "siap kerja + wirausaha + bahasa Inggris" — bedakan dari kompetitor yang hanya tulis nama jurusan.

**Route:** `/jurusan`, detail `/jurusan/[slug]` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header: Breadcrumb + H1 + filter │
│ [Filter chips: Semua/Teknik/Bisnis/dll + search] │
├──────────────────────────────────┤
│ Grid cards: [Foto][Nama][Durasi 3th][Skill tags][Prospek][CTA Detail + Daftar] │
│ Detail (L2): hero jurusan + kurikulum + fasilitas + prospek + alumni + CTA │
│ Related: jurusan lain (3 card)   │
├──────────────────────────────────┤
│ Footer                           │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Filter Chips | Top | Kategori + search input |
| Jurusan Card | Grid | Reusable, foto + tags + CTA |
| Badge | Card | Durasi, akreditasi |
| Button | Card/detail | Detail & Daftar |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Grid 6-8 jurusan tampil | Load sukses |
| **Empty** | Ilustrasi wrench + "Jurusan tidak ditemukan" + Reset filter | Filter 0 hasil |
| **Loading** | Skeleton grid 6 cards shimmer | Fetch |
| **Error** | Banner + Retry, filter disabled | API gagal |
| **Success** | Filter applied → count "Menampilkan X jurusan" + toast | Filter/search |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Filter | Rect pills x4 | 100x32px full | Shimmer |
| Card image | Rect | 100%x180px top rounded | Shimmer |
| Card title/lines | Lines | 70%x20px + 2x100%x14px | Shimmer |
| Card CTA | Rect | 100%x40px | Pulse |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| Ilustrasi | Wrench + search icon 96px |
| Title | "Tidak ada jurusan yang cocok" |
| Description | "Coba kata kunci lain atau reset filter kategori." |
| CTA | "Reset filter" (secondary) |
| Link | "Tanya via WA →" |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| API Failure | Card area diganti banner + Retry | Retry |
| Offline | Toast + cache terakhir jika ada | Auto-retry |
| 404 detail | Ilustrasi + "Jurusan tidak ditemukan" + daftar jurusan lain | Back to `/jurusan` |
| 500 | Banner server + saran tunggu | Retry |
| Validation | Search min 2 char inline hint | Highlight input |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Nama jurusan | Text | API `jurusan.nama` | Title case, 1 baris ellipsis |
| Durasi | Badge | `durasi` | "3 Tahun" pill soft |
| Skills | Tags | `skills[]` | Maks 4 tags + "+n" |
| Prospek | List | `prospek[]` | 3 bullet + "Lihat detail" |
| Biaya | Currency | `biaya.masuk/spp` | "Rp 150rb/bln" IDR short |
| Foto | Image | `cover_url` | 16:9, lazy, alt nama jurusan |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Filter chip | Click | Pill fill primary + scale | 200ms | ease-out |
| Card | Hover | Lift + image zoom 1.05 | 250ms | ease-out |
| Search | Type | Debounce 300ms + spinner kecil | 300ms | linear |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Chip filter | Click | Grid filter animasi fade |
| Search | Input | Live filter |
| Card CTA | Click | Detail atau prefill PPDB `?jurusan=slug` |

#### Accessibility
- Keyboard: Filter chips focusable, `/` fokus ke search
- ARIA: `role=search`, `aria-live` untuk count hasil
- Contrast: Tag teks slate on soft bg AA
- Touch: Chip min 40px
- SR: Umumkan "Menampilkan 4 dari 6 jurusan"

#### Responsive Behavior
- Mobile: Filter horizontal scroll, grid 1-col, detail stack
- Tablet: Grid 2-col, filter wrap
- Desktop: Grid 3-col, detail 2-col (konten + sidebar CTA sticky)

---

### Screen 04: Fasilitas

**Purpose:** Buktikan klaim sarana (lab, bengkel, perpus, masjid, lapangan, kantin) dengan foto + deskripsi
**UVP Highlight:** Kelompokkan per pilar UVP: Iman (masjid), Ilmu/Vokasi (lab/bengkel), Raga/Seni (lapangan/aula) agar narasi konsisten.

**Route:** `/fasilitas` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header + kategori tabs           │
│ Featured: foto besar + desc      │
│ Grid fasilitas cards (foto, nama, kapasitas, status) │
│ Mini-map denah (opsional)        │
│ CTA PPDB                         │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Category Tabs | Top | Iman / Vokasi / Penunjang |
| Fasilitas Card | Grid | Foto + meta |
| Lightbox | Overlay | Zoom foto |
| CTA Band | Bottom | Kunjungan sekolah |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | 8-12 fasilitas tampil | Sukses |
| **Empty** | Ilustrasi + "Foto segera hadir" | Kategori kosong |
| **Loading** | Skeleton masonry shimmer | Fetch |
| **Error** | Banner + Retry | Gagal |
| **Success** | Lightbox terbuka + caption | Klik foto |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Featured | Rect | 100%x320px `--radius-lg` | Shimmer |
| Grid | Rect x6 | 100%x200px `--radius-md` | Shimmer |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| Ilustrasi | Building icon |
| Title | "Foto fasilitas menyusul" |
| Description | "Jadwalkan kunjungan langsung untuk lihat lab & bengkel." |
| CTA | "Jadwalkan via WA" |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| API Failure | Banner + Retry | Retry |
| Offline | Toast + teks list tanpa foto | Auto-retry |
| 404 | N/A | — |
| 500 | Fallback list teks | Retry |
| Image broken | Placeholder icon + alt | Lazy retry |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Nama | Text | `fasilitas.nama` | 1 baris |
| Kategori | Badge | `kategori` | Iman/Vokasi/Penunjang warna beda |
| Kapasitas | Meta | `kapasitas` | "40 PC", "2 lapangan" |
| Foto | Image | `foto_url[]` | 4:3, lightbox multi |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Card foto | Hover | Zoom 1.06 + overlay | 300ms | ease-out |
| Lightbox | Open/close | Fade + scale | 250/200ms | ease-out |
| Tab | Click | Underline slide | 200ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Foto | Click | Lightbox + prev/next + caption |
| Tab | Click | Filter grid |
| CTA kunjungan | Click | WA prefilled |

#### Accessibility
- Keyboard: Esc tutup lightbox, arrows navigasi foto, focus trap
- ARIA: `role=dialog aria-label`, alt deskriptif
- Contrast: Overlay caption putih on hitam 70%
- Touch: Swipe galeri, target 44px
- SR: "Foto 2 dari 8: Lab Komputer"

#### Responsive Behavior
- Mobile: 1-col + featured full, lightbox full-screen
- Tablet: 2-col
- Desktop: Featured 2-col + grid 3-col

---

### Screen 05: Berita & Pengumuman

**Purpose:** Info terkini, pengumuman PPDB, agenda — bukti sekolah hidup & transparan
**UVP Highlight:** Kategori label "Prestasi Seni/Olahraga", "Kerjasama DUDI", "Wirausaha" agar UVP terlihat di arsip.

**Route:** `/berita`, detail `/berita/[slug]` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header + search + kategori chips │
│ Featured article (besar)         │
│ Grid 3-col + sidebar pengumuman & agenda │
│ Pagination / Load more           │
│ Detail: hero + body + share + related │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Search + Chips | Top | Filter |
| Berita Card | Grid | Thumbnail + meta |
| Pengumuman List | Sidebar | Pin + tanggal |
| Pagination | Bottom | Numbered / Load more |
| Share buttons | Detail | WA/FB/copy |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Featured + 6 list + 3 pengumuman | Sukses |
| **Empty** | Ilustrasi koran + reset | 0 hasil / arsip kosong |
| **Loading** | Skeleton featured + 6 rows | Fetch |
| **Error** | Banner + Retry | Gagal |
| **Success** | Copy link toast "Tautan disalin" | Share |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Featured | Rect + lines | 100%x280px + 2 lines | Shimmer |
| List thumb | Rect | 120x90px | Shimmer |
| Sidebar | Lines x3 | 100%x16px | Pulse |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| Ilustrasi | Newspaper icon |
| Title | "Belum ada berita pada kategori ini" |
| Description | "Coba kategori lain atau lihat semua berita." |
| CTA | Reset |
| Link | Arsip |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| API Failure | Banner + Retry | Retry |
| Offline | Toast + cache | Auto-retry |
| 404 detail | "Artikel tidak ditemukan" + related | Back |
| 500 | Fallback + saran | Retry |
| Validation | Search kosong → hint | Inline |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Judul | Text | `berita.judul` | 2 baris ellipsis card, full di detail |
| Tanggal | Date | `published_at` | "12 Jan 2026 • 3 mnt baca" |
| Kategori | Badge | `kategori` | Warna per kategori |
| Isi | Rich text | `body` | H2/H3, list, image caption |
| Penulis | Meta | `author` | "Humas SMK BBM" + avatar initial |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Card | Hover | Lift + title underline | 200ms | ease-out |
| Load more | Click | Skeleton append + fade-in | 400ms | ease-out |
| Share | Click | Toast slide-in | 300ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Card | Click | Detail |
| Pengumuman pin | Click | Expand inline |
| Pagination | Click | Scroll top + fetch |

#### Accessibility
- Keyboard: Pagination focusable, skip list
- ARIA: `aria-live` count, `article` roles
- Contrast: Meta 13px `#64748B` on white AA (4.76:1) ✅
- Touch: Card full tap area 48px+
- SR: Baca kategori + tanggal sebelum judul

#### Responsive Behavior
- Mobile: Featured stack, sidebar jadi accordion di bawah grid, 1-col
- Tablet: 2-col + sidebar 2-col mini
- Desktop: 2/3 grid + 1/3 sidebar sticky

---

### Screen 06: PPDB / Pendaftaran

**Purpose:** Konversi utama — info gelombang, syarat, biaya, formulir, FAQ, konfirmasi WA
**UVP Highlight:** Badge "Biaya Terjangkau SNP" + "Beasiswa Tahfidz/Prestasi Seni-Olahraga" + "Gratis Bahasa Inggris intensif" di atas form.

**Route:** `/ppdb` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header: Status Buka (green dot) + countdown gelombang │
│ Steps: 1 Isi Form → 2 Verifikasi WA → 3 Daftar Ulang │
│ [Syarat + Berkas] [Biaya table] [Jadwal gelombang] │
│ Form: Nama, Asal SMP, Jurusan (prefill), No WA, Upload KK (opsional) + checkbox ortu │
│ FAQ accordion (biaya, seragam, beasiswa, antar-jemput) │
│ Success panel: No. pendaftaran + WA + unduh bukti │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Status Badge + Countdown | Top | Buka/Tutup + sisa hari |
| Steps Indicator | Top | 3 langkah |
| Pricing/Biaya Table | Tengah | Rincian transparan |
| Form Input + Select + Upload | Tengah | Validasi inline |
| FAQ Accordion | Bawah | 6-8 Q |
| Success Card | Pengganti form | Bukti + WA |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Form kosong + gelombang aktif | Normal |
| **Empty** | Gelombang tutup → form disabled + "Tunggu gelombang berikutnya" + notify WA | Status tutup |
| **Loading** | Skeleton form + submit spinner "Mengirim..." | Fetch info / submit |
| **Error** | Inline field merah + banner gagal + Retry | Validasi/API gagal |
| **Success** | Card hijau + nomor `PPDB-2026-XXXX` + tombol WA + unduh | Submit sukses |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Countdown | Rect x3 | 80x64px | Pulse |
| Biaya rows | Lines x4 | 100%x20px | Shimmer |
| Form fields | Rect x5 | 100%x48px `--radius-sm` | Shimmer |
| Submit | Rect | 100%x48px | Pulse |

#### Empty State Spec (Gelombang Tutup)
| Elemen | Deskripsi |
|--------|-----------|
| Ilustrasi | Calendar-clock icon |
| Title | "Pendaftaran gelombang ini ditutup" |
| Description | "Tinggalkan nomor WA untuk dihubungi saat gelombang berikutnya dibuka." |
| CTA | "Ingatkan Saya" (notify form 1 field) |
| Link | Lihat syarat sambil menunggu |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| Validation | Merah di bawah field + ikon + border merah, fokus ke field pertama error | Perbaiki → hijau |
| API Failure | Banner merah + "Gagal mengirim. Coba lagi." + data form tidak hilang | Retry (persist localStorage) |
| Offline | Disable submit + toast "Anda offline" + simpan draft | Auto-enable online |
| 404 | N/A | — |
| 500 | Banner + saran WA manual + tombol WA darurat | WA fallback |
| Upload gagal | Inline "File >2MB / format salah (JPG/PDF saja)" | Ganti file |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Nama | Text | form `nama` | Min 3 char, title case, regex huruf |
| Asal SMP | Text | `asal_sekolah` | Autocomplete datalist SMP Kandanghaur |
| Jurusan | Select | `jurusan_id` | Prefill dari `?jurusan=` |
| No WA | Phone | `wa` | `08xx`, auto-format `62`, validasi 10-14 digit |
| Tanggal lahir | Date | `tgl_lahir` | `DD MMM YYYY`, min usia 12 |
| Biaya | Currency | CMS `biaya` | `Rp 1.250.000` IDR full + cicilan note |
| No. pendaftaran | ID | API response | `PPDB-2026-XXXX` monospace + QR (opsional) |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Field focus | Focus | Border primary + ring soft + label float | 200ms | ease-out |
| Field error | Blur invalid | Shake 4px + merah | 300ms | ease-in-out |
| Submit | Click | Spinner + disabled + progress | hingga respons | linear |
| Success | Muncul | Confetti ringan + scale-in card | 500ms | ease-out |
| Countdown | Tiap detik | Flip angka (tanpa layout shift) | 300ms | linear |
| FAQ | Click | Expand height anim + rotate chevron | 250ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Jurusan select | Change | Update estimasi biaya + prospek mini |
| Upload KK | Drop/click | Preview + progress + hapus |
| Submit | Click | Validasi → loading → success |
| WA konfirmasi | Click | Pesan prefilled "Assalamualaikum, saya [nama] no [ID]..." |

#### Accessibility
- Keyboard: Tab order logis, Enter submit, Esc tutup success? tidak, focus ke success heading
- ARIA: `aria-required`, `aria-invalid`, `aria-describedby` error id, `role=alert` banner, `fieldset/legend` untuk grup
- Contrast: Error `#DC2626` on `#FEF2F2` + teks 14px bold ✅, label 15px
- Touch: Input height 48px, CTA 48px, jarak 16px
- SR: Umumkan error count "3 kolom perlu diperbaiki", success "Pendaftaran berhasil, nomor..."

#### Responsive Behavior
- Mobile: Steps vertikal compact, biaya table jadi stacked cards, form 1-col, sticky submit? tidak (hindari mis-tap), FAQ full
- Tablet: Form 2-col untuk nama/WA, biaya 2-col
- Desktop: 2-col (form kiri 7/12 + info biaya/FAQ kanan 5/12 sticky)

---

### Screen 07: Galeri & Ekstrakurikuler

**Purpose:** Tampilkan kehidupan sekolah: praktik, seni, olahraga, keagamaan — bukti "pengawalan potensi sampai profesional"
**UVP Highlight:** Filter "Seni", "Olahraga", "Keagamaan", "Praktik Kejuruan", "Wirausaha" sesuai Misi 5.

**Route:** `/galeri` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header + filter chips + tahun    │
│ Masonry grid foto/video (lazy)   │
│ Ekskul cards: Pramuka, Paskibra, Futsal, Hadroh, PMR, Kewirausahaan │
│ Prestasi timeline (juara, tahun) │
│ Lightbox + video modal           │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Filter Chips | Top | Kategori + tahun |
| Masonry Card | Grid | Foto + caption |
| Ekskul Card | Tengah | Ikon + jadwal + pembina |
| Timeline | Bawah | Prestasi |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | 12+ foto tampil | Sukses |
| **Empty** | Ilustrasi image + reset filter | 0 hasil |
| **Loading** | Skeleton masonry blurhash | Fetch |
| **Error** | Banner + Retry | Gagal |
| **Success** | Lightbox + caption + counter | Klik |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Masonry | Rect bervariasi | 300x200/300/250 | Shimmer |
| Ekskul | Rect x4 | 100%x120px | Pulse |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| Ilustrasi | Image icon |
| Title | "Belum ada foto kategori ini" |
| Description | "Coba tahun atau kategori lain." |
| CTA | Reset |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| API Failure | Banner + Retry | Retry |
| Offline | Toast + cache | Auto |
| Image 404 | Placeholder + alt | Skip |
| Video gagal | Thumbnail + "Video tidak dapat diputar" + coba lagi | Retry |
| 500 | Fallback teks | Kontak |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Caption | Text | `galeri.caption` | 1 baris ellipsis, full di lightbox |
| Tanggal | Date | `taken_at` | "Agu 2026" |
| Kategori | Badge | `kategori` | Warna konsisten fasilitas |
| Ekskul jadwal | Meta | `jadwal` | "Jumat 15.30 • Lapangan" |
| Prestasi | Timeline | `prestasi[]` | "Juara 2 Futsal Kab. 2025" + badge emas/perak |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Foto | Hover | Zoom + overlay caption slide-up | 300ms | ease-out |
| Filter | Click | Layout anim FLIP | 350ms | ease-in-out |
| Lightbox | Swipe | Follow finger | 200ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Foto | Click | Lightbox |
| Video | Click | Modal play |
| Filter | Click | Re-layout |

#### Accessibility
- Keyboard: Lightbox trap + Esc + arrows
- ARIA: `role=dialog`, alt bermakna bukan "IMG_123"
- Contrast: Caption overlay AA
- Touch: Swipe + pinch? cukup swipe
- SR: "Foto 5 dari 20: Praktik pengelasan..."

#### Responsive Behavior
- Mobile: Masonry 2-col kecil, ekskul 1-col, lightbox full
- Tablet: 3-col
- Desktop: 4-col + ekskul 3-col

---

### Screen 08: Kontak

**Purpose:** Hubungi sekolah: alamat Kemped No.212, telp/WA, email, jam, peta, form pesan
**UVP Highlight:** Info "Biaya terjangkau — tanya langsung Humas" + jam layanan ramah orang tua (08.00-15.00 + Sabtu setengah hari).

**Route:** `/kontak` **Access:** Public

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header H1 Kontak                 │
│ 2-col: [Info card: alamat, WA, email, jam, sosmed] [Map embed] │
│ Form: Nama, WA, Keperluan (PPDB/Biaya/Kerjasama), Pesan + kirim WA/email │
│ FAQ mini + CTA PPDB              │
└──────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Info Card | Kiri | List kontak + ikon + copy button |
| Map Embed | Kanan | Google Maps iframe + tombol rute |
| Form Pesan | Bawah | Sama seperti PPDB tapi bebas |
| Sosmed Row | Info | FB/IG/YT/TikTok |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Info + map + form tampil | Normal |
| **Empty** | N/A (statis selalu ada) | — |
| **Loading** | Skeleton map + form shimmer | Fetch info / submit |
| **Error** | Map gagal → static image + "Buka di Google Maps"; form gagal → banner + Retry | Offline/API |
| **Success** | Toast + form reset "Pesan terkirim, kami balas maks 1x24 jam" | Kirim sukses |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Info rows | Lines x4 | 100%x20px + icon circle | Shimmer |
| Map | Rect | 100%x320px `--radius-lg` | Pulse |
| Form | Rect x3 | 100%x48px + textarea 120px | Shimmer |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| N/A statis — jika sosmed kosong sembunyikan row, jangan tampilkan empty |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| Map offline | Placeholder + alamat teks + tombol rute | Buka Maps app |
| Form validation | Inline merah sama seperti PPDB | Perbaiki |
| API Failure | Banner + simpan draft + Retry | Retry |
| Offline | Disable + draft tersimpan | Auto-enable |
| 500 | WA fallback button | WA |

#### Data Format Per Screen
| Elemen | Type | Source | Format |
|--------|------|--------|--------|
| Alamat | Text | CMS statis | "Jl. PU Kemped No.212, Kandanghaur, Indramayu 45254" + copy |
| WA | Phone | CMS `kontak.wa` | `+62 8xx` + link `wa.me/62...` prefilled |
| Email | Email | `kontak.email` | Lowercase + mailto |
| Jam | Hours | `jam` | "Senin–Jumat 07.00–15.00, Sabtu 08.00–12.00" |
| Map | Embed | Google Maps `q=SMK BBM Kandanghaur` | iframe lazy, title="Peta SMK BBM" |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Copy alamat | Click | Icon jadi check + toast | 2000ms toast | ease-out |
| Map | Hover | Sedikit zoom control highlight | 200ms | ease-out |
| Submit | Click | Spinner → toast slide-in | 300ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Copy | Click | Toast tersalin |
| Rute | Click | Buka Google Maps |
| Kirim | Click | Validasi → kirim → reset |

#### Accessibility
- Keyboard: Map iframe `title`, skip map link "Lewati peta"
- ARIA: `address` tag, `aria-label` tiap tombol kontak
- Contrast: Link info underline + AA
- Touch: Nomor WA 48px tap
- SR: Baca alamat lengkap sekali jalan

#### Responsive Behavior
- Mobile: Stack info → map (300px) → form, tombol rute full-width
- Tablet: Info 2-col mini, map full
- Desktop: Info+map 2-col (5/7), form 2-col + info samping

---

## BAGIAN 4: Component Specs

> Semua pakai token Bagian 1. Hanya komponen dipakai ≥2 screen.

### Component: Button

**Usage:** 01,02,03,05,06,07,08 — CTA utama konversi
**Category:** Atom

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Primary | bg `--color-primary`, teks putih, `--radius-md`, shadow-sm | Daftar PPDB, Kirim, Simpan |
| Secondary | bg `--color-secondary`, teks `#0F172A` | Hubungi WA, Lihat Jurusan |
| Outline | border primary, teks primary, bg putih | Detail, Reset filter |
| Ghost | teks primary, tanpa bg/border | Linkaan, Batal, Lihat semua → |
| Danger | bg `--color-error`, teks putih | Hapus file upload, reset data |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal sesuai variant |
| Hover | Brighten/darken 8% + shadow-md + scale 1.02 (desktop) |
| Active/Pressed | Scale 0.96 + darken 12% |
| Disabled | Opacity 50%, cursor not-allowed, no shadow |
| Loading | Spinner 16px + teks "Memuat..." + disabled + lebar tetap (no layout shift) |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `primary\|secondary\|outline\|ghost\|danger` | `primary` | Visual style |
| `size` | `sm\|md\|lg` | `md` | sm 36px, md 44px, lg 52px height |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading spinner |
| `fullWidth` | `boolean` | `false` | 100% di mobile |
| `href` | `string` | — | Jika link, render `<a>` |
| `onClick` | `function` | — | Handler |
| `icon` | `node` | — | Lucide left/right |

#### Accessibility
- Keyboard: Enter/Space, focus ring 2px offset 2px primary
- ARIA: `aria-disabled`, `aria-busy` saat loading, `role=button` jika div (hindari)
- Focus: Visible selalu, kontras ring 3:1

### Component: Navbar + Topbar

**Usage:** Semua screen (01-08)
**Category:** Organism

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Desktop sticky | Logo kiri, menu center, CTA kanan, shadow-sm saat scroll | >1024px |
| Tablet collapsed | Logo + 4 menu utama + hamburger | 768-1024px |
| Mobile drawer | Hamburger → drawer kanan + backdrop + accordion sub | <768px |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Transparan di hero → putih blur saat scroll |
| Hover | Link underline amber 2px |
| Active | Link primary bold + dot |
| Disabled | N/A |
| Loading | N/A (statis), skeleton hanya first paint |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `links` | `array {label,href,children?}` | nav 8 screen | Menu |
| `cta` | `object` | PPDB button | CTA kanan |
| `sticky` | `boolean` | `true` | Sticky top |
| `announcement` | `string` | "PPDB Gel. X dibuka" | Topbar text |

#### Accessibility
- Keyboard: Esc tutup drawer, focus trap, tab urut
- ARIA: `role=navigation aria-label=Utama`, `aria-expanded` hamburger, `aria-current=page`
- Focus: Skip-to-content pertama

### Component: Section Heading

**Usage:** 01,03,04,05,07 — judul tiap section
**Category:** Molecule

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Center | Eyebrow pill + H2 center + desc center | Home, PPDB |
| Left | Eyebrow + H2 left + link kanan "Lihat semua" | Jurusan, Berita |
| Split | H2 kiri + desc kanan 2-col | Profil, Fasilitas |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Eyebrow amber + H2 slate |
| Hover | N/A |
| Active | N/A |
| Disabled | N/A |
| Loading | Skeleton: pill 80x24 + H2 40% + desc 60% shimmer |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `eyebrow` | `string` | — | Label kecil uppercase |
| `title` | `string` | — | H2 |
| `desc` | `string` | — | Maks 2 baris |
| `align` | `center\|left\|split` | `center` | Layout |
| `link` | `{label,href}` | — | Lihat semua |

#### Accessibility
- Heading hierarchy: H1 sekali per page, section pakai H2
- Eyebrow `aria-hidden` jika dekoratif duplikat

### Component: Card Jurusan / Berita (unified Card)

**Usage:** 01,03,05,07
**Category:** Molecule

#### Card Structure
```
┌────────────────────┐
│ [Image 16:9] [Badge]│
│ [Eyebrow/kategori] │
│ [Title 2-line]     │
│ [Desc 2-line]      │
│ [Meta: durasi/tgl] │
│ [Action: Detail →] │
└────────────────────┘
```

#### Card Variants
| Variant | Content | Use Case |
|---------|---------|----------|
| Default | Image + Title + Desc + Meta | Feed jurusan/berita |
| Compact | Title + Meta tanpa image | Sidebar pengumuman, related |
| Interactive | Full + CTA button + hover lift | Promo PPDB, unggulan |
| Horizontal | Thumb kiri 120px + teks kanan | Search result, mobile list |

#### States
| State | Visual Change |
|-------|--------------|
| Default | surface + border + shadow-sm |
| Hover | Lift 4px + shadow-md + image zoom |
| Active | Scale 0.98 |
| Disabled | Opacity 60% (arsip tutup) |
| Loading | Skeleton image + 2 lines shimmer |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default\|compact\|interactive\|horizontal` | `default` | Layout |
| `image` | `string` | — | URL + alt wajib |
| `badge` | `string` | — | Durasi/kategori |
| `title` | `string` | — | Ellipsis 2 baris |
| `meta` | `string` | — | Tanggal/durasi |
| `href` | `string` | — | Link detail |

#### Accessibility
- Whole card clickable via stretched-link, fokus satu saja (hindari nested)
- Alt bermakna, badge bukan satu-satunya info warna

### Component: Badge / Chip / Tag

**Usage:** 02,03,04,05,06,07
**Category:** Atom

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Success soft | bg `#DCFCE7` teks `#166534` | Buka, Akreditasi, Aktif |
| Primary soft | bg `#E6F4EE` teks `#0A5F46` | Kategori, Vokasi |
| Amber soft | bg `#FEF3C7` teks `#92400E` | Beasiswa, Wirausaha |
| Info soft | bg `#E0F2FE` teks `#0C4A6E` | Pengumuman |
| Outline | border slate teks slate | Filter inactive |
| Solid primary | bg primary teks putih | Filter active, count |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Pill full 13px medium |
| Hover | (filter saja) border primary |
| Active | Solid primary |
| Disabled | Opacity 50% |
| Loading | Skeleton pill shimmer |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tone` | `success\|primary\|amber\|info\|outline\|solid` | `primary` | Warna |
| `size` | `sm\|md` | `md` | Padding |
| `dot` | `boolean` | `false` | Dot status depan |

#### Accessibility
- Jangan sampaikan info hanya via warna (tambah teks/icon)
- Kontras teks soft ≥4.5:1

### Component: Form Input / Select / Textarea

**Usage:** 03 (search), 05 (search), 06 (PPDB), 08 (pesan)
**Category:** Molecule

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Text | 48px, border, radius-sm, placeholder slate | Nama, WA, search |
| Select | Sama + chevron + custom arrow | Jurusan, keperluan |
| Textarea | Min 120px auto-grow | Pesan, alamat |
| Upload | Dashed border + drag area + preview | KK/Akta (PPDB) |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Border `--color-border` bg white |
| Hover | Border slate-400 |
| Active/Focus | Border primary + ring `0 0 0 3px #E6F4EE` |
| Disabled | Bg slate-100 + muted |
| Loading | Spinner right + disabled |
| Error | Border error + bg `#FEF2F2` + pesan 13px error + icon |
| Success | Border success + check icon (setelah valid) |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label atas + required `*` |
| `hint` | `string` | — | Helper bawah |
| `error` | `string` | — | Pesan error + `aria-describedby` |
| `required` | `boolean` | `false` | Validasi |
| `disabled` | `boolean` | `false` | — |
| `prefix/suffix` | `node` | — | Ikon Rp / +62 / search |

#### Accessibility
- Label selalu `<label for>`, bukan placeholder saja
- `aria-invalid`, `aria-describedby`, error `role=alert` ringan
- Touch 48px, pesan error 13px+ tetap AA

### Component: Footer

**Usage:** Semua screen
**Category:** Organism

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Full | 4 col: Profil+NPSN, Menu, Jurusan, Kontak + peta mini + sosmed + copyright | Semua page desktop |
| Compact | 2 col + CTA WA (mobile stack) | <768px (otomatis responsive, bukan prop) |
| Minimal | Logo + copyright + 3 link (untuk halaman sukses/cetak bukti) | `/ppdb/sukses` print |

#### States
| State | Visual Change |
|-------|--------------|
| Default | bg `#0F172A` teks slate-300, heading putih |
| Hover | Link jadi putih + underline |
| Active | N/A |
| Disabled | N/A |
| Loading | N/A statis |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `full\|minimal` | `full` | Layout |
| `school` | `object` | BBM data | Nama, NPSN, alamat, kontak |
| `menus` | `array` | — | Link kolom |
| `socials` | `array` | — | FB/IG/YT/WA |

#### Accessibility
- `role=contentinfo`, heading footer H2 sr-only
- Kontras link slate-300 `#CBD5E1` on `#0F172A` 8:1 ✅
- Sosmed `aria-label="Instagram SMK BBM"`

---

## Validasi Checklist (pra-review)
- [x] Semua 8 screen Bagian 2 ada di Bagian 3
- [x] Setiap screen pakai color/typography/spacing Bagian 1
- [x] Setiap component ≥3 variants
- [x] Setiap screen ≥5 states
- [x] A11y + responsive + skeleton + error detail + data format + micro-interactions di tiap screen
- [x] Light mode lengkap (dark mode tidak diminta)
- [x] IA/sitemap depth konsisten maks L2
- [x] Stitch prompt di-skip sesuai pilihan user

---

*Siap dilanjut ke Mini PRD → Tech Spec → Implementasi. File ini acuan tunggal visual + UX.*
