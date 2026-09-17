import { NextResponse } from "next/server";
import { requireSession, type SessionUser } from "./auth";
import { can, type Kemampuan } from "./permissions";
import { fail } from "./api-response";

/**
 * Guard Route Handler internal: 401 bila belum login, 403 bila peran tak boleh.
 * Pakai diskriminan boolean agar narrowing TypeScript selalu tepat:
 *   const g = await guard("konten:kelola");
 *   if (!g.ok) return g.response;
 */
export async function guard(
  kemampuan: Kemampuan,
): Promise<{ ok: true; user: SessionUser } | { ok: false; response: NextResponse }> {
  const user = await requireSession();
  if (!user)
    return { ok: false, response: fail("UNAUTHORIZED", "Belum login. Silakan login dulu.") };
  if (!can(user.peran, kemampuan)) {
    return { ok: false, response: fail("FORBIDDEN", "Peran Anda tidak diizinkan untuk aksi ini.") };
  }
  return { ok: true, user };
}
