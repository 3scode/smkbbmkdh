import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { appUser, authAudit, PERAN_LIST } from "@/lib/schema";
import { hashPassword } from "@/lib/auth";
import { canManageAccount } from "@/lib/permissions";
import { guard } from "@/lib/guard";
import type { Peran } from "@/lib/schema";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { checkRateLimit, clientIp, hashIp } from "@/lib/rate-limit";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

async function guardAkun() {
  return guard("akun:kelola_staf");
}

const akunSchema = z.object({
  nipNis: z
    .string()
    .trim()
    .min(3, "NIP/NISN minimal 3 karakter.")
    .max(30)
    .regex(/^[0-9]+$/, "NIP/NISN hanya berisi angka."),
  nama: z.string().trim().min(3, "Nama minimal 3 karakter.").max(120),
  peran: z.enum(PERAN_LIST as unknown as [Peran, ...Peran[]], {
    message: "Peran tidak dikenal.",
  }),
});

/** Buat akun — password awal = NIP/NISN, wajib diganti saat login pertama. */
export const POST = withHandler(async function POST(request: Request) {
  const g = await guardAkun();
  if (!g.ok) return g.response;
  const rl = checkRateLimit(request, "internal:akun");
  if (!rl.ok) return fail("RATE_LIMITED", "Terlalu sering. Coba lagi 1 menit.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("VALIDATION_ERROR", "Format data tidak valid.");
  }
  const parsed = akunSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }
  const { nipNis, nama, peran } = parsed.data;
  if (!canManageAccount(g.user.peran, peran)) {
    return fail("FORBIDDEN", "Anda tidak boleh membuat akun dengan peran tersebut.");
  }

  const ada = await db
    .select({ id: appUser.id })
    .from(appUser)
    .where(eq(appUser.nipNis, nipNis))
    .limit(1);
  if (ada[0]) return fail("CONFLICT", "NIP/NISN sudah terdaftar.");

  const rows = await db
    .insert(appUser)
    .values({
      nipNis,
      nama,
      peran,
      passwordHash: await hashPassword(nipNis),
      mustChangePassword: true,
    })
    .returning({ id: appUser.id });
  await db.insert(authAudit).values({
    userId: g.user.id,
    aksi: "akun_dibuat",
    ipHash: hashIp(clientIp(request)),
  });
  return ok({ id: rows[0]?.id });
});
