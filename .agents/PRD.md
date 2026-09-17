# PRD.md — Website Landing SMK Bangun Bangsa Mandiri (BBM) Kandanghaur

> **Sumber acuan:** `.agents/DESIGN.md` (8 screen, Web Responsive, Modern & Clean, Light)
> **Tanggal:** 2026-09-16
> **V1 Scope:** Landing informatif + PPDB sederhana (tanpa LMS / payment gateway)
> **Runtime:** Bun 1.4.2 (terdeteksi lokal) — versi lib lain pakai latest stable saat implementasi, jangan hardcode

---

## BAGIAN 1: Visi & Tujuan Produk

### Visi Produk
Menjadi etalase digital utama SMK Bangun Bangsa Mandiri Kandanghaur (Jl. PU Kemped No.212, NPSN 20233754) yang mengubah pengunjung — calon siswa SMP/MTs dan orang tua di Kandanghaur, Gabuswetan, Kroya — dari sekadar tahu menjadi percaya dan mendaftar, dengan menampilkan Visi, 7 Misi, 7 Tujuan sekolah secara jujur, jurusan yang prospektif, fasilitas nyata, dan alur PPDB yang mudah via HP, sesuai UVP "Mandiri Berahlak, Terampil Berwirausaha — Sekolah Terjangkau untuk Pasar Kerja Lokal & Global."

### Tujuan Utama

1. **Menaikkan kepercayaan & pendaftaran PPDB** — Indikator: 150+ form PPDB masuk per tahun ajaran V1, rasio form→daftar ulang ≥40%
2. **Menyampaikan Visi Misi Tujuan secara utuh & mudah dipahami** — Indikator: halaman `/profil` jadi top-3 pageviews, avg time on page ≥1m30s, bounce <45%
3. **Menjawab keraguan biaya & prospek kerja** — Indikator: 70% pendaftar memilih jurusan setelah baca `/jurusan`, pertanyaan berulang via WA turun 30%
4. **Menjadi pusat info resmi (berita/pengumuman/galeri)** — Indikator: 24+ berita/pengumuman terbit per tahun, update <48 jam setelah kegiatan

### Value Proposition
- **Mandiri Berahlak + Siap Kerja:** Fondasi Keimanan & Ahlak Mulia + keterampilan kejuruan + kewirausahaan + kepemimpinan + longlife education — bukan sekadar ijazah
- **Terjangkau & Transparan:** Biaya sesuai SNP ditampilkan terbuka di `/ppdb` + beasiswa tahfidz/prestasi seni-olahraga, tanpa biaya siluman
- **Nilai Tambah Global:** Bahasa Inggris + bahasa asing lain + kemitraan DUDI untuk penyerapan lulusan lokal maupun global, plus pengawalan bakat seni & olahraga sampai profesional

### Analisis Kompetitor

| Kompetitor | Fitur Utama | Kelebihan | Kekurangan | Peluang |
|------------|-------------|-----------|------------|---------|
| SMKN 1 Kandanghaur (Negeri, A) | Profil, jurusan, PPDB online, fasilitas negara | Gratis/murah, brand negeri, fasilitas besar | Kuota ketat, info membingungkan, kurang personal | Tampilkan kemudahan daftar + pendampingan WA 1x24 jam + tanpa zonasi |
| SMK Muhammadiyah Kandanghaur (Swasta A, Pusat Keunggulan, 1500+ siswa, 6 jurusan) | Hero Islami, 6 jurusan detail, lab/bengkel, kerjasama industri | Skala besar, brand Muhammadiyah, konten kaya | Navigasi padat, bahasa formal, load berat di HP | Menang di kecepatan (<2s), bahasa ramah orang tua, Visi Misi Tujuan verbatim + ringkas |
| SMK Prestasi Prima / SMK Indonesia (umum) | Jurusan, fasilitas, testimoni, mitra | Template modern, SEO bagus | Generik, tidak lokal Indramayu | Menang lokal: peta Kemped, asal SMP sekitar, testimoni alumni Kandanghaur, bahasa Indonesia santai |

### Success Metrics

