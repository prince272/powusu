import { createSearchParamsCache, parseAsInteger } from "nuqs/parsers";

export const postsSearchParsers = {
  page: parseAsInteger.withDefault(1).withOptions({ shallow: false })
};

export const postsSearchParamsCache = createSearchParamsCache(postsSearchParsers);
