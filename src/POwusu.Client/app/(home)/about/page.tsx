"use client";

import { FC } from "react";
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { title } from "@/components/primitives";
import { Metadata } from "next";

const AboutPage: FC = () => {
  return (
    <div>
      <h1 className={title()}>About</h1>

      <Link as={NextLink} href="/portal/posts" className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}>
        Portal
      </Link>
    </div>
  );
};

export default AboutPage;