| Tujuan | KPI | Target V1 (6 bln) | Cara Ukur |
|--------|-----|-------------------|-----------|
| Pendaftaran | Form PPDB valid masuk | ≥80 form / gelombang | Hitung submit sukses `PPDB-2026-XXXX` di DB/log + WA konfirmasi |
| Kepercayaan | Klik CTA Daftar dari Home/Jurusan | CTR ≥8% | GA4 event `click_daftar_ppdb` |
| Keterbacaan Visi Misi | Time on `/profil` + scroll depth | ≥1m30s, depth ≥70% | GA4 + scroll tracker |
| Transparansi biaya | Kunjungan `/ppdb#biaya` | Top-2 section views | Scroll/anchor event |
| Info resmi | Berita terbit & kecepatan | ≥2/bln, <48 jam | CMS publish log |
| Performa | LCP mobile | <2.5s di 4G | PageSpeed + Vercel Analytics |
| Kepuasan | Pesan kontak dibalas | 100% <1x24 jam | Inbox WA/email log |

---

## BAGIAN 2: User Persona

### Persona 1: Rizky — Calon Siswa (15 th, lulusan SMPN sekitar Kandanghaur)
- **Usia/Pekerjaan:** 15 tahun, pelajar kelas 9 SMP, HP Android RAM 3GB, kuota pas-pasan, aktif TikTok/WA
- **Level Teknis:** Menengah-rendah (bisa browsing, malas baca panjang, suka foto/video)
- **Tujuan:** Cari SMK yang seru, ada futsal/ekskul, jurusan yang gampang kerja, daftar bareng teman, tanpa ribet
- **Pain Points:** Bingung beda jurusan; takut biaya mahal; form panjang bikin males; web sekolah lemot & tulisan kecil
- **Motivasi:** Lihat foto praktik + galeri + testimoni kakak kelas yang sudah kerja; bisa WA langsung; ada teman se-SMP yang daftar

#### User Journey: Rizky
| Stage | Action | Touchpoints | Emotions | Pain Points |
|-------|--------|-------------|----------|-------------|
| 1. Dengar | Teman share link WA / lihat spanduk PPDB | Screen 01 Home Hero (mobile) | 😊 penasaran | Sinyal lemot, takut web berat |
| 2. Jelajah | Scroll hero → stats → jurusan preview → tap card | Screen 01 + Screen 03 Program Keahlian + filter chips | 😊 excited / 😐 bingung pilih | Istilah jurusan asing, butuh prospek simpel |
| 3. Validasi seru | Buka galeri futsal/praktik + fasilitas bengkel/lab | Screen 07 Galeri & Ekstrakurikuler, Screen 04 Fasilitas + lightbox | 😊 mantap | Foto sedikit / tidak ada video |
| 4. Daftar | Klik Daftar → isi form pendek → dapat nomor → WA | Screen 06 PPDB / Pendaftaran + success + WA prefilled | 😤 tegang isi form / 😊 lega sukses | Validasi NIK/WA ribet, upload gagal |
| 5. Keluar | Screenshot nomor, share ke ortu/teman | Success card + footer | 😊 bangga | Lupa nomor jika tidak screenshot |

### Persona 2: Bu Siti — Orang Tua (38 th, pedagang pasar Kandanghaur)
- **Usia/Pekerjaan:** 38 tahun, pedagang + ibu 2 anak, HP Android, WA harian, jarang email, baca teliti soal biaya & agama
- **Level Teknis:** Pemula (bisa WA/Google, takut salah pencet, suka telpon langsung)
- **Tujuan:** Pastikan sekolah berahlak, aman, dekat, biaya terjangkau & jelas, lulusan bisa kerja/wirausaha, bisa bahasa Inggris
- **Pain Points:** Trauma biaya siluman; tidak paham jurusan; takut anak salah gaul; susah datang survei karena jualan; butuh jawaban cepat
- **Motivasi:** Baca Visi Misi Tujuan lengkap + sambutan kepsek + biaya transparan + testimoni wali murid + bisa tanya WA tanpa datang

