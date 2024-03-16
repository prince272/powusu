import { Header } from "@/components/portal/header";
import { Sidebar } from "@/components/portal/sidebar";

import "@/styles/globals.css";

import { ReactNode } from "react";

const PortalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container max-w-[1400px] relative grid flex-1 p-0 md:grid-cols-[256px_1fr]">
        <Sidebar />
        <main className="relative flex flex-col px-6 pb-6 pt-6 md:px-6 md:pb-6">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
