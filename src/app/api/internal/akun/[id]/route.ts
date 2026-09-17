import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { appUser, authAudit } from "@/lib/schema";
import { hashPassword, revokeAllSessions } from "@/lib/auth";
import { canManageAccount } from "@/lib/permissions";
import { guard } from "@/lib/guard";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { clientIp, hashIp } from "@/lib/rate-limit";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    isActive: z.boolean().optional(),
    resetPassword: z.boolean().optional(),
  })
  .refine((v) => v.isActive !== undefined || v.resetPassword === true, {
    message: "Tidak ada perubahan yang diminta.",
  });

async function ambil(id: string) {
  const rows = await db.select().from(appUser).where(eq(appUser.id, id)).limit(1);
  return rows[0] ?? null;
}

export const PATCH = withHandler(async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const g = await guard("akun:kelola_staf");
  if (!g.ok) return g.response;
  const user = g.user;

  const { id } = await params;
  const target = await ambil(id);
  if (!target) return fail("NOT_FOUND", "Akun tidak ditemukan.");
  if (target.id === user.id) {
    return fail("FORBIDDEN", "Tidak bisa mengubah akun sendiri dari sini.");
  }
  if (
    !canManageAccount(
      user.peran,
      target.peran as "siswa" | "guru" | "kaprodi" | "wakasek" | "kesiswaan" | "admin",
    )
  ) {
    return fail("FORBIDDEN", "Anda tidak boleh mengelola akun dengan peran tersebut.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("VALIDATION_ERROR", "Format data tidak valid.");
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }

  // Jangan sampai tidak ada admin aktif tersisa
  if (parsed.data.isActive === false && target.peran === "admin") {
    const adminAktif = await db
      .select({ id: appUser.id })
      .from(appUser)
      .where(and(eq(appUser.peran, "admin"), eq(appUser.isActive, true), ne(appUser.id, target.id)))
      .limit(1);
    if (!adminAktif[0]) {
      return fail("CONFLICT", "Tidak bisa menonaktifkan admin aktif terakhir.");
    }
  }

  if (parsed.data.isActive !== undefined) {
    await db
      .update(appUser)
      .set({ isActive: parsed.data.isActive, updatedAt: new Date() })
      .where(eq(appUser.id, id));
    if (!parsed.data.isActive) await revokeAllSessions(id);
    await db.insert(authAudit).values({
      userId: user.id,
      aksi: "akun_dinonaktifkan",
      ipHash: hashIp(clientIp(request)),
    });
  }
  if (parsed.data.resetPassword === true) {
    await db
      .update(appUser)
      .set({
        passwordHash: await hashPassword(target.nipNis),
        mustChangePassword: true,
        updatedAt: new Date(),
      })
      .where(eq(appUser.id, id));
    await revokeAllSessions(id);
  }
  return ok({ id });
});
