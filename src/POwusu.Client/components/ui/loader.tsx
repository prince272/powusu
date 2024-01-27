"use client";

import { FC, useEffect, useState } from "react";
import { cn } from "@/utils";
import { Spinner } from "@nextui-org/spinner";

import { ExternalWindow } from "@/lib/external-window";

const Loader: FC<{ timeout?: number; }> = ({ timeout = 1000 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      ExternalWindow.notify();
      setLoading(false);
    }, timeout);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={cn("absolute top-0 z-50 flex h-full w-full items-center justify-center bg-background", !loading && "hidden")}>
      <Spinner className="mb-16" size="lg" aria-label="Loading..." />
    </div>
  );
};

export { Loader };
