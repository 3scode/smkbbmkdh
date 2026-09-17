# TECH-SPEC.md — Website Landing SMK Bangun Bangsa Mandiri (BBM) Kandanghaur

> **Acuan:** `.agents/PRD.md` (17 FR, 12 US) + `.agents/DESIGN.md` (8 screen, Web Responsive, Modern & Clean, Light)
> **Tanggal:** 2026-09-16
> **Stack pilihan user:** Next.js + Supabase + Vercel
> **Runtime:** Bun 1.4.2 (terdeteksi lokal) — versi lib lain pakai latest stable saat `bun install`, jangan hardcode
> **V1 Scope:** Landing informatif + PPDB sederhana (tanpa LMS / payment / login siswa)

---

## BAGIAN 1: Tech Stack & Arsitektur

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime / PM | Bun | 1.4.2 (lokal, pakai latest saat deploy) |
| Frontend / SSR-SSG | Next.js App Router (React Server Components) | latest stable 15.x saat install (`next@latest`) |
| Language | TypeScript | 5.x (`typescript@latest`, `strict: true`) |
| Styling | Tailwind CSS + tailwind-merge + clsx | latest 4.x / 3.x stable |
| UI Primitives | shadcn/ui (copy-paste, Radix) + Lucide icons | latest |
| State | URL state (`nuqs`) + React `useState`/`useOptimistic`, tanpa global store V1 | - |
| Validasi | Zod (client + server share schema) | latest |
| Backend | Next.js Route Handlers + Server Actions (kolokasi di `src/app/api`) | - |
| Database | Supabase Postgres (serverless, free tier) | Postgres 15+ managed |
| ORM / DB client | Drizzle ORM + `postgres-js` + Supabase JS (auth/storage) | latest |
| Migrasi | Drizzle Kit (`drizzle-kit generate/migrate`) + Supabase SQL editor fallback | - |
| Storage file | Supabase Storage (bucket `kk-docs` private + `public-assets` public) | - |
| CMS (Humas) | Decap CMS (git-based, `/admin`, `config.yml`) → commit ke `content/` → webhook rebuild | 3.x |
| Email | Resend (notif admin) | latest SDK |
| WA | V1: `wa.me` click-to-chat prefilled (tanpa key). V2 opsional: WhatsApp Cloud API | - |
| Peta | Google Maps Embed iframe (tanpa key, `q=SMKS+Bangun+Bangsa+Mandiri+Kandanghaur`) | - |
| Analitik | GA4 (consent mode) + Vercel Analytics + Vercel Speed Insights | - |
| Error tracking | Sentry (`@sentry/nextjs`) | latest |
| Hosting / CDN | Vercel (SSG+ISR+Edge) + Cloudflare DNS | - |
| CI/CD | GitHub Actions → Vercel Preview/Production | - |
| Test | Vitest + Testing Library (unit) + Playwright (E2E) | latest |
| Lint/Format | ESLint (next/core-web-vitals) + Prettier + tsc `--noEmit` | - |

### Arsitektur Sistem

```
                    ┌──────────────┐
                    │   Browser    │
                    │ Mobile+Desktop│
                    └──────┬───────┘
                           │ HTTPS
                    ┌──────▼───────┐
                    │  Vercel Edge  │
                    │ CDN + ISR Cache│
                    └──────┬───────┘
                           │
            ┌──────────────▼──────────────┐
            │  Next.js 15 App Router      │
            │  RSC (SSG/ISR) + Client     │
            │  Islands (filter/form/      │
            │  lightbox/count-up)         │
            └──┬─────────┬──────────┬─────┘
               │         │          │
     ┌─────────▼──┐ ┌────▼────┐ ┌───▼────────┐
     │ Route      │ │ Server  │ │ Decap CMS  │
     │ Handlers   │ │ Actions │ │ /content/*.md│
     │ /api/*     │ │ (PPDB,  │ │ + /public/ │
     │ validasi   │ │ kontak) │ │ images     │
     │ Zod + RL   │ │         │ └────────────┘
     └─────────┬──┘ └────┬────┘
               │         │
        ┌──────▼─────────▼──────┐
        │  Supabase Postgres    │
        │  + Storage (KK privat │
        │  signed-URL 15 mnt)   │
        └──────┬────────────────┘
               │ async (queue in-route, retry 3x)
     ┌─────────▼────────┐  ┌──────────────┐
     │ Resend SMTP      │  │ GA4+Vercel   │
     │ humas@...        │  │ Analytics    │
     └──────────────────┘  └──────────────┘
              │ fallback: wa.me manual, server log count
```

**Pola render:**
- `SSG + ISR`: `/`, `/profil`, `/jurusan`, `/fasilitas`, `/galeri` → `revalidate` 24 jam (86400s); `/berita`, `/berita/[slug]` → 1 jam (3600s).
- `SSR dynamic`: `/ppdb` (status gelombang live) → `dynamic = 'force-dynamic'` untuk countdown, tapi section biaya di-cache via `fetch(..., {next:{revalidate:3600}})`.
- `Client islands` seminimal mungkin agar bundle awal ≤180KB gzip (FR NFR): filter chips, search debounce, lightbox, form PPDB, countdown, carousel, toast.

### Struktur Folder (Next.js App Router best practice)

```
smkbbmkdh/
├── bun.lockb
├── package.json            # scripts pakai bun
├── next.config.mjs         # images remote, headers CSP, experimental optimize
├── tailwind.config.ts      # token DESIGN.md Bagian 1
├── drizzle.config.ts
├── content/                # Decap CMS source (md + json)
│   ├── profil.json         # visi, misi[7], tujuan[7], sejarah, kepsek
│   ├── hero.json           # hero H1, stats, testimoni
│   ├── ppdb.json           # gelombang, biaya, syarat, faq
│   └── kontak.json
├── public/
│   ├── images/             # hero, jurusan, fasilitas (AVIF/WebP ≤200KB)
│   └── og-default.png      # 1200x630
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Navbar+Topbar, Footer, WA float, GA4, font Plus Jakarta Sans
│   │   ├── page.tsx        # Screen 01 /
│   │   ├── profil/page.tsx # Screen 02
│   │   ├── jurusan/page.tsx + [slug]/page.tsx  # Screen 03
│   │   ├── fasilitas/page.tsx                  # Screen 04
│   │   ├── berita/page.tsx + [slug]/page.tsx   # Screen 05
│   │   ├── ppdb/page.tsx + bukti/[id]/page.tsx # Screen 06 + FR-17
│   │   ├── galeri/page.tsx                     # Screen 07
│   │   ├── kontak/page.tsx                     # Screen 08
│   │   ├── admin/page.tsx  # redirect ke /admin (Decap)
│   │   ├── api/
│   │   │   ├── jurusan/route.ts + [slug]/route.ts
│   │   │   ├── berita/route.ts + [slug]/route.ts
│   │   │   ├── fasilitas/route.ts
│   │   │   ├── galeri/route.ts
│   │   │   ├── ppdb/submit/route.ts + status/route.ts + bukti/[id]/route.ts
│   │   │   ├── kontak/route.ts
│   │   │   ├── notify/route.ts
│   │   │   └── health/route.ts
│   │   ├── sitemap.ts + robots.ts + manifest.ts
│   │   └── globals.css     # CSS vars token DESIGN.md
│   ├── components/
│   │   ├── ui/             # Button, Badge, Input, Select, Textarea, Accordion, Dialog
│   │   ├── Navbar.tsx + Topbar.tsx + Footer.tsx + WAFloat.tsx
│   │   ├── SectionHeading.tsx + JurusanCard.tsx + BeritaCard.tsx
│   │   ├── Lightbox.tsx + TestimoniCarousel.tsx + StatsCounter.tsx
│   │   ├── PPDBForm.tsx + BiayaTable.tsx + FAQ.tsx + Countdown.tsx
│   │   └── MapsEmbed.tsx + ShareButtons.tsx + EmptyState.tsx + ErrorBanner.tsx
│   ├── lib/
│   │   ├── db.ts           # drizzle client
│   │   ├── schema.ts       # drizzle schema (Bagian 2)
│   │   ├── supabase.ts     # server + client helpers
│   │   ├── validations.ts  # zod schemas PPDB/kontak
│   │   ├── rate-limit.ts   # upstash/redis-memory V1 (in-memory + Vercel KV opsional)
│   │   ├── mail.ts         # resend
│   │   ├── utils.ts        # cn(), formatIDR, formatTanggalID
│   │   ├── constants.ts    # nav 8 rute, kategori, jam layanan
│   │   └── analytics.ts    # GA4 events click_daftar_ppdb dsb
│   └── content.ts          # loader content/*.json + fallback hardcoded visi
├── drizzle/
│   └── 0001_init.sql
├── tests/
│   ├── unit/validations.test.ts + format.test.ts
│   ├── integration/ppdb.test.ts + kontak.test.ts
│   └── e2e/ppdb.spec.ts + navigasi.spec.ts + profil.spec.ts
└── .github/workflows/ci.yml
```

