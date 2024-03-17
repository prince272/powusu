"use client";

import { Icon as BaseIcon, IconifyIconProps } from "@iconify-icon/react";

function convertToCssSize(width: number | string | undefined | null, height: number | string | undefined | null): { width?: string; height?: string } {
  const parseValue = (value: number | string | undefined | null): string | undefined => {
    if (typeof value === "number") {
      return `${value}px`;
    }

    if (typeof value === "string") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        return `${numericValue}px`;
      }
    }

    return undefined;
  };

  const result: { width?: string; height?: string } = {};

  const parsedWidth = parseValue(width);
  const parsedHeight = parseValue(height);

  if (parsedWidth !== undefined) result.width = parsedWidth;

  if (parsedHeight !== undefined) result.height = parsedHeight;

  return result;
}

export const Icon = (props: Omit<IconifyIconProps, "ref">) => {
  const { width, height } = convertToCssSize(props.width, props.height);
  return <BaseIcon style={{ width, height }} observe={false} mode="svg" {...props} />;
};
