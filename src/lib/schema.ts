import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** timestamp with time zone (timestamptz) */
const tstz = (name: string) => timestamp(name, { withTimezone: true });

/* Jurusan / Program Keahlian — 1:N ke ppdb_registration */
export const jurusan = pgTable(
  "jurusan",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    nama: varchar("nama", { length: 120 }).notNull(),
    kategori: varchar("kategori", { length: 40 }).notNull().default("Vokasi"),
    deskripsi: text("deskripsi"),
    durasi: varchar("durasi", { length: 20 }).notNull().default("3 Tahun"),
    skills: jsonb("skills").$type<string[]>().notNull().default([]),
    prospek: jsonb("prospek").$type<string[]>().notNull().default([]),
    biayaMasuk: integer("biaya_masuk").notNull().default(0),
    sppBulanan: integer("spp_bulanan").notNull().default(0),
    coverUrl: text("cover_url"),
    kurikulum: jsonb("kurikulum").$type<string[]>(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    check("jurusan_slug_format", sql`${t.slug} ~ '^[a-z0-9-]+$'`),
    index("jurusan_active_sort_idx").on(t.isActive, t.sortOrder),
  ],
);

/* Fasilitas — kategori tetap Iman/Vokasi/Penunjang */
export const fasilitas = pgTable(
  "fasilitas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nama: varchar("nama", { length: 120 }).notNull(),
    kategori: varchar("kategori", { length: 20 }).notNull(),
    kapasitas: varchar("kapasitas", { length: 60 }),
    deskripsi: text("deskripsi"),
    fotoUrls: text("foto_urls").array().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    check("fasilitas_kategori_check", sql`${t.kategori} IN ('Iman','Vokasi','Penunjang')`),
    index("fasilitas_kategori_idx").on(t.kategori),
  ],
);

/* Berita — published_at NULL = draft, tidak tampil publik */
export const berita = pgTable(
  "berita",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    judul: varchar("judul", { length: 200 }).notNull(),
    excerpt: varchar("excerpt", { length: 300 }),
    body: text("body").notNull(),
    kategori: varchar("kategori", { length: 40 }).notNull(),
    coverUrl: text("cover_url"),
    author: varchar("author", { length: 80 }).notNull().default("Humas SMK BBM"),
    publishedAt: tstz("published_at"),
    readingMinutes: integer("reading_minutes").notNull().default(3),
    views: integer("views").notNull().default(0),
  },
  (t) => [
    uniqueIndex("berita_slug_idx").on(t.slug),
    index("berita_feed_idx")
      .on(t.publishedAt.desc())
      .where(sql`${t.publishedAt} IS NOT NULL`),
    index("berita_kategori_idx").on(t.kategori, t.publishedAt.desc()),
  ],
);

/* Pengumuman + agenda (kategori) — pin tampil di sidebar */
export const pengumuman = pgTable(
  "pengumuman",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    judul: varchar("judul", { length: 200 }).notNull(),
    body: text("body").notNull(),
    kategori: varchar("kategori", { length: 20 }).notNull().default("pengumuman"),
    isPinned: boolean("is_pinned").notNull().default(false),
    publishedAt: tstz("published_at").notNull().defaultNow(),
    expiresAt: tstz("expires_at"),
  },
  (t) => [
    check("pengumuman_kategori_check", sql`${t.kategori} IN ('pengumuman','agenda')`),
    index("pengumuman_pin_idx").on(t.isPinned, t.publishedAt.desc()),
  ],
);

/* Galeri — caption bermakna, video cukup URL facade */
export const galeri = pgTable(
  "galeri",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    caption: varchar("caption", { length: 200 }).notNull(),
    kategori: varchar("kategori", { length: 40 }).notNull(),
    takenAt: date("taken_at"),
    imageUrl: text("image_url").notNull(),
    videoUrl: text("video_url"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("galeri_filter_idx").on(t.kategori, t.takenAt.desc())],
);

export const ekskul = pgTable("ekskul", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: varchar("nama", { length: 80 }).notNull().unique(),
  jadwal: varchar("jadwal", { length: 120 }),
  pembina: varchar("pembina", { length: 80 }),
  deskripsi: text("deskripsi"),
});

