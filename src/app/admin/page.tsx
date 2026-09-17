import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CMS Humas",
  robots: { index: false, follow: false },
};

/**
 * Decap CMS untuk Humas (tanpa coding).
 * - Dev lokal: jalankan `bunx decap-server`, buka /admin (local_backend)
 * - Produksi: login via git-gateway (lihat public/admin/config.yml)
 * Catatan: dimuat di dalam chrome situs; CMS Decap me-render app sendiri.
 */
export default function AdminPage() {
  return (
    <div className="flex min-h-[70vh] flex-col">
      <Script
        src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"
        strategy="afterInteractive"
      />
      <div id="nc-root" />
      <noscript>
        <p className="p-8 text-center text-text-secondary">
          CMS membutuhkan JavaScript. Aktifkan JavaScript lalu muat ulang.
        </p>
      </noscript>
    </div>
  );
}
