"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { KEPERLUAN, kontakSchema, type KontakInput } from "@/lib/validations";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";

const DRAFT_KEY = "kontak-draft";

/** Baca draf tersimpan (sekali, saat inisialisasi form — aman SSR via guard). */
function initialDraft(): Partial<KontakInput> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const d = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<KontakInput> = {};
    if (typeof d.nama === "string") out.nama = d.nama;
    if (typeof d.wa === "string") out.wa = d.wa;
    if (typeof d.pesan === "string") out.pesan = d.pesan;
    return out;
  } catch {
    return {};
  }
}

export function KontakForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<KontakInput>({
    resolver: zodResolver(kontakSchema),
    defaultValues: { nama: "", wa: "", keperluan: "PPDB", pesan: "", ...initialDraft() },
  });

  // Restore + autosave draf (disengaja tanpa useEffect-setState lint issue:
  // baca saat submit? tidak — pakai pola lazy di bawah via onChange manual)
  const saveDraft = (field: keyof KontakInput, value: string) => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const d = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      d[field] = value;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {
      /* abaikan */
    }
  };

  if (done) {
    return (
      <p role="status" className="flex items-start gap-2 rounded-md bg-[#F0FDF4] p-4 text-success">
        <CheckCircle2 className="size-5 shrink-0" aria-hidden />
        <span>
          <strong>Pesan terkirim!</strong> Kami balas maksimal 1x24 jam via WA pada jam layanan.
        </span>
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        try {
          const res = await fetch("/api/kontak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const json = await res.json();
          if (!json.success) {
            if (json.error?.code === "VALIDATION_ERROR" && json.error.details) {
              for (const [f, m] of Object.entries(json.error.details)) {
                setError(f as keyof KontakInput, { message: String(m) });
              }
            } else {
              setServerError(json.error?.message ?? "Gagal mengirim pesan.");
            }
            return;
          }
          try {
            localStorage.removeItem(DRAFT_KEY);
          } catch {
            /* abaikan */
          }
          reset();
          setDone(true);
        } catch {
          setServerError("Jaringan bermasalah. Draf tersimpan — coba lagi.");
        }
      })}
      className="flex flex-col gap-4"
      noValidate
    >
      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        onChange={() => undefined}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="kontak-nama" label="Nama" required error={errors.nama?.message}>
          <Input
            id="kontak-nama"
            placeholder="cth. Bu Siti"
            autoComplete="name"
            error={errors.nama?.message}
            {...register("nama", { onChange: (e) => saveDraft("nama", e.target.value) })}
          />
        </Field>
        <Field
          id="kontak-wa"
          label="No. WA"
          required
          error={errors.wa?.message}
          hint="cth. 081234567890"
        >
          <Input
            id="kontak-wa"
            inputMode="tel"
            placeholder="08xx"
            autoComplete="tel"
            error={errors.wa?.message}
            {...register("wa", { onChange: (e) => saveDraft("wa", e.target.value) })}
          />
        </Field>
      </div>
      <Field id="kontak-perlu" label="Keperluan" required error={errors.keperluan?.message}>
        <Select id="kontak-perlu" error={errors.keperluan?.message} {...register("keperluan")}>
          {KEPERLUAN.map((k) => (
            <option key={k} value={k}>
              {k === "PPDB"
                ? "PPDB / Pendaftaran"
                : k === "Biaya"
                  ? "Biaya & Beasiswa"
                  : k === "Kerjasama"
                    ? "Kerjasama DUDI"
                    : "Lainnya"}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        id="kontak-pesan"
        label="Pesan"
        required
        error={errors.pesan?.message}
        hint="Minimal 10 karakter"
      >
        <Textarea
          id="kontak-pesan"
          placeholder="Tulis pesan Ayah/Bunda…"
          error={errors.pesan?.message}
          {...register("pesan", { onChange: (e) => saveDraft("pesan", e.target.value) })}
        />
      </Field>
      {serverError && (
        <p role="alert" className="text-sm font-medium text-error">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} icon={<Send className="size-4" aria-hidden />}>
        Kirim Pesan
      </Button>
    </form>
  );
}
