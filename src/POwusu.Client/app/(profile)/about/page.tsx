"use client";

import { Button } from "@heroui/react";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <main className="section-shell py-28">
      <p className="eyebrow mb-4">About the engineer</p>
      <h1 className="display-title max-w-3xl text-6xl sm:text-8xl">Good software is useful before it is impressive.</h1>
      <div className="mt-10 grid gap-8 text-lg leading-8 text-[var(--muted)] md:grid-cols-[1.5fr_1fr]">
        <p>I am Prince Owusu, a Ghana-based software engineer who enjoys turning complex requirements into dependable, approachable products. I care about the details users feel: clear flows, quick feedback, and interfaces that do not get in the way.</p>
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--ink)]">Currently open to</span>
          <span>{siteConfig.availability}</span>
          <Button variant="primary" onPress={() => window.open(siteConfig.cv, "_blank")}>
            <Download size={16} /> Download CV
          </Button>
        </div>
      </div>
      <Link href="/" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--ink)] underline decoration-[var(--color-coral)] decoration-2 underline-offset-4">
        <ArrowLeft size={16} /> Back to the profile
      </Link>
    </main>
  );
}
