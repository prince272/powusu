"use client";

import { SVGProps } from "react";
import { Icon as BaseIcon, IconifyIconProps } from "@iconify-icon/react";

const Icon = (props: Omit<IconifyIconProps, "ref">) => <BaseIcon {...props} observe={false} />;
export { Icon };

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
