import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

export const GET = withHandler(async function GET() {
  const user = await requireSession();
  if (!user) return fail("UNAUTHORIZED", "Belum login. Silakan login dulu.");
  return ok({
    nama: user.nama,
    peran: user.peran,
    mustChangePassword: user.mustChangePassword,
  });
});
