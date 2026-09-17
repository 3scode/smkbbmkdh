import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan, ppdbGelombang, ppdbRegistration } from "@/lib/schema";
import { maskNama } from "@/lib/ppdb";
import { buildWaLink } from "@/lib/utils";
import { PrintButtonClient } from "./print-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bukti Pendaftaran PPDB",
  description:
    "Bukti pendaftaran PPDB SMK BBM Kandanghaur — simpan dan tunjukkan saat daftar ulang.",
  robots: { index: false, follow: false },
};

async function getBukti(id: string) {
  try {
    const rows = await db
      .select({
        nomorBukti: ppdbRegistration.nomorBukti,
        nama: ppdbRegistration.nama,
        asalSmp: ppdbRegistration.asalSmp,
        status: ppdbRegistration.status,
        createdAt: ppdbRegistration.createdAt,
        jurusan: jurusan.nama,
        gelombang: ppdbGelombang.nama,
      })
      .from(ppdbRegistration)
      .innerJoin(jurusan, eq(ppdbRegistration.jurusanId, jurusan.id))
      .innerJoin(ppdbGelombang, eq(ppdbRegistration.gelombangId, ppdbGelombang.id))
      .where(eq(ppdbRegistration.nomorBukti, id))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function BuktiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || id.length > 20) notFound();
  const row = await getBukti(id);
  if (!row) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://smkbbm-kandanghaur.sch.id";
  const buktiUrl = `${baseUrl}/ppdb/bukti/${row.nomorBukti}`;
  let qr = "";
  try {
    qr = await QRCode.toDataURL(buktiUrl, { width: 200, margin: 1 });
  } catch {
    qr = "";
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-10 text-center print:py-2">
      <CheckCircle2 className="size-12 text-success print:hidden" aria-hidden />
      <p className="text-sm text-text-secondary">Bukti Pendaftaran PPDB</p>
      <h1 className="font-mono text-2xl font-bold tracking-widest text-text-primary">
        {row.nomorBukti}
      </h1>
      <dl className="w-full rounded-lg border border-border bg-surface p-5 text-left shadow-sm">
        <div className="flex justify-between gap-4 border-b border-border py-2">
          <dt className="text-text-secondary">Nama</dt>
          <dd className="font-semibold text-text-primary">{maskNama(row.nama)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border py-2">
          <dt className="text-text-secondary">Asal SMP</dt>
          <dd className="font-semibold text-text-primary">{row.asalSmp}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border py-2">
          <dt className="text-text-secondary">Jurusan</dt>
          <dd className="font-semibold text-text-primary">{row.jurusan}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-text-secondary">Gelombang</dt>
          <dd className="font-semibold text-text-primary">{row.gelombang}</dd>
        </div>
      </dl>
      {qr && (
        // eslint-disable-next-line @next/next/no-img-element -- data URL QR tidak didukung next/image
        <img src={qr} alt={`Kode QR bukti ${row.nomorBukti}`} width={160} height={160} />
      )}
      <p className="text-sm text-text-secondary">
        Tunjukkan nomor ini + berkas asli saat daftar ulang (Senin–Jumat 08.00–14.00, ruang TU).
      </p>
      <div className="flex flex-col gap-2 print:hidden sm:flex-row">
        <PrintButtonClient />
        <a
          href={buildWaLink(maskNama(row.nama), row.nomorBukti)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <MessageCircle className="size-4" aria-hidden /> Konfirmasi WA
        </a>
        <Link
          href="/ppdb"
          className="inline-flex h-12 items-center justify-center rounded-md border border-border px-5 font-semibold text-text-primary hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
