"use client";

import { Metadata } from "next";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { Link as NextLink } from "@/components/ui/navigation";
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
