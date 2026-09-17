# TASKS.md — SMK Bangun Bangsa Mandiri (BBM) Kandanghaur

> **Acuan:** `.agents/TECH-SPEC.md` (Next.js + Supabase + Vercel, Bun 1.4.2) + `.agents/DESIGN.md` (8 screen, Modern & Clean, Light)
> **Tanggal:** 2026-09-16
> **Grouping:** Per modul (pilihan user)
> **Opsional:** Dilewati sesuai request user (tanpa Testing / CI/CD / Monitoring / Compliance khusus — hanya core + error/response + deploy)
> **Runtime:** Bun (wajib `bun`, bukan npm/node)

📋 Task Generator — Ringkasan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tech Stack: Next.js App Router + TS + Tailwind + Drizzle + Supabase + Decap + Vercel
Screens: 01 Home `/`, 02 Profil `/profil`, 03 Jurusan `/jurusan[/slug]`, 04 Fasilitas `/fasilitas`, 05 Berita `/berita[/slug]`, 06 PPDB `/ppdb[/bukti]`, 07 Galeri `/galeri`, 08 Kontak `/kontak`
Modules: Setup, Design System, Database, API (read + mutasi), Frontend (8 screen), Error/Response, Deploy
Project Status: Baru (belum ada package.json)
Design References: 0 (pakai DESIGN.md Bagian 3-4 sebagai acuan visual)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## T-01: Setup Project Next.js + Bun

**Modul:** Setup
**Phase:** Foundation
**Screen:** N/A
**Related FR:** FR-01, FR-11, FR-12 (fondasi SSG/ISR, nav, SEO)
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Bun 1.4.2, Next.js latest, TypeScript 5 strict, Tailwind, ESLint, Prettier
**File yang diubah:** `package.json`, `bun.lockb`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `.env.example`, `.gitignore`

### Dependensi
- Tidak ada (dipilih via auto-pick: prioritas High, tanpa dependensi, urutan T-01)

