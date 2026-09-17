import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can, type Kemampuan } from "@/lib/permissions";
import type { Peran } from "@/lib/schema";
import { Badge } from "@/components/ui/Badge";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

const PERAN_LABEL: Record<Peran, string> = {
  siswa: "Siswa",
  guru: "Guru",
  kaprodi: "Kaprodi",
  wakasek: "Wakasek",
  kesiswaan: "Tim Kesiswaan",
  admin: "Admin",
};

interface NavItem {
  href: string;
  label: string;
  butuh: Kemampuan | null;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Ringkasan", butuh: null },
  { href: "/dashboard/direktori", label: "Direktori", butuh: "direktori:lihat_internal" },
  { href: "/dashboard/siswa", label: "Siswa", butuh: "siswa:lihat_semua" },
  { href: "/dashboard/konten/berita", label: "Berita", butuh: "konten:kelola" },
  { href: "/dashboard/konten/pengumuman", label: "Pengumuman", butuh: "konten:kelola" },
  { href: "/dashboard/akun", label: "Akun", butuh: "akun:kelola_staf" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireSession();
  if (!user) redirect("/login?next=/dashboard");
  if (user.mustChangePassword) redirect("/ganti-password?awal=1");

  const items = NAV.filter((n) => !n.butuh || can(user.peran, n.butuh));

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate font-bold text-text-primary">{user.nama}</p>
          <div>
            <Badge tone="primary" size="sm">
              {PERAN_LABEL[user.peran]}
            </Badge>
          </div>
        </div>
        <LogoutButton />
      </div>
      <nav aria-label="Dashboard" className="flex gap-2 overflow-x-auto py-4">
        {items.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-text-secondary hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
