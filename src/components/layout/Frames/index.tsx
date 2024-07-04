"use client";

import { DMContainer } from "@/components/utils/DMContainer";
import React from "react";
const maskCommonProperties = "fixed bg-white dark:bg-black opacity-40 z-1000";

export const Frames = () => {
  return (
    <DMContainer>
      <div
        id="frame"
        style={{ zIndex: -1 }}
        className="top-5 md:top-10 left-5 md:left-10 right-5 md:right-10 bottom-5 md:bottom-10 m-0 fixed border border-gray-500 "
      />
      <div
        id="mask-left"
        className={`${maskCommonProperties} w-5 md:w-10 h-full left-0 top-0`}
      />
      <div
        id="mask-right"
        className={`${maskCommonProperties} w-5 md:w-10 h-full right-0 top-0`}
      />
      <div
        id="mask-top"
        className={`${maskCommonProperties} h-5 md:h-10 left-5 md:left-10 right-5 md:right-10 top-0`}
      />
      <div
        id="mask-bottom"
        className={`${maskCommonProperties} h-5 md:h-10 left-5 md:left-10 right-5 md:right-10 bottom-0`}
      />
    </DMContainer>
  );
};
