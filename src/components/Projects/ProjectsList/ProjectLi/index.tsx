"use client";

import React, { Dispatch, SetStateAction, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { useIsMobile } from "@/hooks/useIsMobile";

export const ProjectLi = ({
  project,
  containerRef,
  setCurrentProject,
  index,
}: {
  project: any;
  index: number;
  containerRef: React.MutableRefObject<any>;
  setCurrentProject: Dispatch<SetStateAction<number | null>>;
}) => {
  const targetRef = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: targetRef,
    offset: ["start end", "end end"],
  });
  const liOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [1, 0], [0, 1000]);
  const isMobile = useIsMobile();
  const LiContent = (
    <>
      <div
        className="relative w-full"
        style={{ paddingBottom: "30%", maxHeight: "0" }}
      >
        <Image
          src={`/assets/${project.picture}`}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "right top",
            overflow: "hidden",
            zIndex: "-1",
          }}
          alt={project.title}
          className="grayscale dark:brightness-50 glow:ring-1 glow:grayscale-0 glow:brightness-100 glow:ring-glow"
        />
        <div className="absolute inset-0 bg-white bg-opacity-10 dark:bg-opacity-0 pointer-events-none"></div>
      </div>
      <motion.div
        className="h-full w-full flex flex-col justify-center items-end absolute top-0 md:left-48"
        style={
          {
            // x,
          }
        }
      >
        <button
          onClick={() => setCurrentProject(index)}
          className="w-min text-right font-light dark:text-white md:mr-8 animate-all ease-in-out duration-300"
        >
          {project.title}
        </button>
      </motion.div>
    </>
  );
  return (
    <>
      <motion.li
        ref={targetRef}
        className="text-4xl md:text-6xl h-full w-full relative snap-center md:px-48"
        style={
          {
            // opacity: liOpacity,
          }
        }
      >
        {isMobile ? (
          LiContent
        ) : (
          <GlowCapture>
            <Glow color="white">{LiContent}</Glow>
          </GlowCapture>
        )}
      </motion.li>
    </>
  );
};
