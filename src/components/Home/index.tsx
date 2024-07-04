"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DMContainer } from "../utils/DMContainer";

export const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLDivElement>,
    offset: ["start start", "end end"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const titleX = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const skillsOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const skillsX = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <DMContainer>
      <div className="w-full relative h-frame md:h-frame-lg" ref={containerRef}>
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute bottom-5 md:bottom-4 left-5 md:left-4 dark:text-white mt-10"
        >
          <h1 className="font-extralight text-3xl">Paul Carillion</h1>
          <h3 className="font-light">Développeur Web Fullstack</h3>
        </motion.div>
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute left-5 md:left-4 bottom-40 dark:text-white"
        >
          <p className="font-extralight">
            Développeur web depuis plusieurs années, <br />
            je vous accompagne de la conception à <br />
            la réalisation de vos projets web <br />
          </p>
        </motion.div>
        <motion.div
          style={{ opacity: skillsOpacity, x: skillsX }}
          className="absolute left-5 md:left-auto bottom-5 md:bottom-4 md:right-4 dark:text-white"
        >
          <h2 className="font-extralight text-2xl">Mes compétences</h2>
        </motion.div>
      </div>
    </DMContainer>
  );
};
