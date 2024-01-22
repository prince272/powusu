import { FC } from "react";
import { Metadata } from "next";

import { title } from "@/components/primitives";

export const metadata: Metadata = {
  title: "About"
};

const AboutPage: FC = () => {
  return (
    <div>
      <h1 className={title()}>About</h1>
    </div>
  );
};

export default AboutPage;
