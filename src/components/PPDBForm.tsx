"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Printer, WifiOff } from "lucide-react";
import { ppdbSchema, type PpdbFormValues } from "@/lib/validations";
import { waLink } from "@/lib/constants";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Upload } from "./ui/Upload";
import { Button } from "./ui/Button";

export interface JurusanOption {
  id: string;
  slug: string;
  nama: string;
}

const DRAFT_KEY = "ppdb-draft";

interface SuccessData {
  nomorBukti: string;
  waLink: string;
  notifAdmin: boolean;
}

export function PPDBForm({
  jurusanList,
  initialSlug,
  gelombangNama,
}: {
  jurusanList: JurusanOption[];
  initialSlug?: string;
  gelombangNama: string;
}) {
  const initialId = useMemo(
    () => jurusanList.find((j) => j.slug === initialSlug)?.id ?? "",
    [jurusanList, initialSlug],
  );
  const idempotencyKey = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const [kkName, setKkName] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PpdbFormValues>({
    resolver: zodResolver(ppdbSchema),
    defaultValues: { nama: "", asalSmp: "", jurusanId: initialId, wa: "" },
  });

  // Restore draft sekali saat mount (localStorage sebagai cache draf, sinkronisasi manual disengaja)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<PpdbFormValues>;
      if (typeof d.nama === "string") setValue("nama", d.nama);
      if (typeof d.asalSmp === "string") setValue("asalSmp", d.asalSmp);
      if (typeof d.jurusanId === "string") setValue("jurusanId", d.jurusanId);
      if (typeof d.wa === "string") setValue("wa", d.wa);
    } catch {
      /* draft rusak → abaikan */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave draft tiap perubahan
  const values = watch();
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          nama: values.nama ?? "",
          asalSmp: values.asalSmp ?? "",
          jurusanId: values.jurusanId ?? "",
          wa: values.wa ?? "",
        }),
      );
    } catch {
      /* storage penuh → abaikan */
    }
  }, [values]);

  // Status online
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (success) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="flex flex-col items-center gap-4 rounded-lg border border-success/30 bg-[#F0FDF4] p-6 text-center motion-safe:animate-zoom-in md:p-8"
      >
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <h2 className="text-2xl font-bold text-text-primary">Pendaftaran Berhasil!</h2>
        <p className="text-text-secondary">
          Simpan nomor bukti di bawah ini untuk daftar ulang di {gelombangNama}.
        </p>
        <p
          aria-label={`Nomor bukti ${success.nomorBukti}`}
          className="rounded-md bg-text-primary px-6 py-3 font-mono text-xl font-bold tracking-widest text-white"
        >
          {success.nomorBukti}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={success.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <MessageCircle className="size-4" aria-hidden /> Konfirmasi via WA
          </a>
          <Link
            href={`/ppdb/bukti/${success.nomorBukti}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-primary px-5 font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Printer className="size-4" aria-hidden /> Lihat & Cetak Bukti
          </Link>
        </div>
        {!success.notifAdmin && (
          <p className="text-[13px] text-text-secondary">
            Notifikasi otomatis ke sekolah tertunda — pastikan tekan tombol WA di atas ya.
          </p>
        )}
      </div>
    );
  }

  const waError = errors.wa?.message;

  return (
    <form
      onSubmit={handleSubmit(
        async (values) => {
          setServerError(null);
          const form = new FormData();
          form.set("nama", values.nama);
          form.set("asalSmp", values.asalSmp);
          form.set("jurusanId", values.jurusanId);
          form.set("wa", values.wa);
          if (values.tglLahir) form.set("tglLahir", values.tglLahir);
          form.set("consentWali", "on");
          const kkEl = document.getElementById("ppdb-kk") as HTMLInputElement | null;
          const file = kkEl?.files?.[0];
          if (file) form.set("kk", file);
          try {
            const res = await fetch("/api/ppdb/submit", {
              method: "POST",
              headers: { "X-Idempotency-Key": idempotencyKey.current },
              body: form,
            });
            const json = await res.json();
            if (!json.success) {
              if (json.error?.code === "VALIDATION_ERROR" && json.error.details) {
                const details = json.error.details as Record<string, string>;
                for (const [f, m] of Object.entries(details)) {
                  if (f === "kk") {
                    setServerError(`File KK: ${m}`);
                  } else {
                    setError(f as keyof PpdbFormValues, { message: m });
                  }
                }
                document
                  .querySelector("[aria-invalid='true']")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                (document.querySelector("[aria-invalid='true']") as HTMLElement | null)?.focus();
              } else if (json.error?.code === "CONFLICT") {
                setServerError(json.error.message);
              } else {
                setServerError(
                  `${json.error?.message ?? "Gagal mengirim."} Data aman tersimpan sebagai draf.`,
                );
              }
              return;
            }
            try {
              localStorage.removeItem(DRAFT_KEY);
            } catch {
              /* abaikan */
            }
            setSuccess(json.data as SuccessData);
            requestAnimationFrame(() => successRef.current?.focus());
          } catch {
            setServerError(
              "Jaringan bermasalah. Data aman tersimpan sebagai draf — coba lagi atau hubungi WA Humas.",
            );
          }
        },
        () => {
          // Invalid client-side → fokus ke error pertama
          requestAnimationFrame(() => {
            const el = document.querySelector("[aria-invalid='true']") as HTMLElement | null;
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            el?.focus();
          });
        },
      )}
      className="flex flex-col gap-4"
      noValidate
    >
      {!online && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-md bg-warning-bg p-3 text-sm text-[#92400E]"
        >
          <WifiOff className="size-4 shrink-0" aria-hidden />
          Kamu offline — isian tersimpan sebagai draf, tombol kirim aktif lagi saat online.
        </p>
      )}

      <Field
        id="ppdb-nama"
        label="Nama Lengkap"
        required
        error={errors.nama?.message}
        hint="Sesuai akta/KK, minimal 3 huruf"
      >
        <Input
          id="ppdb-nama"
          placeholder="cth. Rizky Pratama"
          autoComplete="name"
          error={errors.nama?.message}
          {...register("nama")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="ppdb-smp"
          label="Asal SMP/MTs"
          required
          error={errors.asalSmp?.message}
          hint="cth. SMPN 1 Kandanghaur"
        >
          <Input
            id="ppdb-smp"
            placeholder="cth. SMPN 1 Kandanghaur"
            list="ppdb-smp-list"
            autoComplete="off"
            error={errors.asalSmp?.message}
            {...register("asalSmp")}
          />
          <datalist id="ppdb-smp-list">
            {[
              "SMPN 1 Kandanghaur",
              "SMPN 2 Kandanghaur",
              "SMPN 1 Gabuswetan",
              "SMPN 1 Kroya",
              "MTsN 1 Indramayu",
            ].map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </Field>

        <Field id="ppdb-jurusan" label="Jurusan" required error={errors.jurusanId?.message}>
          <Select id="ppdb-jurusan" error={errors.jurusanId?.message} {...register("jurusanId")}>
            <option value="">— Pilih jurusan —</option>
            {jurusanList.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="ppdb-wa"
          label="No. WA Aktif"
          required
          error={waError}
          hint="10-14 digit, cth. 081234567890"
        >
          <Input
            id="ppdb-wa"
            inputMode="tel"
            placeholder="08xx"
            autoComplete="tel"
            error={waError}
            {...register("wa", {
              onBlur: (e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (v.startsWith("08")) setValue("wa", `62${v.slice(1)}`, { shouldValidate: true });
              },
            })}
          />
        </Field>
        <Field
          id="ppdb-lahir"
          label="Tanggal Lahir"
          error={errors.tglLahir?.message}
          hint="Usia minimal 12 tahun"
        >
          <Input
            id="ppdb-lahir"
            type="date"
            error={errors.tglLahir?.message}
            {...register("tglLahir")}
          />
        </Field>
      </div>

      <Field id="ppdb-kk" label="Upload KK (opsional)" hint="JPG/PDF, maksimal 2MB">
        <Upload
          id="ppdb-kk"
          accept=".jpg,.jpeg,.pdf"
          fileName={kkName}
          onChange={(e) => setKkName(e.target.files?.[0]?.name ?? null)}
          onClearFile={() => {
            setKkName(null);
            const el = document.getElementById("ppdb-kk") as HTMLInputElement | null;
            if (el) el.value = "";
          }}
        />
      </Field>

      <div className="flex items-start gap-2 rounded-md bg-background-alt p-3">
        <input
          id="ppdb-consent"
          type="checkbox"
          value="on"
          className="mt-1 size-5 shrink-0 accent-primary"
          aria-invalid={Boolean(errors.consentWali) || undefined}
          aria-describedby={errors.consentWali ? "ppdb-consent-error" : undefined}
          {...register("consentWali")}
        />
        <label htmlFor="ppdb-consent" className="text-sm text-text-primary">
          Saya wali murid menyetujui data anak dipakai untuk PPDB SMK BBM &amp; dihubungi via WA.{" "}
          <span aria-hidden className="text-error">
            *
          </span>
        </label>
      </div>
      {errors.consentWali && (
        <p
          id="ppdb-consent-error"
          role="alert"
          className="-mt-2 text-[13px] font-medium text-error"
        >
          {errors.consentWali.message}
        </p>
      )}

      {serverError && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-md border border-error/30 bg-[#FEF2F2] p-4"
        >
          <p className="text-sm font-medium text-error">{serverError}</p>
          <a
            href={waLink("Assalamualaikum, saya mengalami kendala mengisi form PPDB online.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary underline"
          >
            Hubungi WA darurat Humas →
          </a>
        </div>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} disabled={!online} fullWidth>
        {isSubmitting ? "Mengirim…" : "Kirim Pendaftaran"}
      </Button>
      <p className="text-center text-[13px] text-text-secondary">
        Data tersimpan otomatis sebagai draf di HP ini.
      </p>
    </form>
  );
}
