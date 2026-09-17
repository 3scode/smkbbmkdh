"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { ErrorBanner } from "./ui/ErrorBanner";

export interface BeritaAwal {
  id: string;
  judul: string;
  excerpt: string;
  body: string;
  kategori: string;
  terbit: boolean;
}

export function BeritaForm({ awal }: { awal: BeritaAwal | null }) {
  const router = useRouter();
  const [judul, setJudul] = useState(awal?.judul ?? "");
  const [excerpt, setExcerpt] = useState(awal?.excerpt ?? "");
  const [body, setBody] = useState(awal?.body ?? "");
  const [kategori, setKategori] = useState(awal?.kategori ?? "Prestasi");
  const [terbit, setTerbit] = useState(awal?.terbit ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const url = awal ? `/api/internal/berita/${awal.id}` : "/api/internal/berita";
      const res = await fetch(url, {
        method: awal ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, excerpt, body, kategori, terbit }),
      });
      const json = (await res.json()) as
        | { success: true }
        | { success: false; error: { message: string; details?: Record<string, string> } };
      if (!json.success) {
        if (json.error.details) setErrors(json.error.details);
        else setFormError(json.error.message);
        return;
      }
      router.push("/dashboard/konten/berita");
      router.refresh();
    } catch {
      setFormError("Jaringan bermasalah. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {formError && <ErrorBanner message={formError} />}
      <Field id="br-judul" label="Judul" required error={errors.judul}>
        <Input
          id="br-judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          error={errors.judul}
          required
        />
      </Field>
      <Field id="br-kategori" label="Kategori" required error={errors.kategori}>
        <Input
          id="br-kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          error={errors.kategori}
          placeholder="Prestasi / DUDI / Wirausaha / Pengumuman"
          required
        />
      </Field>
      <Field
        id="br-excerpt"
        label="Ringkasan"
        hint="Maks 300 karakter, tampil di kartu."
        error={errors.excerpt}
      >
        <Textarea
          id="br-excerpt"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </Field>
      <Field
        id="br-body"
        label="Isi (markdown)"
        required
        hint="Minimal 20 karakter."
        error={errors.body}
      >
        <Textarea
          id="br-body"
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </Field>
      <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[15px] font-semibold text-text-primary">
        <input
          type="checkbox"
          checked={terbit}
          onChange={(e) => setTerbit(e.target.checked)}
          className="size-5 accent-[#0E7C5B]"
        />
        Terbitkan langsung
      </label>
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {awal ? "Simpan perubahan" : "Simpan berita"}
        </Button>
        {awal && (
          <Link
            href="/dashboard/konten/berita"
            className="inline-flex h-11 items-center rounded-md border border-border px-5 text-[15px] font-semibold text-text-primary hover:border-primary hover:text-primary"
          >
            Batal
          </Link>
        )}
      </div>
    </form>
  );
}
