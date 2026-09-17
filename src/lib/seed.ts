import { closeDb, db, type Db } from "./db";
import {
  berita,
  ekskul,
  fasilitas,
  galeri,
  jurusan,
  pengumuman,
  ppdbGelombang,
  prestasi,
  siteConfig,
  testimoni,
} from "./schema";

/**
 * Seed idempotent — aman dijalankan ulang (skip jika data sudah ada;
 * ON CONFLICT DO NOTHING untuk baris ber-unique constraint).
 * Data jurusan/biaya final tetap butuh pengesahan kepsek sebelum PPDB puncak.
 */
export async function runSeed(target: Db = db) {
  if ((await target.$count(jurusan)) > 0) {
    console.log("seed skipped — data sudah ada");
    return;
  }
  await target
    .insert(jurusan)
    .values([
      {
        slug: "tkj",
        nama: "Teknik Komputer dan Jaringan",
        kategori: "Teknologi",
        deskripsi: "Perakitan PC, jaringan, server, dan administrasi sistem.",
        skills: ["Mikrotik", "Linux", "Cabling", "Server"],
        prospek: ["Teknisi NOC", "Admin jaringan", "Wirausaha IT"],
        biayaMasuk: 1500000,
        sppBulanan: 150000,
        sortOrder: 1,
      },
      {
        slug: "tkr",
        nama: "Teknik Kendaraan Ringan",
        kategori: "Teknik",
        deskripsi: "Perawatan dan perbaikan kendaraan ringan modern.",
        skills: ["Tune-up", "Kelistrikan", "Chasis", "AC mobil"],
        prospek: ["Mekanik bengkel", "Teknisi dealer", "Bengkel mandiri"],
        biayaMasuk: 1500000,
        sppBulanan: 150000,
        sortOrder: 2,
      },
      {
        slug: "akl",
        nama: "Akuntansi dan Keuangan Lembaga",
        kategori: "Bisnis",
        deskripsi: "Pembukuan, perpajakan dasar, dan aplikasi akuntansi.",
        skills: ["MYOB", "Spreadsheet", "Pajak", "Kasir"],
        prospek: ["Staff administrasi", "Kasir", "Asisten akuntan"],
        biayaMasuk: 1250000,
        sppBulanan: 140000,
        sortOrder: 3,
      },
      {
        slug: "mplb",
        nama: "Manajemen Perkantoran",
        kategori: "Bisnis",
        deskripsi: "Administrasi perkantoran, kearsipan, dan layanan prima.",
        skills: ["Kearsipan", "Ms Office", "Humas", "Korespondensi"],
        prospek: ["Staff TU", "Resepsionis", "Admin perusahaan"],
        biayaMasuk: 1250000,
        sppBulanan: 140000,
        sortOrder: 4,
      },
      {
        slug: "busana",
        nama: "Tata Busana",
        kategori: "Kreatif",
        deskripsi: "Desain, pola, jahit, dan usaha fashion.",
        skills: ["Pola", "Jahit", "Bordir", "Fashion design"],
        prospek: ["Penjahit", "Butik mandiri", "Garmen"],
        biayaMasuk: 1250000,
        sppBulanan: 140000,
        sortOrder: 5,
      },
      {
        slug: "dkv",
        nama: "Desain Komunikasi Visual",
        kategori: "Kreatif",
        deskripsi: "Desain grafis, fotografi, dan konten digital.",
        skills: ["Photoshop", "Ilustrator", "Fotografi", "Videografi"],
        prospek: ["Desainer grafis", "Konten kreator", "Percetakan"],
        biayaMasuk: 1350000,
        sppBulanan: 145000,
        sortOrder: 6,
      },
    ])
    .onConflictDoNothing();

  await target
    .insert(ppdbGelombang)
    .values([
      {
        nama: "Gelombang 1",
        startDate: "2026-06-01",
        endDate: "2026-09-30",
        kuota: 240,
        status: "buka",
        biaya: {
          pendaftaran: 100000,
          spp_bulanan: 150000,
          seragam: 750000,
          kegiatan: 500000,
        },
        syarat: [
          "Fotokopi KK 1 lembar",
          "Fotokopi akta kelahiran 1 lembar",
          "Fotokopi rapor semester 5",
          "Pas foto 3x4 sebanyak 4 lembar",
        ],
      },
      {
        nama: "Gelombang 2",
        startDate: "2026-10-01",
        endDate: "2026-12-31",
        kuota: 120,
        status: "tutup",
        biaya: {
          pendaftaran: 100000,
          spp_bulanan: 150000,
          seragam: 750000,
          kegiatan: 500000,
        },
        syarat: ["Fotokopi KK 1 lembar", "Fotokopi akta kelahiran 1 lembar"],
      },
    ])
    .onConflictDoNothing();

  await target
    .insert(fasilitas)
    .values([
      {
        nama: "Masjid At-Taqwa",
        kategori: "Iman",
        kapasitas: "300 jamaah",
        deskripsi: "Pusat pembinaan keimanan dan tahfidz.",
        isFeatured: true,
        fotoUrls: ["/images/placeholder-berita.svg"],
      },
      {
        nama: "Ruang Tahfidz",
        kategori: "Iman",
        kapasitas: "40 santri",
        deskripsi: "Halaqah tahfidz harian dengan musyrif.",
        fotoUrls: ["/images/placeholder-berita.svg"],
      },
      {
        nama: "Aula Keagamaan",
        kategori: "Iman",
        kapasitas: "200 kursi",
        deskripsi: "Kajian, peringatan hari besar Islam, dan wisuda tahfidz.",
        fotoUrls: ["/images/placeholder-berita.svg"],
      },
      {
        nama: "Lab Komputer",
        kategori: "Vokasi",
        kapasitas: "40 PC",
        deskripsi: "Praktik jaringan, desain, dan aplikasi perkantoran.",
        isFeatured: true,
        fotoUrls: ["/images/placeholder-jurusan.svg"],
      },
      {
        nama: "Bengkel Otomotif",
        kategori: "Vokasi",
        kapasitas: "4 stall",
        deskripsi: "Praktik tune-up, kelistrikan, dan chasis.",
        isFeatured: true,
        fotoUrls: ["/images/placeholder-jurusan.svg"],
      },
      {
        nama: "Lab Jaringan",
        kategori: "Vokasi",
        kapasitas: "20 rack",
        deskripsi: "Praktik Mikrotik, server, dan cabling.",
        fotoUrls: ["/images/placeholder-jurusan.svg"],
      },
      {
        nama: "Perpustakaan",
        kategori: "Penunjang",
        kapasitas: "5.000 judul",
        deskripsi: "Koleksi buku, ruang baca, dan pojok literasi.",
        fotoUrls: ["/images/placeholder-berita.svg"],
      },
      {
        nama: "Lapangan Futsal",
        kategori: "Penunjang",
        kapasitas: "2 lapangan",
        deskripsi: "Latihan futsal dan kegiatan olahraga.",
        fotoUrls: ["/images/ekskul-futsal/futsal-2.jpg"],
      },
      {
        nama: "Kantin Kewirausahaan",
        kategori: "Penunjang",
        kapasitas: "8 stan",
        deskripsi: "Praktik wirausaha siswa dengan pendampingan guru.",
        fotoUrls: ["/images/dll/makan-makan.jpg"],
      },
    ])
    .onConflictDoNothing();

  await target
    .insert(berita)
    .values([
      {
        slug: "futsal-juara-2-kabupaten-2026",
        judul: "Tim Futsal SMK BBM Juara 2 Tingkat Kabupaten 2026",
        excerpt: "Pengawalan bakat olahraga sampai profesional berbuah prestasi.",
        body: "## Prestasi membanggakan\n\nTim futsal SMK Bangun Bangsa Mandiri meraih **Juara 2** tingkat Kabupaten Indramayu 2026 setelah melalui 5 pertandingan.",
        kategori: "Prestasi",
        publishedAt: new Date("2026-08-20T08:00:00+07:00"),
        readingMinutes: 3,
      },
      {
        slug: "kerjasama-dudi-bengkel-2026",
        judul: "SMK BBM Teken Kerjasama DUDI dengan 4 Bengkel Lokal",
        excerpt: "Penyerapan lulusan otomotif makin terbuka.",
        body: "## Kemitraan DUDI\n\nEmpat bengkel di Kandanghaur dan Kroya resmi menjadi mitra Praktik Kerja Lapangan dan penyerapan lulusan.",
        kategori: "DUDI",
        publishedAt: new Date("2026-08-10T08:00:00+07:00"),
        readingMinutes: 3,
      },
      {
        slug: "bazar-kewirausahaan-2026",
        judul: "Bazar Kewirausahaan: Stan Siswa Raup Omzet Jutaan Rupiah",
        excerpt: "Praktik wirausaha nyata di kantin sekolah.",
        body: "## Wirausaha muda\n\nStan kuliner dan fashion karya siswa mencatat omzet gabungan jutaan rupiah dalam bazar sehari.",
        kategori: "Wirausaha",
        publishedAt: new Date("2026-07-28T08:00:00+07:00"),
        readingMinutes: 4,
      },
      {
        slug: "ppdb-gelombang-1-dibuka",
        judul: "PPDB Gelombang 1 Tahun Ajaran 2026/2027 Resmi Dibuka",
        excerpt: "Daftar mudah via HP, biaya transparan, ada beasiswa.",
        body: "## Pendaftaran dibuka\n\nCalon siswa bisa mendaftar online melalui halaman PPDB atau datang langsung ke Jl. PU Kemped No.212.",
        kategori: "Pengumuman",
        publishedAt: new Date("2026-06-02T08:00:00+07:00"),
        readingMinutes: 2,
      },
      {
        slug: "wisuda-tahfidz-2026",
        judul: "12 Siswa Diwisuda dalam Haflah Tahfidz 2026",
        excerpt: "Fondasi keimanan sebagai pilar utama sekolah.",
        body: "## Haflah tahfidz\n\nDua belas siswa diwisuda setelah menyelesaikan hafalan 1–5 juz dengan predikat baik.",
        kategori: "Prestasi",
        publishedAt: new Date("2026-05-18T08:00:00+07:00"),
        readingMinutes: 3,
      },
      {
        slug: "pelatihan-bahasa-inggris",
        judul: "Intensif Bahasa Inggris: Bekal Kerja Lokal & Global",
        excerpt: "Nilai tambah global untuk setiap lulusan.",
        body: "## English intensive\n\nProgram intensif bahasa Inggris berjalan tiap pekan untuk semua jurusan tanpa biaya tambahan.",
        kategori: "DUDI",
        publishedAt: new Date("2026-04-25T08:00:00+07:00"),
        readingMinutes: 3,
      },
    ])
    .onConflictDoNothing();

  await target
    .insert(pengumuman)
    .values([
      {
        judul: "PPDB Gelombang 1 dibuka — kuota 240 kursi",
        body: "Pendaftaran online via halaman PPDB atau WA Humas. Bawa fotokopi KK saat daftar ulang.",
        kategori: "pengumuman",
        isPinned: true,
      },
      {
        judul: "Beasiswa tahfidz & prestasi seni-olahraga tersedia",
        body: "Potongan biaya masuk bagi penghafal Al-Qur'an dan peraih juara minimal tingkat kabupaten.",
        kategori: "pengumuman",
        isPinned: true,
      },
      {
        judul: "Jadwal daftar ulang: Senin–Jumat 08.00–14.00",
        body: "Loket di ruang TU, Jl. PU Kemped No.212 Kandanghaur.",
        kategori: "pengumuman",
        isPinned: true,
      },
      {
        judul: "Upacara HUT RI ke-81",
        body: "Lapangan sekolah, 17 Agustus 2026 pukul 07.00. Seluruh siswa wajib hadir.",
        kategori: "agenda",
      },
      {
        judul: "Bazar kewirausahaan semester ganjil",
        body: "Kantin sekolah, pekan kedua Oktober 2026. Pendaftaran stan via wali kelas.",
        kategori: "agenda",
      },
    ])
    .onConflictDoNothing();

  const galeriRows = [
    {
      caption: "Praktik pengelasan dasar kelas X TKR",
      kategori: "Praktik",
      takenAt: "2026-08-01",
      imageUrl: "/images/placeholder-jurusan.svg",
    },
    {
      caption: "Konfigurasi Mikrotik lab jaringan",
      kategori: "Praktik",
      takenAt: "2026-08-05",
      imageUrl: "/images/placeholder-jurusan.svg",
    },
    {
      caption: "Latihan futsal sore hari",
      kategori: "Olahraga",
      takenAt: "2026-07-20",
      imageUrl: "/images/ekskul-futsal/futsal-2.jpg",
    },
    {
      caption: "Tim futsal SMK BBM",
      kategori: "Olahraga",
      takenAt: "2026-08-18",
      imageUrl: "/images/ekskul-futsal/futsal-3.jpg",
    },
    {
      caption: "Penampilan hadroh acara isra miraj",
      kategori: "Seni",
      takenAt: "2026-02-10",
      imageUrl: "/images/placeholder-berita.svg",
    },
    {
      caption: "Lomba tari tradisional HUT sekolah",
      kategori: "Seni",
      takenAt: "2026-05-02",
      imageUrl: "/images/placeholder-berita.svg",
    },
    {
      caption: "Halaqah tahfidz ba'da zuhur",
      kategori: "Keagamaan",
      takenAt: "2026-06-12",
      imageUrl: "/images/placeholder-jurusan.svg",
    },
    {
      caption: "Haflah wisuda tahfidz 2026",
      kategori: "Keagamaan",
      takenAt: "2026-05-18",
      imageUrl: "/images/placeholder-berita.svg",
    },
    {
      caption: "Stan kuliner bazar kewirausahaan",
      kategori: "Wirausaha",
      takenAt: "2026-07-28",
      imageUrl: "/images/dll/makan-makan.jpg",
    },
    {
      caption: "Produk fashion karya tata busana",
      kategori: "Wirausaha",
      takenAt: "2026-07-28",
      imageUrl: "/images/kegiatan-osis/osis-1.jpg",
    },
    {
      caption: "Kunjungan industri bengkel mitra",
      kategori: "Praktik",
      takenAt: "2026-08-08",
      imageUrl: "/images/placeholder-jurusan.svg",
    },
    {
      caption: "Apel pagi dan pembinaan karakter",
      kategori: "Keagamaan",
      takenAt: "2026-07-14",
      imageUrl: "/images/taman-smk/taman-1.jpg",
    },
  ];
  await target.insert(galeri).values(galeriRows).onConflictDoNothing();

  await target
    .insert(ekskul)
    .values([
      {
        nama: "Pramuka",
        jadwal: "Jumat 15.30 • Lapangan",
        pembina: "Kak Hery",
        deskripsi: "Kepramukaan penegak dan tali-temali.",
      },
      {
        nama: "Paskibra",
        jadwal: "Sabtu 08.00 • Lapangan",
        pembina: "Kak Dedi",
        deskripsi: "Baris-berbaris dan pengibaran bendera.",
      },
      {
        nama: "Futsal",
        jadwal: "Rabu & Sabtu 15.30 • Lapangan futsal",
        pembina: "Coach Andi",
        deskripsi: "Tim inti dan pembinaan usia muda.",
      },
      {
        nama: "Hadroh",
        jadwal: "Kamis 15.30 • Aula",
        pembina: "Ust. Mahmud",
        deskripsi: "Seni musik islami dan qasidah.",
      },
      {
        nama: "PMR",
        jadwal: "Selasa 15.30 • UKS",
        pembina: "Bu Rina",
        deskripsi: "Pertolongan pertama dan donor darah.",
      },
      {
        nama: "Kewirausahaan",
        jadwal: "Jumat 13.00 • Kantin",
        pembina: "Pak Budi",
        deskripsi: "Stan usaha siswa dan bazar.",
      },
    ])
    .onConflictDoNothing();

  await target
    .insert(prestasi)
    .values([
      { judul: "Juara 2 Futsal tingkat Kabupaten", tahun: 2026, tingkat: "Kabupaten" },
      { judul: "Juara 1 Hadroh tingkat Kecamatan", tahun: 2026, tingkat: "Kecamatan" },
      { judul: "Juara 3 LKS IT Network tingkat Kabupaten", tahun: 2025, tingkat: "Kabupaten" },
      { judul: "Sekolah Adiwiyata tingkat Kabupaten", tahun: 2025, tingkat: "Kabupaten" },
    ])
    .onConflictDoNothing();

  await target
    .insert(testimoni)
    .values([
      {
        nama: "Deden S.",
        angkatan: "2023",
        statusText: "Teknisi di bengkel mitra Kroya",
        quote: "Lulus langsung kerja. Ilmu bengkelnya kepakai semua.",
      },
      {
        nama: "Novi L.",
        angkatan: "2022",
        statusText: "Admin di perusahaan Kandanghaur",
        quote: "Belajar komputer dan bahasa Inggrisnya ngebantu banget di kantor.",
      },
      {
        nama: "Agus P.",
        angkatan: "2024",
        statusText: "Wirausaha konter HP",
        quote: "Diajari jualan sejak kelas XI, sekarang punya konter sendiri.",
      },
      {
        nama: "Siti M.",
        angkatan: "2021",
        statusText: "Kuliah sambil kerja",
        quote: "Guru-gurunya perhatian, biaya juga jelas dari awal.",
      },
    ])
    .onConflictDoNothing();

  await target
    .insert(siteConfig)
    .values([
      {
        key: "hero",
        value: {
          title: "Mandiri Berahlak, Terampil Berwirausaha",
          subtitle: "Sekolah terjangkau untuk pasar kerja lokal & global.",
        },
      },
      { key: "stats", value: { siswa: 480, guru: 32, dudi: 18, serapan: 87 } },
      {
        key: "kontak",
        value: {
          alamat: "Jl. PU Kemped No.212, Kandanghaur, Indramayu 45254",
          wa: "6281234567890",
          email: "humas@smkbbm.sch.id",
        },
      },
      { key: "jam", value: { senin_jumat: "07.00–15.00", sabtu: "08.00–12.00" } },
      { key: "sosmed", value: { fb: "", ig: "", yt: "", tiktok: "" } },
    ])
    .onConflictDoNothing();
}

if (import.meta.main) {
  await runSeed();
  await closeDb();
  console.log("seed ok");
}
