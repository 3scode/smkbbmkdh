import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { appSession, appUser, authAudit } from "@/lib/schema";
import { hashPassword, requireSession, verifyPassword } from "@/lib/auth";
import { checkRateLimit, clientIp, hashIp } from "@/lib/rate-limit";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const gantiSchema = z.object({
  passwordLama: z.string().min(1, "Password lama wajib diisi.").max(128),
  passwordBaru: z
    .string()
    .min(10, "Password baru minimal 10 karakter.")
    .max(128, "Password baru maksimal 128 karakter.")
    .regex(/[0-9]/, "Password baru harus memuat angka."),
});

export const POST = withHandler(async function POST(request: Request) {
  const user = await requireSession();
  if (!user) return fail("UNAUTHORIZED", "Belum login. Silakan login dulu.");

  const rl = checkRateLimit(request, "auth:ganti-password");
  if (!rl.ok) {
    return fail("RATE_LIMITED", "Terlalu sering mencoba. Coba lagi 1 menit.", undefined, {
      headers: { "Retry-After": "60" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("VALIDATION_ERROR", "Format data tidak valid.");
  }
  const parsed = gantiSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }

  const rows = await db.select().from(appUser).where(eq(appUser.id, user.id)).limit(1);
  const akun = rows[0];
  if (!akun || !akun.isActive) return fail("UNAUTHORIZED", "Akun tidak aktif.");
  if (!(await verifyPassword(parsed.data.passwordLama, akun.passwordHash))) {
    return fail("VALIDATION_ERROR", "Password lama salah.", {
      passwordLama: "Password lama salah.",
    });
  }
  if (await verifyPassword(parsed.data.passwordBaru, akun.passwordHash)) {
    return fail("VALIDATION_ERROR", "Password baru harus berbeda dari yang lama.", {
      passwordBaru: "Gunakan password yang berbeda.",
    });
  }

  await db
    .update(appUser)
    .set({
      passwordHash: await hashPassword(parsed.data.passwordBaru),
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(appUser.id, user.id));
  // Cabut sesi lain (perangkat lain), sesi ini tetap berlaku
  await db
    .update(appSession)
    .set({ revokedAt: new Date() })
    .where(and(eq(appSession.userId, user.id), ne(appSession.id, user.sessionId)));
  await db.insert(authAudit).values({
    userId: user.id,
    aksi: "ganti_password",
    ipHash: hashIp(clientIp(request)),
  });

  return ok({ berhasil: true });
});
