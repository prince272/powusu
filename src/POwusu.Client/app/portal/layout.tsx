import { Header } from "@/components/portal/header";
import { Sidebar } from "@/components/portal/sidebar";

import "@/styles/globals.css";

import { FC } from "react";

import { Loader } from "@/components/ui/loader";

const PortalLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container relative grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden pt-6">{children}</main>
        <Loader />
      </div>
    </div>
  );
};

export default PortalLayout;
