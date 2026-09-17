/** Pagination page-based — TECH-SPEC Bagian 3. */

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PageParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Hitung meta dari total baris. Selalu valid:
 * - page < 1 → 1; page > totalPages → data kosong, meta tetap valid
 * - limit dijepit 1..maxLimit (default maks 24)
 */
export function paginate(total: number, page: number, limit: number): PageMeta {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeLimit = Math.max(1, Math.floor(limit));
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeLimit));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  return { page: safePage, limit: safeLimit, total: safeTotal, totalPages };
}

export function toOffset(meta: Pick<PageMeta, "page" | "limit">): number {
  return (meta.page - 1) * meta.limit;
}

/** Ambil page/limit dari URLSearchParams dengan default + batas aman. */
export function parsePageParams(
  params: URLSearchParams,
  defaults: { page?: number; limit?: number; maxLimit?: number } = {},
): PageParams {
  const { page = 1, limit = 9, maxLimit = 24 } = defaults;
  const rawPage = Number(params.get("page") ?? page);
  const rawLimit = Number(params.get("limit") ?? limit);
  const safePage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const safeLimit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), maxLimit) : limit;
  return { page: safePage, limit: safeLimit, offset: (safePage - 1) * safeLimit };
}
