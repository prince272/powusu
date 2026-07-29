import { Card } from "@heroui/react";
import { ArrowDownToLine, ExternalLink, GraduationCap, Trophy } from "lucide-react";
import Image from "next/image";

import { siteConfig, type Certificate } from "@/config/site";

const categories: Certificate["category"][] = ["Education", "Technical", "Recognition", "Communication"];

export function CertificatesSection() {
  return (
    <section id="credentials" className="bg-[var(--surface-soft)] py-24 sm:py-32">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl"><p className="eyebrow mb-4">Credentials & growth</p><h2 className="display-title text-5xl sm:text-7xl">Proof of <span className="text-gradient">practice.</span></h2><p className="mt-6 text-lg leading-8 text-[var(--muted)]">A curated archive of formal study, hands-on learning, communication, and recognition — including my University of the People computer science certificate.</p></div>
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
  return (
    <Card variant="default" className="group overflow-hidden border-0 bg-[var(--surface)] shadow-none transition-transform duration-300 hover:-translate-y-1">
      <Card.Content className="p-0">
        {certificate.image ? <Image src={certificate.image} alt={`${certificate.title} certificate`} width={640} height={480} className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] w-full flex-col justify-between bg-[#201a2e] p-6 text-white"><span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-mint)]">{certificate.category} / {certificate.year}</span><div><div className="mb-3 size-9 rounded-xl bg-[var(--color-lilac)]/20 p-2 text-[var(--color-lilac)]"><GraduationCap size={20} /></div><p className="font-display text-2xl leading-tight">{certificate.issuer}</p></div></div>}
        <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h4 className="font-bold leading-5">{certificate.title}</h4><p className="mt-1 text-sm text-[var(--muted)]">{certificate.issuer} · {certificate.year}</p></div><span className="font-mono text-xs text-[var(--muted)]">PDF</span></div><div className="mt-5 flex gap-2"><a href={certificate.document} download className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-3 py-2.5 text-sm font-bold text-[var(--page)] transition-opacity hover:opacity-80"><ArrowDownToLine size={15} /> Download</a><a href={certificate.document} target="_blank" rel="noreferrer" aria-label={`Open ${certificate.title}`} className="grid size-10 place-items-center rounded-xl border border-[var(--line)] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"><ExternalLink size={15} /></a></div></div>
      </Card.Content>
    </Card>
  );
}
