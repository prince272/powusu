import { Card, Tooltip } from "@heroui/react";
import { ArrowUpRight, Braces, Database, GitBranch, Layers3, Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";

const accentClass = { lilac: "bg-[var(--color-lilac)]", coral: "bg-[var(--color-coral)]", mint: "bg-[var(--color-mint)]" };

export function SkillsSection() {
  return (
    <section id="skills" className="section-shell py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start"><p className="eyebrow mb-4">The toolkit</p><h2 className="display-title text-5xl sm:text-7xl">Skills, with <span className="text-gradient">range.</span></h2><p className="mt-6 max-w-sm leading-7 text-[var(--muted)]">A balance of product thinking and engineering depth — the combination I bring to every build.</p><a href={siteConfig.cv} target="_blank" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--ink)] underline decoration-[var(--color-coral)] decoration-2 underline-offset-4">See the full toolkit <ArrowUpRight size={15} /></a></div>
        <div className="grid gap-5">
          {siteConfig.skillGroups.map((group, index) => (
            <Card key={group.name} variant="secondary" className="border-0 bg-[var(--surface-soft)] shadow-none">
              <Card.Content className="p-6 sm:p-8">
                <div className="mb-8 flex items-start gap-4"><div className="grid size-11 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--color-lilac)]">{index === 0 ? <Layers3 size={20} /> : index === 1 ? <Database size={20} /> : <GitBranch size={20} />}</div><div><h3 className="font-display text-2xl tracking-[-0.04em]">{group.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{group.note}</p></div></div>
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {group.skills.map((skill) => (
                    <Tooltip key={skill.name} delay={0}>
                      <Tooltip.Trigger className="block w-full cursor-help"><div className="flex items-center justify-between gap-3 text-sm font-bold"><span>{skill.name}</span><span className="font-mono text-xs text-[var(--muted)]">{skill.level}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface)]"><div className={`h-full rounded-full ${accentClass[skill.accent]}`} style={{ width: `${skill.level}%` }} /></div></Tooltip.Trigger>
                      <Tooltip.Content><Tooltip.Arrow /><p>{skill.name} — working proficiency</p></Tooltip.Content>
                    </Tooltip>
                  ))}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3"><Card variant="transparent" className="border border-[var(--line)] bg-transparent shadow-none"><Card.Content className="flex items-center gap-3 p-5"><Braces className="text-[var(--color-coral)]" /><span className="text-sm text-[var(--muted)]">API-first thinking</span></Card.Content></Card><Card variant="transparent" className="border border-[var(--line)] bg-transparent shadow-none"><Card.Content className="flex items-center gap-3 p-5"><Sparkles className="text-[var(--color-lilac)]" /><span className="text-sm text-[var(--muted)]">Accessible by default</span></Card.Content></Card><Card variant="transparent" className="border border-[var(--line)] bg-transparent shadow-none"><Card.Content className="flex items-center gap-3 p-5"><GitBranch className="text-[var(--color-mint)]" /><span className="text-sm text-[var(--muted)]">Iterate in the open</span></Card.Content></Card></div>
    </section>
  );
}
