import "@/styles/globals.css";

import { ReactNode } from "react";
import { Link } from "@heroui/link";

import { PageLoader } from "@/components/ui/page-loader";
import { Header } from "@/components/profile/header";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex flex-col">
      <Header />
      {children}
      <footer className="flex w-full items-center justify-center py-3">
        <Link isExternal className="flex items-center gap-1 text-current" href="https://heroui.com" title="heroui.com homepage">
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
      <PageLoader timeout={100} />
    </div>
  );
};

export default HomeLayout;
