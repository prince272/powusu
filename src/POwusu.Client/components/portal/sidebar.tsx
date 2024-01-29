"use client";

import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { CubeRegular, DocumentTextRegular, HatGraduationRegular } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";

const SidebarWrapper = ({ children } : { children: React.ReactNode }) => {
  return (
    <div className="relative hidden h-full flex-col pt-6 md:flex">
      <div className="fixed w-[200px]">{children}</div>
    </div>
  );
};

const Sidebar = () => {
  const segment = useSelectedLayoutSegment() ?? "";
  return (
    <SidebarWrapper>
      <div className="grid h-full w-full items-start gap-x-2 gap-y-3">
        {[
          { label: <>Posts</>, href: "posts", icon: <DocumentTextRegular fontSize={24} /> },
          { label: <>Courses</>, href: "courses", icon: <HatGraduationRegular fontSize={24} /> },
          { label: <>Products</>, href: "products", icon: <CubeRegular fontSize={24} /> }
        ].map((item) => (
          <Button
            key={item.href}
            as={NextLink}
            href={item.href}
            variant={item.href.startsWith(segment) ? "flat" : "light"}
            color={item.href.startsWith(segment) ? "primary" : "default"}
            className="justify-start"
            startContent={item.icon}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </SidebarWrapper>
  );
};

export { Sidebar, SidebarWrapper };
