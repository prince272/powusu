import type { ReactNode } from "react";

import { Header } from "@/components/profile/header";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      {children}
      <footer className="border-t border-[var(--line)] py-8">
        <div className="section-shell flex flex-col justify-between gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Prince Owusu</span>
          <span>Built with curiosity, care, and HeroUI v3.</span>
        </div>
      </footer>
    </div>
  );
}
