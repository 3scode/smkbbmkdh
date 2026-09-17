import { sql } from "drizzle-orm";
import { closeDb, db } from "./db";

const expected: Record<string, number> = {
  jurusan: 6,
  ppdb_gelombang: 2,
  fasilitas: 9,
  berita: 6,
  pengumuman: 5,
  galeri: 12,
  ekskul: 6,
  prestasi: 4,
  testimoni: 4,
  site_config: 5,
};

async function count(table: string): Promise<number> {
  const rows = await db.execute<{ count: string }>(
    sql`SELECT COUNT(*)::text AS count FROM ${sql.identifier(table)}`,
  );
  return Number(rows[0]?.count ?? 0);
}

if (import.meta.main) {
  let failed = false;
  for (const [table, min] of Object.entries(expected)) {
    const n = await count(table);
    const ok = n >= min;
    if (!ok) failed = true;
    console.log(`${ok ? "OK  " : "FAIL"} ${table}: ${n} (min ${min})`);
  }
  if (failed) {
    console.error("verify:seed gagal — jalankan `bun run db:seed` dulu.");
    await closeDb();
    process.exit(1);
  }
  await closeDb();
  console.log("verify:seed ok");
}