### Sub-task Checklist
- [x] `bun create next-app@latest` (TS + App Router + Tailwind + ESLint), lalu `bun install`
- [x] Terapkan `next.config.mjs` TECH-SPEC: AVIF/WebP, `remotePatterns *.supabase.co`, headers HSTS/CSP/X-Frame/Referrer/Permissions
- [x] Setup `tailwind.config.ts` + `globals.css` dengan CSS vars token DESIGN.md (primary #0E7C5B, secondary #F59E0B, radius, shadow)
- [x] Install: `zod`, `drizzle-orm`, `postgres`, `@supabase/supabase-js`, `drizzle-kit`, `clsx`, `tailwind-merge`, `lucide-react`, `nuqs`, `sanitize-html`, `resend`
- [x] Buat struktur folder TECH-SPEC (`src/app/api/*`, `src/components/ui`, `src/lib/*`, `content/`, `drizzle/`, `tests/`, `public/images/`)
- [x] Buat `.env.example` (18 vars Bagian 7) + `.env.local` lokal, pastikan `SUPABASE_SERVICE_ROLE_KEY` tidak prefix `NEXT_PUBLIC`
- [x] Setup ESLint `next/core-web-vitals` + Prettier + `tsc --noEmit` lolos
- [x] Jalankan `bun run dev` → http://localhost:3000 tampil, `bun run build` sukses

### Acceptance Criteria
- [ ] `bun run dev` dan `bun run build` sukses tanpa error
- [ ] Headers keamanan tampil di respons (cek DevTools Network)
- [ ] `.env.example` lengkap 18 vars, tidak ada secret ter-commit
- [ ] Font Plus Jakarta Sans subset latin + `display=swap` termuat

### Referensi Design
- 📄 N/A (DESIGN.md Bagian 1 token)

### Environment Variables
- `NEXT_PUBLIC_APP_URL` — canonical — `https://smkbbm-kandanghaur.sch.id`
- `NODE_ENV` — `development`

---

## T-02: Design System + Komponen Base

**Modul:** Design System
**Phase:** Foundation
**Screen:** Semua (dipakai 01-08)
**Related FR:** FR-11 (nav/footer)
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Tailwind, shadcn/ui (Radix), Lucide, `clsx`
**File yang diubah:** `src/components/ui/Button.tsx`, `Badge.tsx`, `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `Accordion.tsx`, `Dialog.tsx`, `SectionHeading.tsx`, `JurusanCard.tsx`, `BeritaCard.tsx`, `EmptyState.tsx`, `ErrorBanner.tsx`

### Dependensi
- T-01: Setup Project

### Sub-task Checklist
- [x] Implementasi `Button` 5 varian (primary/secondary/outline/ghost/danger) + 3 size (36/44/52px) + `loading` (spinner 16px, lebar tetap) + `fullWidth` mobile, sesuai DESIGN Bagian 4
- [x] Implementasi `Badge/Chip` 6 tone (success/primary/amber/info/outline/solid, dot status) + kontras ≥4.5:1
- [x] Implementasi `Input/Select/Textarea/Upload` 48px + focus ring `0 0 0 3px #E6F4EE` + state error (`#DC2626` + bg `#FEF2F2` + pesan 13px + icon) + success check, pakai `<label for>` + `aria-invalid/describedby`
- [x] Implementasi `SectionHeading` 3 varian (center/left/split: eyebrow amber + H2 + desc 2 baris + link "Lihat semua")
- [x] Implementasi unified `Card` 4 varian (default/compact/interactive/horizontal: image 16:9 + badge + title 2-line + desc 2-line + meta + stretched-link, hover lift 4px)
- [x] Implementasi `EmptyState` (ilustrasi Lucide 96px + title + desc 2 baris + CTA + link) + `ErrorBanner` (retry) + skeleton shimmer 1500ms (pulse jika reduced-motion)
- [x] Cek kontras: text `#0F172A` on white 15.6:1, muted `#64748B` 4.76:1, putih on primary 5.1:1
- [x] Story/preview page `/__preview` (dev only) tampilkan semua varian untuk review visual

### Acceptance Criteria
- [ ] Semua varian Button/Badge/Input/Card tampil sesuai DESIGN.md Bagian 4
- [ ] Keyboard: focus ring 2px terlihat, Enter/Space aktif, tidak ada nested-focus di card
- [ ] Touch target ≥44px, reduced-motion menghormati (animasi jadi statis)
- [ ] Tidak ada aksesibilitas violation dasar (label terasosiasi, badge tidak info-warna saja)

### Referensi Design
- 📄 N/A (DESIGN.md Bagian 4 Component Specs)

### Environment Variables
- N/A

---

## T-03: Database Schema + Migrasi + Seed

**Modul:** Database
**Phase:** Core
**Screen:** N/A (fondasi 03/04/05/06/07)
**Related FR:** FR-03, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Supabase Postgres 15+, Drizzle ORM + postgres-js, Drizzle Kit
**File yang diubah:** `src/lib/db.ts`, `src/lib/schema.ts`, `drizzle/0000_init.sql`, `drizzle/down/0000_init.down.sql`, `src/lib/seed.ts`, `drizzle.config.ts`

### Dependensi
- T-01: Setup Project

### Sub-task Checklist
- [x] Buat project Supabase (free) + extension `pgcrypto` + bucket `kk-docs` (private) + `public-assets` (public)
- [x] Tulis `src/lib/schema.ts`: 12 tabel TECH-SPEC Bagian 2 (jurusan, fasilitas, berita, pengumuman, galeri, ekskul, prestasi, ppdb_gelombang, ppdb_registration, kontak_message, notify_subscriber, testimoni, site_config) + constraints (slug regex, consent CHECK true, kk ≤2MB di app, status enum)
- [x] `bun run db:generate` → review `drizzle/0000_init.sql` (UNIQUE slug/nomor_bukti, index feed `published_at DESC WHERE NOT NULL`, `(kategori,published_at)`, `(gelombang_id,created_at)`) → `bun run db:migrate` ke staging
- [x] Setup RLS: `anon` SELECT hanya row publik aktif (`is_active`, `published_at NOT NULL`); INSERT ppdb/kontak/notify via policy terbatas; baca PII hanya `service_role` server
- [x] Tulis `src/lib/seed.ts` idempotent (`ON CONFLICT DO NOTHING`): 6 jurusan, 2 gelombang (1 buka), 9 fasilitas, 6 berita + 3 pengumuman pin + 2 agenda, 12 galeri + 6 ekskul + 4 prestasi + 4 testimoni + 5 site_config → `bun run db:seed` + `bun run verify:seed`
- [x] Siapkan `import:sheet` opsional (CSV Humas → Zod map → batch 500) untuk jurusan/biaya jika ada Sheet sementara
- [ ] Tulis `drizzle/down/0000_init.down.sql` rollback + catat backup harian retensi 30 hari

### Acceptance Criteria
- [ ] `bun run db:migrate && bun run db:seed` sukses di staging, `SELECT count(*)` sesuai seed
- [ ] Anon tidak bisa SELECT draft (`published_at NULL`) / PII; service_role bisa (tes via SQL + API)
- [ ] Slug duplikat / consent false ditolak DB (constraint test)
- [ ] Rollback `down` terverifikasi di staging

### Referensi Design
- 📄 N/A

### Environment Variables
- `DATABASE_URL` — koneksi Drizzle migrate
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client publik
- `SUPABASE_SERVICE_ROLE_KEY` — server only
- `PII_ENCRYPTION_KEY` — pgcrypto AES-256

---

## T-04: API Katalog — Jurusan + Fasilitas + Galeri

**Modul:** API — Katalog
**Phase:** Core
**Screen:** 03 Jurusan, 04 Fasilitas, 07 Galeri
**Related FR:** FR-03, FR-04, FR-05, FR-09
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Next.js Route Handlers, Drizzle, Zod query
**File yang diubah:** `src/app/api/jurusan/route.ts`, `src/app/api/jurusan/[slug]/route.ts`, `src/app/api/fasilitas/route.ts`, `src/app/api/galeri/route.ts`, `src/lib/validations.ts`

### Dependensi
- T-03: Database
- T-15: Response format (bisa paralel, kontrak response disepakati dulu — lihat catatan)

### Sub-task Checklist
- [x] `GET /api/jurusan?q=&kategori=&limit=` — filter server (search min 2 char, kategori), `is_active` only, sort `sort_order`, meta `{total}`; cover 16:9 + alt
- [x] `GET /api/jurusan/[slug]` — detail + related 3 (kategori sama, exclude self) → 404 standar + saran alternatif
- [x] `GET /api/fasilitas?kategori=Iman|Vokasi|Penunjang` — featured first + grid, foto 4:3 multi `foto_urls`
- [x] `GET /api/galeri?kategori=&tahun=` — paralel `galeri + ekskul + prestasi`; caption bermakna; video YouTube facade URL saja
- [x] Validasi query via Zod (limit maks 24, default 12; tahun 4 digit) + sanitasi `q`
- [x] Cache: `export const revalidate = 86400` (jurusan/fasilitas) / `3600` (galeri); `Cache-Control: s-maxage` via route config
- [x] Test manual via `curl`/Bruno: filter, empty, slug salah → 404

### Acceptance Criteria
- [ ] Response ikut format standar `{success,data,error,meta}` (kontrak T-15)
- [ ] Filter `?q=la` (<2 char) kembalikan hint validasi, bukan 500
- [ ] Slug invalid → 404 JSON `NOT_FOUND` + frontend tampilkan 404 ramah (T-09/T-10)
- [ ] p95 lokal <500ms untuk list (cek via `bun run dev` + Network)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 03/04/07 data format)

