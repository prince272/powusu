import { Header } from "@/components/portal/header";
import { Sidebar } from "@/components/portal/sidebar";

import "@/styles/globals.css";

import { FC } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/providers/user/server";

const PortalLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = getUser();
  
  if (!currentUser) {
    redirect("/#sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden pt-6">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
