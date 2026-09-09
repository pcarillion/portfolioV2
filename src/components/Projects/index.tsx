"use client";

import React, { useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
} from "framer-motion";
import { ProjectsList } from "./ProjectsList";
import { DMContainer } from "../utils/DMContainer";
import { CircleSlash2, LayoutGrid, Rows3 } from "lucide-react";

export type ListMode = "grid" | "list" | "circle";

const MODE_TRANSITION_EASE = [0.22, 1, 0.36, 1] as const;

export const Projects = () => {
  const projectContainerRef = useRef<HTMLElement>(null);
  const contentControls = useAnimationControls();
  const [listMode, setListMode] = useState<ListMode>("circle");
  const [pendingMode, setPendingMode] = useState<ListMode | null>(null);
  const { scrollYProgress } = useScroll({
    target: projectContainerRef,
    offset: ["start end", "start start"],
  });
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0, 1, 1],
  );
  const titleX = useTransform(scrollYProgress, [0, 0.55, 1], [-100, 0, 0]);
  const toggleX = useTransform(scrollYProgress, [0, 0.45, 1], [100, 0, 0]);

  const handleModeChange = async (nextMode: ListMode) => {
    if (nextMode === listMode || pendingMode !== null) return;

    setPendingMode(nextMode);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    await contentControls.start({
      opacity: 0,
      y: reduceMotion ? 0 : 16,
      transition: {
        duration: reduceMotion ? 0 : 0.3,
        ease: MODE_TRANSITION_EASE,
      },
    });

    const section = projectContainerRef.current;
    if (section) {
      const frameInset = window.innerWidth >= 768 ? 40 : 20;
      const start = window.scrollY;
      const target = start + section.getBoundingClientRect().top - frameInset;

      if (Math.abs(target - start) > 1) {
        await animate(start, target, {
          duration: reduceMotion ? 0 : 0.8,
          ease: MODE_TRANSITION_EASE,
          onUpdate: (value) => window.scrollTo(0, value),
        });
      }
    }

    setListMode(nextMode);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void contentControls.start({
          opacity: 1,
          y: 0,
          transition: {
            duration: reduceMotion ? 0 : 0.45,
            ease: MODE_TRANSITION_EASE,
          },
        }).then(() => setPendingMode(null));
      });
    });
  };

  const selectedMode = pendingMode ?? listMode;

  return (
    <DMContainer>
      <section
        ref={projectContainerRef}
        data-projects-section
        className="relative min-h-50vh w-full md:min-h-frame-lg"
      >
        <div className="pointer-events-none sticky top-5 z-[70] h-50vh md:top-10 md:h-frame-lg">
          <motion.div
            style={{ opacity: titleOpacity, x: titleX }}
            className="absolute left-4 top-14 dark:text-white"
          >
            <h2 className="text-2xl font-extralight">Mes Projets</h2>
          </motion.div>

          <motion.div
            style={{ x: toggleX }}
            className="pointer-events-auto absolute right-4 top-14 flex flex-row gap-6 dark:text-white"
          >
            <ModeButton
              active={selectedMode === "circle"}
              disabled={pendingMode !== null}
              label="Afficher les projets en mode circulaire"
              onClick={() => void handleModeChange("circle")}
            >
              <CircleSlash2 />
            </ModeButton>
            <ModeButton
              active={selectedMode === "grid"}
              disabled={pendingMode !== null}
              label="Afficher les projets en grille"
              onClick={() => void handleModeChange("grid")}
            >
              <LayoutGrid />
            </ModeButton>
            <ModeButton
              active={selectedMode === "list"}
              disabled={pendingMode !== null}
              label="Afficher les projets en liste"
              onClick={() => void handleModeChange("list")}
            >
              <Rows3 />
            </ModeButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={contentControls}
          className="-mt-[50vh] md:-mt-[calc(100vh-5rem)]"
        >
          <ProjectsList listMode={listMode} />
        </motion.div>
      </section>
    </DMContainer>
  );
};

const ModeButton = ({
  active,
  children,
  disabled,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    aria-label={label}
    title={label}
    className="relative transition-opacity duration-300 hover:opacity-60 disabled:cursor-wait dark:opacity-60 dark:hover:opacity-100"
  >
    {active && (
      <span className="absolute -left-3 top-1/3 size-2 rounded-full bg-black dark:bg-white" />
    )}
    {children}
  </button>
);
