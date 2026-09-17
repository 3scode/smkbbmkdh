"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "./ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function keluar() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* abaikan — cookie dihapus sisi server bila memungkinkan */
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={keluar}
      loading={loading}
      icon={<LogOut className="size-4" aria-hidden />}
    >
      Keluar
    </Button>
  );
}
