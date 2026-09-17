"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing } from "lucide-react";
import { notifySchema, type NotifyInput } from "@/lib/validations";
import { useOnline } from "@/hooks/useOnline";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

/** Form 1 field "Ingatkan saya" saat gelombang tutup. */
export function NotifyForm({ gelombangId }: { gelombangId?: string }) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const online = useOnline();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NotifyInput>({
    resolver: zodResolver(notifySchema),
    defaultValues: { wa: "", gelombangId },
  });

  if (done) {
    return (
      <p
        role="status"
        className="flex items-center gap-2 rounded-md bg-primary-soft p-4 text-primary-hover"
      >
        <BellRing className="size-5 shrink-0" aria-hidden />
        Siap! Kami hubungi via WA saat gelombang berikutnya dibuka.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        try {
          const res = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const json = await res.json();
          if (!json.success) {
            if (json.error?.code === "VALIDATION_ERROR" && json.error.details) {
              for (const [f, m] of Object.entries(json.error.details)) {
                setError(f as keyof NotifyInput, { message: String(m) });
              }
            } else {
              setServerError(json.error?.message ?? "Gagal menyimpan.");
            }
            return;
          }
          setDone(true);
        } catch {
          setServerError("Jaringan bermasalah. Coba lagi.");
        }
      })}
      className="flex flex-col gap-3"
      noValidate
    >
      <Field
        id="notify-wa"
        label="Nomor WA"
        required
        error={errors.wa?.message}
        hint="Contoh: 081234567890"
      >
        <Input
          id="notify-wa"
          inputMode="tel"
          placeholder="08xx"
          error={errors.wa?.message}
          {...register("wa")}
        />
      </Field>
      {serverError && (
        <p role="alert" className="text-sm font-medium text-error">
          {serverError}
        </p>
      )}
      {!online && (
        <p role="status" className="text-sm text-[#92400E]">
          Kamu offline — tombol aktif lagi saat online.
        </p>
      )}
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!online}
        icon={<BellRing className="size-4" aria-hidden />}
      >
        Ingatkan Saya
      </Button>
    </form>
  );
}