### Code Snippets

```ts
// next.config.mjs — image optimize + security headers + ISR
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
    deviceSizes: [360, 640, 828, 1200],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        // CSP ketat, izinkan maps + GA4 + vercel insights
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com; img-src 'self' data: https:; frame-src https://www.google.com https://maps.google.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com;" },
      ],
    }];
  },
};
export default nextConfig;
```

```css
/* src/app/globals.css — token DESIGN.md Bagian 1 */
:root {
  --color-primary: #0E7C5B; --color-primary-hover: #0A5F46; --color-primary-soft: #E6F4EE;
  --color-secondary: #F59E0B; --color-background: #F8FAFC; --color-surface: #FFFFFF;
  --color-text-primary: #0F172A; --color-text-secondary: #64748B; --color-border: #E2E8F0;
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px;
}
```

### Justifikasi
- **Next.js App Router:** Kebutuhan PRD FR-01/06/12 (SSG+ISR, SEO meta/sitemap/JSON-LD School, image optimize) + ISR 1 jam/24 jam tanpa server stateful. Alternatif Astro lebih ringan tapi Server Actions + ekosistem form + ISR Vercel lebih matang di Next.
- **Supabase Postgres + Drizzle:** FR-07 butuh relasi jurusan→pendaftaran + unique nomor bukti + signed-URL KK privat. Supabase free menutup DB+storage+auth admin sekaligus, scale ke 5rb form/th tanpa migrasi.
- **Decap CMS git-based:** FR-14 Humas non-teknis update <48 jam, gratis, preview + rollback via git revert, tanpa biaya Strapi hosting.
- **Vercel:** Preview per PR + ISR + Analytics/Speed Insights untuk KPI LCP <2.5s, zero-config dengan Next.
- **Tanpa global store:** Semua filter via URL (`?q=&kategori=`) agar shareable + SSR-friendly, JS minimal untuk target 180KB.

---

## BAGIAN 2: Database Design

### Ringkasan Database

| Item | Detail |
|------|--------|
| Database | Supabase Postgres 15+ (managed, TLS 1.2+) |
| ORM/Driver | Drizzle ORM (`drizzle-orm/postgres-js`) + `postgres` driver + `@supabase/supabase-js` untuk Storage/Auth |
| Pendekatan | Relational, normalisasi V1 (1 tabel per domain PRD) |
| Tools Migrasi | Drizzle Kit (`bunx drizzle-kit generate` → `drizzle/*.sql` → apply via Supabase SQL / `bun run db:migrate`) |
| Enkripsi | PII at-rest via `pgcrypto` (`pgp_sym_encrypt`, key dari `PII_ENCRYPTION_KEY`), TLS in-transit, KK di bucket private |

### Entity Overview