#### User Journey: Bu Siti
| Stage | Action | Touchpoints | Emotions | Pain Points |
|-------|--------|-------------|----------|-------------|
| 1. Cari | Google "SMK murah bagus Kandanghaur" → klik | Screen 01 Home (SEO title) | 😐 was-was | Banyak SMK, bingung bedakan |
| 2. Nilai | Baca ringkasan profil → klik Visi Misi Tujuan lengkap | Screen 02 Profil + Visi Misi Tujuan (tab/accordion) | 😊 tenang jika jelas | Teks panjang 7+7 poin, perlu ringkasan |
| 3. Hitung | Cek biaya + syarat + beasiswa + FAQ | Screen 06 PPDB (biaya table, FAQ) | 😤 khawatir biaya / 😊 lega transparan | Tabel rumit di HP, istilah DP/SPP |
| 4. Yakin | Lihat fasilitas masjid + kontak + peta Kemped | Screen 04 Fasilitas, Screen 08 Kontak + Maps + jam layanan | 😊 percaya | Peta tidak akurat, jam tidak jelas |
| 5. Tanya/Daftar | WA humas atau isikan form untuk anak | Screen 08 Kontak form + WA float, Screen 06 form | 😊 terbantu jika fast respon | Tidak dibalas >1 hari → pindah sekolah |

---

## BAGIAN 3: User Stories (12)

### Modul A: Landing & Navigasi

### US-01: Lihat ringkasan sekolah dalam 1 scroll
Sebagai calon siswa, saya ingin melihat hero + keunggulan + jurusan + berita dalam satu halaman, agar cepat paham tanpa buka banyak menu.

**Priority:** High
**Screen:** Home / Hero + Ringkasan

**Acceptance Criteria:**
- [ ] Hero tampil H1 UVP + 2 CTA (Daftar PPDB, Lihat Jurusan) + foto + stats dalam LCP <2.5s
- [ ] Section urut: stats → profil snippet → jurusan preview (4) → value 6 → fasilitas/galeri preview → berita (3) → testimoni → CTA PPDB
- [ ] Sticky navbar + floating WA + sticky bottom CTA di mobile berfungsi
- [ ] Gagal API berita tidak merusak hero (graceful fallback)

### US-02: Navigasi cepat antar info
Sebagai orang tua, saya ingin menu jelas (Profil, Jurusan, Fasilitas, Berita, PPDB, Galeri, Kontak), agar langsung ke info biaya/alamat tanpa tersesat.

**Priority:** High
**Screen:** Home / Hero + Ringkasan (Navbar)

**Acceptance Criteria:**
- [ ] Navbar sticky 8 link + CTA PPDB, active state sesuai route
- [ ] Mobile drawer + backdrop + Esc menutup + focus trap
- [ ] Skip-to-content tersedia dan tab order logis
- [ ] Breadcrumb muncul di detail jurusan/berita

### Modul B: Profil & Kepercayaan

### US-03: Baca Visi Misi Tujuan lengkap
Sebagai orang tua, saya ingin membaca Visi + 7 Misi + 7 Tujuan verbatim dengan layout nyaman, agar yakin soal ahlak & mutu.

**Priority:** High
**Screen:** Profil + Visi Misi Tujuan

**Acceptance Criteria:**
- [ ] Tab Visi | Misi (7 numbered) | Tujuan (7 checklist) sesuai teks user, tidak diringkas sepihak
- [ ] Mobile jadi accordion (Visi terbuka default), desktop tab pill
- [ ] Sejarah + NPSN + sambutan kepsek tampil + CTA lanjutan
- [ ] Jika CMS gagal, fallback statis visi tetap tampil + banner retry

### US-04: Nilai keunggulan & testimoni
Sebagai calon siswa, saya ingin melihat 6 kartu Kenapa BBM + testimoni alumni kerja/kuliah, agar termotivasi daftar.

**Priority:** Mid
**Screen:** Home / Hero + Ringkasan

**Acceptance Criteria:**
- [ ] 6 value cards (agama, vokasi, wirausaha, bahasa, seni-olahraga, DUDI) dengan ikon Lucide
- [ ] Carousel testimoni (nama + angkatan + status) bisa swipe + dots + aria
- [ ] Animasi count-up stats saat masuk viewport, hormati prefers-reduced-motion

### Modul C: Akademik (Jurusan + Fasilitas)

### US-05: Bandingkan jurusan & prospek kerja
Sebagai calon siswa, saya ingin filter/search jurusan + lihat skill + prospek + biaya singkat, agar bisa pilih dan langsung daftar.

**Priority:** High
**Screen:** Program Keahlian

**Acceptance Criteria:**
- [ ] Grid cards (foto 16:9, durasi 3th, maks 4 tags, prospek 3 bullet) + filter chips + search debounce 300ms
- [ ] Empty "Tidak ada jurusan yang cocok" + Reset + WA link saat 0 hasil
- [ ] Klik Daftar di card prefill `?jurusan=slug` ke form PPDB
- [ ] Detail `/jurusan/[slug]` ada breadcrumb + kurikulum + related + 404 ramah

