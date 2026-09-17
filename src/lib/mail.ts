import { Resend } from "resend";
import { getBreaker } from "./circuit";

/**
 * Pengiriman email notif admin via Resend.
 * - Subject TANPA PII (hanya nomor bukti / keperluan umum).
 * - Retry 3x exponential + jitter, timeout 5s per attempt.
 * - Tanpa RESEND_API_KEY (dev/lokal) → mock: warn log, return sent:false.
 * - Gagal kirim TIDAK boleh menggagalkan PPDB (caller tetap 200 + flag).
 */

export interface SendMailResult {
  sent: boolean;
  mocked: boolean;
  attempts: number;
  error?: string;
}

const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 5_000;

async function attempt(
  resend: Resend,
  from: string,
  to: string,
  subject: string,
  text: string,
  attemptNo: number,
): Promise<void> {
  const backoff = attemptNo === 1 ? 0 : 500 * 2 ** (attemptNo - 2) + Math.random() * 250;
  if (backoff > 0) await new Promise((r) => setTimeout(r, backoff));
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    headers: { "X-Attempt": String(attemptNo) },
  });
  if (error) throw new Error(error.message);
}

export async function sendAdminMail(opts: {
  subject: string;
  text: string;
}): Promise<SendMailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL ?? "";
  if (!apiKey || !to) {
    console.warn("[mail] RESEND_API_KEY/ADMIN_EMAIL kosong — mail di-mock.");
    return { sent: false, mocked: true, attempts: 0 };
  }
  const from = `SMK BBM <noreply@${new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://smkbbm-kandanghaur.sch.id").hostname}>`;
  const resend = new Resend(apiKey);
  // Circuit breaker: 5 gagal/60s → open 30s (fast-fail, hemat budget).
  const breaker = getBreaker("resend");
  if (!breaker.canRun()) {
    console.warn("[mail] circuit open — lewati kirim, fallback tanpa notif.");
    return { sent: false, mocked: false, attempts: 0, error: "circuit-open" };
  }
  // Budget total 9 detik: user tidak boleh menunggu retry jaringan lama.
  // Jika budget habis, kiriman latar tetap boleh selesai sendiri.
  try {
    const result = await withTimeout(sendWithRetry(resend, from, to, opts), 9_000);
    if (result.sent) breaker.recordSuccess();
    else breaker.recordFailure();
    return result;
  } catch {
    breaker.recordFailure();
    console.warn("[mail] budget 9s habis — lanjut tanpa notif.");
    return { sent: false, mocked: false, attempts: MAX_ATTEMPTS, error: "budget habis" };
  }
}

async function sendWithRetry(
  resend: Resend,
  from: string,
  to: string,
  opts: { subject: string; text: string },
): Promise<SendMailResult> {
  let lastError = "";
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    try {
      await withTimeout(attempt(resend, from, to, opts.subject, opts.text, i), TIMEOUT_MS);
      return { sent: true, mocked: false, attempts: i };
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.warn(`[mail] attempt ${i}/${MAX_ATTEMPTS} gagal: ${lastError}`);
    }
  }
  return { sent: false, mocked: false, attempts: MAX_ATTEMPTS, error: lastError };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