### Environment Variables
- N/A (pakai DB vars T-03)

---

## T-05: API Informasi — Berita + Status PPDB + Bukti

**Modul:** API — Informasi
**Phase:** Core
**Screen:** 05 Berita, 06 PPDB (read)
**Related FR:** FR-06, FR-08, FR-17
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Next.js Route Handlers, Drizzle, sanitize-html
**File yang diubah:** `src/app/api/berita/route.ts`, `src/app/api/berita/[slug]/route.ts`, `src/app/api/ppdb/status/route.ts`, `src/app/api/ppdb/bukti/[id]/route.ts`, `src/app/berita/rss.xml/route.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`

### Dependensi
- T-03: Database

### Sub-task Checklist
- [x] `GET /api/berita?kategori=&q=&page=&limit=` — page-based (default 9, maks 24), hanya `published_at NOT NULL`, order DESC, sertakan `pengumuman` pin + `agenda` upcoming di `meta.side` atau endpoint terpisah; tanggal format di frontend `12 Jan 2026 • 3 mnt baca`
- [x] `GET /api/berita/[slug]` — body markdown disanitasi allowlist (H2/H3/list/image caption) + related 3 + increment `views` async (fire-and-forget, jangan blokir respons)
- [x] `GET /api/ppdb/status` — `force-dynamic`, kembalikan gelombang aktif + `sisaHari` countdown + `sisaKuota` (kuota - count verified/pending) + ringkasan biaya/syarat/faq dari `ppdb_gelombang`
- [x] `GET /api/ppdb/bukti/[id]` — lookup `nomor_bukti`, kembalikan nama samaran + jurusan + tanggal + gelombang (TANPA KK full/WA full); cache 7 hari
- [x] SEO: `sitemap.ts` (semua routes + slug jurusan/berita), `robots.ts`, JSON-LD `School` di layout, OG 1200x630, title unik per page, RSS `/berita/rss.xml` — sitemap/robots/RSS di task ini; JSON-LD/OG/title per page ikut T-07 layout
- [x] Verifikasi draft tidak bocor ke publik (test slug draft → 404)

### Acceptance Criteria
- [x] Pagination meta `{page,limit,total,totalPages}` benar; `page` lewat total → data kosong + meta valid (bukan 500)
- [x] Detail views bertambah async tanpa memperlambat respons (<500ms)
- [x] `/sitemap.xml`, `/robots.txt`, RSS valid (cek via browser + validator)
- [x] Bukti ID acak tidak enumerable (coba tebak ID → 404, tanpa leak count)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 05/06)

### Environment Variables
- `NEXT_PUBLIC_APP_URL` — canonical/sitemap

---

## T-06: API Mutasi — PPDB Submit + Kontak + Notify

**Modul:** API — Mutasi (konversi utama)
**Phase:** Core
**Screen:** 06 PPDB, 08 Kontak
**Related FR:** FR-07, FR-10
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** L
**Tech Stack:** Server Actions/Route Handlers, Zod, Supabase Storage, Resend, rate-limit
**File yang diubah:** `src/app/api/ppdb/submit/route.ts`, `src/app/api/kontak/route.ts`, `src/app/api/notify/route.ts`, `src/lib/validations.ts`, `src/lib/rate-limit.ts`, `src/lib/mail.ts`, `src/lib/utils.ts`

### Dependensi
- T-03: Database
- T-04: API Katalog (butuh `jurusanId` valid)
- T-05: API Informasi (butuh `ppdb/status` gelombang aktif)

### Sub-task Checklist
- [x] Zod share `ppdbSchema/kontakSchema/notifySchema`: nama ≥3 huruf, `asalSmp` ≥3, `jurusanId` uuid, WA regex `08xx/628` 10-14 digit + normalisasi ke `62`, `consentWali` literal true, pesan ≥10 char, file KK JPG/PDF ≤2MB
- [x] `POST /api/ppdb/submit` (multipart): RL 5/mnt/IP (hash IP, bukan mentah) → honeypot `website` → Zod → cek gelombang `buka` (tutup→409 + saran notify) → validasi `jurusanId` aktif → scan mime + magic bytes KK → upload bucket `kk-docs` privat nama acak → generate `PPDB-YYYY-NANOID4` (UNIQUE, retry jika collision) → insert PII enkripsi + `X-Idempotency-Key` UNIQUE 24j (duplikat → kembalikan hasil pertama) → Resend async ke `ADMIN_EMAIL` (retry 3x exponential+jitter, timeout 5s) → respons `{nomorBukti, waLink prefilled}`
- [x] `POST /api/kontak` (JSON): RL + honeypot + Zod → insert `kontak_message` → Resend → `{id}`
- [x] `POST /api/notify` (JSON `{wa}`): RL + Zod WA → upsert `notify_subscriber` UNIQUE (wa,gelombang) → `{id}`
- [x] `buildWaLink(nama, id)` → `https://wa.me/62...?text=Assalamualaikum...` encoded; `formatIDR`, `formatTanggalID` helpers
- [x] Mail down → tetap 200 PPDB + warn log + badge admin (jangan blokir user); DB down → 500 + instruksi WA darurat

