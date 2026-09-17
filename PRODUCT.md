# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Calon siswa SMP/MTs (13–15 th, sekitar Kandanghaur, Gabuswetan, Kroya). Situasi: eksplorasi via HP Android low-spec, kuota pas-pasan, sinyal 4G tidak stabil. Tugas: paham beda jurusan, lihat bukti seru (futsal/ekskul/praktik), daftar PPDB ≤2 menit bareng teman.
- Orang tua (contoh: pedagang pasar, WA harian, jarang email, teliti soal biaya dan agama). Situasi: validasi dari rumah tanpa survei langsung. Tugas: yakin soal akhlak dan mutu, hitung biaya transparan, hubungi humas via WA dengan respons <1x24 jam.
- Internal akademik — arah baru dikonfirmasi user 2026-09-17: guru, kaprodi, siswa, plus kepsek dan humas/admin sebagai pengelola. Situasi: sekolah ingin data akademik (guru, kaprodi, siswa, dan lain-lain) terintegrasi di website. Tugas: kelola dan tampilkan data akademik. OPEN: peran dan hak akses tiap peran, alur login vs publik, dan skema tabel guru/kaprodi/siswa belum diputuskan.

## Product Purpose

Website resmi SMK Bangun Bangsa Mandiri (BBM) Kandanghaur: etalase digital yang mengubah pengunjung dari tahu menjadi percaya dan mendaftar PPDB, plus — per permintaan user 2026-09-17 — fondasi website akademik dengan database guru, kaprodi, siswa, dan lain-lain sebagai demo dummy agar kepala sekolah mau mengintegrasikan data real.

Sukses berarti: formulir PPDB valid masuk dan terkonfirmasi WA; pengunjung paham Visi Misi Tujuan dan biaya tanpa trauma biaya siluman; humas mampu memperbarui info <48 jam tanpa coding; kepsek menyetujui integrasi data akademik real menggantikan dummy. Target angka V1 mengikuti PRD (contoh: 150+ form per tahun ajaran, CTR CTA ≥8%, LCP mobile <2,5 dtk) — belum direvisi untuk lingkup akademik.

## Positioning

UVP dikunci final oleh user 2026-09-17: "Mandiri Berahlak, Terampil Berwirausaha — Sekolah Terjangkau untuk Pasar Kerja Lokal & Global."

Mekanisme pembeda yang tidak bisa diklaim tetangga secara jujur: fondasi keimanan dan akhlak mulia + keterampilan vokasi dan kewirausahaan + kepemimpinan dan pendidikan sepanjang hayat; biaya terjangkau transparan sesuai SNP plus beasiswa tahfidz dan prestasi seni-olahraga; nilai tambah global berupa bahasa Inggris/bahasa asing dan kemitraan DUDI untuk penyerapan lulusan; pengawalan bakat seni dan olahraga sampai profesional.

## Operating Context

- PPDB bergelombang dengan status buka/tutup, countdown, tabel biaya IDR, syarat berkas, FAQ, dan nomor bukti format `PPDB-2026-XXXX` plus konfirmasi WA prefilled.
- Perangkat utama HP Android Chrome, internet 4G minimal saat puncak; WA sebagai kanal utama (tanya, konfirmasi, fallback saat form down); email humas sebagai notifikasi admin.
- Humas 1 orang memperbarui konten via Decap CMS (`content/*.json`) dan dashboard Supabase; publish → rebuild/revalidate ≤5 menit; panduan 1 halaman di `content/README.md`.
- Lokasi dan jam faktual: Jl. PU Kemped No.212, Kandanghaur, Indramayu 45254; Senin–Jumat 07.00–15.00, Sabtu 08.00–12.00; peta Google Maps embed plus tombol Rute.
- Konteks akademik baru (OPEN): struktur data, sumber data real sekolah, dan ritme pemutakhiran data guru/kaprodi/siswa belum ditetapkan.

## Capabilities and Constraints

