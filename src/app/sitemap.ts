import type { MetadataRoute } from "next";
import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita, jurusan } from "@/lib/schema";

const STATIC_ROUTES = [
  "",
  "/profil",
  "/jurusan",
  "/akademik",
  "/akademik/guru",
  "/akademik/kaprodi",
  "/akademik/siswa",
  "/fasilitas",
  "/berita",
  "/ppdb",
  "/galeri",
  "/kontak",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://smkbbm-kandanghaur.sch.id";
  const now = new Date();

  // Tanpa DB (build lokal / DB down) → tetap kembalikan rute statis
  try {
    // Sequential: aman untuk pool koneksi kecil.
    const jurusanRows = await db
      .select({ slug: jurusan.slug })
      .from(jurusan)
      .where(eq(jurusan.isActive, true));
    const beritaRows = await db
      .select({ slug: berita.slug, publishedAt: berita.publishedAt })
      .from(berita)
      .where(isNotNull(berita.publishedAt))
      .orderBy(desc(berita.publishedAt));
    return [
      ...STATIC_ROUTES.map((r) => ({
        url: `${baseUrl}${r === "" ? "" : r}`,
        lastModified: now,
      })),
      ...jurusanRows.map((j) => ({
        url: `${baseUrl}/jurusan/${j.slug}`,
        lastModified: now,
      })),
      ...beritaRows.map((b) => ({
        url: `${baseUrl}/berita/${b.slug}`,
        lastModified: b.publishedAt ?? now,
      })),
    ];
  } catch {
    return STATIC_ROUTES.map((r) => ({
      url: `${baseUrl}${r === "" ? "" : r}`,
      lastModified: now,
    }));
  }
}
