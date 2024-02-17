"use clinet";

import { ReactNode } from "react";
import { cn } from "@/utils";
import { SlotsToClasses } from "@nextui-org/theme";

export interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export type ShellHeaderSlots = "heading" | "description";

const Shell = ({ children, className, ...props }: ShellProps) => {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  );
};

interface ShellHeaderProps {
  heading: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: React.ReactNode;
  classNames?: SlotsToClasses<ShellHeaderSlots>;
}

const ShellHeader = ({ heading, description, actions, children, classNames }: ShellHeaderProps) => {
  return (
    <>
      <div className="grid gap-1">
        <div className="flex justify-between items-center">
          <h1 className={cn("font-heading text-3xl md:text-4xl", classNames?.heading)}>{heading}</h1>
          <div>{actions}</div>
        </div>
        {description && <div className={cn("text-muted-foreground text-lg", classNames?.description)}>{description}</div>}
      </div>
      {children}
    </>
  );
};

export { Shell, ShellHeader };
