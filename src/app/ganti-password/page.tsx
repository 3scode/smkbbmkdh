import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { GantiPasswordForm } from "@/components/GantiPasswordForm";

export const metadata: Metadata = {
  title: "Ganti Password",
  robots: { index: false, follow: false },
};

export default async function GantiPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ awal?: string }>;
}) {
  const user = await requireSession();
  if (!user) redirect("/login?next=/ganti-password");
  const sp = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-10">
      <div className="flex flex-1 items-start justify-center pt-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-text-primary">Ganti Password</h1>
          <p className="pt-1 text-sm text-text-secondary">
            {sp.awal === "1" || user.mustChangePassword
              ? `Halo, ${user.nama}. Demi keamanan, buat password baru sebelum memakai dashboard.`
              : "Buat password baru untuk akun Anda."}
          </p>
          <div className="pt-6">
            <GantiPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
