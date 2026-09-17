import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { appUser, authAudit } from "@/lib/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { checkRateLimit, clientIp, hashIp } from "@/lib/rate-limit";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  nipNis: z
    .string()
    .trim()
    .min(3, "NIP/NISN minimal 3 karakter.")
    .max(30, "NIP/NISN maksimal 30 karakter.")
    .regex(/^[0-9]+$/, "NIP/NISN hanya berisi angka."),
  password: z.string().min(1, "Password wajib diisi.").max(128, "Password terlalu panjang."),
});

const SALAH = "NIP/NISN atau password salah, atau akun tidak aktif.";

// Hash bcrypt valid agar waktu respons user-ada vs user-tidak-ada setara.
const DUMMY_HASH = "$2b$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaO";

export const POST = withHandler(async function POST(request: Request) {
  const rl = checkRateLimit(request, "auth:login");
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
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }
  const { nipNis, password } = parsed.data;
  const ipHash = hashIp(clientIp(request));

  const rows = await db.select().from(appUser).where(eq(appUser.nipNis, nipNis)).limit(1);
  const user = rows[0];

  const cocok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !cocok || !user.isActive) {
    await db.insert(authAudit).values({
      userId: user?.id ?? null,
      nipNisAttempt: user ? null : nipNis,
      aksi: "login_gagal",
      ipHash,
    });
    return fail("UNAUTHORIZED", SALAH);
  }

  await createSession({
    userId: user.id,
    peran: user.peran as "siswa" | "guru" | "kaprodi" | "wakasek" | "kesiswaan" | "admin",
    ipHash,
    userAgent: request.headers.get("user-agent"),
  });
  await db
    .update(appUser)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(appUser.id, user.id));
  await db.insert(authAudit).values({ userId: user.id, aksi: "login", ipHash });

  return ok({
    nama: user.nama,
    peran: user.peran,
    mustChangePassword: user.mustChangePassword,
  });
});
