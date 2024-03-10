"use client";

import React from "react";
import { cn, withRef } from "@udecode/cn";
import { PlateLeaf } from "@udecode/plate-common";

export const CodeLeaf = withRef<typeof PlateLeaf>(({ className, children, ...props }, ref) => {
  return (
    <PlateLeaf ref={ref} asChild className={cn("bg-muted whitespace-pre-wrap rounded-md px-[0.3em] py-[0.2em] font-mono text-sm", className)} {...props}>
      <code>{children}</code>
    </PlateLeaf>
  );
});
