import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/AccessDenied";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { BeritaForm } from "@/components/BeritaForm";
import { BeritaActions } from "@/components/BeritaActions";

export const dynamic = "force-dynamic";

export default async function BeritaAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard/konten/berita");
  if (!can(user.peran, "konten:kelola")) {
    return <AccessDenied kembali="/dashboard" />;
  }

  const sp = await searchParams;
  const editId = typeof sp.edit === "string" && sp.edit ? sp.edit : null;
  const sunting = editId
    ? ((await db.select().from(berita).where(eq(berita.id, editId)).limit(1))[0] ?? null)
    : null;

  let daftar: Array<{
    id: string;
    judul: string;
    kategori: string;
    publishedAt: Date | null;
  }> = [];
  try {
    daftar = await db
      .select({
        id: berita.id,
        judul: berita.judul,
        kategori: berita.kategori,
        publishedAt: berita.publishedAt,
      })
      .from(berita)
      .orderBy(desc(berita.publishedAt))
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
          title={sunting ? "Sunting Berita" : "Tulis Berita"}
          desc="Terbit = langsung tampil di /berita. Draft tersimpan tanpa tampil publik."
        />
        <div className="max-w-2xl rounded-md border border-border bg-surface p-5 shadow-sm">
          <BeritaForm
            key={sunting?.id ?? "baru"}
            awal={
              sunting
                ? {
                    id: sunting.id,
                    judul: sunting.judul,
                    excerpt: sunting.excerpt ?? "",
                    body: sunting.body,
                    kategori: sunting.kategori,
                    terbit: sunting.publishedAt !== null,
                  }
                : null
            }
          />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-text-primary tabular-nums">
          {daftar.length} berita
        </h2>
        <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Daftar berita</caption>
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
              {daftar.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 font-medium text-text-primary">{b.judul}</td>
                  <td className="px-4 py-3 text-text-secondary">{b.kategori}</td>
                  <td className="px-4 py-3">
                    <Badge tone={b.publishedAt ? "success" : "outline"} size="sm" dot>
                      {b.publishedAt ? "Terbit" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <BeritaActions id={b.id} terbit={b.publishedAt !== null} />
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
