import { db } from "@/lib/db";
import { authAudit } from "@/lib/schema";
import { destroySession, requireSession } from "@/lib/auth";
import { clientIp, hashIp } from "@/lib/rate-limit";
import { ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

export const POST = withHandler(async function POST(request: Request) {
  const user = await requireSession();
  if (user) {
    await db.insert(authAudit).values({
      userId: user.id,
      aksi: "logout",
      ipHash: hashIp(clientIp(request)),
    });
  }
  await destroySession();
  return ok({ keluar: true });
});
