"use client";

import React, { useEffect, useRef, useState } from "react";
import { projectsList } from "../constants";
import { ProjectLi } from "./ProjectLi";
import { useScroll } from "framer-motion";
import { ProgressCircle } from "@/components/utils/ProgressCircle";
import { ProjectModal } from "../ProjectModal";

export const ProjectsList = () => {
  const projectListRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: projectListRef,
  });

  // modal gestion
  const [currentProject, setCurrentProject] = useState<number | null>(null);
  useEffect(() => {
    console.log(currentProject);
  }, [currentProject]);

  return (
    <>
      <ProjectModal
        index={currentProject}
        setCurrentProject={setCurrentProject}
      />
      <ul
        className="w-full h-full box-border overflow-y-scroll overflow-x-hidden snap-y snap-mandatory relative"
        ref={projectListRef}
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
    </>
  );
};
