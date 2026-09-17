"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function BeritaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error("[berita]", error.message);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold text-text-primary">Berita</h1>
      <ErrorBanner message="Gagal memuat berita. Periksa koneksi lalu coba lagi." onRetry={reset} />
      <div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
