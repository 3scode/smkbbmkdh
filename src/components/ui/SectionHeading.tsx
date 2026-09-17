import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left" | "split";
  link?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
  link,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        align === "split" && "items-start text-left md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          align === "center" && "items-center",
          align === "split" && "max-w-xl",
        )}
      >
        <Badge tone="amber">{eyebrow}</Badge>
        <h2 className="text-2xl font-bold text-text-primary md:text-[30px] md:leading-[1.25]">
          {title}
        </h2>
        {desc && <p className="line-clamp-2 max-w-2xl text-text-secondary">{desc}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {link.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
