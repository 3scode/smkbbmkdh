"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfilContent } from "@/content";

const TABS = [
  { id: "visi", label: "Visi" },
  { id: "misi", label: "Misi" },
  { id: "tujuan", label: "Tujuan" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function fromHash(): TabId {
  if (typeof window === "undefined") return "visi";
  const h = window.location.hash.replace("#", "");
  return h === "misi" || h === "tujuan" ? h : "visi";
}

export function ProfilTabs({ content }: { content: ProfilContent }) {
  const [active, setActive] = useState<TabId>(() => fromHash());
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    visi: null,
    misi: null,
    tujuan: null,
  });

  useEffect(() => {
    const onHash = () => setActive(fromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const select = (id: TabId) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next !== null) {
      e.preventDefault();
      const tab = TABS[next]!;
      select(tab.id);
      tabRefs.current[tab.id]?.focus();
    }
  };

  return (
    <div>
      {/* Desktop: pill tabs */}
      <div
        role="tablist"
        aria-label="Visi, Misi, dan Tujuan"
        className="hidden justify-center gap-2 md:flex"
      >
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => select(t.id)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={cn(
              "h-11 min-w-[120px] rounded-full px-5 font-semibold transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active === t.id
                ? "bg-primary text-white shadow-sm"
                : "border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Desktop panels — semua konten tetap di DOM (SEO + no-JS) */}
      <div className="hidden pt-6 md:block">
        {TABS.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            hidden={active !== t.id}
          >
            <div
              key={`${t.id}-${active === t.id ? "on" : "off"}`}
              className={active === t.id ? "motion-safe:animate-fade-up" : undefined}
            >
              <PanelContent id={t.id} content={content} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: accordion (Visi terbuka default) */}
      <div className="flex flex-col gap-3 md:hidden">
        {TABS.map((t) => {
          const open = active === t.id;
          return (
            <div
              key={t.id}
              className="overflow-hidden rounded-md border border-border bg-surface shadow-sm"
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`acc-${t.id}`}
                  id={`acc-btn-${t.id}`}
                  onClick={() => {
                    if (!open) select(t.id);
                  }}
                  className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                >
                  {t.label}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-5 shrink-0 text-text-secondary transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                </button>
              </h3>
              <div
                id={`acc-${t.id}`}
                role="region"
                aria-labelledby={`acc-btn-${t.id}`}
                hidden={!open}
                className="px-4 pb-4"
              >
                <PanelContent id={t.id} content={content} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PanelContent({ id, content }: { id: TabId; content: ProfilContent }) {
  if (id === "visi") {
    return (
      <blockquote className="rounded-lg border-l-4 border-secondary bg-primary-soft px-6 py-8 text-center">
        <p className="mx-auto max-w-3xl text-lg font-medium text-text-primary italic md:text-xl">
          “{content.visi}”
        </p>
      </blockquote>
    );
  }
  if (id === "misi") {
    return (
      <ol className="grid gap-3 md:grid-cols-2">
        {content.misi.map((m, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-md border border-border bg-surface p-4 shadow-sm motion-safe:animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
            >
              {i + 1}
            </span>
            <p className="text-text-primary">
              <span className="sr-only">
                Misi {i + 1} dari {content.misi.length}:{" "}
              </span>
              {m}
            </p>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {content.tujuan.map((t, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-md border border-border bg-surface p-4 shadow-sm motion-safe:animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <CheckCircle2 aria-hidden className="size-6 shrink-0 text-success" />
          <p className="text-text-primary">
            <span className="sr-only">
              Tujuan {i + 1} dari {content.tujuan.length}:{" "}
            </span>
            {t}
          </p>
        </li>
      ))}
    </ul>
  );
}
