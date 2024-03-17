"use client";

import { useEffect, useState } from "react";

export default function Error({ reset, ...props }: { error: Error; reset: () => void }) {
  const [error, setError] = useState<Error | null>(props.error);
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
