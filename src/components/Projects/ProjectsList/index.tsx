"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { projectsList } from "../constants";
import { ProjectLi } from "./ProjectLi";
import { ProjectCard } from "./ProjectCard";
import { ProgressCircle } from "@/components/utils/ProgressCircle";
import { ProjectModal } from "../ProjectModal";
import { ListMode } from "..";

type SetCurrentProject = Dispatch<SetStateAction<number | null>>;
type Project = (typeof projectsList)[number];

const getProjectPicture = (project: Project) =>
  "previewPicture" in project ? project.previewPicture : project.picture;

export const ProjectsList = ({ listMode }: { listMode: ListMode }) => {
  const [currentProject, setCurrentProject] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = currentProject !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [currentProject]);

  return (
    <>
      <ProjectModal
        index={currentProject}
        setCurrentProject={setCurrentProject}
      />

      {listMode === "list" && (
        <ListProjects setCurrentProject={setCurrentProject} />
      )}
      {listMode === "circle" && (
        <CircleProjects setCurrentProject={setCurrentProject} />
      )}
      {listMode === "grid" && (
        <GridProjects setCurrentProject={setCurrentProject} />
      )}
    </>
  );
};

const ListProjects = ({
  setCurrentProject,
}: {
  setCurrentProject: SetCurrentProject;
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="relative min-h-50vh md:min-h-frame-lg">
      <div className="pointer-events-none sticky top-5 z-40 h-50vh md:top-10 md:h-frame-lg">
        <div className="absolute left-0 top-24 hidden size-20 md:top-28 md:block">
          <ProgressCircle y={scrollYProgress} />
        </div>
      </div>

      <ul
        ref={listRef}
        className="relative -mt-[50vh] md:-mt-[calc(100vh-5rem)]"
      >
        {projectsList.map((project, index) => (
          <ProjectLi
            key={project.title}
            project={project}
            index={index}
            setCurrentProject={setCurrentProject}
          />
        ))}
      </ul>
    </div>
  );
};

const GridProjects = ({
  setCurrentProject,
}: {
  setCurrentProject: SetCurrentProject;
}) => (
  <ul className="grid min-h-50vh w-full grid-cols-1 content-start gap-4 px-4 pb-8 pt-32 md:min-h-frame-lg md:grid-cols-2 md:gap-6 lg:grid-cols-3">
    {projectsList.map((project, index) => (
      <ProjectCard
        key={project.title}
        project={project}
        index={index}
        setCurrentProject={setCurrentProject}
      />
    ))}
  </ul>
);

