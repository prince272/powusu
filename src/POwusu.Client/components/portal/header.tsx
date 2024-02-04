"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/user/client";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { User } from "@nextui-org/user";
import queryString from "query-string";

import { useRouter } from "@/hooks/use-router";

import { AcmeLogo } from "../icons";
import { PersonArrowRightRegular, SettingsRegular } from "@fluentui/react-icons";

const Header = () => {
  const router = useRouter();
  const currentUser = useUser();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  return (
    <Navbar className="border-b-1 border-default-100" classNames={{ wrapper: "max-w-[1400px]" }}>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <Dropdown>
            <DropdownTrigger>
              <Button color="default" className="h-unit-2xl min-w-unit-6 px-2 sm:px-3" href="#" variant="light">
                <User
                  classNames={{ wrapper: "hidden sm:flex" }}
                  name={currentUser?.fullName}
                  description={currentUser?.title}
                  avatarProps={{
                    src: currentUser?.imageUrl,
                  }}
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User actions">
              <DropdownItem key="settings" startContent={<SettingsRegular fontSize={24} />} as={NextLink} href={queryString.stringifyUrl({ url: currentUrl, query: { modal: "settings", callback: currentUrl } })}>
                Settings
              </DropdownItem>
              <DropdownItem key="sign-out" startContent={<PersonArrowRightRegular fontSize={24} />} className="text-danger" color="danger" as={NextLink} href={queryString.stringifyUrl({ url: currentUrl }) + "#sign-out"}>
                Sign out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export { Header };