| Entity | Field | Type | Constraints | Cardinality |
|--------|-------|------|-------------|-------------|
| `jurusan` | id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | 1:N ke ppdb_registration |
| | slug | VARCHAR(80) | NOT NULL, UNIQUE, CHECK (slug ~ '^[a-z0-9-]+$') | |
| | nama | VARCHAR(120) | NOT NULL | |
| | kategori | VARCHAR(40) | NOT NULL, DEFAULT 'Vokasi' | |
| | deskripsi | TEXT | NULLABLE | |
| | durasi | VARCHAR(20) | NOT NULL, DEFAULT '3 Tahun' | |
| | skills | JSONB | NOT NULL, DEFAULT '[]' | maks 4 tampil, "+n" di UI |
| | prospek | JSONB | NOT NULL, DEFAULT '[]' | 3 bullet |
| | biaya_masuk | INTEGER | NOT NULL, DEFAULT 0 (IDR) | |
| | spp_bulanan | INTEGER | NOT NULL, DEFAULT 0 | |
| | cover_url | TEXT | NULLABLE | 16:9, alt=nama |
| | kurikulum | JSONB | NULLABLE | |
| | is_active | BOOLEAN | NOT NULL, DEFAULT true | draft tidak tampil (FR-06 aturan) |
| | sort_order | INTEGER | NOT NULL, DEFAULT 0 | |
| | created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| `fasilitas` | id | UUID | PK | |
| | nama | VARCHAR(120) | NOT NULL | |
| | kategori | VARCHAR(20) | NOT NULL, CHECK IN ('Iman','Vokasi','Penunjang') | |
| | kapasitas | VARCHAR(60) | NULLABLE ("40 PC") | |
| | deskripsi | TEXT | NULLABLE | |
| | foto_urls | TEXT[] | NOT NULL, DEFAULT '{}' | 4:3, lightbox multi |
| | is_featured | BOOLEAN | NOT NULL, DEFAULT false | |
| `berita` | id | UUID | PK | N:1 ke penulis implisit (author TEXT V1) |
| | slug | VARCHAR(160) | NOT NULL, UNIQUE | |
| | judul | VARCHAR(200) | NOT NULL | 2 baris ellipsis di card |
| | excerpt | VARCHAR(300) | NULLABLE | |
| | body | TEXT | NOT NULL (markdown, sanitasi allowlist) | |
| | kategori | VARCHAR(40) | NOT NULL (Prestasi/DUDI/Wirausaha/Pengumuman) | |
| | cover_url | TEXT | NULLABLE | |
| | author | VARCHAR(80) | NOT NULL, DEFAULT 'Humas SMK BBM' | |
| | published_at | TIMESTAMPTZ | NULLABLE (NULL=draft, tidak tampil publik) | |
| | reading_minutes | INTEGER | NOT NULL, DEFAULT 3 | tampil "• 3 mnt baca" |
| | views | INTEGER | NOT NULL, DEFAULT 0 | increment async |
| `pengumuman` | id | UUID | PK | standalone, tampil di sidebar |
| | judul | VARCHAR(200) | NOT NULL | |
| | body | TEXT | NOT NULL | |
| | is_pinned | BOOLEAN | NOT NULL, DEFAULT false | pin di atas |
| | published_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| | expires_at | TIMESTAMPTZ | NULLABLE | lewat → sembunyi |
| `galeri` | id | UUID | PK | |
| | caption | VARCHAR(200) | NOT NULL (bermakna, bukan IMG_123) | |
| | kategori | VARCHAR(40) | NOT NULL (Seni/Olahraga/Keagamaan/Praktik/Wirausaha) | |
| | taken_at | DATE | NULLABLE | format "Agu 2026" |
| | image_url | TEXT | NOT NULL | lazy + blurhash |
| | video_url | TEXT | NULLABLE (YouTube embed facade) | |
| `ekskul` | id | UUID | PK | |
| | nama | VARCHAR(80) | NOT NULL, UNIQUE | Pramuka/Futsal/Hadroh/dll |
| | jadwal | VARCHAR(120) | NULLABLE ("Jumat 15.30 • Lapangan") | |
| | pembina | VARCHAR(80) | NULLABLE | |
| `prestasi` | id | UUID | PK | |
| | judul | VARCHAR(200) | NOT NULL ("Juara 2 Futsal Kab. 2025") | |
| | tahun | INTEGER | NOT NULL | filter tahun galeri |
| | tingkat | VARCHAR(40) | NULLABLE | badge emas/perak |
| `ppdb_gelombang` | id | UUID | PK | 1:N ke ppdb_registration + notify_subscriber |
| | nama | VARCHAR(60) | NOT NULL (Gel. 1/2/3) | |
| | start_date | DATE | NOT NULL | |
| | end_date | DATE | NOT NULL, CHECK (end_date >= start_date) | |
| | kuota | INTEGER | NOT NULL, DEFAULT 200 | |
| | status | VARCHAR(20) | NOT NULL, DEFAULT 'tutup', CHECK IN ('buka','tutup') | tutup→disable form (FR-08) |
| | biaya | JSONB | NOT NULL (rincian transparan IDR) | |
| | syarat | JSONB | NOT NULL, DEFAULT '[]' | |
| `ppdb_registration` | id | UUID | PK | N:1 ke jurusan & gelombang |
| | nomor_bukti | VARCHAR(20) | NOT NULL, UNIQUE (`PPDB-2026-XXXX`, nanoid 4 acak) | tanpa auth V1, ID sulit ditebak |
| | nama | TEXT | NOT NULL, CHECK (char_length(nama)>=3) — enkripsi pgcrypto | PII anak |
| | asal_smp | VARCHAR(120) | NOT NULL | datalist SMP Kandanghaur |
| | jurusan_id | UUID | FK → jurusan.id, NOT NULL, ON RESTRICT | |
| | gelombang_id | UUID | FK → ppdb_gelombang.id, NOT NULL | |
| | wa | TEXT | NOT NULL (enkripsi; validasi 10-14 digit, normalisasi 62) | duplikat WA+nama ditandai |
| | tgl_lahir | DATE | NULLABLE, CHECK (usia ≥12 th implisit via app) | |
| | kk_file_url | TEXT | NULLABLE (path storage privat, bukan URL publik) | JPG/PDF ≤2MB |
| | consent_wali | BOOLEAN | NOT NULL, DEFAULT false, CHECK (consent_wali = true) | wajib UU PDP |
| | status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' (pending/verified/rejected) | |
| | ip_hash | VARCHAR(64) | NULLABLE (SHA256 IP, bukan IP mentah — hindari PII di log) | rate-limit 5/mnt/IP |
| | created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| `kontak_message` | id | UUID | PK | standalone |
| | nama | VARCHAR(120) | NOT NULL | PII dewasa, retensi 1 th |
| | wa | VARCHAR(20) | NOT NULL | |
| | keperluan | VARCHAR(40) | NOT NULL (PPDB/Biaya/Kerjasama/Lainnya) | |
| | pesan | TEXT | NOT NULL, CHECK (char_length>=10) | sanitasi XSS |
| | status | VARCHAR(20) | NOT NULL, DEFAULT 'baru' | |
| | created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| `notify_subscriber` | id | UUID | PK | N:1 ke gelombang |
| | wa | VARCHAR(20) | NOT NULL | form "Ingatkan saya" 1 field |
| | gelombang_id | UUID | FK → ppdb_gelombang.id, NULLABLE | |
| | created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | UNIQUE (wa, gelombang_id) |
| `testimoni` | id | UUID | PK | |
| | nama | VARCHAR(80) | NOT NULL | |
| | angkatan | VARCHAR(10) | NULLABLE | |
| | status_text | VARCHAR(120) | NULLABLE ("Kerja di X / Kuliah di Y") | |
| | quote | TEXT | NOT NULL | carousel |
| `site_config` | key | VARCHAR(60) | PK (hero, stats, kontak, jam, sosmed) | singleton KV |
| | value | JSONB | NOT NULL | |
| | updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

### Cardinality Summary

| Relation | Type | Description |
|----------|------|-------------|
| jurusan → ppdb_registration | 1:N | Satu jurusan dilamar banyak pendaftar; hapus jurusan di-RESTRICT jika ada pendaftar |
| ppdb_gelombang → ppdb_registration | 1:N | Satu gelombang menampung banyak form; tanpa gelombang aktif form disabled |
| ppdb_gelombang → notify_subscriber | 1:N | Satu gelombang ditunggu banyak WA |
| berita/pengumuman/galeri/testimoni | standalone | Tanpa FK, query by kategori/tahun + published_at |

### Index Strategy

- `jurusan.slug` UNIQUE BTREE — lookup `/jurusan/[slug]` ISR
- `jurusan.is_active, sort_order` — list filter cepat
- `berita.slug` UNIQUE BTREE + `berita(published_at DESC)` WHERE published_at IS NOT NULL — feed + RSS
- `berita(kategori, published_at DESC)` — chips filter
- `ppdb_registration.nomor_bukti` UNIQUE — cetak bukti `/ppdb/bukti/[id]`
- `ppdb_registration(gelombang_id, created_at DESC)` — hitung kuota + admin review
- `ppdb_registration(jurusan_id)` — FK index
- `kontak_message(created_at DESC)` + `notify_subscriber(wa)` — inbox + dedup
- `galeri(kategori, taken_at DESC)` — filter masonry

### Data Flow

```
Decap CMS (content/*.json) → build-time loader (src/content.ts) → SSG/ISR pages
  └─ fallback hardcoded visi (DESIGN Screen 02) jika CMS gagal → banner retry

Humas via Supabase dashboard (jurusan/berita/galeri/biaya) → Postgres → ISR revalidate (1j/24j) → CDN

Calon siswa → PPDBForm (Zod client) → POST /api/ppdb/submit (Zod server + RL + honeypot)
  → simpan ppdb_registration + upload KK ke Storage privat
  → async Resend ke humas + WA prefilled link ke user
  → success PPDB-2026-XXXX + /ppdb/bukti/[id] (print + QR)

Pengunjung → /kontak form → kontak_message → Resend + toast
Gelombang tutup → ppdb_registration ditolak (409) → tawarkan notify_subscriber
```

### Data Migration Strategy

- **From Legacy:** Tidak ada legacy DB V1 (fresh). Jika Humas punya Google Sheet sementara → skrip `bun run import:sheet --csv` mapping kolom → validasi Zod → insert batch 500 rows → verifikasi count.
- **Versioning:** Semua perubahan via `drizzle-kit generate` → file `drizzle/000X_*.sql` di-commit; apply staging dulu, prod via `bun run db:migrate` di CI sebelum deploy.
- **Rollback:** Setiap migration punya `down` (Drizzle `drizzle-kit drop` / SQL revert manual di folder `drizzle/down/`); backup Supabase harian (retensi 30 hari, PITR jika paket mendukung) sebelum migrasi destruktif.
- **Zero Downtime:** Pattern expand-contract (tambah kolom nullable → backfill → NOT NULL), tanpa rename tabel saat PPDB puncak; feature flag `site_config.maintenance`.

