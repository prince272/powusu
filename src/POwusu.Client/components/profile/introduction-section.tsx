"use client";

import { Button } from "@heroui/react";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export function IntroductionSection() {
  const scrollToWork = () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="intro" className="relative overflow-hidden border-b border-[var(--line)] pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="pointer-events-none absolute -right-28 -top-36 size-[32rem] rounded-full bg-[var(--color-lilac)]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 left-1/3 size-[28rem] rounded-full bg-[var(--color-coral)]/15 blur-3xl" />
      <div className="section-shell relative grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="reveal max-w-4xl">
          <div className="mb-7 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2"><MapPin size={15} className="text-[var(--color-coral)]" /> {siteConfig.location}</span>
            <span className="rounded-full bg-[var(--color-mint)]/30 px-3 py-2 text-[var(--ink)]">{siteConfig.availability}</span>
          </div>
          <p className="eyebrow mb-5">Software engineer · product-minded builder</p>
          <h1 className="display-title max-w-4xl text-6xl sm:text-8xl lg:text-[9rem]">Building the <span className="text-gradient">useful</span> parts of the future.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">I design and ship full-stack products that turn complicated systems into simple, human experiences — from reliable APIs to interfaces people enjoy using.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onPress={scrollToWork}>See selected work <ArrowDown size={17} /></Button>
            <Button variant="outline" size="lg" onPress={() => window.open(siteConfig.cv, "_blank")}><Download size={17} /> Download CV</Button>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)]">LinkedIn <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="reveal relative mx-auto w-full max-w-sm lg:mb-3" style={{ animationDelay: "160ms" }}>
          <div className="dot-grid absolute -right-5 -top-5 size-28 rounded-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-2xl shadow-[var(--color-lilac)]/10">
            <Image src={siteConfig.profileImage} alt="Prince Owusu" width={640} height={800} priority className="aspect-[4/5] w-full rounded-[2rem] object-cover object-top" />
            <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-[#17151f]/80 p-4 text-white backdrop-blur-md">
              <div className="flex items-end justify-between gap-4"><span className="font-display text-2xl">PO / 01</span><span className="font-mono text-xs text-white/60">curious by default</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
