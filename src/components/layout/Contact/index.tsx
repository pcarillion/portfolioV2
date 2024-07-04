"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ContactModal } from "./ContactModal";
import { useHasScrolled } from "@/hooks/useHasScrolled";
import { DMContainer } from "@/components/utils/DMContainer";

export const Contact = () => {
  const { hasScrolled } = useHasScrolled();
  const [openModal, setOpenModal] = useState(false);

  /**
   * This hook is to avoid rendering on page load
   */
  const [isOpenedOnce, setIsOpenedOnce] = useState(false);
  useEffect(() => {
    if (openModal) {
      setIsOpenedOnce(true);
    }
  }, [openModal]);
  return (
    <DMContainer>
      <div className="fixed top-10 md:top-14 left-10 md:left-14 h-20 w-20">
        <button
          className="relative h-6 w-6 dark:opacity-60 hover:opacity-60 dark:hover:opacity-100 transition-all duration-300 ease-in-out"
          onClick={() => setOpenModal(true)}
        >
          <Image
            fill
            src="/contact.svg"
            alt="contact"
            className="dark:invert"
            style={{ objectFit: "cover", animation: "fadeIn 5s" }}
          />
          <div
            className={`ml-8 mt-1 text-left ${
              hasScrolled ? "w-0" : "w-24"
            }  overflow-hidden dark:text-white transition-all duration-300 ease-in-out`}
          >
            Contact
          </div>
        </button>
        {isOpenedOnce && (
          <ContactModal openModal={openModal} setOpenModal={setOpenModal} />
        )}
      </div>
    </DMContainer>
  );
};
