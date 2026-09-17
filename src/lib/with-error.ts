import { NextResponse } from "next/server";
import { fail } from "./api-response";

/**
 * Error handling terpusat untuk Route Handlers (FR-15/16).
 * - Semua respons tetap kontrak `{success,data,error,meta}` (T-15)
 * - Throw tak terduga → 500 + capture (Sentry jika tersedia) + log JSON tanpa PII
 * - Propagasi `X-Request-ID` (dibuat middleware, lihat src/middleware.ts)
 */

export interface HandlerContext {
  route: string;
  requestId: string;
}

export function getRequestId(request: Request): string {
  return request.headers.get("x-request-id") || crypto.randomUUID();
}

/** Log JSON terstruktur — JANGAN sertakan body/PII (nama, WA, file). */
export function logError(event: {
  level: "warn" | "error";
  route: string;
  requestId: string;
  code: string;
  message: string;
}): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event });
  if (event.level === "error") console.error(line);
  else console.warn(line);
}

/**
 * Kirim ke tracker eksternal (mis. Sentry) bila sudah dipasang.
 * Tanpa SDK terinstal: hanya server log. Tidak pernah throw.
 *
 * Memasang Sentry nanti (opsional):
 *   bun add @sentry/nextjs
 *   // src/instrumentation.ts
 *   import * as Sentry from "@sentry/nextjs";
 *   import { onServerError } from "@/lib/with-error";
 *   onServerError((e, ctx) =>
 *     Sentry.captureException(e, { tags: { route: ctx.route }, extra: { requestId: ctx.requestId } }),
 *   );
 */
export async function captureError(e: unknown, ctx: HandlerContext): Promise<void> {
  logError({
    level: "error",
    route: ctx.route,
    requestId: ctx.requestId,
    code: "INTERNAL_ERROR",
    message: e instanceof Error ? e.message : String(e),
  });
  for (const hook of errorHooks) {
    try {
      hook(e, ctx);
    } catch {
      /* hook eksternal tidak boleh merusak respons */
    }
  }
}

type ErrorHook = (e: unknown, ctx: HandlerContext) => void;

const errorHooks: ErrorHook[] = [];

/** Daftarkan pengirim error eksternal (Sentry, dsb). */
export function onServerError(hook: ErrorHook): void {
  errorHooks.push(hook);
}

type Handler = (request: Request, ...rest: unknown[]) => Promise<NextResponse>;

/** Nama route untuk log: eksplisit atau dari method + pathname. */
function routeOf(request: Request, explicit?: string): string {
  if (explicit) return explicit;
  try {
    const url = new URL(request.url);
    return `${request.method} ${url.pathname}`;
  } catch {
    return "unknown-route";
  }
}

export function withHandler<T extends unknown[]>(
  handler: (request: Request, ...args: T) => Promise<NextResponse>,
  opts: { route?: string } = {},
): (request: Request, ...args: T) => Promise<NextResponse> {
  return async (request: Request, ...args: T) => {
    const requestId = getRequestId(request);
    const route = routeOf(request, opts.route);
    try {
      const res = await handler(request, ...args);
      res.headers.set("X-Request-ID", requestId);
      return res;
    } catch (e) {
      await captureError(e, { route, requestId });
      const res = fail("INTERNAL_ERROR", "Terjadi gangguan. Coba lagi atau hubungi WA Humas.");
      res.headers.set("X-Request-ID", requestId);
      return res;
    }
  };
}
