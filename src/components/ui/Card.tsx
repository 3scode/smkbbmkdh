import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeTone } from "./Badge";

export type CardVariant = "default" | "compact" | "interactive" | "horizontal";

export interface CardProps {
  variant?: CardVariant;
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeTone?: BadgeTone;
  eyebrow?: string;
  title: string;
  desc?: string;
  meta?: ReactNode;
  actionLabel?: string;
  href: string;
  className?: string;
}

export function Card({
  variant = "default",
  image,
  imageAlt = "",
  badge,
  badgeTone = "primary",
  eyebrow,
  title,
  desc,
  meta,
  actionLabel = "Lihat detail",
  href,
  className,
}: CardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex flex-col gap-1 rounded-md border border-border bg-surface p-4 shadow-sm transition-all duration-250",
          "hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className,
        )}
      >
        {eyebrow && <span className="text-[13px] font-medium text-text-secondary">{eyebrow}</span>}
        <span className="font-semibold text-text-primary group-hover:underline">{title}</span>
        {meta && <span className="text-[13px] text-text-secondary">{meta}</span>}
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex gap-4 rounded-md border border-border bg-surface p-3 shadow-sm transition-all duration-250",
          "hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className,
        )}
      >
        {image && (
          <span className="relative block h-[90px] w-[120px] shrink-0 overflow-hidden rounded-md">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-250 group-hover:scale-105"
            />
          </span>
        )}
        <span className="flex min-w-0 flex-col gap-1">
          {eyebrow && (
            <span className="text-[13px] font-medium text-text-secondary">{eyebrow}</span>
          )}
          <span className="line-clamp-2 font-semibold text-text-primary group-hover:underline">
            {title}
          </span>
          {meta && <span className="text-[13px] text-text-secondary">{meta}</span>}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-all duration-250",
        "hover:-translate-y-1 hover:shadow-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "interactive" && "hover:shadow-lg",
        className,
      )}
    >
      {image && (
        <span className="relative block aspect-video w-full overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            loading="lazy"
            className="object-cover transition-transform duration-250 group-hover:scale-105"
          />
          {badge && (
            <span className="absolute top-3 left-3">
              <Badge tone={badgeTone}>{badge}</Badge>
            </span>
          )}
        </span>
      )}
      <span className="flex flex-1 flex-col gap-2 p-4">
        {eyebrow && <span className="text-[13px] font-medium text-text-secondary">{eyebrow}</span>}
        <span className="line-clamp-2 text-xl leading-snug font-semibold text-text-primary">
          {title}
        </span>
        {desc && <span className="line-clamp-2 text-text-secondary">{desc}</span>}
        {meta && <span className="text-[13px] text-text-secondary">{meta}</span>}
        <span className="mt-auto inline-flex min-h-[44px] items-center gap-1 pt-1 font-semibold text-primary">
          {actionLabel}
          <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}
