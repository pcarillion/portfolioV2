"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProjectsList } from "./ProjectsList";
import { DMContainer } from "../utils/DMContainer";

export const Projects = () => {
  const projectContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectContainerRef as React.RefObject<HTMLDivElement>,
    offset: ["start end", "end end"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const titleX = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [600, 0]);

  return (
    <DMContainer>
      <div
        className="h-50vh w-full relative snap-center  md:h-frame md:h-frame-lg"
        ref={projectContainerRef}
      >
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute top-4 left-4 dark:text-white mt-10"
        >
          <h2 className="font-extralight text-2xl">Mes Projets</h2>
        </motion.div>
        <motion.div style={{ y }} className="pt-32 px-4 h-full">
          <ProjectsList />
        </motion.div>
      </div>
    </DMContainer>
  );
};
