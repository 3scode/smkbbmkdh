"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { ErrorBanner } from "./ui/ErrorBanner";

export function PengumumanForm() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [body, setBody] = useState("");
  const [kategori, setKategori] = useState<"pengumuman" | "agenda">("pengumuman");
  const [pin, setPin] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/internal/pengumuman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, body, kategori, isPinned: pin }),
      });
      const json = (await res.json()) as
        | { success: true }
        | { success: false; error: { message: string; details?: Record<string, string> } };
      if (!json.success) {
        if (json.error.details) setErrors(json.error.details);
        else setFormError(json.error.message);
        return;
      }
      setJudul("");
      setBody("");
      setPin(false);
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
      <Field id="pg-judul" label="Judul" required error={errors.judul}>
        <Input
          id="pg-judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          error={errors.judul}
          required
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pg-kat" label="Kategori" required>
          <select
            id="pg-kat"
            value={kategori}
            onChange={(e) => setKategori(e.target.value as "pengumuman" | "agenda")}
            className="h-12 w-full rounded-sm border border-border bg-surface px-4 text-base text-text-primary focus:border-primary focus:ring-[3px] focus:ring-primary-soft focus:outline-none"
          >
            <option value="pengumuman">Pengumuman</option>
            <option value="agenda">Agenda</option>
          </select>
        </Field>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 self-end pb-3 text-[15px] font-semibold text-text-primary">
          <input
            type="checkbox"
            checked={pin}
            onChange={(e) => setPin(e.target.checked)}
            className="size-5 accent-[#0E7C5B]"
          />
          Pin di sidebar
        </label>
      </div>
      <Field id="pg-body" label="Isi" required hint="Minimal 10 karakter." error={errors.body}>
        <Textarea
          id="pg-body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </Field>
      <Button type="submit" loading={loading}>
        Simpan pengumuman
      </Button>
    </form>
  );
}
