"use client";

import { useState } from "react";
import { Button, Link as HeroLink } from "@heroui/react";
import { ArrowUpRight, Download, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--page)]/80 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid size-9 place-items-center rounded-full bg-[var(--ink)] font-display text-sm text-[var(--page)]">PO</span>
          <span className="font-display text-lg tracking-[-0.04em]">Prince Owusu</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {siteConfig.navItems.map((item) => <HeroLink key={item.href} href={item.href} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{item.label}</HeroLink>)}
        </div>
        <div className="flex items-center gap-2">
          <Button isIconOnly variant="ghost" aria-label="Toggle colour theme" onPress={toggleTheme}>
            <Moon size={18} className="dark:hidden" />
            <Sun size={18} className="hidden dark:block" />
          </Button>
          <Button className="hidden sm:inline-flex" variant="primary" onPress={() => window.open(siteConfig.cv, "_blank")}>
            <Download size={16} /> CV
          </Button>
          <Button isIconOnly variant="ghost" className="md:hidden" aria-label={isOpen ? "Close navigation" : "Open navigation"} onPress={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="section-shell border-t border-[var(--line)] py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => <HeroLink key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-lg" onClick={() => setIsOpen(false)}>{item.label}</HeroLink>)}
            <HeroLink href={siteConfig.links.linkedin} target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-3 text-lg" onClick={() => setIsOpen(false)}>LinkedIn <ArrowUpRight size={17} /></HeroLink>
          </div>
        </div>
      )}
    </nav>
  );
}
