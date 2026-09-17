CREATE TABLE "app_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"ip_hash" varchar(64),
	"user_agent" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_session_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "app_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nip_nis" varchar(30) NOT NULL,
	"nama" varchar(120) NOT NULL,
	"peran" varchar(20) NOT NULL,
	"password_hash" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"must_change_password" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_user_nip_nis_unique" UNIQUE("nip_nis"),
	CONSTRAINT "app_user_peran_check" CHECK ("app_user"."peran" IN ('siswa','guru','kaprodi','wakasek','kesiswaan','admin'))
);
--> statement-breakpoint
CREATE TABLE "auth_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"nip_nis_attempt" varchar(30),
	"aksi" varchar(30) NOT NULL,
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_audit_aksi_check" CHECK ("auth_audit"."aksi" IN ('login','login_gagal','logout','ganti_password','sesi_dicabut','akun_dibuat','akun_dinonaktifkan'))
);
--> statement-breakpoint
CREATE TABLE "guru" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"nuptk" varchar(20),
	"nama" varchar(120) NOT NULL,
	"mapel" varchar(120),
	"jurusan_id" uuid,
	"jadwal" varchar(120),
	"wali_kelas" varchar(60),
	"is_kaprodi" boolean DEFAULT false NOT NULL,
	"jurusan_kaprodi_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guru_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "guru_nuptk_unique" UNIQUE("nuptk")
);
--> statement-breakpoint
CREATE TABLE "siswa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"nisn" varchar(10) NOT NULL,
	"nama" varchar(120) NOT NULL,
	"jurusan_id" uuid,
	"tingkat" varchar(3),
	"kelas" varchar(10),
	"angkatan" varchar(9),
	"consent_wali_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "siswa_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "siswa_nisn_unique" UNIQUE("nisn"),
	CONSTRAINT "siswa_tingkat_check" CHECK ("siswa"."tingkat" IN ('X','XI','XII'))
);
--> statement-breakpoint
ALTER TABLE "app_session" ADD CONSTRAINT "app_session_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_audit" ADD CONSTRAINT "auth_audit_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guru" ADD CONSTRAINT "guru_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guru" ADD CONSTRAINT "guru_jurusan_id_jurusan_id_fk" FOREIGN KEY ("jurusan_id") REFERENCES "public"."jurusan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guru" ADD CONSTRAINT "guru_jurusan_kaprodi_id_jurusan_id_fk" FOREIGN KEY ("jurusan_kaprodi_id") REFERENCES "public"."jurusan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_jurusan_id_jurusan_id_fk" FOREIGN KEY ("jurusan_id") REFERENCES "public"."jurusan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "app_session_token_idx" ON "app_session" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "app_session_user_idx" ON "app_session" USING btree ("user_id","expires_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "app_user_nip_nis_idx" ON "app_user" USING btree ("nip_nis");--> statement-breakpoint
CREATE INDEX "app_user_peran_idx" ON "app_user" USING btree ("peran");--> statement-breakpoint
CREATE INDEX "auth_audit_user_idx" ON "auth_audit" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "guru_jurusan_idx" ON "guru" USING btree ("jurusan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "siswa_nisn_idx" ON "siswa" USING btree ("nisn");--> statement-breakpoint
CREATE INDEX "siswa_jurusan_idx" ON "siswa" USING btree ("jurusan_id","tingkat");