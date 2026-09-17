"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AkunActions({
  id,
  isActive,
  diriSendiri,
}: {
  id: string;
  isActive: boolean;
  diriSendiri: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  async function kirim(patch: Record<string, unknown>, kunci: string, okMsg: string) {
    if (!confirm(okMsg + " Lanjutkan?")) return;
    setBusy(kunci);
    setPesan(null);
    try {
      const res = await fetch(`/api/internal/akun/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as
        { success: true } | { success: false; error: { message: string } };
      if (!json.success) {
        setPesan(json.error.message);
        return;
      }
      router.refresh();
    } catch {
      setPesan("Jaringan bermasalah.");
    } finally {
      setBusy(null);
    }
  }

  if (diriSendiri) return <span className="text-[13px] text-text-secondary">—</span>;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() =>
            kirim(
              { isActive: !isActive },
              "aktif",
              isActive ? "Nonaktifkan akun?" : "Aktifkan akun?",
            )
          }
          className="inline-flex min-h-[44px] items-center rounded-md border border-border px-3 text-[13px] font-semibold text-text-primary hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
        >
          {busy === "aktif" ? "…" : isActive ? "Nonaktifkan" : "Aktifkan"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => kirim({ resetPassword: true }, "reset", "Reset password ke NIP/NISN?")}
          className="inline-flex min-h-[44px] items-center rounded-md border border-border px-3 text-[13px] font-semibold text-text-primary hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
        >
          {busy === "reset" ? "…" : "Reset password"}
        </button>
      </div>
      {pesan && (
        <p role="alert" className="text-[13px] font-medium text-error">
          {pesan}
        </p>
      )}
    </div>
  );
}
