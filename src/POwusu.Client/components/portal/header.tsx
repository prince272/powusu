"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModalRouter } from "@/providers/modal-router";
import { Link as NextLink } from "@/providers/navigation";
import { useUser } from "@/providers/user/client";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { User } from "@nextui-org/user";
import queryString from "query-string";

import { SignOutModal } from "../identity/sign-out-modal";
import { AppIcon } from "../ui/icon";

const Header = () => {
  const modalRouter = useModalRouter();

  const router = useRouter();
  const currentUser = useUser();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  return (
    <Navbar className="absolute" classNames={{ wrapper: "max-w-[1400px] px-3 md:px-6" }}>
      <NavbarBrand>
        <AppIcon />
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
                    src: currentUser?.imageUrl
                  }}
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User actions">
              <DropdownItem
                key="settings"
                startContent={<Icon icon="solar:settings-bold" width="24" height="24" />}
                as={NextLink}
                href={queryString.stringifyUrl({ url: currentUrl, query: { modal: "settings", callback: currentUrl } })}
              >
                Settings
              </DropdownItem>
              <DropdownItem
                key="sign-out"
                startContent={<Icon icon="solar:logout-2-bold" width="20" height="20" />}
                className="text-danger"
                color="danger"
                onPress={() => {
                  modalRouter.open({
                    key: "sign-out",
                    Component: SignOutModal
                  });
                }}
              >
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
