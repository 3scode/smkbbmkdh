"use client";

import { useEffect, useRef, useState } from "react";

export interface StatsCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function StatsCounter({ value, suffix = "", label }: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [display, setDisplay] = useState(() => (reduceMotion ? value : 0));
  const [done, setDone] = useState(() => reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - p) ** 3;
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, reduceMotion]);

  const formatted = new Intl.NumberFormat("id-ID").format(display);
  return (
    <span ref={ref} suppressHydrationWarning>
      <span aria-hidden={done ? undefined : true}>
        {formatted}
        {suffix}
      </span>
      <span className="sr-only">
        {new Intl.NumberFormat("id-ID").format(value)}
        {suffix} {label}
      </span>
    </span>
  );
}