### US-06: Lihat bukti fasilitas
Sebagai orang tua, saya ingin melihat foto lab/bengkel/masjid/lapangan per kategori, agar percaya sarana nyata.

**Priority:** Mid
**Screen:** Fasilitas

**Acceptance Criteria:**
- [ ] Tabs Iman / Vokasi / Penunjang + featured + grid + lightbox (Esc/arrows, caption, counter)
- [ ] Image broken → placeholder + alt, tidak layout shift (width/height tetap)
- [ ] CTA "Jadwalkan kunjungan via WA" prefilled tersedia

### Modul D: Informasi (Berita + Galeri)

### US-07: Ikuti berita & pengumuman PPDB
Sebagai siswa aktif/orang tua, saya ingin baca berita + pengumuman pin + agenda + search, agar tidak ketinggalan info.

**Priority:** High
**Screen:** Berita & Pengumuman

**Acceptance Criteria:**
- [ ] Featured + grid + sidebar pengumuman pin + pagination/load more
- [ ] Kategori label UVP (Prestasi, DUDI, Wirausaha) dengan warna konsisten
- [ ] Detail ada share WA/FB/copy dengan toast "Tautan disalin"
- [ ] Tanggal format id-ID "12 Jan 2026 • 3 mnt baca"

### US-08: Lihat kehidupan sekolah
Sebagai calon siswa, saya ingin lihat galeri praktik/ekskul/prestasi per filter, agar tahu sekolahnya seru.

**Priority:** Mid
**Screen:** Galeri & Ekstrakurikuler

**Acceptance Criteria:**
- [ ] Masonry lazy + filter kategori (Seni/Olahraga/Keagamaan/Praktik/Wirausaha) + tahun
- [ ] Ekskul cards (jadwal + pembina) + timeline prestasi
- [ ] Lightbox + video modal bisa swipe di mobile

### Modul E: PPDB (Konversi)

### US-09: Isi form PPDB singkat via HP
Sebagai calon siswa/orang tua, saya ingin isi form (nama, asal SMP, jurusan, WA) ≤2 menit dan dapat nomor bukti, agar resmi terdaftar tanpa datang.

**Priority:** High
**Screen:** PPDB / Pendaftaran

**Acceptance Criteria:**
- [ ] Field: nama (≥3 char), asal SMP (datalist), jurusan select (prefill), WA (08xx 10-14 digit auto 62), upload KK opsional JPG/PDF ≤2MB
- [ ] Validasi inline merah + fokus ke error pertama + draft tersimpan localStorage
- [ ] Submit → loading anti double-click → success `PPDB-2026-XXXX` + tombol WA prefilled + unduh/cetak
- [ ] Offline → submit disabled + toast + draft aman; 500 → banner + tombol WA darurat

### US-10: Paham biaya & jadwal gelombang
Sebagai orang tua, saya ingin lihat tabel biaya transparan + gelombang + syarat + FAQ, agar bisa siapkan dana.

**Priority:** High
**Screen:** PPDB / Pendaftaran

**Acceptance Criteria:**
- [ ] Status Buka (dot hijau) + countdown + steps 1-2-3 + tabel biaya IDR + cicilan note
- [ ] Mobile tabel jadi stacked cards, desktop 2-col form+info sticky
- [ ] FAQ 6-8 (biaya, seragam, beasiswa, antar-jemput) accordion + chevron anim
- [ ] Gelombang tutup → form disabled + form "Ingatkan saya" 1 field WA

### Modul F: Kontak

### US-11: Hubungi & temukan lokasi
Sebagai orang tua, saya ingin lihat alamat Kemped No.212 + WA + jam + peta + rute, agar bisa survei atau tanya.

**Priority:** High
**Screen:** Kontak

**Acceptance Criteria:**
- [ ] Info card (alamat + copy, WA wa.me, email mailto, jam Sen-Jum 07-15 Sab 08-12, sosmed) + Maps embed lazy + tombol Rute
- [ ] Map gagal → static + alamat teks + buka di app; copy → toast
- [ ] Form pesan (nama, WA, keperluan, pesan) validasi sama seperti PPDB + toast sukses + reset

### US-12: Kelola konten oleh admin (Humas)
Sebagai admin Humas, saya ingin update hero/stats/berita/jurusan/biaya tanpa coding, agar info selalu fresh <48 jam.

