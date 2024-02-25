import { Link as NextLink } from "@/providers/navigation";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Navbar } from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/ui/theme-switch";

import { AppIcon, Icon } from "../ui/icon";

export const Header = () => {
  return (
    <Navbar position="sticky" maxWidth="xl">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <AppIcon />
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
          <Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
            <Icon icon="ri:twitter-x-fill" className="text-default-500" width={24} height={24} />
          </Link>
          <Link isExternal href={siteConfig.links.discord} aria-label="Discord">
            <Icon icon="ic:outline-discord" className="text-default-500" width={24} height={24} />
          </Link>
          <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <Icon icon="mdi:github" className="text-default-500" width={24} height={24} />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="bg-default-100 text-sm font-normal text-default-600"
            href={siteConfig.links.sponsor}
            startContent={<Icon icon="solar:heart-bold" className="text-danger" width={24} height={24} />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <Icon icon="mdi:github" className="text-default-500" width={24} height={24} />
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
