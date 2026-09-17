import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { appUser } from "@/lib/schema";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/AccessDenied";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { AkunForm } from "@/components/AkunForm";
import { AkunActions } from "@/components/AkunActions";

export const dynamic = "force-dynamic";

const PERAN_LABEL: Record<string, string> = {
  siswa: "Siswa",
  guru: "Guru",
  kaprodi: "Kaprodi",
  wakasek: "Wakasek",
  kesiswaan: "Kesiswaan",
  admin: "Admin",
};

export default async function AkunPage() {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard/akun");
  if (!can(user.peran, "akun:kelola_staf")) {
    return <AccessDenied kembali="/dashboard" />;
  }

  let daftar: Array<{
    id: string;
    nipNis: string;
    nama: string;
    peran: string;
    isActive: boolean;
    mustChangePassword: boolean;
  }> = [];
  try {
    daftar = await db
      .select({
        id: appUser.id,
        nipNis: appUser.nipNis,
        nama: appUser.nama,
        peran: appUser.peran,
        isActive: appUser.isActive,
        mustChangePassword: appUser.mustChangePassword,
      })
      .from(appUser)
      .orderBy(desc(appUser.createdAt))
      .limit(200);
  } catch {
    daftar = [];
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <SectionHeading
          align="left"
          eyebrow="Admin"
          title="Kelola Akun"
          desc="Password awal selalu = NIP/NISN dan wajib diganti saat login pertama."
        />
        <div className="max-w-xl rounded-md border border-border bg-surface p-5 shadow-sm">
          <AkunForm peranSaya={user.peran} />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-text-primary tabular-nums">
          {daftar.length} akun
        </h2>
        <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <caption className="sr-only">Daftar akun</caption>
            <thead>
              <tr className="border-b border-border bg-background-alt text-text-secondary">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Nama
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  NIP/NISN
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Peran
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {a.nama}
                    {a.id === user.id && (
                      <span className="ml-2 text-[13px] font-normal text-text-secondary">
                        (Anda)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary tabular-nums">{a.nipNis}</td>
                  <td className="px-4 py-3">
                    <Badge tone="primary" size="sm">
                      {PERAN_LABEL[a.peran] ?? a.peran}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={a.isActive ? "success" : "outline"} size="sm" dot>
                      {a.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <AkunActions id={a.id} isActive={a.isActive} diriSendiri={a.id === user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
