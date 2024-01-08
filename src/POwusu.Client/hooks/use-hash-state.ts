"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trimEnd } from "lodash";
import queryString from "query-string";

// How do I get the pathname with hash.
// source: https://github.com/vercel/next.js/discussions/49465
export const useHashState = () => {
  const getCurrentHash = useMemo(() => () => (typeof window !== "undefined") ? window.location.hash.replace(/^#!?/, "") : null, []);
  const router = useRouter();
  const params = useParams();
  const [hash, _setHash] = useState<string>(getCurrentHash());

  const setHash = (newHash: string) => {
    let updatedUrl = window.location.href;
    updatedUrl = queryString.stringifyUrl({ url: updatedUrl.split('#')[0], fragmentIdentifier: newHash });

    _setHash(newHash);
    router.replace(updatedUrl);
  };
  useEffect(() => {
    const currentHash = getCurrentHash();
    _setHash(currentHash);
  }, [params]);

  return [hash, setHash] as const;
};