const CircleProjects = ({
  setCurrentProject,
}: {
  setCurrentProject: SetCurrentProject;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const circleReveal = useMotionValue(0);
  const circleStartAngle = useMotionValue(225);
  const circleMaskStop = useTransform(circleReveal, (value) => 360 - value);
  const circleMaskImage = useMotionTemplate`conic-gradient(from ${circleStartAngle}deg, transparent 0deg, transparent ${circleMaskStop}deg, black ${circleMaskStop}deg, black 360deg)`;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateStartAngle = () => {
      const deltaX = -0.65 * stage.clientWidth;
      const deltaY =
        (window.innerWidth < 768 ? 1 : 1.08) * stage.clientHeight;
      const angle =
        ((Math.atan2(deltaX, -deltaY) * 180) / Math.PI + 360) % 360;

      circleStartAngle.set(angle);
    };

    updateStartAngle();
    const resizeObserver = new ResizeObserver(updateStartAngle);
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, [circleStartAngle]);

  useEffect(() => {
    const updateFromPageScroll = () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const firstProject = projectRefs.current[0];
      const lastProject = projectRefs.current[projectsList.length - 1];
      if (!root || !stage || !firstProject || !lastProject) return;

      const rootRect = root.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const focusRatio = window.innerWidth < 768 ? 0.5 : 0.42;
      const focusY = stageRect.top + stageRect.height * focusRatio;
      const firstProjectY = firstProject.getBoundingClientRect().top;
      const lastProjectY = lastProject.getBoundingClientRect().top;
      const entryDistance = stageRect.bottom - focusY;
      const exitDistance = lastProject.offsetHeight || 1;
      const entryProgress = Math.min(
        1,
        Math.max(0, (stageRect.bottom - firstProjectY) / entryDistance),
      );
      const exitProgress = Math.min(
        1,
        Math.max(0, (focusY - lastProjectY) / exitDistance),
      );
      const revealProgress =
        entryProgress < 1 ? entryProgress : 1 - exitProgress;

      circleReveal.set(360 * revealProgress);

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      projectRefs.current.forEach((project, index) => {
        if (!project) return;

        const distance = Math.abs(
          project.getBoundingClientRect().top - focusY,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      const rootIsVisible =
        rootRect.bottom > stageRect.top && rootRect.top < stageRect.bottom;
      const nextActiveProject =
        !rootIsVisible || entryProgress <= 0 || exitProgress >= 1
          ? null
          : closestIndex;

      setActiveProject((current) =>
        current === nextActiveProject ? current : nextActiveProject,
      );
    };

    updateFromPageScroll();
    window.addEventListener("scroll", updateFromPageScroll, { passive: true });

    return () =>
      window.removeEventListener("scroll", updateFromPageScroll);
  }, [circleReveal]);

  const activeProjectData =
    activeProject !== null ? projectsList[activeProject] : null;
  const activePicture = activeProjectData
    ? getProjectPicture(activeProjectData)
    : null;

  return (
    <div
      ref={rootRef}
      className={`relative transition-colors duration-700 ${
        activeProject === null
          ? "text-gray-500"
          : "text-black dark:text-gray-200"
      }`}
    >
      <div className="pointer-events-none sticky top-5 z-50 h-frame md:top-10 md:h-frame-lg">
        <div className="absolute inset-0">
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <line
              x1="-10%"
              y1="150%"
              x2="55%"
              y2="50%"
              className="md:hidden"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="-10%"
              y1="150%"
              x2="55%"
              y2="42%"
              className="hidden md:block"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            aria-hidden="true"
            className="absolute left-[55%] top-1/2 size-[clamp(18px,1.8vw,34px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current md:top-[42%]"
          />
        </div>
      </div>

      <div
        ref={stageRef}
        className="pointer-events-none sticky top-5 z-20 -mt-[calc(100vh-2.5rem)] h-frame md:top-10 md:-mt-[calc(100vh-5rem)] md:h-frame-lg"
      >
        <motion.div
          style={{
            maskImage: circleMaskImage,
            WebkitMaskImage: circleMaskImage,
          }}
          className="absolute left-[55%] top-1/2 aspect-square w-[clamp(220px,34vw,600px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full md:top-[42%]"
        >
          <AnimatePresence initial={false}>
            {activeProjectData && activePicture && (
              <motion.div
                key={activeProjectData.title}
                initial={{ opacity: activeProject === 0 ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 overflow-hidden rounded-full"
              >
                <motion.div
                  initial={{ scale: activeProject === 0 ? 1.03 : 1.16 }}
                  animate={{ scale: 1.03 }}
                  exit={{ scale: 1.03 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 will-change-transform"
                >
                  <Image
                    src={`/assets/${activePicture}`}
                    alt=""
                    fill
                    sizes="(max-width: 646px) 440px, (min-width: 1765px) 1200px, 68vw"
                    quality={90}
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {activeProjectData && (
            <div className="absolute inset-0 bg-black/50" />
          )}
        </motion.div>
      </div>

      <ul className="relative z-30 -mt-[calc(100vh-2.5rem)] md:-mt-[calc(100vh-5rem)]">
        <li
          aria-hidden="true"
          className="h-[calc(100vh-1rem)]"
        />
        {projectsList.map((project, index) => (
          <li
            key={project.title}
            ref={(item) => {
              projectRefs.current[index] = item;
            }}
            className="relative h-[clamp(170px,24vh,230px)] w-full snap-start scroll-mt-[calc(50vh-1.25rem)] md:scroll-mt-[calc(42vh-2.5rem)]"
          >
            <div
              className={`absolute left-[calc(55%+clamp(24px,3vw,56px))] top-0 max-w-[calc(45%-clamp(40px,5vw,80px))] -translate-y-1/2 text-left text-black transition-opacity duration-500 dark:text-white ${
                activeProject === null || activeProject === index
                  ? "opacity-100"
                  : "opacity-45"
              }`}
            >
              <button
                type="button"
                onClick={() => setCurrentProject(index)}
                aria-label={`Voir le projet ${project.title}`}
                className="group text-left text-2xl font-bold leading-tight focus-visible:outline-none md:text-5xl"
              >
                <span className="relative inline-block">
                  {project.title}
                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-current transition-[width] duration-500 group-hover:w-full group-focus-visible:w-full" />
                </span>
              </button>
            </div>
          </li>
        ))}
        <li aria-hidden="true" className="h-[60vh]" />
      </ul>
    </div>
  );
};
