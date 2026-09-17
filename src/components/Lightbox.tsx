"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const total = items.length;
  const item = items[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => onIndex((index + dir + total) % total),
    [index, total, onIndex],
  );

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      // Focus trap sederhana
      if (e.key === "Tab") {
        const els = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
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
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  if (!item) return null;

  const btn =
    "flex size-11 shrink-0 items-center justify-center rounded-full bg-text-primary/60 text-white hover:bg-text-primary/80 focus-visible:outline-2 focus-visible:outline-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/80 p-0 animate-fade-in md:p-8"
      onClick={onClose}
      onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Foto ${index + 1} dari ${total}${item.caption ? `: ${item.caption}` : ""}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative flex h-full w-full flex-col bg-text-primary outline-none md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg",
          "motion-safe:animate-zoom-in",
        )}
      >
        <div className="relative flex-1 md:aspect-[16/10] md:flex-none">
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-3 bg-text-primary/70 p-4 text-white">
          <button type="button" aria-label="Foto sebelumnya" onClick={() => go(-1)} className={btn}>
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <p className="min-w-0 flex-1 text-center text-sm" aria-live="polite">
            <span className="font-semibold">
              Foto {index + 1} dari {total}
            </span>
            {item.caption && <span className="block truncate">{item.caption}</span>}
          </p>
          <button type="button" aria-label="Foto berikutnya" onClick={() => go(1)} className={btn}>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-text-primary/60 text-white hover:bg-text-primary/80 focus-visible:outline-2 focus-visible:outline-white"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
