import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan, ppdbRegistration } from "@/lib/schema";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { ppdbSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendAdminMail } from "@/lib/mail";
import { InvalidFileError, UploadTooLargeError, uploadKk, validateKkFile } from "@/lib/storage";
import { buildWaLink } from "@/lib/utils";
import { generateNomorBukti, getGelombangAktif } from "@/lib/ppdb";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

function isUniqueViolation(e: unknown): boolean {
  const code = (e as { code?: string })?.code;
  return code === "23505" || /unique|duplicate/i.test(e instanceof Error ? e.message : String(e));
}

function idempotencyTtlHours(): number {
  const v = Number(process.env.IDEMPOTENCY_TTL_HOURS ?? 24);
  return Number.isFinite(v) && v > 0 ? v : 24;
}

export const POST = withHandler(async function POST(request: Request) {
  try {
    const rl = checkRateLimit(request, "ppdb:submit");
    if (!rl.ok) {
      return fail("RATE_LIMITED", "Terlalu sering mengirim. Coba lagi 1 menit.", undefined, {
        headers: { "Retry-After": "60" },
      });
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("VALIDATION_ERROR", "Format data tidak valid.");
    }

    // Honeypot: bot mengisi field tak kasat mata → pura-pura sukses
    if (form.get("website")) {
      return ok({ nomorBukti: null, waLink: null, notifAdmin: false });
    }

    const idempotencyKey = request.headers.get("x-idempotency-key")?.slice(0, 64) || null;
    if (idempotencyKey) {
      const prev = await db
        .select()
        .from(ppdbRegistration)
        .where(eq(ppdbRegistration.idempotencyKey, idempotencyKey))
        .limit(1);
      const row = prev[0];
      if (row) {
        const ageH = (Date.now() - new Date(row.createdAt).getTime()) / 3_600_000;
        if (ageH < idempotencyTtlHours()) {
          return ok({
            nomorBukti: row.nomorBukti,
            waLink: buildWaLink(row.nama, row.nomorBukti),
            notifAdmin: true,
          });
        }
        await db
          .update(ppdbRegistration)
          .set({ idempotencyKey: null })
          .where(eq(ppdbRegistration.id, row.id));
      }
    }

    const raw: Record<string, unknown> = {};
    for (const [k, v] of form.entries()) {
      if (k === "kk" || k === "website") continue;
      if (typeof v === "string") raw[k] = v;
    }
    const parsed = ppdbSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
    }
    const input = parsed.data;

    const gelombang = await getGelombangAktif();
    if (!gelombang || gelombang.status !== "buka") {
      return fail(
        "CONFLICT",
        "Pendaftaran gelombang ini ditutup. Tinggalkan nomor WA via form Ingatkan Saya.",
        { notify: true },
      );
    }

    const jr = await db
      .select({ id: jurusan.id, nama: jurusan.nama })
      .from(jurusan)
      .where(and(eq(jurusan.id, input.jurusanId), eq(jurusan.isActive, true)))
      .limit(1);
    if (!jr[0]) {
      return fail("VALIDATION_ERROR", "Jurusan tidak valid.", {
        jurusanId: "Pilih jurusan yang tersedia.",
      });
    }

    // File KK opsional — kegagalan storage tidak menggagalkan pendaftaran
    let kkFileUrl: string | null = null;
    let kkWarning: string | null = null;
    const kkRaw = form.get("kk");
    if (kkRaw instanceof File && kkRaw.size > 0) {
      try {
        const valid = await validateKkFile(kkRaw);
        try {
          kkFileUrl = await uploadKk(valid.bytes, valid.ext);
        } catch {
          kkWarning = "File KK gagal diunggah — pendaftaran tetap diproses.";
        }
      } catch (e) {
        if (e instanceof UploadTooLargeError) {
          return fail("PAYLOAD_TOO_LARGE", e.message, { kk: e.message });
        }
        return fail("VALIDATION_ERROR", "File KK tidak valid.", {
          kk: e instanceof InvalidFileError ? e.message : "Format salah.",
        });
      }
    }

    let nomorBukti = "";
    for (let i = 0; i < 5 && !nomorBukti; i++) {
      const candidate = generateNomorBukti();
      try {
        await db.insert(ppdbRegistration).values({
          nomorBukti: candidate,
          nama: input.nama,
          asalSmp: input.asalSmp,
          jurusanId: input.jurusanId,
          gelombangId: gelombang.id,
          wa: input.wa,
          tglLahir: input.tglLahir || null,
          kkFileUrl,
          consentWali: true,
          idempotencyKey,
        });
        nomorBukti = candidate;
      } catch (e) {
        if (!isUniqueViolation(e)) throw e;
        if (idempotencyKey) {
          const race = await db
            .select()
            .from(ppdbRegistration)
            .where(eq(ppdbRegistration.idempotencyKey, idempotencyKey))
            .limit(1);
          if (race[0]) {
            return ok({
              nomorBukti: race[0].nomorBukti,
              waLink: buildWaLink(race[0].nama, race[0].nomorBukti),
              notifAdmin: true,
            });
          }
        }
      }
    }
    if (!nomorBukti) {
      return fail("INTERNAL_ERROR", "Gagal membuat nomor bukti. Coba lagi.");
    }

    const mail = await sendAdminMail({
      subject: `[PPDB SMK BBM] Pendaftaran baru ${nomorBukti}`,
      text: [
        `Nomor: ${nomorBukti}`,
        `Nama: ${input.nama}`,
        `Asal SMP: ${input.asalSmp}`,
        `Jurusan: ${jr[0].nama}`,
        `WA: ${input.wa}`,
        `Gelombang: ${gelombang.nama}`,
        kkFileUrl ? `KK: ${kkFileUrl}` : "KK: tidak dilampirkan",
        kkWarning ?? "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    if (!mail.sent) {
      console.warn(`[ppdb] mail admin gagal untuk ${nomorBukti} (mocked=${mail.mocked})`);
    }

    return ok({
      nomorBukti,
      waLink: buildWaLink(input.nama, nomorBukti),
      notifAdmin: mail.sent,
    });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal mengirim pendaftaran. Coba lagi atau hubungi WA Humas.");
  }
});
