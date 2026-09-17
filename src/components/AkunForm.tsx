"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { ErrorBanner } from "./ui/ErrorBanner";
import type { Peran } from "@/lib/schema";

const SEMUA_PERAN: Peran[] = ["siswa", "guru", "kaprodi", "wakasek", "kesiswaan", "admin"];

/** Wakasek hanya boleh membuat peran di bawahnya (ditegakkan juga di server). */
const BOLEH_DIBUAT: Record<string, Peran[]> = {
  wakasek: ["siswa", "guru", "kaprodi", "kesiswaan"],
  admin: SEMUA_PERAN,
};

export function AkunForm({ peranSaya }: { peranSaya: Peran }) {
  const router = useRouter();
  const [nipNis, setNipNis] = useState("");
  const [nama, setNama] = useState("");
  const [peran, setPeran] = useState<Peran>("siswa");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sukses, setSukses] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pilihan = BOLEH_DIBUAT[peranSaya] ?? ["siswa"];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setSukses(null);
    setLoading(true);
    try {
      const res = await fetch("/api/internal/akun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nipNis, nama, peran }),
      });
      const json = (await res.json()) as
        | { success: true }
        | { success: false; error: { message: string; details?: Record<string, string> } };
      if (!json.success) {
        if (json.error.details) setErrors(json.error.details);
        else setFormError(json.error.message);
        return;
      }
      setSukses(`Akun ${nama} dibuat. Password awal = NIP/NISN, wajib diganti pemiliknya.`);
      setNipNis("");
      setNama("");
      router.refresh();
    } catch {
      setFormError("Jaringan bermasalah. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <h3 className="font-semibold text-text-primary">Tambah akun</h3>
      {formError && <ErrorBanner message={formError} />}
      {sukses && (
        <p role="status" className="rounded-md bg-[#F0FDF4] p-4 text-sm font-medium text-success">
          {sukses}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ak-nip" label="NIP / NISN" required error={errors.nipNis}>
          <Input
            id="ak-nip"
            inputMode="numeric"
            value={nipNis}
            onChange={(e) => setNipNis(e.target.value)}
            error={errors.nipNis}
            required
          />
        </Field>
        <Field id="ak-nama" label="Nama" required error={errors.nama}>
          <Input
            id="ak-nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            error={errors.nama}
            required
          />
        </Field>
      </div>
      <Field id="ak-peran" label="Peran" required error={errors.peran}>
        <select
          id="ak-peran"
          value={peran}
          onChange={(e) => setPeran(e.target.value as Peran)}
          className="h-12 w-full rounded-sm border border-border bg-surface px-4 text-base text-text-primary focus:border-primary focus:ring-[3px] focus:ring-primary-soft focus:outline-none"
        >
          {pilihan.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Button type="submit" loading={loading}>
        Buat akun
      </Button>
    </form>
  );
}
