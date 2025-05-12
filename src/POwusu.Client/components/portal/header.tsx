"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";

import { AccountButton } from "./identity/account-button";

const Header = () => {
  return (
    <Navbar position="static" classNames={{ wrapper: "container relative max-w-[1400px] flex flex-1 px-6 md:grid-cols-[256px_1fr]" }}>
      <NavbarBrand>
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
