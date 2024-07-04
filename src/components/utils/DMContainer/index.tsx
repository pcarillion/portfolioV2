"use client";

import React from "react";
import { useIsDM } from "@/hooks/useIsDM";

export const DMContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isDM = useIsDM();
  return <div className={isDM ? "dark" : ""}>{children}</div>;
};
