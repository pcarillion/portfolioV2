"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useHasScrolled } from "@/hooks/useHasScrolled";
import { DMContainer } from "@/components/utils/DMContainer";

export const SocialMedias = () => {
  const { hasScrolled } = useHasScrolled();
  const initialPosition = {
    github: "top-10 md:top-14 right-10 md:right-14",
    linkedin: "top-20 md:top-24 right-10 md:right-14",
    malt: "top-32 top-36 right-10 md:right-14",
  };
  const scrolledPosition = {
    github: "top-10 md:top-14 right-32 right-36",
    linkedin: "top-10 md:top-14 right-20 right-24",
    malt: "top-10 md:top-14 right-10 md:right-14",
  };

  return (
    <DMContainer>
      <div
        className={`fixed ${
          hasScrolled ? scrolledPosition.github : initialPosition.github
        } h-6 w-6 transition-all duration-500 ease-in-out`}
      >
        <Link href="https://github.com/pcarillion" target="_blank">
          <Image
            fill
            src="/github.svg"
            alt="github"
            className="dark:invert-[.6] hover:opacity-60 dark:hover:invert dark:hover:opacity-100 transition-all duration-300 ease-in-out"
            style={{ objectFit: "cover", animation: "fadeIn 5s" }}
          />
        </Link>
      </div>
      <div
        className={`fixed ${
          hasScrolled ? scrolledPosition.linkedin : initialPosition.linkedin
        } h-6 w-6 transition-all duration-500 ease-in-out`}
      >
        <Link
          href="https://www.linkedin.com/in/paul-carillion/"
          target="_blank"
        >
          <Image
            fill
            src="/linkedin.svg"
            alt="linkedin"
            className="dark:invert-[.6] hover:opacity-60 dark:hover:invert dark:hover:opacity-100 transition-all duration-300 ease-in-out"
            style={{ objectFit: "cover", animation: "fadeIn 5s" }}
          />
        </Link>
      </div>
      <div
        className={`fixed ${
          hasScrolled ? scrolledPosition.malt : initialPosition.malt
        } h-6 w-6 transition-all duration-500 ease-in-out`}
      >
        <Link href="https://www.malt.fr/profile/paulcarillion" target="_blank">
          <Image
            fill
            src="/malt.svg"
            alt="malt"
            className="dark:invert-[.6] hover:opacity-60 dark:hover:invert dark:hover:opacity-100 transition-all duration-300 ease-in-out"
            style={{
              objectFit: "cover",
              animation: "fadeIn 5s",
            }}
          />
        </Link>
      </div>
    </DMContainer>
  );
};
