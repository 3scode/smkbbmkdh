import { describe, expect, test } from "bun:test";

// Secret dummy khusus test (min 32 char) — jangan pakai pola ini di produksi.
process.env.AUTH_SECRET ??= "test-secret-minimal-32-karakter-abcdef";

const { hashPassword, verifyPassword, sha256Hex, newSessionToken } = await import("@/lib/auth");

describe("password hashing (bcrypt)", () => {
  test("hash lalu verifikasi sukses; salah gagal", async () => {
    const hash = await hashPassword("8102012203990001");
    expect(hash).not.toBe("8102012203990001");
    expect(hash.startsWith("$2")).toBe(true);
    expect(await verifyPassword("8102012203990001", hash)).toBe(true);
    expect(await verifyPassword("salah-password", hash)).toBe(false);
  }, 20000);

  test("hash korup tidak melempar", async () => {
    expect(await verifyPassword("x", "bukan-hash")).toBe(false);
  });
});

describe("sha256Hex", () => {
  test("deterministik 64 hex, tanpa input mentah", () => {
    const a = sha256Hex("192.0.2.1");
    const b = sha256Hex("192.0.2.1");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("192.0.2.1");
  });
});

describe("newSessionToken", () => {
  test("unik dan cukup panjang", () => {
    const t1 = newSessionToken();
    const t2 = newSessionToken();
    expect(t1).not.toBe(t2);
    expect(t1.length).toBeGreaterThanOrEqual(64);
  });
});
