"use client";

import { SegmentError } from "@/components/SegmentError";

export default function KontakError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Gagal Memuat Halaman Kontak"
      message="Coba lagi — atau langsung chat WA Humas di bawah."
      logTag="kontak"
      error={error}
      reset={reset}
      homeHref="/kontak"
    />
  );
}
