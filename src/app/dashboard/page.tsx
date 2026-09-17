import Link from "next/link";
import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita, guru, jurusan, ppdbRegistration, siswa } from "@/lib/schema";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

async function hitung(table: typeof guru | typeof siswa | typeof berita): Promise<number> {
  try {
    const rows = await db.select({ n: count() }).from(table as typeof guru);
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

export default async function DashboardPage() {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard");

  const [nGuru, nSiswa, nBerita] = await Promise.all([hitung(guru), hitung(siswa), hitung(berita)]);

  let ppdbPending = 0;
  try {
    const rows = await db
      .select({ n: count() })
      .from(ppdbRegistration)
      .where(eq(ppdbRegistration.status, "pending"));
    ppdbPending = rows[0]?.n ?? 0;
  } catch {
    ppdbPending = 0;
  }

  // Profil milik sendiri (siswa/guru/kaprodi)
  let profil: { jurusan?: string; ekstra?: string } | null = null;
  try {
    if (user.peran === "siswa") {
      const rows = await db
        .select({ tingkat: siswa.tingkat, kelas: siswa.kelas, nama: jurusan.nama })
        .from(siswa)
        .leftJoin(jurusan, eq(siswa.jurusanId, jurusan.id))
        .where(eq(siswa.userId, user.id))
        .limit(1);
      const r = rows[0];
      if (r)
        profil = {
          jurusan: r.nama ?? undefined,
          ekstra: `Kelas ${r.tingkat ?? "-"} ${r.kelas ?? ""}`.trim(),
        };
    } else if (user.peran === "guru" || user.peran === "kaprodi") {
      const rows = await db
        .select({ mapel: guru.mapel, nama: jurusan.nama })
        .from(guru)
        .leftJoin(jurusan, eq(guru.jurusanId, jurusan.id))
        .where(eq(guru.userId, user.id))
        .limit(1);
      const r = rows[0];
      if (r) profil = { jurusan: r.nama ?? undefined, ekstra: r.mapel ?? undefined };
    }
  } catch {
    profil = null;
  }

  const stats: Array<{ label: string; nilai: number; href: string | null }> = [];
  if (can(user.peran, "guru:lihat_semua") || user.peran === "guru") {
    stats.push({
      label: "Guru terdata",
      nilai: nGuru,
      href: can(user.peran, "direktori:lihat_internal") ? "/dashboard/direktori" : null,
    });
  }
  if (can(user.peran, "siswa:lihat_semua")) {
    stats.push({ label: "Siswa terdata", nilai: nSiswa, href: "/dashboard/siswa" });
  }
  if (can(user.peran, "konten:kelola")) {
    stats.push({ label: "Berita terdata", nilai: nBerita, href: "/dashboard/konten/berita" });
  }
  if (can(user.peran, "ppdb:verifikasi")) {
    stats.push({ label: "PPDB menunggu verifikasi", nilai: ppdbPending, href: null });
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <SectionHeading
          align="left"
          eyebrow="Ringkasan"
          title={`Halo, ${user.nama.split(" ")[0]}!`}
          desc={
            profil?.jurusan
              ? `${profil.jurusan}${profil.ekstra ? ` • ${profil.ekstra}` : ""}`
              : "Kelola data sekolah sesuai peran Anda dari satu tempat."
          }
        />
        {stats.length > 0 ? (
          <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 rounded-md border border-border bg-surface p-5 shadow-sm"
              >
                <span className="text-3xl font-bold text-primary tabular-nums">{s.nilai}</span>
                <span className="text-sm text-text-secondary">{s.label}</span>
                {s.href && (
                  <Link
                    href={s.href}
                    className="inline-flex min-h-[44px] items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    Buka <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="pt-6 text-text-secondary">
            Belum ada ringkasan untuk peran Anda. Data profil akan dilengkapi tata usaha.
          </p>
        )}
      </section>

      {user.peran === "siswa" && (
        <section className="rounded-md border border-border bg-background-alt p-5 text-sm text-text-secondary">
          Nilai, jadwal, dan pengumuman kelas tampil di sini setelah data akademik real dimasukkan.
          Jaga kerahasiaan NISN dan password Anda — jangan dibagikan ke siapa pun.
        </section>
      )}
    </div>
  );
}
