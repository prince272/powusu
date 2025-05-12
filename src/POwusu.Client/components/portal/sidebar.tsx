"use client";

import { usePathname } from "next/navigation";
import SolarBoxBold from "@iconify/icons-solar/box-bold";
import SolarDocumentTextBold from "@iconify/icons-solar/document-text-bold";
import SolarNotebookBookmarkBold from "@iconify/icons-solar/notebook-bookmark-bold";
import { Button } from "@heroui/button";

import { Icon } from "@/components/ui/icon";
import { Link as NextLink } from "@/components/ui/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="relative hidden h-full flex-col px-6 pt-6 md:flex">
      <div className="fixed min-w-[200px]">
        <div className="grid h-full w-full items-start gap-x-2 gap-y-3">
          {[
            { label: <>Posts</>, href: "/portal/posts", icon: <Icon icon={SolarDocumentTextBold} width="24" height="24" /> },
            { label: <>Courses</>, href: "/portal/courses", icon: <Icon icon={SolarNotebookBookmarkBold} width="24" height="24" /> },
            { label: <>Products</>, href: "/portal/products", icon: <Icon icon={SolarBoxBold} width="24" height="24" /> }
          ].map((item) => (
            <Button
              key={item.href}
              as={NextLink}
              href={item.href}
              variant={item.href.startsWith(pathname) ? "flat" : "light"}
              color={item.href.startsWith(pathname) ? "primary" : "default"}
              className="justify-start"
              startContent={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