export const prestasi = pgTable(
  "prestasi",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    judul: varchar("judul", { length: 200 }).notNull(),
    tahun: integer("tahun").notNull(),
    tingkat: varchar("tingkat", { length: 40 }),
  },
  (t) => [index("prestasi_tahun_idx").on(t.tahun.desc())],
);

/* Gelombang PPDB — status tutup menonaktifkan form */
export const ppdbGelombang = pgTable(
  "ppdb_gelombang",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nama: varchar("nama", { length: 60 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    kuota: integer("kuota").notNull().default(200),
    status: varchar("status", { length: 20 }).notNull().default("tutup"),
    biaya: jsonb("biaya").$type<Record<string, number>>().notNull().default({}),
    syarat: jsonb("syarat").$type<string[]>().notNull().default([]),
  },
  (t) => [
    check("gelombang_status_check", sql`${t.status} IN ('buka','tutup')`),
    check("gelombang_date_check", sql`${t.endDate} >= ${t.startDate}`),
  ],
);

/* Pendaftaran PPDB — PII anak, consent wali wajib (UU PDP) */
export const ppdbRegistration = pgTable(
  "ppdb_registration",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nomorBukti: varchar("nomor_bukti", { length: 20 }).notNull().unique(),
    nama: text("nama").notNull(),
    asalSmp: varchar("asal_smp", { length: 120 }).notNull(),
    jurusanId: uuid("jurusan_id")
      .notNull()
      .references(() => jurusan.id),
    gelombangId: uuid("gelombang_id")
      .notNull()
      .references(() => ppdbGelombang.id),
    wa: text("wa").notNull(),
    tglLahir: date("tgl_lahir"),
    kkFileUrl: text("kk_file_url"),
    consentWali: boolean("consent_wali").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    idempotencyKey: varchar("idempotency_key", { length: 64 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("ppdb_nomor_bukti_idx").on(t.nomorBukti),
    check("ppdb_nama_check", sql`char_length(${t.nama}) >= 3`),
    check("ppdb_consent_check", sql`${t.consentWali} = true`),
    index("ppdb_gelombang_idx").on(t.gelombangId, t.createdAt.desc()),
    index("ppdb_jurusan_idx").on(t.jurusanId),
    uniqueIndex("ppdb_idempotency_idx")
      .on(t.idempotencyKey)
      .where(sql`${t.idempotencyKey} IS NOT NULL`),
  ],
);

/* Pesan kontak — PII dewasa, retensi 1 tahun */
export const kontakMessage = pgTable(
  "kontak_message",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nama: varchar("nama", { length: 120 }).notNull(),
    wa: varchar("wa", { length: 20 }).notNull(),
    keperluan: varchar("keperluan", { length: 40 }).notNull(),
    pesan: text("pesan").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("baru"),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    check("kontak_pesan_check", sql`char_length(${t.pesan}) >= 10`),
    index("kontak_created_idx").on(t.createdAt.desc()),
  ],
);

/* Subscriber "Ingatkan saya" — unik per (wa, gelombang) */
export const notifySubscriber = pgTable(
  "notify_subscriber",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wa: varchar("wa", { length: 20 }).notNull(),
    gelombangId: uuid("gelombang_id").references(() => ppdbGelombang.id),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("notify_wa_gelombang_idx").on(t.wa, t.gelombangId),
    // Postgres menganggap NULL berbeda di UNIQUE, jadi cegah duplikat eksplisit saat gelombang NULL
    uniqueIndex("notify_wa_null_gelombang_idx")
      .on(t.wa)
      .where(sql`${t.gelombangId} IS NULL`),
    index("notify_wa_idx").on(t.wa),
  ],
);

export const testimoni = pgTable("testimoni", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: varchar("nama", { length: 80 }).notNull(),
  angkatan: varchar("angkatan", { length: 10 }),
  statusText: varchar("status_text", { length: 120 }),
  quote: text("quote").notNull(),
});

