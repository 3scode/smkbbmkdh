import { cacheHeaders, fail, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { getPpdbStatus } from "@/lib/ppdb";

export const dynamic = "force-dynamic";

export const GET = withHandler(async function GET() {
  try {
    const status = await getPpdbStatus();
    if (!status) {
      return fail("NOT_FOUND", "Info gelombang belum tersedia.");
    }
    return ok(status, null, { headers: cacheHeaders(60) });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat status PPDB. Coba lagi.");
  }
});