### Seed Data

| Data | Purpose | Quantity |
|------|---------|----------|
| `jurusan` 6 baris (contoh TKR/TKJ/AK/LP/Busana/DKV — finalisasi kepsek) | Dropdown + cards + detail | 6 |
| `ppdb_gelombang` Gel.1 buka + Gel.2 tutup | Countdown + tabel biaya + FAQ | 2 |
| `berita` 6 + `pengumuman` 3 pin + `agenda` 2 | Home preview 3 + sidebar | 11 |
| `fasilitas` 9 (3 per kategori Iman/Vokasi/Penunjang) | Grid + featured | 9 |
| `galeri` 12 + `ekskul` 6 + `prestasi` 4 + `testimoni` 4 | Galeri masonry + timeline + carousel | 26 |
| `site_config` hero/stats/kontak | Hero H1, stats count-up, alamat Kemped | 5 keys |
| Admin Supabase Auth (humas@…) | Akses dashboard + storage | 1 |

### Code Snippets

```ts
// src/lib/schema.ts (Drizzle, ringkas)
import { pgTable, uuid, varchar, text, integer, boolean, jsonb, timestamptz, date } from 'drizzle-orm/pg-core';
export const jurusan = pgTable('jurusan', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  nama: varchar('nama', { length: 120 }).notNull(),
  kategori: varchar('kategori', { length: 40 }).notNull().default('Vokasi'),
  skills: jsonb('skills').notNull().default([]),
  prospek: jsonb('prospek').notNull().default([]),
  biayaMasuk: integer('biaya_masuk').notNull().default(0),
  sppBulanan: integer('spp_bulanan').notNull().default(0),
  coverUrl: text('cover_url'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamptz('created_at').notNull().defaultNow(),
});
export const ppdbRegistration = pgTable('ppdb_registration', {
  id: uuid('id').defaultRandom().primaryKey(),
  nomorBukti: varchar('nomor_bukti', { length: 20 }).notNull().unique(),
  nama: text('nama').notNull(), // enkripsi di SQL via pgp_sym_encrypt saat insert mentah; app kirim plaintext via TLS
  asalSmp: varchar('asal_smp', { length: 120 }).notNull(),
  jurusanId: uuid('jurusan_id').notNull().references(() => jurusan.id),
  wa: text('wa').notNull(),
  consentWali: boolean('consent_wali').notNull().default(false),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamptz('created_at').notNull().defaultNow(),
});
```

```sql
-- drizzle/0001_init.sql (cuplikan constraints)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE UNIQUE INDEX jurusan_slug_idx ON jurusan (slug);
CREATE INDEX berita_feed_idx ON berita (published_at DESC) WHERE published_at IS NOT NULL;
ALTER TABLE ppdb_registration ADD CONSTRAINT chk_consent CHECK (consent_wali = true);
```

---

## BAGIAN 3: Interface Design

> Next.js App Router: **pages (RSC)** untuk 8 screen + **Route Handlers** untuk API. Monolith ringan, tanpa backend terpisah.

### Halaman (Screens DESIGN.md → Routes)

| Route | Screen | Fetch | Cache |
|-------|--------|-------|-------|
| `/` | 01 Home | hero/stats (content), `jurusan?limit=4`, `berita?limit=3`, testimoni | ISR 24j, berita section 1j |
| `/profil` | 02 Profil | content profil.json + fallback hardcoded visi | ISR 24j |
| `/jurusan` + `/jurusan/[slug]` | 03 Program Keahlian | DB jurusan, related 3, breadcrumb | ISR 24j, 404 ramah |
| `/fasilitas` | 04 Fasilitas | DB fasilitas by kategori | ISR 24j |
| `/berita` + `/berita/[slug]` | 05 Berita | DB berita + pengumuman pin + agenda | ISR 1j, RSS `/berita/rss.xml` |
| `/ppdb` + `/ppdb/bukti/[id]` | 06 PPDB | gelombang live + biaya + FAQ + submit | dynamic (status), bukti cache 7 hari |
| `/galeri` | 07 Galeri | galeri + ekskul + prestasi | ISR 1j |
| `/kontak` | 08 Kontak | site_config kontak + Maps embed | ISR 24j |

### Endpoint List (Route Handlers)

| Method | Path / Action | Description | Auth | Request Body | Response |
|--------|---------------|-------------|------|-------------|----------|
| GET | `/api/jurusan?q=&kategori=&limit=` | List jurusan + filter client/server | No | query | `{data: Jurusan[], meta:{total}}` |
| GET | `/api/jurusan/[slug]` | Detail + related 3 | No | - | `{data, related[]}` |
| GET | `/api/fasilitas?kategori=` | List fasilitas Iman/Vokasi/Penunjang | No | query | `{data[]}` |
| GET | `/api/berita?kategori=&q=&page=&limit=` | Feed + search + pagination | No | query | `{data[], meta{page,total}}` |
| GET | `/api/berita/[slug]` | Detail artikel + related + increment views async | No | - | `{data, related[]}` |
| GET | `/api/galeri?kategori=&tahun=` | Masonry + ekskul + prestasi (3 query paralel) | No | query | `{galeri[], ekskul[], prestasi[]}` |
| GET | `/api/ppdb/status` | Gelombang aktif + countdown + kuota sisa | No | - | `{gelombang, sisaHari, sisaKuota}` |
| POST | `/api/ppdb/submit` | Submit form PPDB + upload KK + generate ID (FR-07) | No + RL+Honeypot | multipart/form | `{data:{nomorBukti, waLink}}` |
| GET | `/api/ppdb/bukti/[id]` | Data bukti print-friendly + QR (FR-17, tanpa KK full) | No (ID acak) | - | `{data:{nama samaran, jurusan, tanggal}}` |
| POST | `/api/kontak` | Form pesan (FR-10) | No + RL+Honeypot | JSON | `{data:{id}}` |
| POST | `/api/notify` | "Ingatkan saya" saat gelombang tutup (FR-08) | No + RL | JSON `{wa}` | `{data:{id}}` |
| GET | `/api/health` | Health + DB ping untuk CI/monitoring | No | - | `{ok, dbMs}` |

Auth: `No` = publik. Tulis (submit/kontak/notify) dilindungi **honeypot + rate-limit 5/mnt/IP + Zod server + Turnstile invisible jika spam >5%**. Baca admin (dashboard Supabase) pakai Supabase Auth + RLS; `service_role` hanya di server (`SUPABASE_SERVICE_ROLE_KEY` tidak pernah ke client).

### Standarisasi Response Format

Sukses:
```json
{ "success": true, "data": { "nomorBukti": "PPDB-2026-A7X2", "waLink": "https://wa.me/62xxx?text=..." }, "error": null, "meta": null }
```
List + pagination:
```json
{ "success": true, "data": [{ "slug": "tkj", "nama": "Teknik Komputer Jaringan" }], "error": null, "meta": { "page": 1, "limit": 12, "total": 6, "totalPages": 1 } }
```
Error:
```json
{ "success": false, "data": null, "error": { "code": "VALIDATION_ERROR", "message": "No. WA harus 10-14 digit.", "details": [{ "field": "wa", "reason": "too_short" }] }, "meta": null }
```

### Error Codes

