"use client";

import { Icon as BaseIcon, IconifyIcon, IconifyIconProps } from "@iconify-icon/react";
import { useMemo } from "react";

const Icon = (props: Omit<IconifyIconProps, "ref">) => {
  const memoizedIcon = useMemo(() => {
    return props.icon;
  }, []);

  return <BaseIcon {...props} icon={memoizedIcon} observe={false} mode="svg" />;
};
export { Icon };
