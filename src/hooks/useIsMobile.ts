"use client";

import { createContext, useContext, useEffect, useState } from "react";
import MobileDetect from "mobile-detect";
import { useWindowWidth } from "@react-hook/window-size";

interface ContextValue {
  me?: any;
  userAgent: string;
}

export const SSRDataContext = createContext<ContextValue>({} as ContextValue);

export function useSSRDataContext() {
  return useContext(SSRDataContext);
}
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { userAgent } = useSSRDataContext();
  const mobileDetect = new MobileDetect(userAgent);
  const userAgentIsDesktop = !mobileDetect.mobile() && !mobileDetect.tablet();
  const isSSR = typeof window === "undefined";
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (isSSR) {
      setIsMobile(!userAgentIsDesktop);
    }

    setIsMobile(windowWidth <= 768);
  }, [userAgentIsDesktop, windowWidth, isSSR]);

  return isMobile;
};
