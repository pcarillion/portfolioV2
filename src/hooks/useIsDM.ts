"use client";

import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

export const useIsDM = () => {
  const cookies = useCookies();
  let dmCookie = cookies.get("x-theme");
  if (!dmCookie) dmCookie = "dark";
  const [isDM, setIsDM] = useState(dmCookie === "dark");
  useEffect(() => {
    setIsDM(dmCookie === "dark");
  }, [dmCookie]);

  return isDM;
};
