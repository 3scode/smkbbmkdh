"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/** Toast offline + auto-hilang saat online lagi. */
export function OfflineNote() {
  const [online, setOnline] = useState(
    () => typeof window === "undefined" || navigator.onLine,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return null;
  return (
    <p
      role="status"
      className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-secondary shadow-sm"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden />
      Kamu sedang offline — menampilkan data terakhir yang tersimpan.
    </p>
  );
}
