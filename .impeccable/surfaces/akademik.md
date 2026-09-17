---
version: 1
slug: "akademik"
primary_target: "akademik"
related_targets: []
---

# Surface brief: /akademik (Data Akademik, publik read-only demo)

Scope: hub `/akademik` + `/akademik/guru`, `/akademik/kaprodi`, `/akademik/siswa`. Visitor mode Operate (cari–filter–detail), sekunder Read (agregat siswa).
Audience: ortu/casis HP Android low-spec (paham guru/kaprodi per jurusan ≤2 tap), kepsek/humas (nilai kelengkapan + kemudahan ganti real).
Proof: 12 contoh guru dari 32 (nama, NUPTK demo, mapel, jurusan, jadwal, wali kelas), 6 kaprodi (1/jurusan, link `/jurusan/[slug]`), agregat siswa 480 per jurusan×kelas tanpa nama/NISN. Setiap dummy bertanda Demo + notice halaman; penggantian via Supabase/CMS.
Untouched: 8 rute existing, token emerald/amber + Plus Jakarta Sans, SectionHeading/Card/FilterChip, form PPDB, teks Visi Misi verbatim.
Anti-goals: tanpa login/auth, tanpa LMS/nilai/absensi, tanpa PII anak, tanpa ubah DESIGN system.
Open: skema tabel final, foto/NIP real, ritme update humas.

## Direction contract

THESIS: Direktori akademik yang dibaca seperti katalog jurusan: satu hub jujur (demo bertanda) menuju tiga rak — guru, kaprodi, agregat siswa — bukan portal admin dan bukan brosur.
OWN-WORLD: Nol identitas baru: kartu putih radius-md border-slate, badge Demo amber + badge jurusan primary-soft, avatar inisial emerald-soft, chips filter pill, heading H1 langsung tanpa kicker.
STORY: Pengunjung paham siapa mengajar apa di jurusan mana dan percaya datanya bisa diganti real; kepsek melihat format lengkap lalu menyetujui integrasi.
FIRST VIEWPORT: Header breadcrumb + H1 + notice demo; di bawahnya tiga kartu rak (Guru 32, Kaprodi 6, Siswa 480) setara, tiap kartu hitungan tabular + deskripsi 1 baris + aksi; aksi utama tiap kartu di kaki kartu, min 44px.
FORM: Hub + sub-route, grounded #1 dari 7, seed dd394ae5, dipilih user mengalahkan THE ROLL (tabbed hub).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
