"use client";

import { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

import { title } from "@/components/primitives";

const AboutPage = () => {
  return (
    <div>
      <h1 className={title()}>About</h1>

      <Link as={NextLink} href="/portal" className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}>
        Portal
      </Link>
    </div>
  );
};

export default AboutPage;