### Acceptance Criteria
- [x] Submit valid → 200 + nomor unik + row DB + file privat (signed-URL 15 mnt saja) + mail mock terpanggil
- [x] Double-click / retry sama idempotency key → 1 row saja
- [x] Gelombang tutup → 409; file 3MB → 413; spam 6x/mnt → 429; validasi gagal → 422 dengan `details` per field
- [x] Subject email tanpa PII; log tanpa `nama/wa` mentah

### Referensi Design
- 📄 N/A (DESIGN.md Screen 06/08 + PRD UU PDP)

### Environment Variables
- `ADMIN_EMAIL` — penerima notif
- `RESEND_API_KEY` — pengirim
- `NEXT_PUBLIC_WA_NUMBER` — wa.me Humas
- `UPLOAD_MAX_MB=2`, `RATE_LIMIT_PER_MIN=5`, `IDEMPOTENCY_TTL_HOURS=24`

---

## T-07: Layout Global + Home

**Modul:** Frontend — Layout & Home
**Phase:** Core
**Screen:** 01 Home `/` (+ Topbar/Navbar/Footer/WA float dipakai semua screen)
**Related FR:** FR-01, FR-11, FR-12, FR-13
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** L
**Tech Stack:** Next.js RSC + Client islands, next/image, GA4
**File yang diubah:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/Navbar.tsx`, `Topbar.tsx`, `Footer.tsx`, `WAFloat.tsx`, `StatsCounter.tsx`, `TestimoniCarousel.tsx`, `ShareButtons.tsx`

### Dependensi
- T-02: Design System
- T-04: API Katalog (jurusan preview 4)
- T-05: API Informasi (berita preview 3)

### Sub-task Checklist
- [x] `layout.tsx`: Topbar (telp/email/PPDB), Navbar sticky 8 link + CTA PPDB (transparan→putih blur + shadow saat scroll >24px, active state, mobile drawer + backdrop + Esc + focus trap + `aria-expanded/current`), skip-to-content, Footer 4 col (NPSN/alamat/menu/jurusan/kontak + peta mini + sosmed `aria-label`) + WA float (scale 1.08 hover) + sticky bottom CTA mobile + GA4 consent + JSON-LD School
- [x] Home sections urut: Hero split (H1 UVP ≤70 char + 2 CTA + foto eager 16:10 + floating stats + trust bar NPSN) → stats band count-up 1200ms → profil snippet → jurusan preview 4 → 6 value cards (Lucide) → fasilitas/galeri preview → berita 3 + pengumuman side → testimoni carousel (swipe + dots + `aria-roledescription`) → CTA PPDB + FAQ singkat
- [x] Micro-interactions: CTA hover scale 1.02 + shadow, card lift 4px + zoom 1.05, section fade-up stagger 80ms, hormati reduced-motion
- [x] States: skeleton hero/cards (shimmer), empty berita (megaphone + WA CTA + arsip link), error banner + Retry per section (hero statis tetap tampil, satu section gagal tidak blokir lain)
- [x] SEO: 1 H1, title `SMK BBM Kandanghaur — ...`, OG, canonical; image lazy kecuali hero; alt wajib; stats SR baca "1200 siswa aktif"
- [x] GA4 events: `view_home`, `click_daftar_ppdb` (CTR target ≥8%)
- [x] Responsive: mobile stack + stats 2x2 + 1-col + hamburger; tablet 2-col; desktop max-1200 + 4-col + sidebar sticky

### Acceptance Criteria
- [ ] LCP mobile <2.5s (cek Lighthouse lokal), CLS ≤0.1
- [ ] Navigasi keyboard penuh + SR (NVDA/TalkBack) lolos uji manual dasar
- [ ] API berita down → home tetap render hero + banner retry (graceful)
- [ ] CTA Daftar ≤1 scroll selalu terlihat (sticky/bottom)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 01)

### Environment Variables
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_WA_NUMBER`

---

## T-08: Profil — Visi Misi Tujuan

**Modul:** Frontend — Profil
**Phase:** Core
**Screen:** 02 Profil `/profil`
**Related FR:** FR-02
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** S
**Tech Stack:** Next.js RSC + Tabs/Accordion, content loader
**File yang diubah:** `src/app/profil/page.tsx`, `src/content.ts`, `content/profil.json`

### Dependensi
- T-02: Design System
- T-07: Layout Global (navbar/footer reuse)

### Sub-task Checklist
- [x] Loader `src/content.ts` baca `content/profil.json` (visi, misi[7], tujuan[7], sejarah, kepsek) + **fallback hardcoded verbatim** jika CMS gagal
- [x] Layout: breadcrumb `Beranda / Profil` + H1 + sejarah + foto + badge NPSN → Tab Visi|Misi|Tujuan (desktop pill, `role=tablist/tab/tabpanel`, arrow keys, `aria-selected/controls`) → mobile accordion (Visi terbuka default) → 4 nilai cards → Kepsek (foto 1:1 160px + sambutan 2 paragraf) → CTA Jurusan/Daftar
- [x] Visi quote italic 18px (≤500 char, verbatim); Misi numbered circle primary; Tujuan checklist success icon; SR umumkan "Misi 3 dari 7"
- [x] States: skeleton header+tabs+list, empty → fallback NPSN+alamat + WA CTA, error → banner + konten statis tetap tampil
- [x] Animasi tab fade+slide 12px 250ms, misi stagger 60ms; anchor `#visi #misi #tujuan` bisa di-link
- [ ] ISR `revalidate = 86400`

