CREATE TABLE "berita" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"judul" varchar(200) NOT NULL,
	"excerpt" varchar(300),
	"body" text NOT NULL,
	"kategori" varchar(40) NOT NULL,
	"cover_url" text,
	"author" varchar(80) DEFAULT 'Humas SMK BBM' NOT NULL,
	"published_at" timestamp with time zone,
	"reading_minutes" integer DEFAULT 3 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "berita_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ekskul" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(80) NOT NULL,
	"jadwal" varchar(120),
	"pembina" varchar(80),
	"deskripsi" text,
	CONSTRAINT "ekskul_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "fasilitas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(120) NOT NULL,
	"kategori" varchar(20) NOT NULL,
	"kapasitas" varchar(60),
	"deskripsi" text,
	"foto_urls" text[] DEFAULT '{}' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fasilitas_kategori_check" CHECK ("fasilitas"."kategori" IN ('Iman','Vokasi','Penunjang'))
);
--> statement-breakpoint
CREATE TABLE "galeri" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caption" varchar(200) NOT NULL,
	"kategori" varchar(40) NOT NULL,
	"taken_at" date,
	"image_url" text NOT NULL,
	"video_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jurusan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"nama" varchar(120) NOT NULL,
	"kategori" varchar(40) DEFAULT 'Vokasi' NOT NULL,
	"deskripsi" text,
	"durasi" varchar(20) DEFAULT '3 Tahun' NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"prospek" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"biaya_masuk" integer DEFAULT 0 NOT NULL,
	"spp_bulanan" integer DEFAULT 0 NOT NULL,
	"cover_url" text,
	"kurikulum" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jurusan_slug_unique" UNIQUE("slug"),
	CONSTRAINT "jurusan_slug_format" CHECK ("jurusan"."slug" ~ '^[a-z0-9-]+$')
);
--> statement-breakpoint
CREATE TABLE "kontak_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(120) NOT NULL,
	"wa" varchar(20) NOT NULL,
	"keperluan" varchar(40) NOT NULL,
	"pesan" text NOT NULL,
	"status" varchar(20) DEFAULT 'baru' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "kontak_pesan_check" CHECK (char_length("kontak_message"."pesan") >= 10)
);
--> statement-breakpoint
CREATE TABLE "notify_subscriber" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wa" varchar(20) NOT NULL,
	"gelombang_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pengumuman" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"kategori" varchar(20) DEFAULT 'pengumuman' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	CONSTRAINT "pengumuman_kategori_check" CHECK ("pengumuman"."kategori" IN ('pengumuman','agenda'))
);
--> statement-breakpoint
CREATE TABLE "ppdb_gelombang" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(60) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"kuota" integer DEFAULT 200 NOT NULL,
	"status" varchar(20) DEFAULT 'tutup' NOT NULL,
	"biaya" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"syarat" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "gelombang_status_check" CHECK ("ppdb_gelombang"."status" IN ('buka','tutup')),
	CONSTRAINT "gelombang_date_check" CHECK ("ppdb_gelombang"."end_date" >= "ppdb_gelombang"."start_date")
);
--> statement-breakpoint
CREATE TABLE "ppdb_registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nomor_bukti" varchar(20) NOT NULL,
	"nama" text NOT NULL,
	"asal_smp" varchar(120) NOT NULL,
	"jurusan_id" uuid NOT NULL,
	"gelombang_id" uuid NOT NULL,
	"wa" text NOT NULL,
	"tgl_lahir" date,
	"kk_file_url" text,
	"consent_wali" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"idempotency_key" varchar(64),
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ppdb_registration_nomor_bukti_unique" UNIQUE("nomor_bukti"),
	CONSTRAINT "ppdb_nama_check" CHECK (char_length("ppdb_registration"."nama") >= 3),
	CONSTRAINT "ppdb_consent_check" CHECK ("ppdb_registration"."consent_wali" = true)
);
--> statement-breakpoint
CREATE TABLE "prestasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(200) NOT NULL,
	"tahun" integer NOT NULL,
	"tingkat" varchar(40)
);
--> statement-breakpoint
CREATE TABLE "site_config" (
	"key" varchar(60) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimoni" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(80) NOT NULL,
	"angkatan" varchar(10),
	"status_text" varchar(120),
	"quote" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notify_subscriber" ADD CONSTRAINT "notify_subscriber_gelombang_id_ppdb_gelombang_id_fk" FOREIGN KEY ("gelombang_id") REFERENCES "public"."ppdb_gelombang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ppdb_registration" ADD CONSTRAINT "ppdb_registration_jurusan_id_jurusan_id_fk" FOREIGN KEY ("jurusan_id") REFERENCES "public"."jurusan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ppdb_registration" ADD CONSTRAINT "ppdb_registration_gelombang_id_ppdb_gelombang_id_fk" FOREIGN KEY ("gelombang_id") REFERENCES "public"."ppdb_gelombang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "berita_slug_idx" ON "berita" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "berita_feed_idx" ON "berita" USING btree ("published_at" DESC NULLS LAST) WHERE "berita"."published_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "berita_kategori_idx" ON "berita" USING btree ("kategori","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "fasilitas_kategori_idx" ON "fasilitas" USING btree ("kategori");--> statement-breakpoint
CREATE INDEX "galeri_filter_idx" ON "galeri" USING btree ("kategori","taken_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "jurusan_active_sort_idx" ON "jurusan" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "kontak_created_idx" ON "kontak_message" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "notify_wa_gelombang_idx" ON "notify_subscriber" USING btree ("wa","gelombang_id");--> statement-breakpoint
CREATE UNIQUE INDEX "notify_wa_null_gelombang_idx" ON "notify_subscriber" USING btree ("wa") WHERE "notify_subscriber"."gelombang_id" IS NULL;--> statement-breakpoint
CREATE INDEX "notify_wa_idx" ON "notify_subscriber" USING btree ("wa");--> statement-breakpoint
CREATE INDEX "pengumuman_pin_idx" ON "pengumuman" USING btree ("is_pinned","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "ppdb_nomor_bukti_idx" ON "ppdb_registration" USING btree ("nomor_bukti");--> statement-breakpoint
CREATE INDEX "ppdb_gelombang_idx" ON "ppdb_registration" USING btree ("gelombang_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "ppdb_jurusan_idx" ON "ppdb_registration" USING btree ("jurusan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ppdb_idempotency_idx" ON "ppdb_registration" USING btree ("idempotency_key") WHERE "ppdb_registration"."idempotency_key" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "prestasi_tahun_idx" ON "prestasi" USING btree ("tahun" DESC NULLS LAST);