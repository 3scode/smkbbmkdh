import { Info } from "lucide-react";

/** Penanda jujur: halaman ini memakai data contoh untuk demo. */
export function DemoNotice({ text }: { text: string }) {
  return (
    <div
      role="note"
      aria-label="Pemberitahuan data demo"
      className="flex items-start gap-3 rounded-md border border-border bg-warning-bg p-4"
    >
      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-[#92400E]" />
      <p className="text-sm leading-relaxed text-[#92400E]">{text}</p>
    </div>
  );
}