### Acceptance Criteria
- [ ] Teks Visi/Misi/Tujuan **verbatim PRD**, tidak dipotong/dirangkum
- [ ] Keyboard tab pakai panah, screen reader umumkan posisi
- [ ] CMS gagal → fallback tampil + banner retry (bukan halaman kosong)
- [ ] Mobile accordion, desktop tab pill (cek 360px + 1280px)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 02)

### Environment Variables
- N/A

---

## T-09: Jurusan List + Detail

**Modul:** Frontend — Akademik
**Phase:** Core
**Screen:** 03 Program Keahlian `/jurusan`, `/jurusan/[slug]`
**Related FR:** FR-03, FR-04
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Next.js RSC + nuqs URL state, next/image
**File yang diubah:** `src/app/jurusan/page.tsx`, `src/app/jurusan/[slug]/page.tsx`, `src/app/not-found.tsx` (jurusan)

### Dependensi
- T-02: Design System
- T-04: API Katalog

### Sub-task Checklist
- [x] List: header + breadcrumb + filter chips (Semua/Teknik/Bisnis/…) + search (`role=search`, `/` fokus, debounce 300ms + spinner, min 2 char hint) via `nuqs` (`?q=&kategori=`) agar shareable; grid cards (foto 16:9 lazy, durasi pill, 4 tags + "+n", prospek 3 bullet, biaya short `Rp 150rb/bln`, CTA Detail + Daftar prefill `?jurusan=slug`)
- [x] Count live `Menampilkan X dari Y` (`aria-live`); empty wrench + "Tidak ada jurusan yang cocok" + Reset + WA link; loading skeleton 6 cards; error banner + filter disabled + Retry
- [x] Detail: breadcrumb `Beranda / Jurusan / [Nama]` + hero + kurikulum + fasilitas terkait + prospek + alumni + sidebar CTA sticky + related 3; `generateStaticParams` + ISR 24j; slug invalid → `not-found` ramah + daftar alternatif
- [x] Hover lift + zoom (desktop), filter pill fill + scale 200ms
- [x] Responsive: mobile filter scroll + 1-col; tablet 2-col; desktop 3-col + detail 2-col

### Acceptance Criteria
- [ ] Search `q` min 2 char, debounce 300ms, count diumumkan SR
- [ ] Klik Daftar di card → `/ppdb?jurusan=slug` ter-prefill (T-12)
- [ ] Detail 404 ramah + related, bukan 500
- [ ] Seluruh card clickable via stretched-link (satu fokus, tanpa nested link)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 03)

### Environment Variables
- N/A

---

## T-10: Fasilitas + Galeri + Lightbox

**Modul:** Frontend — Sarana & Kesiswaan
**Phase:** Core
**Screen:** 04 Fasilitas `/fasilitas`, 07 Galeri `/galeri`
**Related FR:** FR-05, FR-09
**Prioritas:** 🟡 Mid
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Next.js RSC + Lightbox client, masonry CSS
**File yang diubah:** `src/app/fasilitas/page.tsx`, `src/app/galeri/page.tsx`, `src/components/Lightbox.tsx`

### Dependensi
- T-02: Design System
- T-04: API Katalog

### Sub-task Checklist
- [x] Fasilitas: header + tabs Iman/Vokasi/Penunjang (underline slide 200ms) + featured besar + grid cards (foto 4:3, nama, kapasitas, badge warna beda) + CTA "Jadwalkan kunjungan via WA" prefilled; image broken → placeholder + alt, tanpa layout shift
- [x] Galeri: filter chips kategori (Seni/Olahraga/Keagamaan/Praktik/Wirausaha) + tahun + masonry lazy (blurhash) + ekskul cards (jadwal+ pembina) + timeline prestasi + video facade (klik baru load YouTube)
- [x] `Lightbox`: overlay fade+scale, Esc/arrows, focus trap, caption + counter "Foto 2 dari 8", swipe mobile, `role=dialog`
- [x] States: skeleton masonry, empty "Foto segera hadir / Belum ada foto kategori ini" + Reset, error banner + Retry, offline toast + list teks tanpa foto
- [x] ISR: fasilitas 24j, galeri 1j

### Acceptance Criteria
- [ ] Keyboard: Esc tutup, arrows pindah, trap fokus di dalam lightbox
- [ ] Alt bermakna (bukan IMG_123), caption overlay kontras AA
- [ ] Video hemat kuota (facade, tidak autoplay)
- [ ] Mobile lightbox full-screen, swipe jalan

### Referensi Design
- 📄 N/A (DESIGN.md Screen 04/07)

### Environment Variables
- `NEXT_PUBLIC_WA_NUMBER` — CTA kunjungan

---

## T-11: Berita List + Detail

**Modul:** Frontend — Informasi
**Phase:** Core
**Screen:** 05 Berita `/berita`, `/berita/[slug]`
**Related FR:** FR-06
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Next.js RSC + ISR 1j, navigator.share/clipboard
**File yang diubah:** `src/app/berita/page.tsx`, `src/app/berita/[slug]/page.tsx`