| Code | HTTP | Description | Dipakai di |
|------|------|-------------|------------|
| VALIDATION_ERROR | 422 | Zod gagal (nama <3, WA salah, file >2MB) | submit/kontak/notify |
| NOT_FOUND | 404 | Slug/ID tidak ada → 404 ramah + alternatif | jurusan/berita/bukti |
| UNAUTHORIZED | 401 | Token admin invalid (dashboard only) | admin routes |
| FORBIDDEN | 403 | RLS tolak / CSRF gagal | mutasi admin |
| CONFLICT | 409 | Gelombang tutup / duplikat WA+nama (ditandai, tetap 200 + warning? pilih 409 + saran WA) | submit |
| RATE_LIMITED | 429 | >5 submit/mnt/IP | semua POST |
| PAYLOAD_TOO_LARGE | 413 | KK >2MB / bukan JPG-PDF | submit |
| INTERNAL_ERROR | 500 | DB/mail down → banner + WA darurat, draft local aman | semua |

### Pagination Format

- **Method:** Page-based (simple, SEO-friendly untuk berita).
- **Request:** `GET /api/berita?page=2&limit=9&kategori=Prestasi&q=las`
- **Response meta:** `{ "page": 2, "limit": 9, "total": 42, "totalPages": 5 }`
- **Aturan:** `limit` maks 24, default 9; `q` min 2 char (DESIGN Screen 03/05); hasil count live `aria-live`.

### Code Snippets

```ts
// src/app/api/ppdb/submit/route.ts
import { NextResponse } from 'next/server';
import { ppdbSchema } from '@/lib/validations';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendAdminMail } from '@/lib/mail';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = await checkRateLimit(`ppdb:${ip}`, 5, 60_000);
  if (!rl.ok) return NextResponse.json(
    { success: false, data: null, error: { code: 'RATE_LIMITED', message: 'Terlalu sering. Coba lagi 1 menit.' } },
    { status: 429 });

  const form = await req.formData();
  if (form.get('website')) return NextResponse.json({ success: true, data: { honeypot: true }, error: null }, { status: 200 }); // honeypot
  const parsed = ppdbSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return NextResponse.json(
    { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Periksa kembali isian.', details: parsed.error.flatten() } },
    { status: 422 });

  // TODO: cek gelombang buka, simpan + upload KK privat, kirim Resend async (retry 3x), kembalikan nomorBukti + waLink
  // ...
  return NextResponse.json({ success: true, data: { nomorBukti: 'PPDB-2026-XXXX', waLink: 'https://wa.me/62...' }, error: null });
}
```

```ts
// src/lib/validations.ts (share client+server)
import { z } from 'zod';
export const waRegex = /^(08\d{8,12}|628\d{8,12}|\+628\d{8,12})$/;
export const ppdbSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 huruf').regex(/^[A-Za-z\s.'-]+$/, 'Nama hanya huruf'),
  asalSmp: z.string().min(3, 'Isi asal SMP'),
  jurusanId: z.string().uuid('Pilih jurusan'),
  wa: z.string().regex(waRegex, 'No. WA 10-14 digit diawali 08'),
  tglLahir: z.string().optional(),
  consentWali: z.literal(true, { errorMap: () => ({ message: 'Centang persetujuan wali (UU PDP)' }) }),
});
```

---

## BAGIAN 4: Alur Logika & Business Rules

### Alur Fitur 1 — Daftar PPDB (Flow 1, FR-07/08, US-09/10, Screen 06)

1. User buka `/ppdb` → `GET /api/ppdb/status` tampilkan badge Buka (dot hijau) + countdown + steps 1-2-3 + tabel biaya IDR + FAQ accordion.
2. Jika `?jurusan=slug` dari card jurusan → select ter-prefill + estimasi biaya update (client).
3. User isi form (nama, asal SMP datalist, jurusan, WA auto-62, tgl lahir, upload KK opsional, checkbox wali) → Zod client inline + draft autosave `localStorage['ppdb-draft']` tiap 500ms.
4. Submit → tombol loading anti double-click + `X-Idempotency-Key: uuid` header → `POST /api/ppdb/submit`.
5. Server: RL → honeypot → Zod → cek gelombang `buka` (tutup→409 + tawarkan notify) → normalisasi WA → scan mime KK (JPG/PDF, ≤2MB, nama acak, bucket privat) → generate `PPDB-YYYY-NANOID4` → insert (PII enkripsi) → Resend async ke humas (retry 3x) → increment kuota.
6. Sukses → hapus draft → success card hijau + confetti ringan + nomor monospace + QR + tombol WA prefilled `Assalamualaikum, saya [nama] no [ID]...` + unduh/cetak `/ppdb/bukti/[id]`.
7. Gagal/offline → banner merah + draft aman + tombol WA darurat; online → auto-enable + retry.

### Alur Fitur 2 — Validasi Visi Misi & Kepercayaan (Flow 2, FR-02, US-03, Screen 02)

1. `/` scroll ringkasan profil + testimoni + DUDI → klik ke `/profil`.
2. `/profil` render tab desktop (`role=tablist`, arrow keys) / accordion mobile (Visi terbuka default) → Visi quote + Misi 7 numbered + Tujuan 7 checklist, **verbatim user**.
3. CMS gagal → fallback hardcoded visi + banner retry; kosong → fallback NPSN+alamat.
4. Lanjut ke `/fasilitas` + `/galeri` (tabs Iman/Vokasi/Penunjang, lightbox Esc/arrows) → `/kontak` (copy alamat, Maps lazy, form pesan).

### Alur Fitur 3 — Jelajah Jurusan & Berita (FR-03/04/06, US-05/07, Screen 03/05)

1. `/jurusan?q=&kategori=` → debounce 300ms, min 2 char → count live `Menampilkan X dari Y` (`aria-live`) → empty → Reset + WA link → card CTA prefill PPDB.
2. `/jurusan/[slug]` → breadcrumb + kurikulum + related 3 → slug invalid → 404 ramah + daftar alternatif.
3. `/berita` → featured + grid + sidebar pin + load more → detail share WA/FB/copy + toast → tanggal `12 Jan 2026 • 3 mnt baca` (id-ID).

### Alur Fitur 4 — Kontak & CMS Humas (FR-10/14, US-11/12, Screen 08)

1. `/kontak` → info card + Maps lazy (`title="Peta SMK BBM"`) → gagal → static + rute app → form pesan (validasi sama PPDB) → toast + reset → Resend ke humas.
2. Humas edit Decap `/admin` (visual + upload ≤1MB auto-compress) → preview → publish → commit → Vercel rebuild/ISR revalidate ≤5 mnt → rollback via git revert 1 versi.

### Business Rules (dari PRD)

- Teks Visi+7 Misi+7 Tujuan **verbatim**, tidak diringkas AI; fallback statis wajib ada.
- WA 10-14 digit, normalisasi `08xx→62`; nama ≥3 char huruf; file KK JPG/PDF ≤2MB opsional; checkbox wali **wajib** (UU PDP anak <18).
- Nomor bukti `PPDB-YYYY-XXXX` unik, acak sulit ditebak; halaman bukti tanpa KK full, tanpa auth V1.
- Gelombang tutup → form disabled otomatis + tampilkan form notify 1 field WA.
- IDR `Rp 1.250.000`, tanggal id-ID, bahasa santai ("Ayah/Bunda" di PPDB).
- Draft PPDB/kontak **tidak pernah hilang** saat gagal/offline (localStorage + server idempotent).
- PII tidak masuk log/GA; email subject tanpa PII; KK signed-URL 15 mnt, hapus ≤1 th pasca verifikasi.

