"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      richColors
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-content1 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-default-500",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:g-default group-[.toast]:text-default-foreground",
          error: "!bg-danger-50 !text-danger",
          success: "!bg-success-50 !text-success",
          warning: "!bg-warning-50 !text-warning",
          info: "!bg-primary-50 !text-primary"
        }
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
