"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";

import { AccountButton } from "../identity/account-button";
import { AppIcon } from "../ui/icon";

const Header = () => {
  return (
    <Navbar position="sticky" maxWidth="xl">
      <NavbarBrand>
        <AppIcon />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <AccountButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export { Header };
