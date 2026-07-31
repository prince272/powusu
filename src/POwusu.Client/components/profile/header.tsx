"use client";

import { useEffect, useState } from "react";
import { Button, Link as HeroLink } from "@heroui/react";
import { ArrowUpRight, Download, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 20);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${isScrolled ? "border-[var(--line)] bg-[var(--page)]/90 shadow-sm shadow-black/5 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
      <div className={`section-shell flex items-center justify-between gap-3 transition-[height] duration-300 sm:gap-6 ${isScrolled ? "h-16" : "h-20"}`}>
        <Link href="/" className="group flex items-center gap-2 sm:gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid size-9 place-items-center rounded-full bg-[var(--ink)] font-display text-sm text-[var(--page)]">PO</span>
          <span className="font-display text-lg tracking-[-0.04em] max-[420px]:hidden">Prince Owusu</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {siteConfig.navItems.map((item) => <HeroLink key={item.href} href={item.href} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{item.label}</HeroLink>)}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button isIconOnly variant="ghost" aria-label="Toggle colour theme" onPress={toggleTheme}>
            <Moon size={18} className="dark:hidden" />
            <Sun size={18} className="hidden dark:block" />
          </Button>
          <Button className="download-action inline-flex whitespace-nowrap" variant="primary" onPress={() => window.open(siteConfig.cv, "_blank")}>
            <Download size={19} strokeWidth={2.4} /> Download CV
          </Button>
          <Button isIconOnly variant="ghost" className="lg:hidden" aria-label={isOpen ? "Close navigation" : "Open navigation"} onPress={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="section-shell border-t border-[var(--line)] py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => <HeroLink key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-lg" onClick={() => setIsOpen(false)}>{item.label}</HeroLink>)}
            <HeroLink href={siteConfig.links.linkedin} target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-3 text-lg" onClick={() => setIsOpen(false)}>LinkedIn <ArrowUpRight size={17} /></HeroLink>
          </div>
        </div>
      )}
    </nav>
  );
}