**Priority:** Mid
**Screen:** N/A (CMS eksternal, tampil di semua screen)

**Acceptance Criteria:**
- [ ] CMS (Decap/Strapi/Notion API) kelola: hero, stats, profil visi-misi, jurusan, fasilitas, berita, galeri, biaya PPDB, kontak
- [ ] Publish → rebuild/revalidate ≤5 menit, ada preview + rollback 1 versi
- [ ] Role admin tunggal V1 + backup harian; panduan 1 halaman untuk Humas

---

## BAGIAN 4: Functional Requirements (17)

**FR-01: Halaman Home agregat** — **Must Have** — **M**
- **Input:** CMS hero, stats, jurusan limit 4, berita limit 3, testimoni
- **Proses:** SSR/SSG gabung + image optimize + graceful fallback per section
- **Output:** `/` ter-render LCP <2.5s, anchor `#jurusan #ppdb` dsb
- **Aturan:** 1 H1 saja; hero eager, sisanya lazy; section gagal tidak blokir lainnya

**FR-02: Profil Visi Misi Tujuan verbatim** — **Must Have** — **S**
- **Input:** CMS `profil.{visi,misi[7],tujuan[7],sejarah,kepsek}`
- **Proses:** Render tab desktop / accordion mobile, numbered + checklist
- **Output:** `/profil` + anchor `#visi #misi #tujuan`
- **Aturan:** Teks verbatim user, tidak boleh dipotong AI; fallback hardcoded jika API gagal

**FR-03: Katalog jurusan + filter/search** — **Must Have** — **M**
- **Input:** API/CMS `jurusan[]`, query `?q=&kategori=`
- **Proses:** Filter client + debounce 300ms + count live `aria-live`
- **Output:** Grid cards + empty state + prefill PPDB link
- **Aturan:** Search min 2 char; maks 4 tags + "+n"; cover 16:9 wajib alt

**FR-04: Detail jurusan** — **Should Have** — **M**
- **Input:** Slug `/jurusan/[slug]`
- **Proses:** Fetch satu + related 3 + breadcrumb
- **Output:** Kurikulum, fasilitas terkait, prospek, alumni, CTA daftar
- **Aturan:** Slug invalid → 404 ramah + daftar alternatif; ISR 1 jam

**FR-05: Fasilitas terkategori + lightbox** — **Should Have** — **M**
- **Input:** `fasilitas[]{nama,kategori,kapasitas,foto[]}`
- **Proses:** Tab filter + masonry + lightbox trap fokus
- **Output:** `/fasilitas` + modal foto/video
- **Aturan:** Kategori tetap: Iman/Vokasi/Penunjang; foto 4:3 + caption

**FR-06: Berita + pengumuman + agenda** — **Must Have** — **M**
- **Input:** `berita[]{judul,body,kategori,published_at,author}`, pengumuman pin
- **Proses:** Featured + list + sidebar + pagination/load more + search
- **Output:** `/berita`, `/berita/[slug]` + RSS opsional V1
- **Aturan:** Format tanggal id-ID; baca ≥3 mnt dihitung; draft tidak tampil publik

**FR-07: Form PPDB + nomor bukti** — **Must Have** — **L**
- **Input:** nama, asal SMP, jurusan_id, WA, tgl_lahir, upload KK opsional
- **Proses:** Validasi server + simpan + generate `PPDB-2026-XXXX` + kirim notif WA/email admin + simpan draft local
- **Output:** Success card + WA prefilled + cetak/unduh bukti
- **Aturan:** Rate-limit 5/menit/IP; WA 10-14 digit; file JPG/PDF ≤2MB; PII terenkripsi; duplikat WA+nama ditandai

**FR-08: Info gelombang/biaya/FAQ PPDB** — **Must Have** — **S**
- **Input:** CMS `ppdb.{status,gelombang[],biaya,syarat,faq[]}`
- **Proses:** Countdown + steps + tabel → cards di mobile
- **Output:** `/ppdb#biaya #syarat #faq`
- **Aturan:** Status tutup → disable form otomatis + tampilkan notify; IDR format `Rp 1.250.000`

**FR-09: Galeri + ekskul + prestasi** — **Should Have** — **M**
- **Input:** `galeri[]{caption,taken_at,kategori,url}`, `ekskul[]`, `prestasi[]`
- **Proses:** Masonry + filter kategori/tahun + timeline
- **Output:** `/galeri`
- **Aturan:** Alt bermakna; video pakai facade (klik baru load) hemat kuota

