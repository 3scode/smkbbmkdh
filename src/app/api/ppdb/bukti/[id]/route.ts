import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan, ppdbGelombang, ppdbRegistration } from "@/lib/schema";
import { cacheHeaders, fail, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { maskNama } from "@/lib/ppdb";

export const revalidate = 604800; // 7 hari (QR bukti)

export const GET = withHandler(async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || id.length > 20) {
      return fail("NOT_FOUND", "Bukti pendaftaran tidak ditemukan.");
    }

    const rows = await db
      .select({
        nomorBukti: ppdbRegistration.nomorBukti,
        nama: ppdbRegistration.nama,
        asalSmp: ppdbRegistration.asalSmp,
        status: ppdbRegistration.status,
        createdAt: ppdbRegistration.createdAt,
        jurusan: jurusan.nama,
        gelombang: ppdbGelombang.nama,
      })
      .from(ppdbRegistration)
      .innerJoin(jurusan, eq(ppdbRegistration.jurusanId, jurusan.id))
      .innerJoin(ppdbGelombang, eq(ppdbRegistration.gelombangId, ppdbGelombang.id))
      .where(eq(ppdbRegistration.nomorBukti, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return fail("NOT_FOUND", "Bukti pendaftaran tidak ditemukan.");
    }

    // Tanpa WA penuh / file KK — ID acak + data samaran cukup untuk V1
    return ok(
      {
        nomorBukti: row.nomorBukti,
        nama: maskNama(row.nama),
        asalSmp: row.asalSmp,
        jurusan: row.jurusan,
        gelombang: row.gelombang,
        status: row.status,
        tanggal: row.createdAt,
      },
      null,
      { headers: cacheHeaders(604800) },
    );
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat bukti. Coba lagi.");
  }
});
