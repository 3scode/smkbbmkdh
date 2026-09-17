import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Link WA Humas dengan pesan prefilled (nomor format 62, tanpa +). */
export function buildWaLink(nama: string, nomorBukti: string): string {
  const humas = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6281234567890";
  const text = `Assalamualaikum, saya ${nama} dengan nomor pendaftaran ${nomorBukti}. Mohon info langkah daftar ulang. Terima kasih.`;
  return `https://wa.me/${humas}?text=${encodeURIComponent(text)}`;
}

/** 1250000 → "Rp 1.250.000" */
export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/** "2026-01-12" → "12 Jan 2026" */
export function formatTanggalID(value: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/** "2026-01-12" → "12 Jan 2026 • 3 mnt baca" */
export function formatTanggalBaca(value: string | Date, minutes = 3): string {
  return `${formatTanggalID(value)} • ${minutes} mnt baca`;
}

/** 150000 → "Rp 150rb/bln", 1500000 → "Rp 1,5jt" */
export function formatRpShort(value: number, suffix = ""): string {
  if (value >= 1_000_000) {
    const jt = value / 1_000_000;
    const str = Number.isInteger(jt)
      ? String(jt)
      : String(Math.round(jt * 10) / 10).replace(".", ",");
    return `Rp ${str}jt${suffix}`;
  }
  if (value >= 1000) {
    return `Rp ${Math.round(value / 1000)}rb${suffix}`;
  }
  return `Rp ${value}${suffix}`;
}
