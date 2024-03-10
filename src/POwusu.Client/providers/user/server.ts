import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { parseJSON } from "@/utils";
import { getCookie } from "cookies-next";

import { User } from "@/types/user";

export const getUser = (cookies: () => ReadonlyRequestCookies) => {
  return parseJSON(getCookie("Identity", { cookies })) as User | null | undefined;
};
