import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site";

export function AboutSection() {
  return (
    <section id="about" className="section-shell grid gap-10 py-24 md:grid-cols-[0.7fr_1.3fr] md:py-32">
      <div><p className="eyebrow">A little context</p><p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">A full-stack engineer with a bias for clarity, useful defaults, and work that lasts.</p></div>
      <div>
        <h2 className="display-title max-w-3xl text-4xl sm:text-6xl">I like the space where <span className="text-gradient text-gradient-animated">strong engineering meets a thoughtful point of view.</span></h2>
        <div className="mt-8 grid gap-6 text-base leading-7 text-[var(--muted)] sm:grid-cols-2">
          <p>My work moves between backend architecture, polished web products, and cross-platform mobile apps. I enjoy making the invisible parts, such as data, APIs, auth, and testing, feel as considered as the interface, whether it ships to the browser, Android, or iOS.</p>
          <p>I am always looking for the next useful question: what can be simpler, more reliable, or more delightful for the person on the other side?</p>
        </div>
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-bold text-[var(--ink)] underline decoration-[var(--color-lilac)] decoration-2 underline-offset-4">Explore my GitHub <ArrowUpRight size={16} /></a>
      </div>
    </section>
  );
}
