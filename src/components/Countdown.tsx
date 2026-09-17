"use client";

import { useEffect, useState } from "react";

function parts(endDate: string) {
  const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
  return {
    hari: Math.floor(diff / 86_400_000),
    jam: Math.floor((diff / 3_600_000) % 24),
    menit: Math.floor((diff / 60_000) % 60),
    detik: Math.floor((diff / 1000) % 60),
  };
}

/** Countdown gelombang — flip tiap detik tanpa layout shift (tabular-nums). */
export function Countdown({ endDate, nama }: { endDate: string; nama: string }) {
  const [t, setT] = useState(() => parts(endDate));

  useEffect(() => {
    const id = setInterval(() => setT(parts(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  const cells = [
    { v: t.hari, l: "Hari" },
    { v: t.jam, l: "Jam" },
    { v: t.menit, l: "Menit" },
    { v: t.detik, l: "Detik" },
  ];

  return (
    <div aria-label={`Sisa waktu ${nama}`} className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-text-secondary">{nama} ditutup dalam:</p>
      <div className="flex gap-2" role="timer" aria-live="off">
        {cells.map((c) => (
          <span
            key={c.l}
            className="flex w-20 flex-col items-center rounded-md border border-border bg-surface px-2 py-3 shadow-sm"
          >
            <span className="text-2xl font-bold tabular-nums text-primary">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="text-xs text-text-secondary">{c.l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
