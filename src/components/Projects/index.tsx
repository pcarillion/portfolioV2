"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProjectsList } from "./ProjectsList";
import { DMContainer } from "../utils/DMContainer";
import { LayoutGrid, Rows3 } from "lucide-react";

export type ListMode = "grid" | "list";

export const Projects = () => {
  const projectContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectContainerRef as React.RefObject<HTMLDivElement>,
    offset: ["start end", "end end"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const titleX = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 0]);
  const toggleX = useTransform(scrollYProgress, [0, 0.4], [100, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [600, 0]);
  const [listMode, setListMode] = React.useState<ListMode>("list");

  return (
    <DMContainer>
      <div
        className="h-50vh w-full relative snap-center  md:h-frame-lg"
        ref={projectContainerRef}
      >
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute top-4 left-4 dark:text-white mt-10"
        >
          <h2 className="font-extralight text-2xl">Mes Projets</h2>
        </motion.div>
        <motion.div
          style={{ x: toggleX }}
          className="absolute top-4 right-4 dark:text-white mt-10 flex flex-row gap-2"
        >
          {listMode === "grid" && (
            <div className="absolute -left-3 top-1/3 h-2 w-2 rounded-full bg-black dark:bg-white" />
          )}
          <button
            className="dark:opacity-60 dark:hover:opacity-100 hover:opacity-60 relative"
            onClick={() => setListMode("grid")}
            aria-label="Afficher les projets en grille"
            title="Grille"
          >
            <LayoutGrid />
          </button>
          <button
            className="ml-4 dark:opacity-60 dark:hover:opacity-100 hover:opacity-60 relative"
            onClick={() => setListMode("list")}
            aria-label="Afficher les projets en liste"
            title="Liste"
          >
            {listMode === "list" && (
              <div className="absolute -left-3 top-1/3 h-2 w-2 rounded-full bg-black dark:bg-white" />
            )}
            <Rows3 />
          </button>
        </motion.div>
        <motion.div style={{ y }} className="pt-32 px-4 h-full">
          <ProjectsList listMode={listMode} />
        </motion.div>
      </div>
    </DMContainer>
  );
};
