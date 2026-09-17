"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimoni {
  nama: string;
  angkatan?: string | null;
  statusText?: string | null;
  quote: string;
}

export function TestimoniCarousel({ items }: { items: Testimoni[] }) {
  const [index, setIndex] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  if (items.length === 0) return null;

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + items.length) % items.length);
  const item = items[index]!;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimoni alumni"
      className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8"
      onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
    >
      <Quote className="size-8 text-secondary" aria-hidden />
      <blockquote className="max-w-2xl text-center text-lg text-text-primary">
        “{item.quote}”
      </blockquote>
      <p aria-live="polite" className="text-center text-[15px] font-semibold text-text-primary">
        {item.nama}
        {item.angkatan ? ` • Angkatan ${item.angkatan}` : ""}
        {item.statusText ? (
          <span className="block text-sm font-normal text-text-secondary">{item.statusText}</span>
        ) : null}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Testimoni sebelumnya"
          onClick={() => go(-1)}
          className="flex size-11 items-center justify-center rounded-full border border-border hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Pilih testimoni">
          {items.map((t, i) => (
            <button
              key={`${t.nama}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimoni ${i + 1} dari ${items.length}: ${t.nama}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-text-secondary",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Testimoni berikutnya"
          onClick={() => go(1)}
          className="flex size-11 items-center justify-center rounded-full border border-border hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
