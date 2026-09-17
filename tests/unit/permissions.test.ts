import { describe, expect, test } from "bun:test";
import { can, canManageAccount, lingkupJurusan } from "@/lib/permissions";

describe("matriks can()", () => {
  test("siswa hanya boleh dashboard", () => {
    expect(can("siswa", "dashboard:lihat")).toBe(true);
    expect(can("siswa", "direktori:lihat_internal")).toBe(false);
    expect(can("siswa", "konten:kelola")).toBe(false);
    expect(can("siswa", "akun:kelola_staf")).toBe(false);
  });

  test("guru terbatas internal sejurusan, tanpa kelola", () => {
    expect(can("guru", "direktori:lihat_internal")).toBe(true);
    expect(can("guru", "guru:lihat_semua")).toBe(false);
    expect(can("guru", "siswa:lihat_semua")).toBe(false);
    expect(can("guru", "siswa:kelola")).toBe(false);
  });

  test("kaprodi vs kesiswaan beda fungsi", () => {
    expect(can("kaprodi", "guru:lihat_semua")).toBe(true);
    expect(can("kaprodi", "siswa:kelola")).toBe(false);
    expect(can("kesiswaan", "siswa:kelola")).toBe(true);
    expect(can("kesiswaan", "ekskul:kelola")).toBe(true);
    expect(can("kesiswaan", "jurusan:kelola")).toBe(false);
  });

  test("wakasek kelola akademik+konten+ppdb, bukan semua akun", () => {
    expect(can("wakasek", "jurusan:kelola")).toBe(true);
    expect(can("wakasek", "konten:kelola")).toBe(true);
    expect(can("wakasek", "ppdb:verifikasi")).toBe(true);
    expect(can("wakasek", "akun:kelola_staf")).toBe(true);
    expect(can("wakasek", "akun:kelola_semua")).toBe(false);
  });

  test("admin boleh semua", () => {
    const semua = [
      "dashboard:lihat",
      "direktori:lihat_internal",
      "guru:lihat_semua",
      "siswa:lihat_semua",
      "jurusan:kelola",
      "siswa:kelola",
      "ekskul:kelola",
      "konten:kelola",
      "ppdb:verifikasi",
      "akun:kelola_staf",
      "akun:kelola_semua",
    ] as const;
    for (const k of semua) expect(can("admin", k)).toBe(true);
  });
});

describe("canManageAccount()", () => {
  test("admin boleh kelola semua termasuk sesama admin", () => {
    expect(canManageAccount("admin", "wakasek")).toBe(true);
    expect(canManageAccount("admin", "admin")).toBe(true);
  });

  test("wakasek hanya staf di bawahnya", () => {
    expect(canManageAccount("wakasek", "guru")).toBe(true);
    expect(canManageAccount("wakasek", "kaprodi")).toBe(true);
    expect(canManageAccount("wakasek", "kesiswaan")).toBe(true);
    expect(canManageAccount("wakasek", "siswa")).toBe(true);
    expect(canManageAccount("wakasek", "wakasek")).toBe(false);
    expect(canManageAccount("wakasek", "admin")).toBe(false);
  });

  test("peran lain tidak boleh kelola akun", () => {
    expect(canManageAccount("guru", "siswa")).toBe(false);
    expect(canManageAccount("kaprodi", "guru")).toBe(false);
    expect(canManageAccount("siswa", "siswa")).toBe(false);
  });
});

describe("lingkupJurusan()", () => {
  test("guru terkunci ke jurusannya", () => {
    expect(lingkupJurusan("guru", "uuid-jurusan")).toBe("uuid-jurusan");
    expect(lingkupJurusan("guru", null)).toBe("tidak_ada");
  });

  test("siswa tidak ada lingkup direktori", () => {
    expect(lingkupJurusan("siswa", "uuid-jurusan")).toBe("tidak_ada");
  });

  test("staf atas melihat semua", () => {
    for (const p of ["kaprodi", "wakasek", "kesiswaan", "admin"] as const) {
      expect(lingkupJurusan(p, null)).toBe("semua");
    }
  });
});
