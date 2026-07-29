"use client";

import { Button, Card, Link as HeroLink } from "@heroui/react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";

export function ContactSection() {
  return (
    <section id="contact" className="section-shell py-24 sm:py-32">
      <Card variant="default" className="overflow-hidden border-0 bg-[var(--color-lilac)] shadow-none"><Card.Content className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end"><div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full bg-white/20 blur-3xl" /><div className="relative"><p className="eyebrow !text-[#17151f]/70">Start a conversation</p><h2 className="display-title mt-4 max-w-3xl text-5xl text-[#17151f] sm:text-7xl">Have a useful problem to solve?</h2><p className="mt-6 max-w-xl leading-7 text-[#17151f]/70">Tell me what you are building, what is stuck, or what could be better. I would love to hear the shape of it.</p></div><div className="relative flex flex-wrap gap-3"><Button variant="primary" onPress={() => window.location.href = siteConfig.links.email}><Mail size={16} /> Email me</Button><Button variant="outline" onPress={() => window.open(siteConfig.links.whatsapp, "_blank")}><MessageCircle size={16} /> WhatsApp</Button></div></Card.Content></Card>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--muted)]"><span>{siteConfig.location}</span><span className="hidden size-1 rounded-full bg-[var(--color-coral)] sm:block" /><HeroLink href={siteConfig.links.github} target="_blank" className="inline-flex items-center gap-1">GitHub <ArrowUpRight size={14} /></HeroLink><HeroLink href={siteConfig.links.linkedin} target="_blank" className="inline-flex items-center gap-1">LinkedIn <ArrowUpRight size={14} /></HeroLink><HeroLink href={siteConfig.links.twitter} target="_blank" className="inline-flex items-center gap-1">X / Twitter <ArrowUpRight size={14} /></HeroLink></div>
    </section>
  );
}
