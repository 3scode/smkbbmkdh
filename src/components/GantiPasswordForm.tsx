"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { ErrorBanner } from "./ui/ErrorBanner";

export function GantiPasswordForm() {
  const router = useRouter();
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    if (baru !== ulang) {
      setErrors({ passwordBaru: "Konfirmasi tidak sama dengan password baru." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/ganti-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordLama: lama, passwordBaru: baru }),
      });
      const json = (await res.json()) as
        | { success: true }
        | { success: false; error: { message: string; details?: Record<string, string> } };
      if (!json.success) {
        if (json.error.details) setErrors(json.error.details);
        else setFormError(json.error.message);
        return;
      }
      router.push("/dashboard");
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
      <Field id="pw-lama" label="Password lama" required error={errors.passwordLama}>
        <Input
          id="pw-lama"
          type="password"
          autoComplete="current-password"
          value={lama}
          onChange={(e) => setLama(e.target.value)}
          error={errors.passwordLama}
          required
        />
      </Field>
      <Field
        id="pw-baru"
        label="Password baru"
        required
        hint="Minimal 10 karakter dan memuat angka."
        error={errors.passwordBaru}
      >
        <Input
          id="pw-baru"
          type="password"
          autoComplete="new-password"
          value={baru}
          onChange={(e) => setBaru(e.target.value)}
          error={errors.passwordBaru}
          required
        />
      </Field>
      <Field id="pw-ulang" label="Ulangi password baru" required>
        <Input
          id="pw-ulang"
          type="password"
          autoComplete="new-password"
          value={ulang}
          onChange={(e) => setUlang(e.target.value)}
          required
        />
      </Field>
      <Button
        type="submit"
        loading={loading}
        fullWidth
        icon={<KeyRound className="size-4" aria-hidden />}
      >
        Simpan password baru
      </Button>
    </form>
  );
}
