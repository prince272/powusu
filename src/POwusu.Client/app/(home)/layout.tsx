import "@/styles/globals.css";

import { FC } from "react";
import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/home/navbar";

const HomeLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">{children}</main>
      <footer className="flex w-full items-center justify-center py-3">
        <Link isExternal className="flex items-center gap-1 text-current" href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template" title="nextui.org homepage">
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p>
        </Link>
      </footer>
    </div>
  );
};

export default HomeLayout;
