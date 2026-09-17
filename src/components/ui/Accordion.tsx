"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  className,
  ...props
}: Omit<AccordionPrimitive.AccordionSingleProps, "type">) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

export function AccordionItem({ className, ...props }: AccordionPrimitive.AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "overflow-hidden rounded-md border border-border bg-surface shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex min-h-[48px] flex-1 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-semibold text-text-primary",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-text-secondary transition-transform duration-250 [[data-state=open]>&]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("px-4 pb-4 text-text-secondary", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