**FR-10: Kontak + peta + form pesan** — **Must Have** — **S**
- **Input:** `kontak.{alamat,wa,email,jam,sosmed}`, form pesan
- **Proses:** Render info + Maps embed lazy + validasi form + kirim ke email/WA admin
- **Output:** `/kontak` + toast sukses + reset
- **Aturan:** Jam tampil "Senin–Jumat 07.00–15.00"; map `title` wajib; spam honeypot + rate-limit

**FR-11: Navigasi global + footer** — **Must Have** — **S**
- **Input:** Config nav 8 rute + kontak sekolah
- **Proses:** Sticky + scroll shadow + drawer mobile + footer 4 col
- **Output:** Konsisten di semua screen
- **Aturan:** Kontras footer 8:1; sosmed `aria-label`; CTA PPDB selalu terlihat ≤1 scroll

**FR-12: SEO dasar + metadata** — **Must Have** — **S**
- **Input:** Judul/deskripsi per page + OG image
- **Proses:** SSR meta + sitemap.xml + robots + JSON-LD School
- **Output:** Title "SMK BBM Kandanghaur — ..." + OG + canonical
- **Aturan:** Setiap page title unik; image OG 1200x630; URL id lowercase

**FR-13: Analitik peristiwa** — **Should Have** — **S**
- **Input:** Event klik/ scroll/ submit
- **Proses:** GA4 + anonim IP + consent
- **Output:** Dashboard CTR, pageviews, form funnel
- **Aturan:** Tanpa cookie tracking jika user tolak; PII tidak dikirim ke GA

**FR-14: CMS untuk Humas (tanpa coding)** — **Must Have** — **L**
- **Input:** Markdown/visual editor + upload gambar
- **Proses:** Git-based (Decap) atau headless + webhook rebuild + preview
- **Output:** Publish ≤5 menit + rollback
- **Aturan:** 1 role admin V1; validasi gambar ≤1MB auto-compress; panduan 1 halaman

**FR-15: Keamanan form & anti-spam** — **Must Have** — **M**
- **Input:** Semua POST PPDB/kontak/notify
- **Proses:** Honeypot + rate-limit + validasi server + sanitasi XSS + CSRF
- **Output:** Tolak spam tanpa CAPTCHA berat (Turnstile invisible jika perlu)
- **Aturan:** Log tanpa simpan PII mentah di log; error generik ke user

**FR-16: Fallback offline & error ramah** — **Should Have** — **M**
- **Input:** Status network + HTTP error
- **Proses:** Cache statis hero/profil + banner retry + draft local
- **Output:** Toast offline + konten cache + auto-retry online
- **Aturan:** PPDB tidak pernah hilangkan isian saat gagal; 404/500 ada CTA pulang + WA

**FR-17: Cetak/unduh bukti PPDB** — **Could Have** — **S**
- **Input:** ID `PPDB-2026-XXXX`
- **Proses:** Render halaman print-friendly + QR
- **Output:** `/ppdb/bukti/[id]` + tombol print
- **Aturan:** Tanpa auth V1 (ID acak sulit ditebak); tanpa tampilkan KK full

**Won't Have V1:** Portal siswa/LMS, pembayaran online, multi-bahasa, dark mode, aplikasi mobile native, chatbot AI, login siswa/orang tua

---

## BAGIAN 5: Non-Functional Requirements

### Performa
- LCP mobile ≤2.5s (4G, Moto G4), CLS ≤0.1, INP ≤200ms — diukur PageSpeed ≥85 mobile
- API/CMS response p95 <500ms; image AVIF/WebP + lazy (kecuali hero) + ukuran ≤200KB per gambar card
- Bundle JS awal ≤180KB gzip (landing statis, minimal JS); font subset latin + display=swap
- Support 500 concurrent baca, 50 submit PPDB/jam saat puncak gelombang tanpa degradasi

### Keamanan
- HTTPS wajib (HSTS), header: CSP ketat, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Validasi server ganda (client hanya UX), sanitasi HTML berita (allowlist), upload scan mime + acak nama file + tanpa eksekusi
- PII PPDB terenkripsi at-rest (AES-256) + in-transit TLS 1.2+; WA/email admin via secret env, tidak di client
- Rate-limit + honeypot + invisible Turnstile jika spam >5%; log tanpa PII; backup DB harian retensi 30 hari

