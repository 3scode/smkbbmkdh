import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan } from "@/lib/schema";
import { JurusanCard } from "@/components/JurusanCard";

export default async function JurusanNotFound() {
  let alternatives: Array<{
    id: string;
    slug: string;
    nama: string;
    durasi: string;
    skills: string[];
    prospek: string[];
    coverUrl: string | null;
  }> = [];
  try {
    alternatives = await db
      .select()
      .from(jurusan)
      .where(eq(jurusan.isActive, true))
      .orderBy(asc(jurusan.sortOrder))
      .limit(3);
  } catch {
    alternatives = [];
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold text-text-primary">Jurusan tidak ditemukan</h1>
      <p className="max-w-md text-text-secondary">
        Alamat yang kamu buka salah atau jurusan sudah tidak aktif. Coba jurusan lain di bawah ini.
      </p>
      <Link
        href="/jurusan"
        className="inline-flex h-11 items-center rounded-md border border-primary px-5 font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Kembali ke daftar jurusan
      </Link>
      {alternatives.length > 0 && (
        <div className="grid w-full gap-4 pt-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((r) => (
            <JurusanCard
              key={r.id}
              slug={r.slug}
              nama={r.nama}
              coverUrl={r.coverUrl ?? "/images/placeholder-jurusan.svg"}
              durasi={r.durasi}
              skills={(r.skills as unknown as string[]) ?? []}
              prospek={(r.prospek as unknown as string[]) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
