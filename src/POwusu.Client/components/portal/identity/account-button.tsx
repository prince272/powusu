"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useModalRouter } from "@/providers/modal-router";
import { useUser } from "@/providers/user/client";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import queryString from "query-string";

import { Icon } from "@/components/ui/icon";

import { SignOutModal } from "./sign-out-modal";

export const AccountButton = () => {
  const currentUser = useUser();
  const modalRouter = useModalRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  return (
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
          startContent={<Icon icon="solar:logout-2-bold" width="24" height="24" />}
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
  );
};
