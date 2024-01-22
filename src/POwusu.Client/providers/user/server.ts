import { cookies } from "next/headers";
import { parseJSON } from "@/utils";
import { getCookie } from "cookies-next";

import { User } from "@/types/user";

export const getUser = () => {
  return parseJSON(getCookie("currentUser", { cookies })) as User | null | undefined;
};
