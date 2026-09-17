"use client";

import { SegmentError } from "@/components/SegmentError";

export default function PpdbError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Gagal Memuat Halaman PPDB"
      message="Isian yang sudah diketik aman sebagai draf di HP. Coba lagi atau daftar via WA darurat."
      logTag="ppdb"
      error={error}
      reset={reset}
      homeHref="/ppdb"
    />
  );
}