/* Config situs singleton (hero, stats, kontak, jam, sosmed) */
export const siteConfig = pgTable("site_config", {
  key: varchar("key", { length: 60 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: tstz("updated_at").notNull().defaultNow(),
});

/* ── Auth custom NIP/NISN — 6 peran: siswa, guru, kaprodi, wakasek, kesiswaan, admin ── */

export const PERAN_LIST = ["siswa", "guru", "kaprodi", "wakasek", "kesiswaan", "admin"] as const;

export type Peran = (typeof PERAN_LIST)[number];

/** Akun login. nipNis menampung NIP (staf), NUPTK, atau NISN (siswa, 10 digit). */
export const appUser = pgTable(
  "app_user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nipNis: varchar("nip_nis", { length: 30 }).notNull().unique(),
    nama: varchar("nama", { length: 120 }).notNull(),
    peran: varchar("peran", { length: 20 }).notNull(),
    passwordHash: varchar("password_hash", { length: 100 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    lastLoginAt: tstz("last_login_at"),
    createdAt: tstz("created_at").notNull().defaultNow(),
    updatedAt: tstz("updated_at").notNull().defaultNow(),
  },
  (t) => [
    check(
      "app_user_peran_check",
      sql`${t.peran} IN ('siswa','guru','kaprodi','wakasek','kesiswaan','admin')`,
    ),
    uniqueIndex("app_user_nip_nis_idx").on(t.nipNis),
    index("app_user_peran_idx").on(t.peran),
  ],
);

/** Sesi stateful agar bisa dicabut (revokasi) kapan saja. Token mentah hanya di cookie. */
export const appSession = pgTable(
  "app_session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => appUser.id, { onDelete: "cascade" }),
    expiresAt: tstz("expires_at").notNull(),
    revokedAt: tstz("revoked_at"),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("app_session_token_idx").on(t.tokenHash),
    index("app_session_user_idx").on(t.userId, t.expiresAt.desc()),
  ],
);

/** Profil guru (data real) — gantikan dummy src/data/akademik.ts bertahap. */
export const guru = pgTable(
  "guru",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => appUser.id, { onDelete: "set null" })
      .unique(),
    nuptk: varchar("nuptk", { length: 20 }).unique(),
    nama: varchar("nama", { length: 120 }).notNull(),
    mapel: varchar("mapel", { length: 120 }),
    jurusanId: uuid("jurusan_id").references(() => jurusan.id, { onDelete: "set null" }),
    jadwal: varchar("jadwal", { length: 120 }),
    waliKelas: varchar("wali_kelas", { length: 60 }),
    isKaprodi: boolean("is_kaprodi").notNull().default(false),
    jurusanKaprodiId: uuid("jurusan_kaprodi_id").references(() => jurusan.id, {
      onDelete: "set null",
    }),
    createdAt: tstz("created_at").notNull().defaultNow(),
    updatedAt: tstz("updated_at").notNull().defaultNow(),
  },
  (t) => [index("guru_jurusan_idx").on(t.jurusanId)],
);

/** Profil siswa (data real, agregat saja yang tampil publik — UU PDP). */
export const siswa = pgTable(
  "siswa",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => appUser.id, { onDelete: "set null" })
      .unique(),
    nisn: varchar("nisn", { length: 10 }).notNull().unique(),
    nama: varchar("nama", { length: 120 }).notNull(),
    jurusanId: uuid("jurusan_id").references(() => jurusan.id, { onDelete: "set null" }),
    tingkat: varchar("tingkat", { length: 3 }),
    kelas: varchar("kelas", { length: 10 }),
    angkatan: varchar("angkatan", { length: 9 }),
    consentWaliAt: tstz("consent_wali_at"),
    createdAt: tstz("created_at").notNull().defaultNow(),
    updatedAt: tstz("updated_at").notNull().defaultNow(),
  },
  (t) => [
    check("siswa_tingkat_check", sql`${t.tingkat} IN ('X','XI','XII')`),
    uniqueIndex("siswa_nisn_idx").on(t.nisn),
    index("siswa_jurusan_idx").on(t.jurusanId, t.tingkat),
  ],
);

/** Jejak audit auth — tanpa password/PII mentah, IP dalam bentuk hash. */
export const authAudit = pgTable(
  "auth_audit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => appUser.id, { onDelete: "set null" }),
    nipNisAttempt: varchar("nip_nis_attempt", { length: 30 }),
    aksi: varchar("aksi", { length: 30 }).notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: tstz("created_at").notNull().defaultNow(),
  },
  (t) => [
    check(
      "auth_audit_aksi_check",
      sql`${t.aksi} IN ('login','login_gagal','logout','ganti_password','sesi_dicabut','akun_dibuat','akun_dinonaktifkan')`,
    ),
    index("auth_audit_user_idx").on(t.userId, t.createdAt.desc()),
  ],
);
