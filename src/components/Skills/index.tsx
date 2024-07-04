"use client";

import { Glow, GlowCapture } from "@codaworks/react-glow";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { skillsTable } from "./constants";
import { DMContainer } from "../utils/DMContainer";
import { useIsDM } from "@/hooks/useIsDM";

export const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLDivElement>,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 0.4], [600, 0]);
  const isDM = useIsDM();

  return (
    <DMContainer>
      <GlowCapture>
        <div className="w-full box-border px-4 md:p-12" ref={containerRef}>
          <motion.div style={{ y }}>
            <div className="dark:text-white text-base w-full ">
              {skillsTable.map(({ title, skills }) => {
                return (
                  <div className="first:pt-0 pt-8 md:pt-4 " key={title}>
                    <Glow color={isDM ? "white" : ""}>
                      <div className="flex flex-col md:flex-row border-b border-black dark:border-gray-500 pb-4 md:pb-10 w-full glow:ring-1 glow:text-glow glow:border-glow glow:ring-glow ">
                        <div className="mb-4 md:mb-0 md:pr-20 md:w-24">
                          {title}
                        </div>
                        <div className="flex direction-row flex-wrap">
                          {skills.map((skill) => {
                            return (
                              <div
                                key={skill}
                                className="px-4 py-1 mr-4 mb-4 border border-black border-gray-500 glow:ring-1 glow:text-glow glow:border-glow glow:ring-glow glow:bg-glow/[.015]"
                              >
                                {skill}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Glow>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </GlowCapture>
    </DMContainer>
  );
};
