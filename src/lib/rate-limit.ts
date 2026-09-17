import { createHash } from "node:crypto";

/**
 * Rate limit in-memory (sliding window) untuk semua POST publik.
 * Batas: RATE_LIMIT_PER_MIN (default 5) per 60 detik per IP per route.
 * Key memakai hash IP (bukan IP mentah) agar tidak menyimpan PII di memori/log.
 * Catatan: per-instance (serverless). Naik ke Upstash Redis jika spam >5%.
 */

const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

export function getLimitPerMin(): number {
  const v = Number(process.env.RATE_LIMIT_PER_MIN ?? 5);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : 5;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return ip;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAfterMs: number;
}

export function checkRateLimit(
  request: Request,
  route: string,
  now: number = Date.now(),
): RateLimitResult {
  const limit = getLimitPerMin();
  const key = `${route}:${hashIp(clientIp(request))}`;
  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, remaining: 0, resetAfterMs: recent[0]! + WINDOW_MS - now };
  }
  recent.push(now);
  hits.set(key, recent);
  // Batasi memori: buang key yang sudah dingin secara oportunistik
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.length === 0 || v[v.length - 1]! < cutoff) hits.delete(k);
      if (hits.size <= 5_000) break;
    }
  }
  return { ok: true, remaining: limit - recent.length, resetAfterMs: 0 };
}

/** Reset state (dipakai skrip validasi lokal). */
export function resetRateLimit(): void {
  hits.clear();
}
