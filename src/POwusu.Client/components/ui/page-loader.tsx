"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils";
import { Spinner } from "@nextui-org/spinner";

const PageLoader = ({ timeout }: { timeout?: number }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (timeout !== undefined) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, timeout);

      return () => clearTimeout(timeoutId);
    }

    // If no timeout is set, keep loading indefinitely
    return () => {};
  }, [timeout]);

  return (
    <div className={cn("fixed top-0 z-50 h-screen w-full bg-background", !loading && "hidden")}>
      <div className="h-screen flex items-center justify-center"><Spinner className="mb-16" size="lg" aria-label="Loading..." /></div>
    </div>
  );
};

export { PageLoader };
