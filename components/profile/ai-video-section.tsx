"use client";

import { Button } from "@heroui/react";
import { ArrowUpRight, Clapperboard } from "lucide-react";

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
              <iframe
                src={`https://www.tiktok.com/embed/v2/${video.tiktokId}`}
                title={video.title}
                className="h-[590px] w-full rounded-2xl border-0"
                loading="lazy"
                allow="encrypted-media; fullscreen"
              />
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
