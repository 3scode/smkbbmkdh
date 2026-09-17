"use client";

import { useEffect, useState } from "react";

/** Status koneksi browser (online/offline) dengan auto-update. */
export function useOnline(): boolean {
  const [online, setOnline] = useState(() => typeof window === "undefined" || navigator.onLine);

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

  return online;
}
