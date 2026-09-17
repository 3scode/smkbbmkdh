import { desc, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { cacheHeaders } from "@/lib/api-response";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://smkbbm-kandanghaur.sch.id";
  try {
    const items = await db
      .select()
      .from(berita)
      .where(isNotNull(berita.publishedAt))
      .orderBy(desc(berita.publishedAt))
      .limit(20);

    const xmlItems = items
      .map(
        (b) => `    <item>
      <title>${escapeXml(b.judul)}</title>
      <link>${baseUrl}/berita/${b.slug}</link>
      <guid>${baseUrl}/berita/${b.slug}</guid>
      <pubDate>${b.publishedAt ? new Date(b.publishedAt).toUTCString() : ""}</pubDate>
      <description>${escapeXml(b.excerpt ?? "")}</description>
    </item>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SMK Bangun Bangsa Mandiri Kandanghaur — Berita</title>
    <link>${baseUrl}/berita</link>
    <description>Berita, pengumuman, dan agenda SMK BBM Kandanghaur.</description>
${xmlItems}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        ...cacheHeaders(3600),
      },
    });
  } catch {
    return new Response("Gagal memuat RSS.", { status: 500 });
  }
}
