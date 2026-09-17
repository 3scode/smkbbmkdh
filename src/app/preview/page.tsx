"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Megaphone, MessageCircle, Search, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Upload } from "@/components/ui/Upload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { JurusanCard } from "@/components/JurusanCard";
import { BeritaCard } from "@/components/BeritaCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Skeleton } from "@/components/ui/Skeleton";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 bg-background px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary">Preview Komponen — SMK BBM</h1>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Daftar PPDB</Button>
          <Button variant="secondary">Hubungi WA</Button>
          <Button variant="outline">Lihat Detail</Button>
          <Button variant="ghost">Lihat semua →</Button>
          <Button variant="danger" icon={<Trash2 className="size-4" aria-hidden />}>
            Hapus
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Kecil 36px</Button>
          <Button size="md">Sedang 44px</Button>
          <Button size="lg">Besar 52px</Button>
          <Button loading>Mengirim</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Penuh di mobile</Button>
          <Button icon={<Send className="size-4" aria-hidden />} iconPosition="right">
            Kirim
          </Button>
        </div>
      </Section>

      <Section title="Badge / Chip">
        <div className="flex flex-wrap gap-2">
          <Badge tone="success" dot>
            PPDB Dibuka
          </Badge>
          <Badge tone="primary">Vokasi</Badge>
          <Badge tone="amber">Beasiswa</Badge>
          <Badge tone="info">Pengumuman</Badge>
          <Badge tone="outline">Filter</Badge>
          <Badge tone="solid">Aktif</Badge>
          <Badge size="sm">Kecil</Badge>
        </div>
      </Section>

      <Section title="Form">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="nama" label="Nama Lengkap" required hint="Sesuai akta/KK">
            <Input id="nama" placeholder="cth. Rizky Pratama" />
          </Field>
          <Field id="wa" label="No. WA" required error="No. WA harus 10-14 digit diawali 08">
            <Input id="wa" inputMode="tel" placeholder="08xx" defaultValue="08123" />
          </Field>
          <Field id="jurusan" label="Jurusan" required valid>
            <Select id="jurusan" defaultValue="tkj">
              <option value="tkj">Teknik Komputer Jaringan</option>
              <option value="tkr">Teknik Kendaraan Ringan</option>
            </Select>
          </Field>
          <Field id="pesan" label="Pesan" hint="Min. 10 karakter">
            <Textarea id="pesan" placeholder="Tulis pesan..." />
          </Field>
        </div>
        <Field id="kk" label="Upload KK (opsional)" hint="JPG / PDF, maks 2MB">
          <Upload
            id="kk"
            accept=".jpg,.jpeg,.pdf"
            fileName={fileName}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            onClearFile={() => setFileName(null)}
          />
        </Field>
        <Field id="cari" label="Cari">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-text-secondary"
            />
            <Input id="cari" placeholder="Cari jurusan..." className="pl-10" role="searchbox" />
          </div>
        </Field>
      </Section>

      <Section title="Accordion & Dialog">
        <Accordion defaultValue="q1">
          <AccordionItem value="q1">
            <AccordionTrigger>Berapa biaya masuk SMK BBM?</AccordionTrigger>
            <AccordionContent>
              Biaya transparan sesuai SNP, lihat tabel di halaman PPDB. Tersedia cicilan dan
              beasiswa tahfidz/prestasi.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Apakah ada antar-jemput?</AccordionTrigger>
            <AccordionContent>
              Hubungi Humas via WA untuk info rute antar-jemput area Kandanghaur, Gabuswetan, dan
              Kroya.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <MessageCircle className="size-4" aria-hidden /> Buka dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Contoh Dialog</DialogTitle>
            <DialogDescription>
              Dialog aksesibel: Esc menutup, fokus ter-trap di dalam.
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Section Heading">
        <SectionHeading
          eyebrow="Program Keahlian"
          title="Jurusan Siap Kerja & Wirausaha"
          desc="Setiap jurusan dibekali keterampilan vokasi, kewirausahaan, dan bahasa Inggris."
          link={{ label: "Lihat semua", href: "/jurusan" }}
        />
        <SectionHeading
          align="left"
          eyebrow="Berita"
          title="Kabar Terbaru"
          link={{ label: "Arsip", href: "/berita" }}
        />
      </Section>

      <Section title="Card">
        <div className="grid gap-4 md:grid-cols-2">
          <JurusanCard
            slug="tkj"
            nama="Teknik Komputer Jaringan"
            coverUrl="/images/placeholder-jurusan.svg"
            skills={["Mikrotik", "Linux", "Cabling", "Server", "Cloud"]}
            prospek={["Teknisi NOC", "Admin jaringan", "Wirausaha IT"]}
            biayaSingkat="Rp 150rb/bln"
          />
          <BeritaCard
            slug="juara-futsal-2026"
            judul="Tim Futsal SMK BBM Juara 2 Tingkat Kabupaten 2026"
            tanggal="12 Jan 2026"
            kategori="Prestasi"
            coverUrl="/images/placeholder-berita.svg"
            excerpt="Pengawalan bakat olahraga sampai profesional berbuah prestasi..."
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            variant="compact"
            href="/berita/pengumuman-ppdb"
            eyebrow="Pengumuman • 10 Jan 2026"
            title="PPDB Gelombang 1 resmi dibuka"
          />
          <Card
            variant="horizontal"
            href="/jurusan/tkj"
            image="/images/placeholder-jurusan.svg"
            imageAlt="Jurusan TKJ"
            title="Hasil pencarian: Teknik Komputer"
            meta="3 Tahun • Vokasi"
          />
        </div>
      </Section>

      <Section title="States">
        <EmptyState
          icon={Megaphone}
          title="Belum ada berita terbaru"
          description="Ikuti info PPDB & kegiatan via WhatsApp sekolah agar tidak ketinggalan."
          ctaLabel="Hubungi via WA"
          ctaHref="https://wa.me/6281234567890"
          linkLabel="Lihat arsip berita →"
          linkHref="/berita"
        />
        <ErrorBanner message="Gagal memuat berita. Coba lagi." onRetry={() => {}} />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-3/5" />
          <Skeleton className="h-7 w-2/5" />
          <Skeleton className="h-11 w-40 rounded-md" />
          <Skeleton className="h-[200px] w-full rounded-md" />
        </div>
      </Section>
    </main>
  );
}
