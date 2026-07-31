"use client";

import { Button, Card, Link as HeroLink } from "@heroui/react";
import { ArrowUpRight, Briefcase, GitFork, Mail, MessageCircle, MessagesSquare } from "lucide-react";

import { siteConfig } from "@/config/site";

export function ContactSection() {
  const socialLinks = [
    { label: "GitHub", note: "See my code", href: siteConfig.links.github, icon: GitFork, accent: "text-[#b9a6ff]" },
    { label: "LinkedIn", note: "Connect professionally", href: siteConfig.links.linkedin, icon: Briefcase, accent: "text-[#72b7ff]" },
    { label: "X / Twitter", note: "Follow updates", href: siteConfig.links.twitter, icon: MessagesSquare, accent: "text-[var(--color-coral)]" }
  ];

  return (
    <section id="contact" className="section-shell py-24 sm:py-32">
      <Card variant="default" className="overflow-hidden border-0 bg-[var(--color-lilac)] shadow-none"><Card.Content className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end"><div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full bg-white/20 blur-3xl" /><div className="relative"><p className="eyebrow !text-[#17151f]/70">Start a conversation</p><h2 className="display-title mt-4 max-w-3xl text-5xl text-[#17151f] sm:text-7xl">Have a useful problem to solve?</h2><p className="mt-6 max-w-xl leading-7 text-[#17151f]/70">Tell me what you are building, what is stuck, or what could be better. I would love to hear the shape of it.</p></div><div className="relative flex flex-wrap gap-3"><Button variant="primary" onPress={() => window.location.href = siteConfig.links.email}><Mail size={16} /> Email me</Button><Button variant="primary" className="border-[#25D366] bg-[#25D366] text-[#102016] hover:border-[#1fba57] hover:bg-[#1fba57]" onPress={() => window.open(siteConfig.links.whatsapp, "_blank")}><MessageCircle size={16} /> WhatsApp</Button></div></Card.Content></Card>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">{socialLinks.map((social) => { const Icon = social.icon; return <HeroLink key={social.label} href={social.href} target="_blank" className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-lilac)] hover:shadow-lg"><span className={`grid size-10 place-items-center rounded-xl bg-[var(--surface-soft)] ${social.accent}`}><Icon size={19} /></span><span className="min-w-0 flex-1"><span className="block font-bold text-[var(--ink)]">{social.label}</span><span className="block text-xs text-[var(--muted)]">{social.note}</span></span><ArrowUpRight size={16} className="text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></HeroLink>; })}</div>
      <p className="mt-5 text-sm text-[var(--muted)]">Based in {siteConfig.location} · Available for thoughtful collaborations.</p>
    </section>
  );
}
