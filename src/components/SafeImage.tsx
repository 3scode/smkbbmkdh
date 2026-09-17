"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** next/image anti layout-shift + fallback placeholder saat gambar rusak. */
export function SafeImage({
  src,
  alt,
  sizes,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-background-alt",
          className,
        )}
      >
        <ImageOff className="size-8 text-border" aria-hidden />
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      priority={eager}
      onError={() => setBroken(true)}
      className={cn("object-cover", className)}
    />
  );
}
