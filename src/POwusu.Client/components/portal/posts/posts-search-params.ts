import { createSearchParamsCache, parseAsInteger } from "nuqs/parsers";

export const postsSearchParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(2)
};

export const postsSearchParamsCache = createSearchParamsCache(postsSearchParsers);