### Skalabilitas
- Target 10rb visitor/bln PPDB, 5rb form/tahun; arsitektur statis SSG + ISR (revalidate 1 jam berita, 24 jam profil) — scale horizontal via CDN
- CMS + DB terpisah (mis. Neon/Supabase free → scale); aset di object storage + CDN; tanpa server stateful
- Siap naik ke multi-gelombang/multi-tahun ajaran tanpa migrasi skema (tambah row, bukan kolom)

### Usability
- Responsive 360px→1440px (1-col → 4-col), touch 44px+, fokus visibel 2px, keyboard penuh + SR (NVDA/TalkBack) lolos uji manual
- Bahasa Indonesia santai-ramah (kamu/Anda konsisten: sapa "Ayah/Bunda" di PPDB), angka IDR + tanggal id-ID
- Light mode saja V1; hormati prefers-reduced-motion (matikan count-up/shimmer jadi statis)
- Skor SUS target ≥80 saat uji 5 orang tua + 5 siswa; waktu isi PPDB median ≤2 menit

---

## BAGIAN 6: Integration Points

| Service | Purpose | Auth Method | Data Flow | SLA / Limits |
|---------|---------|-------------|-----------|--------------|
| Google Maps Embed (gratis, tanpa key) | Peta lokasi Kemped No.212 + tombol Rute | None (iframe) + fallback static | CMS alamat → iframe `q=SMKS+Bangun+Bangsa+Mandiri+Kandanghaur` → user klik Rute ke Google Maps app | Uptime Google ~99.9%; lazy load; kuota embed unlimited wajar |
| WhatsApp Click-to-Chat (`wa.me`) + (opsional) WhatsApp Cloud API | Konfirmasi PPDB + tanya Humas + fallback saat form down | V1: tanpa key (link prefilled); V2 Cloud API: Bearer token server-side | Form sukses → prefilled text `Halo, saya [nama] [ID]...` → wa.me/62xxx → admin balas manual; Cloud API (Should) kirim template otomatis | wa.me selalu on selama nomor aktif; Cloud API 1000 msg/bln gratis, p95 <5s |
| Email SMTP (Resend/Brevo gratis) | Notif admin tiap PPDB/pesan + backup bukti ke pendaftar | API Key server-side (env) | Submit → server kirim ke `humas@smkbbm.sch.id` + CC arsip + (opsional) ke pendaftar | 100-300 email/hari gratis; retry 3x; tanpa PII di subject |
| GA4 + Vercel Analytics | Ukur pageviews, CTR Daftar, funnel PPDB, LCP | Measurement ID publik + consent mode | Client event (`view_profil`, `click_daftar`, `submit_ppdb`) → GA (anon IP) → dashboard | Sampling gratis cukup; adblock → fallback server log count |

**Dependencies:**
- **Synchronization:** Maps/GA real-time client; WA/email async server (queue, retry 3x, DLQ log)
- **Fallback:** Maps gagal → alamat teks + tombol; WA API down → wa.me manual; email gagal → log + badge admin; GA diblok → hitung submit server-side sebagai sumber kebenaran
- **Caching:** ISR 1 jam (berita/galeri), 24 jam (profil/biaya); Maps/GA no-cache; QR bukti cache 7 hari

---

## BAGIAN 7: Compliance & Data Privacy

### Regulasi
- **Indonesia:** UU PDP No. 27 Tahun 2022 + PP pelaksana; ITE untuk konten; perlindungan anak (data siswa <18 butuh persetujuan orang tua — checkbox wali di form PPDB)
- **Global:** GDPR tidak wajib V1 (target lokal), tapi ikuti prinsipnya (minimasi, consent, hapus)

### Data Classification

| Data Type | Category | Storage | Retention |
|-----------|----------|---------|-----------|
| Nama, asal SMP, WA, tgl lahir, KK upload | PII (anak) | DB terenkripsi AES-256 + storage privat signed-URL 15 mnt | Aktif PPDB + 3 tahun ajaran, lalu anonim/hapus; KK dihapus ≤1 th setelah verifikasi |
| Nama/WA pengirim pesan kontak | PII dewasa | DB + inbox email | 1 tahun, lalu hapus |
| Email humas, stats, konten publik | Non-PII | CMS publik + Git | Selama tayang + arsip |
| Log submit (tanpa isi PII), analitik anon | Non-PII | Server log + GA anon | Log 90 hari, GA 14 bln |
| Password admin CMS | Sensitive | Hash Argon2/bcrypt, tidak plaintext | Sampai diganti; sesi 12 jam |

