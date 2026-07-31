import { Accordion } from "@heroui/react";

import { siteConfig } from "@/config/site";

export function FaqsSection() {
  return (
    <section id="faqs" className="section-shell grid gap-10 py-24 sm:py-32 lg:grid-cols-[0.7fr_1.3fr]">
      <div><p className="eyebrow mb-4">A few answers</p><h2 className="display-title text-5xl sm:text-6xl">The <span className="text-gradient text-gradient-animated">short version.</span></h2><p className="mt-6 max-w-sm leading-7 text-[var(--muted)]">The things teams usually want to know before we start building together.</p></div>
      <Accordion variant="surface" allowsMultipleExpanded className="w-full rounded-3xl bg-[var(--surface)] p-3">
        {siteConfig.faqs.map((faq) => <Accordion.Item key={faq.id} id={faq.id}><Accordion.Heading><Accordion.Trigger className="px-4 py-5 text-left font-bold">{faq.question}<Accordion.Indicator /></Accordion.Trigger></Accordion.Heading><Accordion.Panel><Accordion.Body className="px-4 pb-5 leading-7 text-[var(--muted)]">{faq.answer}</Accordion.Body></Accordion.Panel></Accordion.Item>)}
      </Accordion>
    </section>
  );
}
