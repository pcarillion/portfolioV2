"use client";

import React, { Dispatch, SetStateAction, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { useIsMobile } from "@/hooks/useIsMobile";

export const ProjectLi = ({
  project,
  // containerRef,
  setCurrentProject,
  index,
}: {
  project: any;
  index: number;
  containerRef?: React.MutableRefObject<any>;
  setCurrentProject: Dispatch<SetStateAction<number | null>>;
}) => {
  const targetRef = useRef<HTMLLIElement>(null);
  // const { scrollYProgress } = useScroll({
  //   container: containerRef,
  //   target: targetRef,
  //   offset: ["start end", "end end"],
  // });
  // const liOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // const x = useTransform(scrollYProgress, [1, 0], [0, 1000]);
  const isMobile = useIsMobile();
  const picture = project.previewPicture ?? project.picture;
  const LiContent = (
    <>
      <div
        className="relative w-full"
        style={{ paddingBottom: "30%", maxHeight: "0" }}
      >
        <Image
          src={`/assets/${picture}`}
          fill
          sizes="(max-width: 768px) 100vw, calc(100vw - 24rem)"
          quality={70}
          loading={index === 0 ? "eager" : "lazy"}
          style={{
            objectFit: "cover",
            objectPosition: "right top",
            overflow: "hidden",
            zIndex: "-1",
          }}
          alt={project.title}
          className="grayscale-[0.8] saturate-[0.32] brightness-90 dark:brightness-50 transition-all duration-500 ease-out glow:ring-1 glow:grayscale-0 glow:saturate-100 glow:brightness-100 glow:ring-glow"
        />
        <div className="absolute inset-0 bg-white bg-opacity-10 dark:bg-opacity-0 pointer-events-none"></div>
      </div>
      <motion.div
        className="relative mt-3 flex w-full justify-end md:absolute md:left-48 md:top-0 md:mt-0 md:h-full md:flex-col md:items-end md:justify-center"
        style={
          {
            // x,
          }
        }
      >
        <button
          onClick={() => setCurrentProject(index)}
          className="group/button max-w-[75%] text-right font-light focus-visible:outline-none dark:text-white md:mr-8 md:w-min md:max-w-none"
        >
          <span className="relative inline-block">
            {project.title}
            <span className="absolute -bottom-2 right-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover/button:w-full group-focus-visible/button:w-full" />
          </span>
        </button>
      </motion.div>
    </>
  );
  return (
    <>
      <motion.li
        ref={targetRef}
        className="group relative box-border h-[clamp(260px,38vh,340px)] w-full snap-start px-4 pt-32 text-4xl md:h-frame-lg md:px-48 md:pt-28 md:text-6xl"
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
