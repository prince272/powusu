import { Header } from "@/components/portal/header";
import { Sidebar } from "@/components/portal/sidebar";

import "@/styles/globals.css";

import { ReactNode } from "react";

const PortalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container relative grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden pt-6 relative">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