### Error Handling & Retry Strategy

**Global Error Middleware:**
- `app/error.tsx` + `not-found.tsx` per segment (404/500 ramah + CTA pulang + WA).
- Route Handlers dibungkus `withError()` → response standar Bagian 3 + log JSON (tanpa PII) + Sentry capture (5xx saja).
- Validasi client = UX, server = kebenaran (selalu Zod ulang + sanitasi `sanitize-html` allowlist untuk body berita).

**Retry Mechanism:**
- **Max Retries:** 3 (Resend/mail, Supabase fetch ISR, increment views).
- **Backoff:** Exponential + jitter (500ms → 1.5s → 4s).
- **Timeout:** 5s per attempt (fetch CMS/DB), 10s untuk upload KK.
- **Idempotency Key:** Header `X-Idempotency-Key` wajib untuk `POST /api/ppdb/submit` + `/api/kontak` (kolom `idempotency_key` UNIQUE 24 jam, duplikat → kembalikan hasil pertama, cegah double-click).

**Circuit Breaker (route `mail` + `supabase`):**
- **Threshold:** 5 gagal dalam 60 detik → open 30 detik.
- **Half-Open:** Setelah 30s izinkan 1 probe; sukses → close, gagal → open lagi.
- **Fallback:** Mail down → log + badge admin + tetap sukseskan PPDB (jangan blokir user); DB read gagal → ISR cache terakhir + banner retry.

**Fallback Strategy per Fitur:**

| Fitur | Primary | Fallback | Degradation |
|-------|---------|----------|-------------|
| Hero/berita home | Supabase/CMS live | ISR cache + statis | Tanpa berita segar, hero tetap tampil |
| Profil visi | CMS profil.json | Hardcoded verbatim | Tanpa foto kepsek baru |
| PPDB submit | Supabase insert | Draft local + WA manual darurat | Tanpa nomor otomatis, verifikasi manual |
| Notif admin | Resend | Server log + badge + WA manual | Delay <1x24 jam tetap via WA |
| Maps | Google embed | Static + alamat teks + tombol rute | Tanpa peta interaktif |
| GA4 | gtag | Server count submit (sumber kebenaran) | Tanpa funnel client |

### Code Snippets

```ts
// src/lib/with-error.ts + idempotency
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
export function ok(data: unknown, meta?: unknown) {
  return NextResponse.json({ success: true, data, error: null, meta: meta ?? null });
}
export function fail(code: string, message: string, status = 500, details?: unknown) {
  return NextResponse.json({ success: false, data: null, error: { code, message, details }, meta: null }, { status });
}
export async function withHandler(fn: () => Promise<Response>) {
  try { return await fn(); }
  catch (e) { Sentry.captureException(e); return fail('INTERNAL_ERROR', 'Terjadi gangguan. Coba lagi atau hubungi WA.', 500); }
}
```

```tsx
// PPDBForm draft + offline guard (ringkas)
useEffect(() => {
  const d = localStorage.getItem('ppdb-draft');
  if (d) reset(JSON.parse(d));
}, []);
useEffect(() => {
  const t = setTimeout(() => localStorage.setItem('ppdb-draft', JSON.stringify(getValues())), 500);
  return () => clearTimeout(t);
}, [watch()]);
const online = useOnline(); // navigator.onLine listener
<Button disabled={!online || isSubmitting} loading={isSubmitting}>Kirim Pendaftaran</Button>
```

---

## BAGIAN 5: Keamanan, Performa, CI/CD & Deployment

### Keamanan (relevan PRD NFR + UU PDP)

- HTTPS wajib + HSTS + CSP ketat + X-Frame + Referrer + Permissions (lihat `next.config.mjs`).
- Zod ganda (client UX, server otoritatif) + `sanitize-html` allowlist untuk body berita + escape semua插值.
- Upload KK: cek ekstensi + magic bytes + `file-type`, acak nama (`uuid.pdf`), bucket **private**, signed-URL 15 mnt, tanpa eksekusi, ≤2MB.
- PII enkripsi `pgcrypto` + TLS 1.2+; secret hanya `process.env` server; RLS Supabase: `anon` SELECT saja tabel publik aktif, INSERT PPDB/kontak via policy terbatas + service_role untuk baca PII (admin).
- Honeypot `website` + RL 5/mnt/IP (in-memory V1, naik ke Upstash Redis jika spam) + Turnstile invisible jika spam >5%; log hash IP, bukan IP mentah.
- Backup DB harian retensi 30 hari; admin 2FA + sesi 12 jam; audit log hapus data (siapa/kapan/ID, tanpa isi PII).

### Performa (target PRD NFR spesifik)

- LCP mobile ≤2.5s (4G Moto G4), CLS ≤0.1, INP ≤200ms, PageSpeed ≥85 mobile.
- Image AVIF/WebP + `next/image` + `sizes`, hero `priority/eager`, sisanya `lazy` + `blurDataURL`; tiap card ≤200KB.
- Bundle awal ≤180KB gzip: RSC default, `next/dynamic` untuk Lightbox/Carousel/Maps, `lucide-react` import per-ikon, font `Plus Jakarta Sans` subset latin + `display=swap`.
- API p95 <500ms: indeks Bagian 2 + ISR + `fetch` cache; support 500 concurrent baca (Vercel auto-scale + CDN), 50 submit/jam (Supabase free cukup + queue async mail).
- `prefers-reduced-motion`: matikan count-up/shimmer jadi statis; shimmer 1500ms hanya jika motion ok.

### CI/CD Pipeline

**Branch Strategy:** GitHub Flow sederhana (V1 tim kecil): `main` (prod) + `feat/*` PR → preview → squash merge.

| Stage | Trigger | Actions |
|-------|---------|---------|
| Build | Push any branch | `bun install --frozen-lockfile` → ESLint → `tsc --noEmit` → Vitest unit |
| Test | PR ke `main` | Integration (Supabase test DB) → Playwright E2E (Chromium+Mobile) → Lighthouse CI (LCP budget) |
| Staging | PR dibuka/update | Vercel Preview deploy + smoke `/api/health` + comment URL di PR |
| Production | Merge ke `main` + manual approve (Vercel Protection) | `drizzle migrate` → Vercel Production → revalidate ISR → smoke + Sentry release |

**Rollback Strategy:**
- **Code:** Vercel instant rollback ke deployment sebelumnya (1 klik) atau `git revert` + redeploy; tiap rilis tag `vYYYY.MM.DD-n` + Sentry release.
- **Database:** `down` SQL di `drizzle/down/` + restore backup pre-migrate (≤30 hari); migrasi destruktif dilarang saat gelombang buka.
- **Verification:** `/api/health` 200 + smoke Playwright (home, jurusan filter, ppdb submit dry-run) + cek Sentry 15 mnt pasca-rollback.

### Deployment

- Vercel project `smkbbm-kandanghaur` → framework Next.js, root `./`, build `bun run build`, output `.next`.
- Domain `smkbbm-kandanghaur.sch.id` (disediakan sekolah) via Cloudflare DNS → Vercel; apex + `www` redirect.
- Env prod di Vercel (bukan `.env` commit); preview pakai Supabase staging/branching.
- Decap CMS di `/admin` (static `admin/index.html + config.yml`), media ke `public/uploads` (≤1MB auto-compress via Decap + `next/image`).
- ISR cron: Vercel Cron `GET /api/revalidate?secret=` tiap 1 jam untuk berita (opsional, atau on-demand webhook CMS).

