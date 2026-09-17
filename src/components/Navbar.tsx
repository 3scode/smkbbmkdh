"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SCHOOL } from "@/lib/constants";
import { trackDaftarClick } from "@/lib/analytics";
import { Button } from "./ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 24,
  );
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const [masuk, setMasuk] = useState<boolean | null>(null);
  // Tutup drawer saat pindah halaman (pola adjust-state-during-render)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let batal = false;
    fetch("/api/auth/me")
      .then((r) => {
        if (!batal) setMasuk(r.ok);
      })
      .catch(() => {
        if (!batal) setMasuk(false);
      });
    return () => {
      batal = true;
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc menutup + focus trap sederhana + kembalikan fokus
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const els = drawerRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (!els || els.length === 0) return;
        const first = els[0]!;
        const last = els[els.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-surface/95 backdrop-blur transition-shadow print:hidden",
        scrolled ? "border-border shadow-sm" : "border-transparent",
      )}
    >
      <nav
        aria-label="Utama"
        className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Beranda SMK BBM"
        >
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-white">
            <GraduationCap className="size-6" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-bold text-text-primary">{SCHOOL.namaSingkat}</span>
            <span className="text-xs text-text-secondary">{SCHOOL.kota}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-[15px] font-semibold transition-colors hover:text-primary",
                  "focus-visible:outline-2 focus-visible:outline-primary",
                  isActive(l.href) ? "text-primary" : "text-text-primary",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {masuk === true ? (
            <Link
              href="/dashboard"
              className="hidden rounded-md border border-primary bg-surface px-4 text-[15px] font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex sm:h-11 sm:items-center"
            >
              Dashboard
            </Link>
          ) : (
            masuk === false && (
              <Link
                href="/login"
                className="hidden rounded-md px-3 text-[15px] font-semibold text-text-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary sm:inline-flex sm:h-11 sm:items-center"
              >
                Login
              </Link>
            )
          )}
          <Link
            href="/ppdb"
            onClick={() => trackDaftarClick("navbar")}
            className="hidden rounded-md bg-primary px-5 text-[15px] font-semibold tracking-[0.2px] text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex sm:h-11 sm:items-center"
          >
            Daftar PPDB
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-drawer"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-md text-text-primary hover:bg-background focus-visible:outline-2 focus-visible:outline-primary lg:hidden"
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-text-primary/60"
            onClick={() => setOpen(false)}
          />
          <div
            ref={drawerRef}
            id="menu-drawer"
            role="dialog"
            aria-label="Menu navigasi"
            className="absolute top-0 right-0 flex h-full w-[85%] max-w-sm flex-col gap-1 overflow-y-auto bg-surface p-4 shadow-lg"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-bold text-text-primary">Menu</span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Tutup menu"
                onClick={() => setOpen(false)}
                className="flex size-11 items-center justify-center rounded-md hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-3 font-semibold",
                  isActive(l.href)
                    ? "bg-primary-soft text-primary"
                    : "text-text-primary hover:bg-background",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3">
              <Button
                fullWidth
                onClick={() => {
                  trackDaftarClick("drawer");
                  setOpen(false);
                  router.push("/ppdb");
                }}
              >
                Daftar PPDB
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
