"use client";

import React from "react";
import { MotionValue, motion } from "framer-motion";
import { useIsDM } from "@/hooks/useIsDM";

export const ProgressCircle = ({ y }: { y: MotionValue<number> }) => {
  const isDM = useIsDM();
  return (
    <svg
      id="progress"
      width={75}
      height={75}
      viewBox="0 0 100 100"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={50}
        cy={50}
        r={30}
        pathLength={1}
        className="bg"
        style={{
          stroke: isDM ? "white" : "black",
          opacity: "0.3",
          strokeDashoffset: "0",
          strokeWidth: "1%",
          fill: "none",
        }}
      />
      <motion.circle
        cx={50}
        cy={50}
        r={30}
        pathLength={1}
        id="indicator"
        style={{
          strokeDashoffset: "0",
          strokeWidth: "1%",
          fill: "none",
          stroke: isDM ? "white" : "black",
          pathLength: y,
        }}
      />
    </svg>
  );
};
