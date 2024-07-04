"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useIsDM } from "@/hooks/useIsDM";
import { DMContainer } from "@/components/utils/DMContainer";

export const DarkModeToggle = () => {
  const router = useRouter();
  const cookies = useCookies();
  const handleClick = (bool: boolean) => {
    cookies.set("x-theme", bool ? "dark" : "light");
    router.refresh();
  };
  const isDM = useIsDM();

  return (
    <DMContainer>
      <div className="fixed md:top-4 md:left-14 h-5 text-black dark:text-white">
        <button
          className="relative dark:opacity-60 dark:hover:opacity-100 hover:opacity-60 animate-all ease-in-out duration-300"
          onClick={() => handleClick(false)}
        >
          {!isDM && (
            <div className="absolute -left-4 top-1/4 h-2 w-2 rounded-full bg-black" />
          )}
          Light
        </button>
        <button
          className="pl-8 dark:opacity-60 dark:hover:opacity-100 hover:opacity-60 relative"
          onClick={() => handleClick(true)}
        >
          {isDM && (
            <div className="absolute left-4 top-1/4 h-2 w-2 rounded-full bg-white" />
          )}
          Dark
        </button>
      </div>
    </DMContainer>
  );
};
