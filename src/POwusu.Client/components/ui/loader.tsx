"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils";
import { Spinner } from "@nextui-org/spinner";

const Loader = ({ timeout }: { timeout?: number }) => {
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
    <div className={cn("absolute top-0 z-50 flex h-full w-full items-center justify-center bg-background", !loading && "hidden")}>
      <Spinner className="mb-16" size="lg" aria-label="Loading..." />
    </div>
  );
};

export { Loader };
