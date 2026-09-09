import React, { Dispatch, SetStateAction } from "react";
import { projectsList } from "../constants";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  ProjectImageName,
  projectImageDimensions,
} from "../imageMetadata";

export const ProjectModal = ({
  index,
  setCurrentProject,
}: {
  index: number | null;
  setCurrentProject: Dispatch<SetStateAction<number | null>>;
}) => {
  const project = index !== null && projectsList[index];
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed top-10 left-10 right-10 bottom-10 z-[100] bg-neutral-50 dark:bg-neutral-900 p-4 animate-all ease-in-out duration-200`}
        >
          <div className="flex flex-row w-full h-full">
            <div className="w-7/12 overflow-scroll">
              {project.gallery.map((picture, i) => {
                const dimensions =
                  projectImageDimensions[picture as ProjectImageName] ??
                  projectImageDimensions[project.picture as ProjectImageName];

                return (
                  <Image
                    src={`/assets/${picture}`}
                    width={dimensions.width}
                    height={dimensions.height}
                    sizes="(max-width: 768px) 100vw, 58vw"
                    quality={75}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="mb-4 h-auto w-full"
                    key={picture + i}
                    alt={project.title + i}
                  />
                );
              })}
            </div>
            <div className="text-right dark:text-white w-5/12 font-light flex flex-col justify-center items-end relative box-border pl-4">
              <button
                id="close__c"
                className="absolute h-6 w-6 right-5 md:right-4 top-5 md:top-4"
                onClick={() => {
                  setCurrentProject(null);
                }}
              >
                <Image
                  fill
                  src="/cross.svg"
                  alt="contact"
                  className="dark:invert-[.6]"
                  style={{ objectFit: "cover", animation: "fadeIn 5s" }}
                />
              </button>
              {project.url ? (
                <div className="flex flex-col items-end">
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir le site de ${project.title} dans un nouvel onglet`}
                    className="mb-3 transition-opacity duration-300 hover:opacity-60 focus-visible:outline-none focus-visible:opacity-60"
                  >
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-9"
                      strokeWidth={0.8}
                    />
                  </Link>
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h2 className="text-6xl hover:opacity-60">
                      {project.title}
                    </h2>
                  </Link>
                </div>
              ) : (
                <h2 className=" text-6xl animate-all ease-in-out duration-300">
                  {project.title}
                </h2>
              )}
              <p className="pt-4">{project.date}</p>
              <p className="pt-4">
                {project.tech.map((t, i) => (
                  <span key={t + i}>{t}, </span>
                ))}
              </p>
              <p className="py-4">{project.description}</p>
              {project.github && (
                <div className={`h-6 w-6 relative float-right`}>
                  <Link href={project.github} target="_blank">
                    <Image
                      fill
                      src="/github.svg"
                      alt="github"
                      className="dark:invert dark:hover:invert-[.6] hover:opacity-60 transition-all duration-300 ease-in-out"
                      style={{ objectFit: "cover", animation: "fadeIn 5s" }}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
