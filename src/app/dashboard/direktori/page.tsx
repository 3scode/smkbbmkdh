import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { guru, jurusan } from "@/lib/schema";
import { requireSession } from "@/lib/auth";
import { can, lingkupJurusan } from "@/lib/permissions";
import { AccessDenied } from "@/components/AccessDenied";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function DirektoriPage() {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard/direktori");
  if (!can(user.peran, "direktori:lihat_internal")) {
    return <AccessDenied kembali="/dashboard" />;
  }

  // Guru dikunci ke jurusannya sendiri
  let jurusanSendiri: string | null = null;
  if (user.peran === "guru") {
    try {
      const rows = await db
        .select({ jurusanId: guru.jurusanId })
        .from(guru)
        .where(eq(guru.userId, user.id))
        .limit(1);
      jurusanSendiri = rows[0]?.jurusanId ?? null;
    } catch {
      jurusanSendiri = null;
    }
  }
  const lingkup = lingkupJurusan(user.peran, jurusanSendiri);

  let daftar: Array<{
    id: string;
    nama: string;
    nuptk: string | null;
    mapel: string | null;
    jurusan: string | null;
    jadwal: string | null;
    wali: string | null;
  }> = [];
  try {
    const rows = await db
      .select({
        id: guru.id,
        nama: guru.nama,
        nuptk: guru.nuptk,
        mapel: guru.mapel,
        jurusan: jurusan.nama,
        jurusanId: guru.jurusanId,
        jadwal: guru.jadwal,
        wali: guru.waliKelas,
      })
      .from(guru)
      .leftJoin(jurusan, eq(guru.jurusanId, jurusan.id));
    daftar = rows.filter((r) =>
      lingkup === "semua" ? true : lingkup === "tidak_ada" ? false : r.jurusanId === lingkup,
    );
  } catch {
    daftar = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        align="left"
        eyebrow="Internal"
        title="Direktori Guru"
        desc={
          lingkup === "semua"
            ? `Seluruh guru terdata (${daftar.length}). Data internal — jangan disebar.`
            : "Guru di jurusan Anda. Data internal — jangan disebar."
        }
      />
      {daftar.length === 0 ? (
        <p className="rounded-md border border-border bg-surface p-6 text-center text-text-secondary">
          Belum ada data guru real. Tata usaha memasukkan data setelah persetujuan kepala sekolah.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">Daftar guru internal</caption>
            <thead>
              <tr className="border-b border-border bg-background-alt text-text-secondary">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Nama
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  NUPTK
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Mapel
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Jurusan
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Jadwal
                </th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {g.nama}
                    {g.wali && (
                      <span className="block text-[13px] font-normal text-text-secondary">
                        {g.wali}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary tabular-nums">{g.nuptk ?? "—"}</td>
                  <td className="px-4 py-3 text-text-secondary">{g.mapel ?? "—"}</td>
                  <td className="px-4 py-3">
                    {g.jurusan ? (
                      <Badge tone="primary" size="sm">
                        {g.jurusan}
                      </Badge>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{g.jadwal ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