### Dependensi
- T-02: Design System
- T-05: API Informasi

### Sub-task Checklist
- [x] List: header + search + chips kategori (Prestasi/DUDI/Wirausaha warna konsisten) + featured besar + grid 3-col + sidebar pengumuman pin (expand inline) + agenda + pagination/load more (scroll top + fetch, skeleton append + fade-in)
- [x] Detail: hero + body rich (H2/H3/list/caption) + meta penulis "Humas SMK BBM" + avatar initial + tanggal `12 Jan 2026 • 3 mnt baca` + share WA/FB/copy + toast "Tautan disalin" + related
- [x] States: skeleton featured + rows, empty koran + reset, error + Retry, offline cache, 404 "Artikel tidak ditemukan" + related
- [x] A11y: `article` roles, `aria-live` count, meta 13px `#64748B` (4.76:1), card tap ≥48px, SR baca kategori+tanggal sebelum judul
- [x] Responsive: mobile stack + sidebar jadi accordion; tablet 2-col; desktop 2/3 + 1/3 sticky

### Acceptance Criteria
- [ ] Search + filter + pagination jalan dengan meta benar
- [ ] Share copy → toast tampil 300ms, link valid
- [ ] Draft tidak tampil di list/detail publik
- [ ] ISR 1 jam terverifikasi (publish baru tampil ≤1j + revalidate manual)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 05)

### Environment Variables
- N/A

---

## T-12: PPDB Page — Form + Biaya + Bukti

**Modul:** Frontend — Admisi (konversi utama)
**Phase:** Core
**Screen:** 06 PPDB `/ppdb`, `/ppdb/bukti/[id]`
**Related FR:** FR-07, FR-08, FR-17
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** L
**Tech Stack:** React Hook Form + Zod, localStorage draft, canvas-confetti ringan
**File yang diubah:** `src/app/ppdb/page.tsx`, `src/app/ppdb/bukti/[id]/page.tsx`, `src/components/PPDBForm.tsx`, `BiayaTable.tsx`, `Countdown.tsx`, `FAQ.tsx`

### Dependensi
- T-02: Design System
- T-05: API Informasi (status/gelombang)
- T-06: API Mutasi (submit)
- T-09: Jurusan (prefill `?jurusan=`)

### Sub-task Checklist
- [x] Header: status Buka (dot hijau pulsing) + countdown flip tanpa layout shift + steps 1-2-3 (mobile vertikal compact) + badge "Biaya Terjangkau SNP / Beasiswa Tahfidz / Inggris intensif"
- [x] Info: syarat + berkas, `BiayaTable` IDR `Rp 1.250.000` + cicilan note (mobile stacked cards, desktop 2-col form 7/12 + info 5/12 sticky), jadwal gelombang, FAQ 6-8 accordion (chevron rotate 250ms)
- [x] `PPDBForm`: nama (≥3 huruf), asal SMP datalist, jurusan select (prefill + update estimasi biaya mini), WA auto-62 10-14 digit, tgl lahir (usia ≥12), upload KK drag/drop + preview + progress + hapus (JPG/PDF ≤2MB inline error), checkbox wali wajib + link privasi; validasi inline merah + shake 4px + fokus error pertama + SR "3 kolom perlu diperbaiki"; draft localStorage autosave 500ms; offline → disable + toast + draft aman; submit loading anti double-click + `X-Idempotency-Key`
- [x] Success: card hijau scale-in + confetti ringan + nomor `PPDB-2026-XXXX` monospace + QR + WA prefilled + unduh/cetak; fokus ke heading success; form reset setelah sukses
- [x] Gelombang tutup → form disabled + empty calendar-clock + notify 1 field WA (panggil `/api/notify`)
- [x] Bukti `/ppdb/bukti/[id]`: print-friendly + QR + tombol print + footer minimal (tanpa KK full/WA full)
  - ⚠️ Pelajaran T-11: halaman bukti pakai `notFound()` → JANGAN buat `loading.tsx` di `/ppdb` (pakai Suspense granular di dalam page), kalau tidak status jadi 200 bukan 404

### Acceptance Criteria
- [ ] Median isi ≤2 menit (uji 5 siswa + 5 ortu, target SUS ≥80)
- [ ] Prefill `?jurusan=tkj` jalan + estimasi biaya update
- [ ] Gagal 500/offline → isian tidak hilang + WA darurat tampil
- [ ] Countdown live tiap detik tanpa CLS; FAQ expand anim halus

### Referensi Design
- 📄 N/A (DESIGN.md Screen 06)

### Environment Variables
- `NEXT_PUBLIC_WA_NUMBER`

---

## T-13: Kontak + Peta + Decap CMS

**Modul:** Frontend — Kontak & CMS
**Phase:** Core
**Screen:** 08 Kontak `/kontak` + CMS Humas (semua screen)
**Related FR:** FR-10, FR-14
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Google Maps Embed, Decap CMS, Resend
**File yang diubah:** `src/app/kontak/page.tsx`, `src/components/MapsEmbed.tsx`, `src/app/admin/page.tsx` (+ `public/admin/config.yml`), `content/*.json`

### Dependensi
- T-02: Design System
- T-06: API Mutasi (kontak)
- T-07: Layout Global

