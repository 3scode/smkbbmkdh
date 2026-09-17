import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

const CTA_STYLES =
  "inline-flex h-11 items-center justify-center rounded-md bg-secondary px-5 text-[15px] font-semibold tracking-[0.2px] text-text-primary shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-secondary-hover hover:shadow-md active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  linkLabel,
  linkHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg bg-background-alt px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-[120px] items-center justify-center rounded-full bg-primary-soft">
        <Icon aria-hidden className="size-24 text-border" strokeWidth={1.5} />
      </span>
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="line-clamp-2 max-w-md text-text-secondary">{description}</p>
      {ctaLabel &&
        (onCtaClick || ctaHref) &&
        (onCtaClick ? (
          <button type="button" onClick={onCtaClick} className={CTA_STYLES}>
            {ctaLabel}
          </button>
        ) : (
          <Link href={ctaHref!} className={CTA_STYLES}>
            {ctaLabel}
          </Link>
        ))}
      {linkLabel && linkHref && (
        <Link
          href={linkHref}
          className="min-h-[44px] font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
