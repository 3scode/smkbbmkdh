"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BeritaActions({ id, terbit }: { id: string; terbit: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  async function patch(patch: Record<string, unknown>, kunci: string) {
    setBusy(kunci);
    setPesan(null);
    try {
      const res = await fetch(`/api/internal/berita/${id}`, {
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

  async function hapus() {
    if (!confirm("Hapus berita ini permanen? Lanjutkan?")) return;
    setBusy("hapus");
    setPesan(null);
    try {
      const res = await fetch(`/api/internal/berita/${id}`, { method: "DELETE" });
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

  const btn =
    "inline-flex min-h-[44px] items-center rounded-md border border-border px-3 text-[13px] font-semibold text-text-primary hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        <Link href={`/dashboard/konten/berita?edit=${id}`} className={btn}>
          Sunting
        </Link>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => patch({ terbit: !terbit }, "terbit")}
          className={btn}
        >
          {busy === "terbit" ? "…" : terbit ? "Tarik" : "Terbitkan"}
        </button>
        <button type="button" disabled={busy !== null} onClick={hapus} className={btn}>
          {busy === "hapus" ? "…" : "Hapus"}
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