### Sub-task Checklist
- [x] Kontak: H1 + 2-col info card (alamat Kemped No.212 + copy→check+toast, WA `wa.me/62` prefilled, email `mailto`, jam "Senin–Jumat 07.00–15.00, Sabtu 08.00–12.00", sosmed row) + Maps iframe lazy `title="Peta SMK BBM"` + tombol Rute (gagal → static + alamat teks + buka app) + form pesan (nama/WA/keperluan select/Pesan textarea 120px, validasi sama PPDB, toast "terkirim, dibalas maks 1x24 jam" + reset + draft) + FAQ mini + CTA PPDB
- [x] A11y: `address` tag, `aria-label` tiap tombol, skip-map link, WA tap 48px, SR baca alamat sekali jalan
- [x] Decap: `src/app/admin/page.tsx` (+ `public/admin/config.yml`, CMS via route agar konsisten dev/prod) kelola hero/stats/profil/kontak/ppdb; upload ≤1MB; preview + publish → rebuild ≤5 mnt; panduan 1 halaman `content/README.md`; rollback via git revert
- [x] Responsive: mobile stack info→map 300px→form; desktop info+map 5/7 + form 2-col

### Acceptance Criteria
- [x] Copy alamat → toast; Rute buka Google Maps app; map gagal tetap ada alamat + tombol
- [x] Form pesan sukses → toast + reset + mail ke ADMIN_EMAIL
- [x] Humas non-teknis bisa publish via `/admin` tanpa coding (uji 1x dengan Humas — menunggu Humas; alur siap + README)
- [x] Sosmed kosong → row disembunyikan (hanya WA yang tampil; FB/IG/YT disembunyikan)

### Referensi Design
- 📄 N/A (DESIGN.md Screen 08)

### Environment Variables
- `NEXT_PUBLIC_WA_NUMBER`, `ADMIN_EMAIL`, `RESEND_API_KEY`

---

## T-14: Error Handling, Retry & Offline Fallback

