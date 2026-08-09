"use client";

import { Button } from "@heroui/react";
import { ArrowUpRight, Clapperboard, Play } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export function AiVideoSection() {
  return (
    <section id="ai-video" className="section-shell py-24 sm:py-32">
      <div>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
          <p className="eyebrow mb-4">AI video creation</p>
          <h2 className="display-title text-5xl sm:text-7xl">Ideas, made <span className="text-gradient text-gradient-animated">watchable.</span></h2>
          <p className="mt-6 max-w-xl leading-7 text-[var(--muted)]">I use AI-assisted video workflows to turn creative concepts into short-form social content. From shaping an idea to refining the final edit, I focus on clear storytelling, atmosphere, and videos that earn attention quickly.</p>
          </div>
          <Button variant="primary" className="w-full shrink-0 sm:w-auto" onPress={() => window.open(siteConfig.links.tiktok, "_blank")}><Clapperboard size={18} /> Show more on TikTok <ArrowUpRight size={17} /></Button>
        </div>
        <div className="mt-12 grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {siteConfig.videoWork.map((video) => (
            <article key={video.id} className="w-full max-w-[380px] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-sm">
              <a href={video.href} target="_blank" rel="noreferrer" className="group relative block aspect-[9/16] overflow-hidden rounded-2xl bg-[#17151f]">
                <Image src={video.thumbnail} alt={`${video.title} TikTok video thumbnail`} fill sizes="(min-width: 1280px) 380px, (min-width: 640px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">TikTok video</span>
                <span className="absolute inset-0 grid place-items-center"><span className="grid size-14 place-items-center rounded-full bg-white/90 text-[#17151f] shadow-xl transition-transform duration-300 group-hover:scale-110"><Play size={23} fill="currentColor" /></span></span>
                <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white"><span className="font-display text-2xl tracking-[-0.04em]">{video.title}</span><ArrowUpRight size={20} /></span>
              </a>
              <a href={video.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 px-3 py-4 text-sm font-bold text-[var(--ink)] hover:text-[var(--color-coral)]">
                Watch on TikTok <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
