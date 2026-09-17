"use client";

import { SegmentError } from "@/components/SegmentError";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Terjadi Gangguan"
      message="Maaf, halaman gagal dimuat. Coba lagi — isian formulir yang tersimpan sebagai draf tidak akan hilang."
      logTag="global"
      error={error}
      reset={reset}
    />
  );
}
