import React from "react";
import { Home } from "@/components/Home";
import { SocialMedias } from "@/components/layout/SocialMedias";
import dynamic from "next/dynamic";

/**
 *
 * Lazy loading for every heavy component and out of First Contentful Paint
 *
 */
const Contact = dynamic(() =>
  import("@/components/layout/Contact").then((mod) => mod.Contact)
);
const Projects = dynamic(() =>
  import("@/components/Projects").then((mod) => mod.Projects)
);
const Skills = dynamic(() =>
  import("@/components/Skills").then((mod) => mod.Skills)
);

const Page = () => {
  return (
    /**
     * size of the main container is set to fit into the frame
     *
     * order of the components fundamental to preserve accessibility
     *
     * page sections: Home, Skills, Projects
     *
     * layout elements: Contact, Social Medias
     */
    <div className="w-screen box-border p-5 md:p-10">
      <Home />
      <Skills />
      <Projects />
      <Contact />
      <SocialMedias />
    </div>
  );
};

export default Page;
