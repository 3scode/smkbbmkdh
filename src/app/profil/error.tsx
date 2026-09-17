"use client";

import { SegmentError } from "@/components/SegmentError";

export default function ProfilError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      title="Gagal Memuat Profil"
      message="Coba lagi untuk membaca Visi, Misi, dan Tujuan sekolah."
      logTag="profil"
      error={error}
      reset={reset}
      homeHref="/profil"
    />
  );
}