### Data Deletion Flow
1. Subjek (ortu/siswa) WA/email "Hapus data PPDB [ID]" → verifikasi WA/no ID (≤2 hari) → soft-delete (tidak tampil) ≤7 hari → hard-delete + hapus file KK ≤30 hari → konfirmasi tertulis
2. Admin CMS dapat hapus manual + audit log (siapa, kapan, ID apa, tanpa isi PII di log)
3. Backup ikut terhapus pada siklus 30 hari berikutnya (tardi dokumentasikan ke pemohon)

### Consent Management
- **Cookie Consent:** Banner sederhana (Terima/Tolak) untuk GA; tolak = mode anonim tanpa cookie tracking, situs tetap penuh fungsi
- **Data Agreement:** Checkbox wajib "Saya wali murid menyetujui data anak dipakai untuk PPDB SMK BBM & dihubungi via WA" + link kebijakan privasi 1 halaman bahasa sederhana; tanpa centang tidak bisa submit
- **Opt-out:** Link WA "STOP" / email hapus kapan saja; anak ≥18 bisa minta hapus mandiri; daftar pemrosesan (RoPA) disimpan Humas

**Security standards:** TLS 1.2+, AES-256 at-rest, backup terenkripsi, akses DB allowlist + 2FA admin, prinsip least-privilege, uji XSS/upload tiap rilis

---

## BAGIAN 8: Out of Scope & Dependensi

### Out of Scope (Tidak Dikerjakan di V1 → V2)
- Portal login siswa/orang tua, LMS/e-rapor, absensi online — V2 terpisah
- Pembayaran SPP/DP online (Midtrans/Xendit) — V1 manual/transfer + bukti WA
- Multi-bahasa (Inggris/Arab), dark mode, mode offline PWA penuh — V2
- Chatbot AI, notifikasi push, aplikasi Android/iOS native — V2
- Video streaming sendiri, forum komentar berita — cukup embed YouTube + WA

### Dependensi
- **Framework:** Astro/Next.js SSG + Tailwind latest stable (via Bun) — untuk SSG/ISR + image optimize
- **CMS:** Decap CMS (Git-based, gratis) atau Strapi/Notion API — untuk Humas update tanpa coding
- **DB V1-lite:** Supabase/Neon Postgres atau Google Sheet API sementara untuk tampung PPDB (pilih satu saat Tech Spec) + Resend/Brevo SMTP
- **Infra:** Vercel/Netlify + Cloudflare DNS/CDN + Google Maps embed + GA4 — domain `smkbbm-kandanghaur.sch.id` (asumsi dibeli/sekolah sediakan)
- **Aset:** Foto asli sekolah (hero, lab, masjid, ekskul) + logo vektor + teks Visi Misi Tujuan final dari kepsek

### Asumsi
- User HP Android Chrome + WA aktif + internet 4G minimal saat PPDB puncak
- Humas 1 orang mampu update CMS <48 jam + balas WA <1x24 jam (jam layanan tertera)
- Data jurusan/biaya/gelombang final disahkan kepsek sebelum dev form PPDB (freeze 1 minggu)
- NPSN/alamat/telepon di atas benar; email resmi disediakan sekolah sebelum launch
- V1 tanpa login — keamanan mengandalkan ID acak + rate-limit + review manual Humas

---

## Validasi Checklist (internal)
- [x] Visi jelas & terukur + kompetitor + success metrics angka
- [x] 2 persona + journey 5 stage + emotion/pain
- [x] 12 US (10-15) + priority + screen ref DESIGN.md + AC checkbox
- [x] 17 FR (15-20) + MoSCoW + effort S/M/L/XL + Input/Proses/Output/Aturan
- [x] NFR spesifik (2.5s, 500ms, 180KB, 500 concurrent)
- [x] 4 integration (1-5) + auth + flow + SLA + fallback/cache
- [x] Compliance UU PDP + klasifikasi + retention + deletion + consent
- [x] Out of scope V1 vs V2 jelas + dependensi realistis + asumsi

*Siap lanjut ke Tech Spec. Semua screen DESIGN.md (01-08) sudah punya US/FR relevan.*
