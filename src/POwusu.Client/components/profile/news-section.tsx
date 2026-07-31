import { Card } from "@heroui/react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export function NewsSection() {
  return (
    <section id="news" className="section-shell py-24 sm:py-32">
      <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="eyebrow mb-4">From the journal</p><h2 className="display-title text-5xl sm:text-7xl">Latest <span className="text-gradient text-gradient-animated">news.</span></h2></div>
        <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">A short record of the projects, ideas, and milestones shaping my work.</p>
      </div>
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        {siteConfig.news.map((post) => (
          <a key={post.id} href={post.link} target="_blank" rel="noreferrer" aria-label={`Read ${post.title}`} className="group block h-full">
          <Card variant="default" className="h-full cursor-pointer overflow-hidden border border-[var(--line)] bg-[var(--surface)] shadow-none transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-lilac)] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[var(--page)]">
            <Card.Content className="flex h-full flex-col p-0">
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-soft)]">
                <Image src={post.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17151f]/50 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-[#17151f]/80 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white backdrop-blur">{post.tag}</span>
              </div>
              <article className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[var(--color-coral)]"><Clock3 size={14} /> {post.date}</div>
                <h3 className="mt-5 font-display text-3xl leading-[0.98] tracking-[-0.045em] text-[var(--ink)] sm:text-4xl">{post.title}</h3>
                <p className="mt-4 leading-7 text-[var(--muted)]">{post.description}</p>
                <div className="mt-6 flex items-center justify-between gap-3"><span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)]">Source: {post.source}</span><span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--ink)] underline decoration-[var(--color-lilac)] decoration-2 underline-offset-4">{post.linkLabel}<ArrowUpRight size={15} /></span></div>
              </article>
            </Card.Content>
          </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
