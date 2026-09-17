# PROGRESS.md — SMK BBM Kandanghaur

## Dashboard
- [x] create-design & design system ✅ Done (2026-09-16)
- [x] mini-prd ✅ Done (2026-09-16)
- [x] tech-spec ✅ Done (2026-09-16)
- [x] create-issues (TASKS.md) ✅ Done (2026-09-16)
- [x] implementasi ✅ Done (2026-09-16) — 16/16 task (T-01–T-16). Deploy prod menunggu aksi user (akun Vercel/Supabase/domain, lihat T-16)

## Detail Output — create-design
- **File:** `.agents/DESIGN.md`
- **Project:** Website Landing SMK Bangun Bangsa Mandiri (BBM) Kandanghaur
- **Platform:** Web Responsive (mobile-first)
- **Style:** Modern & Clean, Light mode
- **UVP:** Mandiri Berahlak, Terampil Berwirausaha — biaya terjangkau SNP
- **Screens (8):** 01 Home `/`, 02 Profil `/profil` (Visi+7 Misi+7 Tujuan verbatim), 03 Jurusan `/jurusan`, 04 Fasilitas `/fasilitas`, 05 Berita `/berita`, 06 PPDB `/ppdb`, 07 Galeri `/galeri`, 08 Kontak `/kontak`
- **Components (7):** Button, Navbar+Topbar, Section Heading, Card, Badge/Chip, Form Input, Footer
- **Stitch prompt:** Di-skip sesuai request (Tidak)
- **Next:** Ketik `Buat PRD berdasarkan DESIGN.md yang sudah dibuat`

## Detail Output — mini-prd
- **File:** `.agents/PRD.md`
- **Visi:** Etalase digital SMK BBM → percaya → daftar (UVP Mandiri Berahlak)
- **Tujuan (4):** 150+ form PPDB/th, /profil top-3, jawab biaya/jurusan, 24+ berita/th
- **Persona (2):** Rizky 15th calon siswa + Bu Siti 38th ortu, masing-masing journey 5 stage
- **User Stories:** 12 (Modul A-F) semua ada Priority + Screen ref + AC
- **FR:** 17 (Must 9 / Should 5 / Could 1 / Won't V1 list) semua ada effort S/M/L
- **Integration (4):** Maps Embed, WA wa.me (+Cloud opsional), SMTP Resend/Brevo, GA4+Vercel
- **Compliance:** UU PDP 27/2022, PII anak + consent wali, retention 1-3th, deletion 30 hari
- **Next:** Ketik `Buat Task berdasarkan Tech Spec dan DESIGN.md yang sudah dibuat`

## Detail Output — write-tech-spec
- **File:** `.agents/TECH-SPEC.md`
- **Stack:** Next.js App Router + TS + Tailwind + Drizzle + Supabase Postgres/Storage + Decap CMS + Vercel + Resend + Sentry
- **Arsitektur:** SSG+ISR (24j profil/jurusan, 1j berita/galeri), dynamic /ppdb, islands minimal ≤180KB
- **Database:** 12 tabel + pgcrypto PII + RLS + indeks slug/feed/bukti
- **Interface:** 8 routes halaman + 12 endpoints /api/* + response standar + 8 error codes + page-based pagination
- **Alur:** PPDB idempotent + draft local + WA prefilled, CB mail/DB + fallback per fitur
- **Ops:** GitHub Flow + Vercel Preview/Prod + rollback instant + Sentry/GA4/Vercel Analytics

## Detail Output — create-issues
- **File:** `.agents/TASKS.md`
- **Grouping:** Per modul (pilihan user), opsional dilewati (tanpa Testing/CI-CD/Monitoring/Compliance)
- **Total:** 16 task (Foundation 2, Core 11, Enhancement 2, Infra 1) — S×3, M×10, L×3
- **Urutan:** T-01 Setup → T-02 Design System → T-03 DB → T-15 Kontrak API → T-04/05/06 API → T-07…T-13 Frontend/CMS → T-14 Error → T-16 Deploy
- **Estimasi:** ±5–8 minggu 1 dev
- **Next:** Ketik `Kerjakan task T-01` untuk mulai implementasi