### Development Setup

```bash
# 1) Clone + install (WAJIB bun, bukan npm/node)
bun install

# 2) Env
cp .env.example .env.local
# isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
# DATABASE_URL, PII_ENCRYPTION_KEY, RESEND_API_KEY, ADMIN_EMAIL, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_WA_NUMBER

# 3) DB
bun run db:generate   # drizzle-kit generate
bun run db:migrate    # apply ke Supabase
bun run db:seed       # seed Tabel Bagian 2 (jurusan, gelombang, berita dummy, dst)

# 4) Dev
bun run dev           # http://localhost:3000
bun run admin         # http://localhost:3000/admin (Decap local backend)

# 5) Quality
bun run lint && bun run typecheck && bun run test && bun run test:e2e
bun run build && bun start
```

```json
// package.json scripts (bun)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "bun ./src/lib/seed.ts"
  }
}
```

---

## BAGIAN 6: Monitoring & Observability

### Ringkasan

Stack kecil: **Vercel Logs + Analytics + Sentry** cukup V1, tanpa ELK/Grafana self-host. GA4 untuk KPI produk (PRD success metrics), Sentry untuk error, Vercel Speed Insights untuk LCP.

### Logging

- **Format:** JSON structured (`{ts, level, reqId, route, msg, meta}` tanpa PII) via `pino` di Route Handlers; `X-Request-ID` propagate (middleware generate jika kosong).
- **Levels:** debug (dev only), info (submit sukses tanpa isi PII, hanya ID), warn (RL hit, fallback dipakai), error (5xx, mail gagal), fatal (DB down).
- **Aggregation:** Vercel Log Drains → Axiom (free) retensi 30 hari; PII di-redact (`wa`, `nama`, `kk`) sebelum log.
- **Retention:** Hot 30 hari (Axiom), cold export mingguan ke Supabase `audit_logs` (tanpa PII) 90 hari.

### Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Request rate | ~10rb visitor/bln (puncak PPDB 500 concurrent baca) | - | - |
| Error rate (5xx) | <1% | >1% 5mnt | >5% 5mnt |
| Latency P50 / P95 / P99 | <200ms / <500ms / <1s | P95 >1s 10mnt | P95 >2s 10mnt |
| LCP mobile (Speed Insights) | <2.5s | >2.5s | >4s |
| CLS / INP | ≤0.1 / ≤200ms | >0.1/>200ms | >0.25/>500ms |
| Supabase DB connections | <60% pool | >80% | >95% |
| Form funnel (GA4) | view_ppdb → submit sukses ≥40% | <30% | <15% |
| Resend bounce | <2% | >3% | >5% |

### Distributed Tracing

- **Tool:** Sentry Performance + Vercel Analytics (cukup V1, tanpa OTEL collector self-host).
- **Trace ID:** `X-Trace-ID`/`X-Request-ID` dari middleware → header respons + log + Sentry tag; Server Action sertakan di mail metadata.
- **Sampling:** 100% errors, 10% success traces (hemat kuota Sentry free).

### Alerting

| Alert | Condition | Channel | Priority |
|-------|-----------|---------|----------|
| High 5xx | error rate >5% 5mnt | WA Humas + Email + Slack (jika ada) | Critical |
| Health fail | `GET /api/health` non-200 3x | Vercel + Sentry + Email | Critical |
| High latency | P95 >2s 10mnt | Email | Warning |
| DB pool | >80% 5mnt | Email | Warning |
| PPDB spike | >50 submit/jam (puncak wajar) tapi error naik | WA Humas | Warning |
| Disk/storage | Supabase storage >80% | Email | Warning |

### Error Tracking

- **Service:** Sentry (`@sentry/nextjs`, DSN server+client, `tracesSampleRate: 0.1`).
- **Source Maps:** Upload otomatis saat `bun run build` via Sentry Vercel integration.
- **Alert on:** New issue (berita/PPDB), regression, spike >10 event/mnt.

### Dashboard

- **Tool:** Vercel Analytics (traffic+LCP) + GA4 Explore (CTR `click_daftar_ppdb`, pageviews `/profil`, funnel PPDB) + Sentry Issues + Supabase Table Editor (kuota gelombang).
- **Panels:** (1) LCP/CLS/INP per route, (2) submit/hari + status gelombang, (3) 5xx + P95 latency, (4) top jurusan diklik.

---

## BAGIAN 7: Environment Variables

### Database

- `DATABASE_URL` — Postgres connection (Drizzle migrate + server) — `postgresql://postgres:PASS@db.xxxx.supabase.co:5432/postgres`
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (publik) — `https://xxxx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon read publik — `eyJ...`
- `SUPABASE_SERVICE_ROLE_KEY` — server only, baca PII + storage privat — `eyJ... (JANGAN prefix NEXT_PUBLIC)`
- `PII_ENCRYPTION_KEY` — key pgcrypto AES-256 (32 byte base64) — `base64:xxx...`

### Auth (admin V1)

- `SUPABASE_JWT_SECRET` — verifikasi JWT admin dashboard — `xxx`
- `ADMIN_EMAIL` — penerima notif PPDB/pesan — `humas@smkbbm.sch.id`

### API Keys / Integrasi

- `RESEND_API_KEY` — kirim email notif — `re_xxx`
- `NEXT_PUBLIC_GA_ID` — GA4 measurement — `G-XXXXXXX`
- `NEXT_PUBLIC_WA_NUMBER` — WA Humas format 62 — `6281234567890`
- `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — anti-spam opsional jika spam >5% — `1x...`
- `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` — error tracking — `https://xxx@sentry.io/xxx`
- `REVALIDATE_SECRET` — trigger ISR on-demand dari CMS — `random-32-char`
- `CRON_SECRET` — Vercel Cron guard — `random-32-char`

### App Config

- `NODE_ENV` — `development` / `production`
- `NEXT_PUBLIC_APP_URL` — canonical — `https://smkbbm-kandanghaur.sch.id`
- `NEXT_PUBLIC_APP_NAME` — `SMK Bangun Bangsa Mandiri Kandanghaur`
- `IDEMPOTENCY_TTL_HOURS` — `24`
- `UPLOAD_MAX_MB` — `2`
- `RATE_LIMIT_PER_MIN` — `5`

> Semua secret di Vercel Project Settings (Production + Preview beda). `.env.local` tidak di-commit. Contoh di `.env.example`.

---

## BAGIAN 8: Testing Strategy

### Ringkasan

Piramida: banyak unit (validasi/format), sedang integration (API + DB test), sedikit E2E (flow konversi DESIGN). Semua via `bun`.

### Unit Testing

- **Framework:** Vitest + Testing Library (komponen murni).
- **Coverage Target:** ≥80% lines untuk `lib/` (validations, utils, mail template).
- **Contoh Test Case:**
  - `ppdbSchema` tolak nama 2 char, WA 9 digit, consent false; terima `081234567890` → normalisasi `628...`.
  - `formatIDR(1250000)` → `Rp 1.250.000`; `formatTanggalID('2026-01-12')` → `12 Jan 2026`.
  - `buildWaLink(nama, id)` hasilkan `wa.me/62...?text=Assalamualaikum...` encoded.
  - `Countdown` hitung sisa hari gelombang dari `end_date` (mock Date).
  - Filter jurusan: `q="las"` (min 2 char) kembalikan TKR, `q="x"` tampilkan empty state.

### Integration Testing

