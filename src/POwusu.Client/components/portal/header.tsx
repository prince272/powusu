"use client";

import { FC } from "react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { User } from "@nextui-org/user";

import { AcmeLogo } from "../icons";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { useUser } from "@/providers/user/client";

const Header: FC = () => {
  const { user: currentUser } = useUser();
  
  return (
    <Navbar className="shadow-md" classNames={{ wrapper: "max-w-[1400px]" }}>
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
                  name={currentUser!.fullName}
                  description="Product Designer"
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                  }}
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Example with disabled actions">
              <DropdownItem key="new">New file</DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export { Header };
