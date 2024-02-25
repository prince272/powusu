import { Header } from "@/components/portal/header";
import { Sidebar } from "@/components/portal/sidebar";

import "@/styles/globals.css";

import { ReactNode } from "react";

const PortalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container relative grid flex-1 md:grid-cols-[256px_1fr] p-0">
        <Sidebar />
        <main className="relative pt-6 px-3 pb-6 md:px-6 md:pb-6 flex flex-col">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
