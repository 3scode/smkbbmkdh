"use client";

import { SegmentError } from "@/components/SegmentError";

export default function JurusanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Gagal Memuat Jurusan"
      message="Data jurusan tidak bisa ditampilkan. Coba lagi atau tanya via WA."
      logTag="jurusan"
      error={error}
      reset={reset}
      homeHref="/jurusan"
    />
  );
}
