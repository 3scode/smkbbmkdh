import { readFile } from "node:fs/promises";
import { z } from "zod";
import { closeDb, db } from "./db";
import { jurusan } from "./schema";

/**
 * Impor sementara dari Google Sheet Humas (CSV) ke tabel jurusan.
 * Format header: slug,nama,kategori,biaya_masuk,spp_bulanan
 * Contoh: bun run import:sheet -- ./sheet-jurusan.csv
 */
const rowSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nama: z.string().min(3),
  kategori: z.string().default("Vokasi"),
  biaya_masuk: z.coerce.number().int().nonnegative().default(0),
  spp_bulanan: z.coerce.number().int().nonnegative().default(0),
});

async function main() {
  const file = process.argv.find((a) => a.endsWith(".csv"));
  if (!file) throw new Error("Gunakan: bun run import:sheet -- ./file.csv");
  const text = await readFile(file, "utf-8");
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const cols = header.split(",").map((c) => c.trim());
  let inserted = 0;
  let skipped = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = line.split(",").map((c) => c.trim());
    const raw = Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? ""]));
    const parsed = rowSchema.safeParse(raw);
    if (!parsed.success) {
      skipped += 1;
      console.warn("SKIP:", line, parsed.error.issues[0]?.message);
      continue;
    }
    const d = parsed.data;
    await db
      .insert(jurusan)
      .values({
        slug: d.slug,
        nama: d.nama,
        kategori: d.kategori,
        biayaMasuk: d.biaya_masuk,
        sppBulanan: d.spp_bulanan,
      })
      .onConflictDoNothing();
    inserted += 1;
  }
  console.log(`import:sheet ok — inserted=${inserted} skipped=${skipped}`);
  await closeDb();
}

if (import.meta.main) await main();
