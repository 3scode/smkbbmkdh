"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { ErrorBanner } from "./ui/ErrorBanner";

interface LoginOk {
  success: true;
  data: { nama: string; peran: string; mustChangePassword: boolean };
}

interface LoginFail {
  success: false;
  error: { code: string; message: string; details?: Record<string, string> };
}

export function LoginForm({ next }: { next: string | null }) {
  const router = useRouter();
  const [nipNis, setNipNis] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nipNis, password }),
      });
      const json = (await res.json()) as LoginOk | LoginFail;
      if (!json.success) {
        if (json.error.details) setErrors(json.error.details);
        else setFormError(json.error.message);
        return;
      }
      if (json.data.mustChangePassword) {
        router.push("/ganti-password?awal=1");
        router.refresh();
      } else {
        router.push(next ?? "/dashboard");
        router.refresh();
      }
    } catch {
      setFormError("Jaringan bermasalah. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {formError && <ErrorBanner message={formError} />}
      <Field
        id="nipnis"
        label="NIP / NISN"
        required
        hint="Guru & staf: NIP. Siswa: NISN 10 digit."
        error={errors.nipNis}
      >
        <Input
          id="nipnis"
          name="nipNis"
          inputMode="numeric"
          autoComplete="username"
          placeholder="cth. 198501012010011001"
          value={nipNis}
          onChange={(e) => setNipNis(e.target.value)}
          error={errors.nipNis}
          required
        />
      </Field>
      <Field id="password" label="Password" required error={errors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
      </Field>
      <Button
        type="submit"
        loading={loading}
        fullWidth
        icon={<LogIn className="size-4" aria-hidden />}
      >
        Masuk
      </Button>
      <p className="text-center text-[13px] text-text-secondary">
        Lupa password? Hubungi humas via{" "}
        <a
          href="https://wa.me/6281234567890?text=Assalamualaikum%2C%20saya%20lupa%20password%20akun%20sekolah."
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          WhatsApp sekolah
        </a>
        .
      </p>
    </form>
  );
}
