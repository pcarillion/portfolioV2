"use client";

import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

export const useIsDM = () => {
  const cookies = useCookies();
  const [isDM, setIsDM] = useState(cookies.get("x-theme") === "dark");
  const dmCookie = cookies.get("x-theme");
  useEffect(() => {
    setIsDM(dmCookie === "dark");
  }, [dmCookie]);

  return isDM;
};
