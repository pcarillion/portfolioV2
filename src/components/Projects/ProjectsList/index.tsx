"use client";

import React, { useEffect, useRef, useState } from "react";
import { projectsList } from "../constants";
import { ProjectLi } from "./ProjectLi";
import { useScroll } from "framer-motion";
import { ProgressCircle } from "@/components/utils/ProgressCircle";
import { ProjectModal } from "../ProjectModal";
import { ListMode } from "..";
import { ProjectCard } from "./ProjectCard";

export const ProjectsList = ({ listMode }: { listMode: ListMode }) => {
  const projectListRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    container: projectListRef,
  });

  // modal gestion
  const [currentProject, setCurrentProject] = useState<number | null>(null);
  useEffect(() => {
    document.body.style.overflow = currentProject !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [currentProject]);

  const handleWheel = (event: React.WheelEvent<HTMLUListElement>) => {
    if (currentProject !== null) return;

    const list = projectListRef.current;
    if (!list) return;

    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = event.deltaY > 0;
    const isAtTop = list.scrollTop <= 0;
    const isAtBottom =
      list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

    if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
      event.preventDefault();
      window.scrollBy({ top: event.deltaY });
    }
  };

  return (
    <>
      <ProjectModal
        index={currentProject}
        setCurrentProject={setCurrentProject}
      />
      {listMode === "list" && (
        <ul
          className={`w-full h-full box-border overflow-x-hidden snap-y snap-mandatory relative ${
            currentProject !== null ? "overflow-y-hidden" : "overflow-y-scroll"
          }`}
          ref={projectListRef}
          onWheel={handleWheel}
        >
          <div
            className="sticky bottom-0 md:top-0 right-0 "
            style={{ width: "80px", height: "80px" }}
          >
            <ProgressCircle y={scrollYProgress} />
          </div>
          {projectsList.map((proj, i) => {
            return (
              <ProjectLi
                key={proj.title}
                project={proj}
                index={i}
                containerRef={projectListRef}
                setCurrentProject={setCurrentProject}
              />
            );
          })}
        </ul>
      )}
      {listMode === "grid" && (
        <ul
          className={`grid h-full w-full grid-cols-1 content-start gap-4 overflow-x-hidden pr-1 md:grid-cols-2 md:gap-6 lg:grid-cols-3 ${
            currentProject !== null ? "overflow-y-hidden" : "overflow-y-scroll"
          }`}
          ref={projectListRef}
          onWheel={handleWheel}
        >
          {projectsList.map((proj, i) => {
            return (
              <ProjectCard
                key={proj.title}
                project={proj}
                index={i}
                containerRef={projectListRef}
                setCurrentProject={setCurrentProject}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};
