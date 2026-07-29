"use client";

import { Button, Card } from "@heroui/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export function WorksSection() {
  return (
    <section id="work" className="bg-[var(--surface-soft)] py-24 sm:py-32">
      <div className="section-shell">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow mb-4">Selected work</p><h2 className="display-title text-5xl sm:text-7xl">Projects with a <span className="text-gradient">purpose.</span></h2></div>
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)]">More on GitHub <ArrowUpRight size={15} /></a>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {siteConfig.works.map((work, index) => (
            <Card key={work.id} variant="default" className="group overflow-hidden border-0 bg-[var(--surface)] shadow-none transition-transform duration-300 hover:-translate-y-1">
              <Card.Content className="p-0">
                <div className="relative overflow-hidden bg-[#15121d]">
                  <Image src={work.defaultImage} alt={`${work.title} project preview`} width={960} height={540} className="aspect-[16/9] w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="absolute left-5 top-5 rounded-full bg-[#17151f]/80 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white backdrop-blur">0{index + 1} / {work.category}</div>
                  <Image src={work.logo} alt="" width={56} height={56} className="absolute bottom-4 right-5 size-14 rounded-2xl border-4 border-white object-contain shadow-xl" />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-coral)]">{work.name}</p><h3 className="mt-2 font-display text-3xl tracking-[-0.04em]">{work.title}</h3></div><ExternalLink size={18} className="mt-1 text-[var(--muted)]" /></div>
                  <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{work.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">{work.stack.map((item) => <span key={item} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--muted)]">{item}</span>)}</div>
                  <Button variant="outline" className="mt-7" onPress={() => window.open(work.link, "_blank")}><ExternalLink size={16} /> View project</Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
