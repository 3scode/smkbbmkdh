import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login untuk siswa, guru, kaprodi, wakasek, tim kesiswaan, dan admin SMK BBM.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/dashboard") ? sp.next : null;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-10">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary hover:underline">
              Beranda
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="font-medium text-text-primary">
            Login
          </li>
        </ol>
      </nav>
      <div className="flex flex-1 items-start justify-center pt-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-text-primary">Login Akun Sekolah</h1>
          <p className="pt-1 text-sm text-text-secondary">
            Pakai NIP (guru/staf) atau NISN 10 digit (siswa). Akun diterbitkan sekolah — hubungi
            humas bila belum punya.
          </p>
          <div className="pt-6">
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}
