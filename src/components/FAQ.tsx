import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/Accordion";

export interface FaqItem {
  q: string;
  a: string;
}

/** FAQ generik (PPDB, Kontak, dll). */
export function FAQ({ items, idPrefix = "faq" }: { items: FaqItem[]; idPrefix?: string }) {
  return (
    <Accordion defaultValue={`${idPrefix}-0`}>
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`${idPrefix}-${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
