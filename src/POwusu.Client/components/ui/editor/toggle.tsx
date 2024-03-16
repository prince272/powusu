"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn, withVariants } from "@udecode/cn";
import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    "[&_svg:not([data-icon])]:size-5"
  ),
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-default-200 hover:text-default-600 data-[state=on]:bg-default-200 data-[state=on]:text-default-600",
        outline: "border border-default-200 bg-transparent hover:bg-default-200 hover:text-default-600",
        floating: "rounded-full bg-primary text-primary-foreground"
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2",
        lg: "h-11 px-5",
        circle: "p-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export const Toggle = withVariants(TogglePrimitive.Root, toggleVariants, ["size", "variant"]);
