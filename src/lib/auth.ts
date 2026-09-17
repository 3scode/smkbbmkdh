import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "./db";
import { appSession, appUser } from "./schema";
import type { Peran } from "./schema";

/**
 * Auth custom NIP/NISN (tanpa Supabase Auth).
 * - Password: bcrypt cost 12.
 * - Sesi: token acak 32-byte di cookie httpOnly; yang disimpan di DB hanya sha256-nya.
 * - Cookie membawa JWT bertanda tangan (sub=userId, peran, sid=sesi) untuk cek cepat
 *   di middleware Edge; validitas penuh (revokasi, is_active) selalu dicek ke DB
 *   di Server Component / Route Handler via requireSession().
 */

export const SESSION_COOKIE = "smkbbm_sesi";
const BCRYPT_COST = 12;

export interface SessionUser {
  id: string;
  nipNis: string;
  nama: string;
  peran: Peran;
  mustChangePassword: boolean;
  sessionId: string;
}

function authSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET belum di-set (min 32 karakter). Lihat .env.example.");
  }
  return new TextEncoder().encode(s);
}

export function sessionTtlHours(): number {
  const v = Number(process.env.SESSION_TTL_HOURS ?? 12);
  return Number.isFinite(v) && v > 0 ? v : 12;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/** sha256 hex — untuk token sesi & hash IP (tanpa PII mentah di DB/log). */
export function sha256Hex(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}

export function newSessionToken(): string {
  return randomBytes(32).toString("hex");
}

async function signSessionCookie(payload: {
  sub: string;
  peran: Peran;
  sid: string;
  expHours: number;
}): Promise<string> {
  return new SignJWT({ peran: payload.peran, sid: payload.sid })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${payload.expHours}h`)
    .sign(authSecret());
}

interface CookiePayload {
  sub: string;
  peran: Peran;
  sid: string;
}

/** Verifikasi tanda tangan + kedaluwarsa JWT cookie. TIDAK menggantikan cek DB. */
export async function readCookiePayload(token: string): Promise<CookiePayload | null> {
  try {
    const { payload } = await jwtVerify(token, authSecret());
    const sub = payload.sub;
    const peran = payload.peran as Peran;
    const sid = payload.sid as string;
    if (typeof sub !== "string" || typeof sid !== "string") return null;
    return { sub, peran, sid };
  } catch {
    return null;
  }
}

/** Buat sesi + set cookie. Kembalikan user untuk redirect sesuai peran. */
export async function createSession(opts: {
  userId: string;
  peran: Peran;
  ipHash: string | null;
  userAgent: string | null;
}): Promise<void> {
  const ttl = sessionTtlHours();
  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + ttl * 3_600_000);

  const inserted = await db
    .insert(appSession)
    .values({
      tokenHash: sha256Hex(token),
      userId: opts.userId,
      expiresAt,
      ipHash: opts.ipHash,
      userAgent: opts.userAgent?.slice(0, 255) ?? null,
    })
    .returning({ id: appSession.id });
  const sid = inserted[0]?.id;
  if (!sid) throw new Error("Gagal membuat sesi.");

  const jwt = await signSessionCookie({ sub: opts.userId, peran: opts.peran, sid, expHours: ttl });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttl * 3600,
  });
}

/**
 * Validasi penuh: cookie valid + sesi ada + belum kedaluwarsa/dicabut + user aktif.
 * Mengembalikan null bila tidak sah (caller merespons 401/redirect /login).
 */
export async function requireSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await readCookiePayload(token);
  if (!payload) return null;

  const rows = await db
    .select({
      sessionId: appSession.id,
      expiresAt: appSession.expiresAt,
      revokedAt: appSession.revokedAt,
      userId: appUser.id,
      nipNis: appUser.nipNis,
      nama: appUser.nama,
      peran: appUser.peran,
      isActive: appUser.isActive,
      mustChangePassword: appUser.mustChangePassword,
    })
    .from(appSession)
    .innerJoin(appUser, eq(appSession.userId, appUser.id))
    .where(
      and(
        eq(appSession.id, payload.sid),
        eq(appSession.userId, payload.sub),
        isNull(appSession.revokedAt),
        gt(appSession.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row || !row.isActive) return null;
  if (row.peran !== payload.peran) return null; // peran berubah → login ulang
  return {
    id: row.userId,
    nipNis: row.nipNis,
    nama: row.nama,
    peran: row.peran as Peran,
    mustChangePassword: row.mustChangePassword,
    sessionId: row.sessionId,
  };
}

/** Cabut sesi ini + hapus cookie (logout). */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const payload = await readCookiePayload(token);
    if (payload) {
      await db
        .update(appSession)
        .set({ revokedAt: new Date() })
        .where(eq(appSession.id, payload.sid));
    }
  }
  jar.delete(SESSION_COOKIE);
}

/** Cabut SEMUA sesi seorang user (dipakai saat nonaktifkan akun / reset password). */
export async function revokeAllSessions(userId: string): Promise<void> {
  await db
    .update(appSession)
    .set({ revokedAt: new Date() })
    .where(and(eq(appSession.userId, userId), isNull(appSession.revokedAt)));
}
