import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan, siswa } from "@/lib/schema";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/AccessDenied";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

const TINGKAT = ["X", "XI", "XII"] as const;

export default async function SiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ jurusan?: string; tingkat?: string }>;
}) {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard/siswa");
  if (!can(user.peran, "siswa:lihat_semua")) {
    return <AccessDenied kembali="/dashboard" />;
  }

  const sp = await searchParams;
  const fJurusan = typeof sp.jurusan === "string" && sp.jurusan ? sp.jurusan : null;
  const fTingkat =
    typeof sp.tingkat === "string" && (TINGKAT as readonly string[]).includes(sp.tingkat)
      ? sp.tingkat
      : null;

  let daftar: Array<{
    id: string;
    nama: string;
    nisn: string;
    jurusan: string | null;
    tingkat: string | null;
    kelas: string | null;
  }> = [];
  let jurusanList: Array<{ id: string; nama: string }> = [];
  try {
    jurusanList = await db.select({ id: jurusan.id, nama: jurusan.nama }).from(jurusan);
    const syarat = [
      fJurusan ? eq(siswa.jurusanId, fJurusan) : undefined,
      fTingkat ? eq(siswa.tingkat, fTingkat) : undefined,
    ].filter((s) => s !== undefined);
    const rows = await db
      .select({
        id: siswa.id,
        nama: siswa.nama,
        nisn: siswa.nisn,
        jurusan: jurusan.nama,
        tingkat: siswa.tingkat,
        kelas: siswa.kelas,
      })
      .from(siswa)
      .leftJoin(jurusan, eq(siswa.jurusanId, jurusan.id))
      .where(syarat.length > 0 ? and(...syarat) : undefined)
      .limit(200);
    daftar = rows;
  } catch {
    daftar = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        align="left"
        eyebrow="Internal"
        title="Data Siswa"
        desc="Data internal dilindungi UU PDP — hanya untuk keperluan sekolah, jangan disebar."
      />
      <form method="get" className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-primary">
          Jurusan
          <select
            name="jurusan"
            defaultValue={fJurusan ?? ""}
            className="h-11 rounded-sm border border-border bg-surface px-3 font-normal"
          >
            <option value="">Semua</option>
            {jurusanList.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-primary">
          Tingkat
          <select
            name="tingkat"
            defaultValue={fTingkat ?? ""}
            className="h-11 rounded-sm border border-border bg-surface px-3 font-normal"
          >
            <option value="">Semua</option>
            {TINGKAT.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="h-11 self-end rounded-md bg-primary px-5 text-[15px] font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Saring
        </button>
      </form>
      <p aria-live="polite" className="text-sm text-text-secondary tabular-nums">
        Menampilkan {daftar.length} siswa
        {daftar.length >= 200 ? " (maks 200, persempit filter)" : ""}.
      </p>
      {daftar.length === 0 ? (
        <p className="rounded-md border border-border bg-surface p-6 text-center text-text-secondary">
          Belum ada data siswa real. Tata usaha memasukkan data setelah persetujuan kepala sekolah.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Daftar siswa internal</caption>
            <thead>
              <tr className="border-b border-border bg-background-alt text-text-secondary">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Nama
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  NISN
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Jurusan
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Kelas
                </th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 font-medium text-text-primary">{s.nama}</td>
                  <td className="px-4 py-3 text-text-secondary tabular-nums">{s.nisn}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.jurusan ?? "—"}</td>
                  <td className="px-4 py-3 text-text-secondary tabular-nums">
                    {[s.tingkat, s.kelas].filter(Boolean).join(" ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