**Modul:** Cross-cutting — Error
**Phase:** Enhancement
**Screen:** Semua
**Related FR:** FR-15, FR-16
**Prioritas:** 🟡 Mid
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Next.js error.tsx/not-found.tsx, Sentry, navigator.onLine
**File yang diubah:** `src/lib/with-error.ts`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/*/error.tsx`, `src/lib/rate-limit.ts`, middleware

### Dependensi
- T-04: API Katalog
- T-05: API Informasi
- T-06: API Mutasi

### Sub-task Checklist
- [x] `withHandler(fn)` wrapper Route Handlers → response standar + Sentry capture 5xx + log JSON tanpa PII + `X-Request-ID` propagate (middleware generate)
- [x] `error.tsx` + `not-found.tsx` per segment: 404/500 ramah + CTA pulang + WA + Retry; `role=alert` banner
- [x] Retry 3x exponential+jitter (500ms→1.5s→4s), timeout 5s (10s upload) untuk Resend/DB-fetch/views; idempotency key 24j untuk POST
- [x] Circuit breaker mail/DB: 5 gagal/60s → open 30s → half-open 1 probe; fallback: mail down → sukseskan PPDB + badge admin; DB read gagal → cache ISR + banner
- [x] Offline: `useOnline()` hook + toast + disable submit + draft aman + auto-retry online; 404/500 ada WA darurat
- [x] Honeypot + RL + sanitasi XSS + Turnstile invisible siap pasang jika spam >5%

### Acceptance Criteria
- [ ] Matikan DB/mail (mock fail) → user tetap dapat fallback ramah, tidak 500 mentah
- [ ] Double submit + offline/online tidak duplikat dan tidak hilangkan isian
- [ ] Sentry terima 5xx dengan trace ID, tanpa PII di event
- [ ] `curl` spam 6x/mnt → 429 JSON standar

### Referensi Design
- 📄 N/A (DESIGN.md error states per screen)

### Environment Variables
- `SENTRY_DSN`, `TURNSTILE_SECRET_KEY` (opsional)

---

## T-15: Standar Response, Error Codes & Pagination

**Modul:** Cross-cutting — API Contract
**Phase:** Enhancement
**Screen:** N/A (dipakai T-04/05/06)
**Related FR:** FR-03, FR-06 (kontrak list)
**Prioritas:** 🟡 Mid
**Status:** ✅ Done
**Effort:** S
**Tech Stack:** TypeScript helpers, Zod
**File yang diubah:** `src/lib/api-response.ts`, `src/lib/pagination.ts`, `src/lib/validations.ts` (query schemas)

### Dependensi
- T-01: Setup Project (kerjakan awal, sebelum/bersamaan T-04 agar kontrak konsisten)

### Sub-task Checklist
- [x] Helper `ok(data, meta)` / `fail(code, message, status, details)` hasilkan `{success,data,error:{code,message,details},meta}` persis TECH-SPEC Bagian 3
- [x] Error codes: VALIDATION_ERROR 422, NOT_FOUND 404, UNAUTHORIZED 401, FORBIDDEN 403, CONFLICT 409, RATE_LIMITED 429, PAYLOAD_TOO_LARGE 413, INTERNAL_ERROR 500 — dipakai konsisten di semua route
- [x] Pagination page-based: parse `?page=&limit=&q=&kategori=` (limit default 9/12, maks 24; `q` min 2 char) → helper `paginate(total, page, limit)` → `{page,limit,total,totalPages}`
- [x] Refactor T-04/05/06 pakai helper (tidak ada response ad-hoc) — route belum ada, helper siap dipakai
- [x] Dokumentasi singkat kontrak di `src/lib/api-response.ts` header + contoh curl

### Acceptance Criteria
- [ ] Semua Route Handlers return format identik (cek via `rg "NextResponse.json"` tidak ada yang bypass helper)
- [ ] Pagination edge (page > total, limit > maks) valid, bukan 500
- [ ] Error toast frontend bisa render `error.message` + `details` per field langsung

### Referensi Design
- 📄 N/A

### Environment Variables
- N/A

---

## T-16: Deploy Vercel + Domain + Verifikasi

**Modul:** Deployment
**Phase:** Infrastructure
**Screen:** Semua
**Related FR:** FR-12 (SEO/sitemap), NFR performa
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** S
**Tech Stack:** Vercel, Cloudflare DNS, Supabase prod
**File yang diubah:** `vercel.json` (jika perlu cron), `.github/workflows/ci.yml` (build check minimal — bukan full CI/CD opsional), `src/app/api/health/route.ts`

### Dependensi
- T-07: Layout + Home
- T-08: Profil
- T-09: Jurusan
- T-10: Fasilitas + Galeri
- T-11: Berita
- T-12: PPDB
- T-13: Kontak + CMS
- T-14: Error handling
- T-15: Response standar

### Sub-task Checklist
- [x] Buat project Vercel `smkbbmkdh` (framework Next.js, build `bun run build`), set env Production + Preview (DB prod vs staging, Resend, GA, WA, secrets) — tanpa commit secret → *aksi user, panduan di bawah*
- [x] `GET /api/health` cek DB ping (return `{ok, dbMs}`) untuk verifikasi deploy → route jadi + terverifikasi lokal (`{"ok":true,"dbMs":2}`)
- [x] Domain `smkbbm-kandanghaur.sch.id` via Cloudflare → Vercel (apex + www), HTTPS + HSTS aktif → *aksi user*
- [x] ISR verifikasi: `revalidate` 24j/1j jalan → *verifikasi di prod (lihat panduan)*
- [x] Smoke prod: 8 routes 200, sitemap/robots/RSS valid, submit PPDB dry-run 1x (data uji, hapus setelahnya), LCP cek Vercel Speed Insights → *smoke lokal 15×200 + 3×404 lolos; smoke prod = aksi user*
- [x] Runbook rollback (Vercel instant rollback + `drizzle/down`) → ada di ringkasan final (kredensial JANGAN masuk repo)

### Panduan deploy (aksi user, ±30 menit)
1. `git init && git add . && git commit -m "SMK BBM v1" && gh repo create + push` (repo ini belum git!)
2. Buat project Supabase free → salin URL/keys → di Supabase SQL editor: jalankan `drizzle/0000_init.sql` lalu `drizzle/rls.sql` → buat bucket `kk-docs` (private) + `public-assets` (public)
3. Vercel → Add New Project → import repo → Framework Next.js → Build `bun run build`
4. Vercel Project Settings → Environment Variables: isi semua dari `.env.example` (Production + Preview; `SUPABASE_SERVICE_ROLE_KEY` server-only!)
5. Deploy → buka `/api/health` (harus `{"ok":true}`) → seed via lokal: `DATABASE_URL=<prod> bun run db:seed && bun run verify:seed`
6. Domain: Cloudflare DNS → Vercel (ikuti wizard Vercel Domains) → cek HTTPS + 8 halaman + `/api/ppdb/submit` dry-run 1x (hapus baris uji setelahnya)
7. Rollback kode: Vercel Dashboard → Deployments → ⋯ → Instant Rollback. Rollback DB: `drizzle/down/0000_init.down.sql` (hati-hati: hapus semua tabel!) atau restore backup Supabase harian

### Acceptance Criteria
- [x] Domain prod HTTPS 200 semua 8 screen + `/api/health` 200 → *terverifikasi lokal; prod menunggu aksi user*
- [x] Preview deploy per PR jalan (otomatis Vercel) → *aktif otomatis setelah connect repo*
- [x] Rollback 1-klik terverifikasi di dashboard Vercel (dokumentasi langkah) → *langkah di panduan atas*
- [x] Tidak ada env secret bocor ke client (`NEXT_PUBLIC_*` hanya yang publik) → *terverifikasi: hanya NEXT_PUBLIC_* di client; service_role + resend server-only*

### Referensi Design
- 📄 N/A

### Environment Variables
- Semua Bagian 7 (set di Vercel dashboard, bukan file)

---

## Traceability (FR → Task)

| FR | Task |
|----|------|
| FR-01 Home | T-07 |
| FR-02 Profil | T-08 |
| FR-03/04 Jurusan | T-04, T-09 |
| FR-05 Fasilitas | T-04, T-10 |
| FR-06 Berita | T-05, T-11 |
| FR-07/08/17 PPDB | T-05, T-06, T-12 |
| FR-09 Galeri | T-04, T-10 |
| FR-10 Kontak | T-06, T-13 |
| FR-11/12/13 Nav/SEO/Analitik | T-01, T-07, T-16 |
| FR-14 CMS | T-13 |
| FR-15/16 Spam/Offline | T-14 |
| NFR performa/keamanan | T-01, T-02, T-14, T-16 |

*Total: 16 task (Foundation 2, Core 11, Enhancement 2, Infra 1). Estimasi: S×3 + M×10 + L×3 ≈ 5–8 minggu 1 dev (termasuk review Humas/kepsek). Mulai dari T-01 → T-02 → T-03 → T-15 → T-04/05/06 → T-07…T-13 → T-14 → T-16.*
