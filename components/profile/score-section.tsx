import { Card } from "@heroui/react";

import { siteConfig } from "@/config/site";

export function ScoreSection() {
  return (
    <section className="border-b border-[var(--line)] py-6">
      <div className="section-shell grid grid-cols-1 divide-y divide-[var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {siteConfig.stats.map((stat) => (
          <Card key={stat.label} variant="transparent" className="rounded-none border-0 bg-transparent px-0 py-5 shadow-none sm:px-7 sm:first:pl-0">
            <Card.Content className="flex items-baseline gap-3">
              <span className="font-display text-4xl tracking-[-0.05em]">{stat.value}</span>
              <span className="text-sm text-[var(--muted)]">{stat.label}</span>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
