import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { pengumuman } from "@/lib/schema";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/AccessDenied";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { PengumumanForm } from "@/components/PengumumanForm";
import { PengumumanActions } from "@/components/PengumumanActions";

export const dynamic = "force-dynamic";

export default async function PengumumanAdminPage() {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard/konten/pengumuman");
  if (!can(user.peran, "konten:kelola")) {
    return <AccessDenied kembali="/dashboard" />;
  }

  let daftar: Array<{
    id: string;
    judul: string;
    kategori: string;
    isPinned: boolean;
  }> = [];
  try {
    daftar = await db
      .select({
        id: pengumuman.id,
        judul: pengumuman.judul,
        kategori: pengumuman.kategori,
        isPinned: pengumuman.isPinned,
      })
      .from(pengumuman)
      .orderBy(desc(pengumuman.publishedAt))
      .limit(100);
  } catch {
    daftar = [];
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <SectionHeading
          align="left"
          eyebrow="Konten"
          title="Tulis Pengumuman"
          desc="Pin agar tampil di sidebar /berita. Agenda untuk kegiatan terjadwal."
        />
        <div className="max-w-2xl rounded-md border border-border bg-surface p-5 shadow-sm">
          <PengumumanForm />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-text-primary tabular-nums">
          {daftar.length} pengumuman & agenda
        </h2>
        <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <caption className="sr-only">Daftar pengumuman</caption>
            <thead>
              <tr className="border-b border-border bg-background-alt text-text-secondary">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Judul
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Kategori
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
              {daftar.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 font-medium text-text-primary">{p.judul}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.kategori}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.isPinned ? "amber" : "outline"} size="sm" dot>
                      {p.isPinned ? "Pin" : "Biasa"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <PengumumanActions id={p.id} pinned={p.isPinned} />
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
