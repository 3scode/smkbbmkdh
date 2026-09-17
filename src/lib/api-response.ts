/**
 * Kontrak response API — TECH-SPEC Bagian 3.
 * Semua Route Handlers WAJIB memakai `ok()` / `fail()` agar format identik:
 *
 * Sukses:
 *   { "success": true, "data": {...}, "error": null, "meta": null }
 * List + pagination (`meta` dari `paginate()` di `./pagination`):
 *   { "success": true, "data": [...], "error": null,
 *     "meta": { "page": 1, "limit": 9, "total": 42, "totalPages": 5 } }
 * Error:
 *   { "success": false, "data": null,
 *     "error": { "code": "VALIDATION_ERROR", "message": "...", "details": {...} },
 *     "meta": null }
 *
 * Contoh curl:
 *   curl -s 'http://localhost:3000/api/berita?page=2&limit=9' | bunx prettier --parser json
 *   curl -s -X POST http://localhost:3000/api/ppdb/submit -F 'nama=Ab'
 *   # → 422 { success:false, error:{ code:"VALIDATION_ERROR", ... } }
 *
 * Frontend: toast cukup render `error.message`; form render `error.details`
 * per field (lihat `flattenZodError()` di bawah).
 */
import { NextResponse } from "next/server";
import type { PageMeta } from "./pagination";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL_ERROR";

export const ERROR_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 422,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_ERROR: 500,
};

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: PageMeta | Record<string, unknown> | null;
}

export function ok<T>(
  data: T,
  meta: PageMeta | Record<string, unknown> | null = null,
  init?: ResponseInit,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, error: null, meta }, init);
}

export function fail(
  code: ErrorCode,
  message: string,
  details?: unknown,
  init?: ResponseInit,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    { success: false, data: null, error: { code, message, details }, meta: null },
    { status: ERROR_STATUS[code], ...init },
  );
}

/**
 * Ubah ZodError (v3/v4) jadi `details` per field yang mudah dirender form:
 *   { "wa": "No. WA harus 10-14 digit", "nama": "Nama minimal 3 huruf" }
 */
export function flattenZodError(error: {
  issues: Array<{
    path: Array<string | number | symbol>;
    message: string;
  }>;
}): Record<string, string> {
  const details: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    details[key] ??= issue.message;
  }
  return details;
}

/** Header Cache-Control untuk respons GET publik (dipakai bareng `revalidate`). */
export function cacheHeaders(maxAge: number): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${Math.min(maxAge, 3600)}`,
  };
}