- **Framework:** Vitest + `next-test-api-route-handler` + Supabase branch / docker `supabase/postgres` + Resend mock.
- **Strategy:** Hit Route Handler asli dengan DB test terisolasi (truncate per test, seed minimal jurusan+gelombang).
  - `POST /api/ppdb/submit` valid → 200 + `PPDB-20XX-XXXX` unik + row terenkripsi + mail mock terpanggil 1x.
  - Double submit sama `X-Idempotency-Key` → 1 row saja (idempotent).
  - Gelombang tutup → 409 + saran notify; file 3MB → 413; spam 6x/mnt → 429.
  - `GET /api/berita?kategori=Prestasi&page=1` → meta totalPages benar, draft tidak bocor.

### E2E Testing

- **Framework:** Playwright (Chromium desktop + Pixel 5 mobile 360px).
- **Coverage (critical dari DESIGN.md):**
  - Navigasi 8 rute + drawer mobile + skip-to-content + breadcrumb L2.
  - Flow 1: Home → Jurusan filter → Detail → PPDB prefill → isi → sukses → bukti print.
  - Flow 2: Profil tab/accordion Visi-Misi-Tujuan verbatim terbaca SR.
  - Offline: `context.setOffline(true)` → submit disabled + draft aman → online → retry sukses.
  - A11y smoke: `axe-playwright` (kontras AA, `aria-invalid`, focus trap lightbox).
  - Perf smoke: Lighthouse CI assert LCP <2.5s di `/` mobile.

### Test Folder Structure

```
tests/
├── unit/
│   ├── validations.test.ts
│   ├── format.test.ts
│   └── wa-link.test.ts
├── integration/
│   ├── ppdb.test.ts
│   ├── kontak.test.ts
│   └── berita.test.ts
└── e2e/
    ├── navigasi.spec.ts
    ├── ppdb.spec.ts
    ├── profil.spec.ts
    └── galeri-lightbox.spec.ts
```

### Testing Config

- **Test Database:** Supabase branching (staging) atau `docker run supabase/postgres:15` lokal; `DATABASE_URL_TEST` terpisah; migrasi + seed otomatis di `globalSetup`.
- **Mock Strategy:** Mock Resend (`vitest.mock('@/lib/mail')`), mock `next/image` di unit, mock GA4 (`dataLayer` spy), jangan mock Zod/Drizzle (test asli).
- **CI Command:** `bun run lint && bun run typecheck && bun run test -- --coverage && bun run test:e2e` (Playwright dengan `webServer: bun run start`).
- **Coverage Threshold:** Lines ≥80%, Branches ≥70%, Functions ≥75% untuk `src/lib/**`; E2E wajib lolos 100% critical flows sebelum merge.

---

## BAGIAN 9: Data Migration & Seeding

> V1 **fresh, tanpa legacy**. Bagian ini = rencana seed + impor Sheet sementara (disebut di PRD Dependensi) + rollback.

### Migration Plan (fresh + impor opsional)

| Table / Collection | Source | Target | Strategy | Downtime |
|--------------------|--------|--------|----------|----------|
| Semua tabel Bagian 2 | — (fresh) | Supabase prod | `drizzle-kit migrate` via CI | No (tabel baru) |
| `jurusan`, `biaya` | Google Sheet sementara Humas (jika ada) | `jurusan`, `ppdb_gelombang.biaya` | `bun run import:sheet --csv sheet.csv` (Zod map + batch 500) | No |
| `berita` arsip | Word/Docs Humas | `berita` (draft → publish) | Paste ke Decap/Supabase + sanitasi | No |
| `content/*.json` | Teks Visi Misi Tujuan kepsek | repo `content/` | Manual 1x + review kepsek | No |

### Process

1. `bun run db:migrate` ke staging → verifikasi `/api/health` + smoke E2E.
2. Jika ada Sheet: `bun run import:sheet` → tampilkan diff count → konfirmasi Humas → insert → cek `SELECT count(*)` + sample 5 rows.
3. `bun run db:seed` (idempotent `ON CONFLICT DO NOTHING`): admin, 6 jurusan, 2 gelombang, 9 fasilitas, 11 berita/pengumuman, 26 galeri/ekskul/prestasi/testimoni, 5 site_config.
4. Cutover: merge ke `main` → Vercel prod → `GET /api/revalidate?secret=` → cek sitemap + RSS + GA4 Realtime.
5. Freeze data jurusan/biaya 1 minggu sebelum PPDB puncak (asumsi PRD).

### Rollback Plan

- Gagal migrate: jalankan `bun run db:rollback` (file `drizzle/down/000X.sql`) + restore Supabase backup harian (<30 hari) → verifikasi health.
- Gagal seed/import: `DELETE FROM <tabel> WHERE created_at > :cutover` (ID batch) atau restore snapshot; redeploy Vercel sebelumnya (instant rollback).
- Salah publish CMS: `git revert <commit-content>` + rebuild ≤5 mnt (FR-14 rollback 1 versi).

### Seed Data (Post-Migration)

| Data | Purpose | Command / Script |
|------|---------|-----------------|
| Admin Humas | Akses dashboard Supabase + Decap | buat manual di Supabase Auth + `bun run seed:admin --email humas@...` |
| Reference (jurusan, gelombang, fasilitas, ekskul) | Dropdown/filter/tabel biaya | `bun run db:seed` (file `src/lib/seed.ts`) |
| Demo (berita, galeri, testimoni, stats) | Preview visual + uji E2E | `bun run seed:demo` |
| Verifikasi | Pastikan count + ISR | `bun run verify:seed` (cek API + screenshot Playwright) |

```ts
// src/lib/seed.ts (idempotent)
import { db } from './db';
import * as s from './schema';
export async function seed() {
  await db.insert(s.jurusan).values([
    { slug: 'tkj', nama: 'Teknik Komputer Jaringan', kategori: 'Teknologi', skills: ['Mikrotik','Linux'], prospek: ['NOC','Teknisi'], biayaMasuk: 1500000, sppBulanan: 150000 },
    // ... 5 jurusan lain (finalisasi kepsek)
  ]).onConflictDoNothing();
  console.log('seed ok');
}
if (import.meta.main) seed();
```

---

## Lampiran: Traceability PRD ↔ DESIGN ↔ Spec

| PRD FR | DESIGN Screen | Tabel/Endpoint | Status |
|--------|---------------|----------------|--------|
| FR-01 Home | 01 `/` | jurusan limit 4, berita limit 3, ISR | ✅ |
| FR-02 Profil verbatim | 02 `/profil` | content profil.json + fallback | ✅ |
| FR-03/04 Jurusan | 03 `/jurusan[/slug]` | tabel jurusan + `/api/jurusan*` | ✅ |
| FR-05 Fasilitas | 04 `/fasilitas` | tabel fasilitas + lightbox | ✅ |
| FR-06 Berita | 05 `/berita[/slug]` | tabel berita/pengumuman + RSS | ✅ |
| FR-07/08/17 PPDB | 06 `/ppdb[/bukti]` | gelombang + registration + submit/bukti/notify | ✅ |
| FR-09 Galeri | 07 `/galeri` | galeri+ekskul+prestasi | ✅ |
| FR-10 Kontak | 08 `/kontak` | kontak_message + Maps | ✅ |
| FR-11/12/13 Nav/SEO/Analitik | Semua | layout, sitemap, GA4 events | ✅ |
| FR-14/15/16 CMS/Spam/Offline | Semua | Decap, RL+honeypot, draft+cache | ✅ |

*Siap lanjut ke Task Generator: `Buat Task berdasarkan Tech Spec dan DESIGN.md yang sudah dibuat`.*
