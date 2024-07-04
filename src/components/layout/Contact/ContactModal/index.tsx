import React, { Dispatch, SetStateAction, useEffect } from "react";
import { AnimationSequence, useAnimate } from "framer-motion";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { contactFormAction } from "./action";
import { ClipLoader } from "react-spinners";
import { useIsDM } from "@/hooks/useIsDM";

/**
 *
 * configure animation: number of columns
 *
 */
const numbColumns = 10;
const colums = Array.from({ length: numbColumns }, (_, i) => i + 1);

/**
 *
 * common classes
 *
 */
const inputClassNames =
  "w-full md:w-1/2 bg-transparent mb-10 p-2 border border-black dark:border-gray-500 dark:text-white focus-visible:outline-0";

/**
 *
 * Form specific
 *
 */
const initialState = {
  status: null,
  message: "",
};

export type FormState = {
  status: "ok" | "error" | null;
  message: string;
};

export type FormSchema = {
  type: "text" | "textarea" | "email";
  name: string;
  placeholder: string;
  required?: boolean;
}[];

export const ContactModal = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = [
      ...colums.map((el) => {
        return [
          `#el-${el}__c`,
          {
            height: openModal ? "100vh" : "0",
          },
          { at: 0.2 * el },
        ];
      }),
      [
        "#close__c",
        {
          display: openModal ? "block" : "none",
        },
        { at: 0.2 },
      ],
      [
        "#contact_form__c",
        {
          display: openModal ? "flex" : "none",
          opacity: openModal ? "1" : "0",
        },
        { at: 0.2 * numbColumns },
      ],
    ] as AnimationSequence;
    animate(sequence);
  }, [openModal, animate]);
  const [state, formAction] = useFormState<FormState, FormData>(
    contactFormAction,
    initialState
  );
  const { pending } = useFormStatus();
  const isDM = useIsDM();

  return (
    <div ref={scope}>
      <div id="contact_modal__c" className={`fixed top-0 left-0 z-30`}>
        <div className={`relative`}>
          {colums.map((el) => {
            return (
              <div
                key={el}
                className="bg-neutral-50 dark:bg-neutral-900 fixed"
                id={`el-${el}__c`}
                style={{
                  top: "0",
                  left: `${((el - 1) / numbColumns) * 100}%`,
                  width: `${(1 / numbColumns) * 100}%`,
                }}
              />
            );
          })}
          <button
            id="close__c"
            className="absolute h-6 w-6 left-10 md:left-14 top-10 md:top-14"
            onClick={() => {
              setOpenModal(false);
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
          <form
            action={formAction}
            id="contact_form__c"
            className="absolute top-28 w-screen p-10 md:p-14 flex justify-center flex-col items-center"
          >
            <input
              type="text"
              placeholder="Votre nom"
              name="name"
              className={inputClassNames}
              style={{ animation: "fadeIn 5s" }}
            />
            <input
              type="email"
              placeholder="Votre email"
              name="email"
              className={inputClassNames}
              style={{ animation: "fadeIn 5s" }}
            />
            <textarea
              className={inputClassNames}
              placeholder="Votre message"
              name="message"
              style={{ animation: "fadeIn 5s" }}
            />
            <input name="hp" id="hp" className="hidden" />
            <button
              type="submit"
              className="w-44 border border-black dark:border-gray-500 dark:text-white h-10 hover:bg-gray-500 transition-all duration-300 ease-in-out"
              style={{ animation: "fadeIn 5s" }}
            >
              {pending ? (
                <ClipLoader
                  color={isDM ? "white" : "black"}
                  loading={true}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  className="mt-2"
                />
              ) : (
                "Envoyer"
              )}
            </button>
            {state.status && (
              <div
                className={`w-full text-center my-12 text-black dark:text-white`}
              >
                {state.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
