import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "primary" | "amber" | "info" | "outline" | "solid";

const toneStyles: Record<BadgeTone, string> = {
  success: "bg-[#DCFCE7] text-[#166534]",
  primary: "bg-primary-soft text-primary-hover",
  amber: "bg-warning-bg text-[#92400E]",
  info: "bg-[#E0F2FE] text-[#0C4A6E]",
  outline: "border border-border bg-surface text-text-secondary",
  solid: "bg-primary text-white",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  tone = "primary",
  size = "md",
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-[13px]",
        toneStyles[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
