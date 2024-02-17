"use client";

import { Link as NextLink } from "@/providers/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Icon } from "@iconify/react";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="relative hidden h-full flex-col pt-6 px-6 md:flex">
      <div className="fixed min-w-[200px]">
        <div className="grid h-full w-full items-start gap-x-2 gap-y-3">
          {[
            { label: <>Posts</>, href: "/portal/posts", icon: <Icon icon="solar:document-text-bold" width="24" height="24" /> },
            { label: <>Courses</>, href: "/portal/courses", icon: <Icon icon="solar:notebook-bookmark-bold" width="24" height="24" /> },
            { label: <>Products</>, href: "/portal/products", icon: <Icon icon="solar:box-bold" width="24" height="24" /> }
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
