-- Rollback untuk drizzle/0000_init.sql
-- Urutan dibalik (tabel anak dulu karena FK RESTRICT/no-action).

DROP TABLE IF EXISTS "ppdb_registration";
DROP TABLE IF EXISTS "notify_subscriber";
DROP TABLE IF EXISTS "kontak_message";
DROP TABLE IF EXISTS "ppdb_gelombang";
DROP TABLE IF EXISTS "jurusan";
DROP TABLE IF EXISTS "berita";
DROP TABLE IF EXISTS "pengumuman";
DROP TABLE IF EXISTS "galeri";
DROP TABLE IF EXISTS "fasilitas";
DROP TABLE IF EXISTS "ekskul";
DROP TABLE IF EXISTS "prestasi";
DROP TABLE IF EXISTS "testimoni";
DROP TABLE IF EXISTS "site_config";
