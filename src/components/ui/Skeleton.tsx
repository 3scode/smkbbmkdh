import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded bg-[#E2E8F0] motion-safe:animate-shimmer motion-safe:bg-[linear-gradient(90deg,#EFF2F5_25%,#E2E8F0_50%,#EFF2F5_75%)] motion-safe:bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
