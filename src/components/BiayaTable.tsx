import { formatIDR } from "@/lib/utils";

const LABELS: Record<string, string> = {
  pendaftaran: "Biaya pendaftaran",
  spp_bulanan: "SPP per bulan",
  seragam: "Seragam",
  kegiatan: "Kegiatan",
};

/** Tabel biaya transparan — desktop tabel, mobile stacked cards. */
export function BiayaTable({ biaya }: { biaya: Record<string, number> }) {
  const rows = Object.entries(biaya);
  if (rows.length === 0) {
    return (
      <p className="text-text-secondary">
        Rincian biaya menyusul — hubungi Humas via WhatsApp untuk info terbaru.
      </p>
    );
  }
  return (
    <div>
      <table className="hidden w-full border-collapse md:table">
        <caption className="sr-only">Rincian biaya PPDB</caption>
        <thead>
          <tr className="border-b border-border text-left text-sm text-text-secondary">
            <th scope="col" className="py-2 pr-4 font-medium">
              Komponen
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Nominal
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-border last:border-0">
              <th scope="row" className="py-3 pr-4 text-left font-normal text-text-primary">
                {LABELS[k] ?? k}
              </th>
              <td className="py-3 text-right font-bold tabular-nums text-text-primary">
                {formatIDR(v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="flex flex-col gap-2 md:hidden">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface p-3"
          >
            <dt className="text-text-primary">{LABELS[k] ?? k}</dt>
            <dd className="font-bold tabular-nums text-text-primary">{formatIDR(v)}</dd>
          </div>
        ))}
      </dl>
      <p className="pt-2 text-[13px] text-text-secondary">
        Tersedia cicilan + beasiswa tahfidz/prestasi seni-olahraga. Tanpa biaya siluman.
      </p>
    </div>
  );
}
