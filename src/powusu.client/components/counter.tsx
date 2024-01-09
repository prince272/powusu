"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import { api } from "@/lib/api";
import { useUser } from "./providers/user";
import { useHashState } from "@/hooks";

export const Counter = () => {
  const [count, setCount] = useState(0);
  const [hash, setHash] = useHashState();
  const user = useUser();

  return (
    <Button radius="full" onPress={() => {
      setCount(count + 1);
      setHash(count % 2 == 0 ? "sign-in" : "");
    }}>
      Count is {count} and user is {user.authenticated ? "logged in" : "logged out"}
    </Button>
  );
};
