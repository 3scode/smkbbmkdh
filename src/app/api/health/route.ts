import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Health check untuk CI/monitoring & verifikasi deploy.
 * - 200 { ok:true, dbMs } saat DB responsif
 * - 503 { ok:false } saat DB down (tanpa bocorkan detail error)
 */
export async function GET() {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json(
      { ok: true, dbMs: Date.now() - start },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, dbMs: -1 },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
