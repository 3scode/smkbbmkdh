import { db } from "@/lib/db";
import { kontakMessage } from "@/lib/schema";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { kontakSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendAdminMail } from "@/lib/mail";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

export const POST = withHandler(async function POST(request: Request) {
  try {
    const rl = checkRateLimit(request, "kontak");
    if (!rl.ok) {
      return fail("RATE_LIMITED", "Terlalu sering mengirim. Coba lagi 1 menit.", undefined, {
        headers: { "Retry-After": "60" },
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("VALIDATION_ERROR", "Format data tidak valid (JSON).");
    }
    if (body && typeof body === "object" && "website" in body) {
      return ok({ id: null });
    }

    const parsed = kontakSchema.safeParse(body);
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
    }
    const input = parsed.data;

    const inserted = await db
      .insert(kontakMessage)
      .values({
        nama: input.nama,
        wa: input.wa,
        keperluan: input.keperluan,
        pesan: input.pesan,
      })
      .returning({ id: kontakMessage.id });

    const mail = await sendAdminMail({
      subject: `[Kontak SMK BBM] ${input.keperluan}`,
      text: [
        `Keperluan: ${input.keperluan}`,
        `Nama: ${input.nama}`,
        `WA: ${input.wa}`,
        "",
        input.pesan,
      ].join("\n"),
    });
    if (!mail.sent) {
      console.warn(`[kontak] mail admin gagal (mocked=${mail.mocked})`);
    }

    return ok({ id: inserted[0]?.id ?? null, notifAdmin: mail.sent });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal mengirim pesan. Coba lagi atau hubungi WA Humas.");
  }
});
