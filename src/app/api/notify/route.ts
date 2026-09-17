import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifySubscriber, ppdbGelombang } from "@/lib/schema";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { notifySchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

export const POST = withHandler(async function POST(request: Request) {
  try {
    const rl = checkRateLimit(request, "notify");
    if (!rl.ok) {
      return fail("RATE_LIMITED", "Terlalu sering mengirim. Coba lagi 1 menit.", undefined, {
        headers: { "Retry-After": "60" },
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("VALIDATION_ERROR", "Format data tidak valid (JSON).");
    }

    const parsed = notifySchema.safeParse(body);
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Nomor WA tidak valid.", flattenZodError(parsed.error));
    }
    const { wa, gelombangId = null } = parsed.data;

    if (gelombangId) {
      const g = await db
        .select({ id: ppdbGelombang.id })
        .from(ppdbGelombang)
        .where(eq(ppdbGelombang.id, gelombangId))
        .limit(1);
      if (!g[0]) {
        return fail("VALIDATION_ERROR", "Gelombang tidak valid.", {
          gelombangId: "Gelombang tidak ditemukan.",
        });
      }
    }

    const inserted = await db
      .insert(notifySubscriber)
      .values({ wa, gelombangId })
      .onConflictDoNothing()
      .returning({ id: notifySubscriber.id });
    let id = inserted[0]?.id ?? null;
    if (!id) {
      const existing = await db
        .select({ id: notifySubscriber.id })
        .from(notifySubscriber)
        .where(
          gelombangId
            ? and(eq(notifySubscriber.wa, wa), eq(notifySubscriber.gelombangId, gelombangId))
            : and(eq(notifySubscriber.wa, wa), isNull(notifySubscriber.gelombangId)),
        )
        .limit(1);
      id = existing[0]?.id ?? null;
    }

    return ok({ id });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal menyimpan. Coba lagi.");
  }
});