- Terkonfirmasi berjalan: 8 rute publik (`/`, `/profil`, `/jurusan`, `/fasilitas`, `/berita`, `/ppdb`, `/galeri`, `/kontak`) + detail `/jurusan/[slug]` dan `/berita/[slug]`; Next.js App Router + Supabase Postgres (Drizzle) + Vercel; ISR 1–24 jam; form PPDB dan kontak dengan validasi Zod ganda, honeypot, rate-limit, draft localStorage.
- Aturan keras: teks Visi + 7 Misi + 7 Tujuan tampil verbatim, tidak diringkas sepihak; WA 10–14 digit dinormalisasi `08xx→62`; upload KK opsional JPG/PDF ≤2MB ke storage privat; checkbox persetujuan wali wajib (UU PDP, data anak <18); PII tidak masuk log/analitik; gelombang tutup → form disabled + tawaran notify WA.
- Terminologi: PPDB, DUDI (dunia usaha/dunia industri), SNP (Standar Nasional Pendidikan), NPSN 20233754.
- Belum diputuskan (OPEN): model data akademik (tabel guru, kaprodi, siswa, relasi ke jurusan/kelas); autentikasi dan otorisasi internal; apakah data akademik publik, internal, atau campuran; revisi target sukses untuk lingkup akademik.

## Brand Commitments

- Nama: SMK Bangun Bangsa Mandiri, singkat SMK BBM Kandanghaur; swasta; NPSN 20233754; semboyan "Mandiri Berahlak, Terampil Berwirausaha".
- Suara: Bahasa Indonesia santai-ramah; sapa "Ayah/Bunda" di area PPDB; tanggal format id-ID; rupiah format `Rp 1.250.000`.
- Aset mengikat yang tercatat: alamat, NPSN, email `humas@smkbbm.sch.id`, dan teks Visi Misi Tujuan dari `content/profil.json`. Kesiapan logo vektor dan foto asli sebagai aset final belum dikonfirmasi — diperlakukan sebagai dummy hingga sekolah menyerahkan.

## Evidence on Hand

- Ditetapkan user 2026-09-17: seluruh data dinamis saat ini adalah DUMMY untuk demo agar kepala sekolah SMK BBM mengintegrasikan data real. Future work dilarang menyajikan angka/kutipan/nama dummy sebagai fakta dan wajib menjaga kemudahan penggantian via CMS/database.
- Dummy yang diketahui: stats hero (`content/hero.json`: 480 siswa, 32 guru, 18 DUDI, 87% serapan); biaya PPDB (`content/ppdb.json`); kontak WA `6281234567890`; nama kepsek placeholder "(Nama Kepala Sekolah — dilengkapi sekolah)" dengan foto null; testimoni, berita, jurusan, fasilitas, dan galeri dari seed/Supabase.
- Real dan boleh dirujuk: teks Visi + 7 Misi + 7 Tujuan dan sejarah di `content/profil.json` (draf UVP+PRD; catatan file mewajibkan review kepsek sebelum launch — status pengesahan final belum terdokumentasi); struktur 8 screen dan token non-visual di `.agents/DESIGN.md`; kebutuhan dan arsitektur di `.agents/PRD.md` dan `.agents/TECH-SPEC.md`; fallback verbatim di `src/content.ts`; foto kegiatan di `public/images/`.
- Absen dan tidak boleh difabrikasi: nama/foto kepsek definitif; angka resmi siswa/guru/DUDI/serapan; daftar 6 jurusan dan biaya final yang difreeze kepsek; testimoni bernama terverifikasi.

## Product Principles

1. Kepercayaan dulu, konversi kemudian: bukti nyata dan biaya terbuka sebelum ajakan daftar.
2. Transparan soal uang dan prospek: tidak ada biaya siluman, tidak ada klaim lulusan yang tidak didukung DUDI.
3. Ringan dan jelas di HP kentang: satu scroll menjelaskan, formulir tidak pernah menghilangkan isian.
4. Humas mandiri tanpa coding: setiap fakta yang sering berubah harus bisa diperbarui via CMS/database dalam hitungan menit.
5. Dummy yang jujur dan mudah diganti: setiap placeholder bertanda dan terjal deprecated rapi saat data real masuk.

## Accessibility & Inclusion

- Audiens mencakup orang tua dengan literasi teknis pemula dan koneksi terbatas: target responsif 360px→1440px, target sentuh ≥44px, alur penuh via keyboard dan pembaca layar, hormati `prefers-reduced-motion`, bahasa sederhana tanpa jargon jurusan yang tidak dijelaskan.
- Persetujuan data: checkbox wali wajib di form PPDB; banner consent untuk analitik; tanpa cookie tracking bila ditolak, situs tetap berfungsi penuh.
