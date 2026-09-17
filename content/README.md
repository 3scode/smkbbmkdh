# Panduan CMS untuk Humas (1 halaman)

Website SMK BBM bisa diperbarui **tanpa coding** lewat halaman CMS.

## 1. Buka CMS

- **Lokal (latihan):** jalankan `bunx decap-server` di laptop, lalu buka `http://localhost:3000/admin`
- **Produksi:** buka `https://smkbbm-kandanghaur.sch.id/admin` lalu login (akun dibuatkan admin IT)

## 2. Yang bisa diubah

| Menu CMS | Isi | Tampil di |
|---|---|---|
| Profil Sekolah | Visi, 7 Misi, 7 Tujuan, sejarah, sambutan kepsek | `/profil` |
| Hero & Statistik | Judul hero, angka siswa/guru/DUDI/serapan | `/` |
| Kontak | Alamat, WA, email, jam layanan | `/kontak` |
| Info PPDB | Biaya, syarat, FAQ | `/ppdb` |

> Berita, jurusan, fasilitas, galeri dikelola via **dashboard Supabase** (tabel `berita`, `jurusan`, dst). Minta akses ke admin IT.

## 3. Upload gambar

- Maksimal **1MB** per file (CMS otomatis mengompres), format JPG/PNG
- Beri nama jelas, contoh: `lab-komputer-2026.jpg` (jangan `IMG_123.jpg`)
- Foto tersimpan di folder `uploads`

## 4. Publish

1. Ubah → **Save** → **Publish** (mode editorial: bisa review dulu via **Preview**)
2. Tunggu **≤5 menit** — website rebuild otomatis, perubahan tampil sendiri
3. Cek halaman terkait di HP + laptop

## 5. Batalkan perubahan (rollback)

- Buka riwayat commit di GitHub → **Revert** commit CMS terakhir (kembali 1 versi)
- Atau hubungi admin IT, sebutkan tanggal/jam perubahan

## 6. Aturan singkat

- Jangan hapus field/key JSON — cukup ubah isinya
- Visi/Misi/Tujuan: ubah kata seperlunya, **jangan kurangi jumlah poin** tanpa sepengetahuan kepsek
- Data pendaftar PPDB **tidak ada di CMS** (hanya di database, akses admin IT)
