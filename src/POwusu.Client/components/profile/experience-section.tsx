import { Card } from "@heroui/react";
import { ArrowUpRight, CheckCircle2, Code2, GitPullRequest } from "lucide-react";

import { siteConfig } from "@/config/site";

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-[var(--surface-soft)] py-24 sm:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">Experience</p>
          <h2 className="display-title text-5xl sm:text-7xl">Work that <span className="text-gradient text-gradient-animated">ships.</span></h2>
          <p className="mt-6 max-w-sm leading-7 text-[var(--muted)]">From dependable internal systems to open-source mobile UI, I focus on the details that make software feel reliable in real use.</p>
        </div>
        <div className="grid gap-5">
          {siteConfig.experience.map((item, index) => (
            <Card key={item.id} variant="default" className="border border-[var(--line)] bg-[var(--surface)] shadow-none">
              <Card.Content className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--surface-soft)] text-[var(--color-lilac)]">{index === 0 ? <Code2 size={20} /> : <GitPullRequest size={20} />}</span><div><p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[var(--color-coral)]">{item.kind}</p><h3 className="mt-2 font-display text-3xl tracking-[-0.04em] text-[var(--ink)]">{item.role}</h3><p className="mt-1 font-medium text-[var(--muted)]">{item.organization}</p></div></div>
                  <span className="shrink-0 rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-xs text-[var(--muted)]">{item.period}</span>
                </div>
                <p className="mt-6 max-w-2xl leading-7 text-[var(--muted)]">{item.summary}</p>
                <ul className="mt-6 grid gap-3 text-sm leading-6 text-[var(--muted)]">{item.highlights.map((highlight) => <li key={highlight} className="flex gap-3"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[var(--color-mint)]" /><span>{highlight}</span></li>)}</ul>
                {item.links && <div className="mt-7 flex flex-wrap gap-3">{item.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--color-lilac)] hover:bg-[var(--surface-soft)]">{link.label}<ArrowUpRight size={15} /></a>)}</div>}
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
