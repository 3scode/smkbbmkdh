import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({
  message = "Gagal memuat data. Coba lagi.",
  onRetry,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-md border border-error/30 bg-[#FEF2F2] p-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-error">
        <AlertTriangle className="size-5 shrink-0" aria-hidden />
        {message}
      </span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="sm:ml-auto">
          Coba lagi
        </Button>
      )}
    </div>
  );
}
