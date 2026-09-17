/**
 * Bootstrap akun pertama (kepsek/admin).
 *   bun ./src/lib/seed-admin.ts --nip 196501011990031001 --nama "Nama Kepsek" [--peran admin]
 * Password awal = NIP (wajib diganti saat login pertama).
 * Menolak jalan bila sudah ada akun admin (anti-duplikasi).
 * Password TIDAK pernah dicetak ke log.
 */
import { eq } from "drizzle-orm";
import { db, closeDb } from "./db";
import { appUser } from "./schema";
import { hashPassword } from "./auth";
import type { Peran } from "./schema";

function arg(nama: string): string | null {
  const i = process.argv.indexOf(nama);
  const v = i >= 0 ? process.argv[i + 1] : undefined;
  return v && !v.startsWith("--") ? v : null;
}

async function main() {
  const nip = arg("--nip");
  const nama = arg("--nama");
  const peran = (arg("--peran") ?? "admin") as Peran;
  if (!nip || !/^[0-9]{3,30}$/.test(nip)) {
    console.error(
      "Pakai: bun ./src/lib/seed-admin.ts --nip <NIP-angka> --nama <nama> [--peran admin]",
    );
    process.exit(1);
  }
  if (!nama || nama.trim().length < 3) {
    console.error("Nama minimal 3 karakter.");
    process.exit(1);
  }
  if (!["admin", "wakasek"].includes(peran)) {
    console.error("Peran bootstrap hanya admin/wakasek.");
    process.exit(1);
  }

  const existing = await db
    .select({ id: appUser.id })
    .from(appUser)
    .where(eq(appUser.peran, "admin"))
    .limit(1);
  if (existing[0]) {
    console.error("Sudah ada akun admin. Tambah akun lain lewat /dashboard/akun.");
    process.exit(1);
  }
  const duplikat = await db
    .select({ id: appUser.id })
    .from(appUser)
    .where(eq(appUser.nipNis, nip))
    .limit(1);
  if (duplikat[0]) {
    console.error("NIP sudah terdaftar.");
    process.exit(1);
  }

  const rows = await db
    .insert(appUser)
    .values({
      nipNis: nip,
      nama: nama.trim(),
      peran,
      passwordHash: await hashPassword(nip),
      mustChangePassword: true,
    })
    .returning({ id: appUser.id });
  console.log(`Akun ${peran} "${nama.trim()}" dibuat (id ${rows[0]?.id}).`);
  console.log(
    "Password awal = NIP. Serahkan langsung ke pemilik, wajib diganti saat login pertama.",
  );
}

try {
  await main();
} finally {
  await closeDb();
}
