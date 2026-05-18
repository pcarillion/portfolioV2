import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

export const ProjectCard = ({
  project,
  setCurrentProject,
  index,
}: {
  project: any;
  index: number;
  containerRef?: React.MutableRefObject<any>;
  setCurrentProject: Dispatch<SetStateAction<number | null>>;
}) => {
  const visibleTech = project.tech.slice(0, 3);
  const hiddenTechCount = project.tech.length - visibleTech.length;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.22) }}
      className="group relative min-h-[21rem] overflow-hidden border border-black/10 bg-white/70 text-black transition-colors duration-300 hover:border-black/30 dark:border-white/15 dark:bg-neutral-950/40 dark:text-white dark:hover:border-white/35"
    >
      <button
        type="button"
        onClick={() => setCurrentProject(index)}
        className="relative flex h-full min-h-[21rem] w-full flex-col text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
        aria-label={`Voir le projet ${project.title}`}
      >
        <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 md:h-56">
          <Image
            src={`/assets/${project.picture}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            alt={project.title}
            className="object-cover object-top grayscale transition duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 dark:brightness-75 dark:group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-white/10 opacity-70 transition-opacity duration-500 group-hover:opacity-35 dark:from-black/75 dark:to-black/5" />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-8 p-4 md:p-5">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4 text-xs font-light uppercase tracking-[0.18em] text-black/45 dark:text-white/45">
              <span>{project.date}</span>
              <span className="h-px flex-1 bg-black/15 dark:bg-white/15" />
            </div>
            <h3 className="text-2xl font-extralight leading-tight md:text-3xl">
              {project.title}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {visibleTech.map((tech: string) => (
                <span
                  key={tech}
                  className="border border-black/10 px-2.5 py-1 text-xs font-light text-black/65 dark:border-white/15 dark:text-white/65"
                >
                  {tech}
                </span>
              ))}
              {hiddenTechCount > 0 && (
                <span className="border border-black/10 px-2.5 py-1 text-xs font-light text-black/45 dark:border-white/15 dark:text-white/45">
                  +{hiddenTechCount}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 text-sm font-light">
              <span className="h-px flex-1 bg-black/15 transition-colors duration-300 group-hover:bg-black/45 dark:bg-white/15 dark:group-hover:bg-white/45" />
              <span className="translate-y-1 opacity-55 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Voir le projet
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.li>
  );
};
