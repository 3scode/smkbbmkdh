-- RLS untuk Supabase — jalankan di SQL editor SETELAH migrasi 0001.
-- service_role (server) bypass RLS by default; policy di bawah untuk key anon publik.

-- GRANT minimal (RLS policy saja tidak cukup tanpa GRANT di Postgres).
-- Baca publik
GRANT SELECT ON
  jurusan, fasilitas, berita, pengumuman, galeri, ekskul,
  prestasi, ppdb_gelombang, testimoni, site_config
  TO anon;
-- Tulis form publik
GRANT INSERT ON ppdb_registration, kontak_message, notify_subscriber TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Aktifkan RLS di semua tabel
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasilitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_gelombang ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE kontak_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE notify_subscriber ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimoni ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Baca publik: hanya konten aktif / terbit
CREATE POLICY "anon read jurusan"
  ON jurusan FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon read fasilitas"
  ON fasilitas FOR SELECT TO anon USING (true);
CREATE POLICY "anon read berita"
  ON berita FOR SELECT TO anon USING (published_at IS NOT NULL);
CREATE POLICY "anon read pengumuman"
  ON pengumuman FOR SELECT TO anon
  USING (expires_at IS NULL OR expires_at > now());
CREATE POLICY "anon read galeri"
  ON galeri FOR SELECT TO anon USING (true);
CREATE POLICY "anon read ekskul"
  ON ekskul FOR SELECT TO anon USING (true);
CREATE POLICY "anon read prestasi"
  ON prestasi FOR SELECT TO anon USING (true);
CREATE POLICY "anon read gelombang"
  ON ppdb_gelombang FOR SELECT TO anon USING (true);
CREATE POLICY "anon read testimoni"
  ON testimoni FOR SELECT TO anon USING (true);
CREATE POLICY "anon read site_config"
  ON site_config FOR SELECT TO anon USING (true);

-- Tulis publik: hanya INSERT form (tanpa SELECT/UPDATE/DELETE)
-- Validasi isi tetap di CHECK constraints + Zod server.
CREATE POLICY "anon insert ppdb"
  ON ppdb_registration FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert kontak"
  ON kontak_message FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert notify"
  ON notify_subscriber FOR INSERT TO anon WITH CHECK (true);

-- Catatan PII (UU PDP): kolom nama/wa/kk_file_url hanya dibaca via
-- service_role di server. Jangan buat policy SELECT untuk anon di
-- ppdb_registration / kontak_message / notify_subscriber.

-- ── Auth custom (migrasi 0001): TANPA policy anon/authenticated sama sekali.
-- Semua akses lewat koneksi service di server + helper can() di src/lib/permissions.ts.
-- REVOKE dulu agar GRANT default tidak bocor, lalu aktifkan RLS.
REVOKE ALL ON app_user, app_session, guru, siswa, auth_audit FROM anon, authenticated;
ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit ENABLE ROW LEVEL SECURITY;
