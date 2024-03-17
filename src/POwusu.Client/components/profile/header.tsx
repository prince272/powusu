"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useModalRouter } from "@/providers/modal-router";
import { useUser } from "@/providers/user/client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import queryString from "query-string";

import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";
import { Link as NextLink } from "@/components/ui/navigation";
import { Switch } from "@/components/ui/render";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { AccountButton } from "@/components/portal/identity/account-button";

export const Header = () => {
  const modalRouter = useModalRouter();
  const currentUser = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  return (
    <Navbar position="sticky" maxWidth="xl">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <p className="font-heading text-inherit">PRINCE</p>
          </NextLink>
        </NavbarBrand>
        <ul className="ml-2 hidden justify-start gap-4 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink className={clsx(linkStyles({ color: "foreground" }), "data-[active=true]:font-medium data-[active=true]:text-primary")} color="foreground" href={item.href}>
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
      <NavbarContent className="hidden basis-1/5 sm:flex sm:basis-full" justify="end">
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Switch switch={!!currentUser ? "authenticated" : "anonymous"}>
            <div key="authenticated">
              <AccountButton />
            </div>
            <div key="anonymous">
              <Button variant="solid" color="primary" as={NextLink} href={queryString.stringifyUrl({ url: currentUrl, query: { modal: "sign-in" } })}>
                Sign in
              </Button>
            </div>
          </Switch>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <Icon icon="mdi:github" className="text-default-500" width="24" height="24" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color={index === 2 ? "primary" : index === siteConfig.navItems.length - 1 ? "danger" : "foreground"} href="#" size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};
