import { Card } from "@heroui/react";
import { ArrowDownToLine, Award, Code2, ExternalLink, GraduationCap, MessagesSquare, Trophy } from "lucide-react";
import Image from "next/image";

import { siteConfig, type Certificate } from "@/config/site";

const categories: Certificate["category"][] = ["Education", "Technical", "Recognition", "Communication"];

const thumbnailStyles = {
  Education: { icon: GraduationCap, label: "Study archive", accent: "text-[#ffcf70]", glow: "bg-[#f6a95b]", panel: "bg-[#1e2f4d]", stamp: "LEARN" },
  Technical: { icon: Code2, label: "Practice log", accent: "text-[#8de4c4]", glow: "bg-[#4bbd9d]", panel: "bg-[#1b3a37]", stamp: "BUILD" },
  Recognition: { icon: Award, label: "Milestone", accent: "text-[#ff9d8e]", glow: "bg-[#e46f64]", panel: "bg-[#442238]", stamp: "MAKE" },
  Communication: { icon: MessagesSquare, label: "People skills", accent: "text-[#bca9ff]", glow: "bg-[#8e77e8]", panel: "bg-[#2c2550]", stamp: "CONNECT" }
} satisfies Record<Certificate["category"], { icon: typeof GraduationCap; label: string; accent: string; glow: string; panel: string; stamp: string }>;

export function CertificatesSection() {
  return (
    <section id="credentials" className="bg-[var(--surface-soft)] py-24 sm:py-32">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl"><p className="eyebrow mb-4">Credentials & growth</p><h2 className="display-title text-5xl sm:text-7xl">Proof of <span className="text-gradient text-gradient-animated">practice.</span></h2><p className="mt-6 text-lg leading-8 text-[var(--muted)]">A curated archive of formal study, hands-on learning, communication, and recognition, including my University of the People computer science certificate.</p></div>
        <div className="grid gap-12">
          {categories.map((category) => {
            const certificates = siteConfig.certificates.filter((certificate) => certificate.category === category);
            if (!certificates.length) return null;
            return <div key={category}><div className="mb-5 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-[var(--surface)] text-[var(--color-coral)]">{category === "Education" ? <GraduationCap size={18} /> : <Trophy size={18} />}</div><div><h3 className="font-display text-2xl tracking-[-0.04em]">{category}</h3><p className="text-sm text-[var(--muted)]">{certificates.length} documents</p></div></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{certificates.map((certificate) => <CertificateCard key={certificate.id} certificate={certificate} />)}</div></div>;
          })}
        </div>
      </div>
    </section>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const thumbnail = thumbnailStyles[certificate.category];
  const ThumbnailIcon = thumbnail.icon;
  const source = certificate.source ?? { href: certificate.document, label: "Open PDF" };

  return (
    <Card variant="default" className="group overflow-hidden border-0 bg-[var(--surface)] shadow-none transition-transform duration-300 hover:-translate-y-1">
      <Card.Content className="p-0">
        {certificate.image ? <Image src={certificate.image} alt={`${certificate.title} certificate`} width={640} height={480} className="aspect-[4/3] w-full object-cover" /> : <div className={`relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden p-6 text-white ${thumbnail.panel}`}>
          <div className={`pointer-events-none absolute -right-12 -top-14 size-44 rounded-full opacity-55 blur-2xl ${thumbnail.glow}`} />
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0%,transparent_47%,white_47.5%,transparent_48%,transparent_100%)] [background-size:24px_24px]" />
          <div className="relative flex items-start justify-between gap-3"><span className={`font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] ${thumbnail.accent}`}>{thumbnail.label}</span><span className="rounded-full border border-white/20 px-2 py-1 font-mono text-[0.58rem] tracking-[0.14em] text-white/70">{certificate.year}</span></div>
          <div className="relative flex items-end justify-between gap-4"><div><div className={`mb-3 grid size-10 place-items-center rounded-2xl border border-white/15 bg-white/10 ${thumbnail.accent}`}><ThumbnailIcon size={21} /></div><p className="max-w-[13rem] font-display text-2xl leading-tight tracking-[-0.04em]">{certificate.issuer}</p></div><span className="font-mono text-[0.6rem] font-bold tracking-[0.12em] text-white/45 [writing-mode:vertical-rl]">{thumbnail.stamp}</span></div>
        </div>}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div><h4 className="font-bold leading-5">{certificate.title}</h4><p className="mt-1 text-sm text-[var(--muted)]">{certificate.issuer} · {certificate.year}</p></div>
            <span className="font-mono text-xs text-[var(--muted)]">PDF</span>
          </div>
          <div className="mt-5 flex gap-2">
            <a href={certificate.document} download className="download-action inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-3 py-2.5 text-sm font-bold text-[var(--page)]"><ArrowDownToLine size={18} strokeWidth={2.4} /> Download</a>
            <a href={source.href} target="_blank" rel="noreferrer" aria-label={`${source.label}: ${certificate.title}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--color-lilac)] hover:bg-[var(--surface-soft)]">{source.label}<ExternalLink size={15} /></a>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
