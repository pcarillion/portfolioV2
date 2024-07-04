import React from "react";
import { Tajawal } from "next/font/google";
const tajawal = Tajawal({
  subsets: ["latin"],
  weight: ["200", "300", "400", "700"],
});
import "./globals.css";
// import { Shader } from "@/components/layout/Shader";
import { LogoAnimation } from "@/components/layout/LogoAnimation";
import WebGLCanvas from "@/components/layout/Shader/ManualShader";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { Frames } from "@/components/layout/Frames";
import { CookiesProvider } from "next-client-cookies/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.BASE_URL || "https://paulcarillion.fr";
  return {
    metadataBase: new URL(baseUrl),
    title: "Paul Carillion - Développeur web fullstack",
    alternates: {
      canonical: "/",
    },
    description:
      "Développeur web depuis plusieurs années, je vous accompagne de la conception à la réalisation de vos projets web",
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * size of the main container is set to fit into the frame
     *
     * order of the components fundamental to preserve accessibility
     *
     * order:
     *
     * - shader (background)
     *
     * - content / children (interaction)
     *
     * - frame elements (above everything)
     *
     * - beginning logo animation
     *
     */
    <html lang="fr">
      <body
        className={`${tajawal.className} bg-neutral-950 sm:max-w-sm relative`}
      >
        <CookiesProvider>
          {/* Shader */}
          {/* <Shader /> */}
          <WebGLCanvas />

          {/* Page content */}
          <div className="z-10">{children}</div>

          {/* frame elements (frame and masks) */}
          <Frames />

          {/* Dark mode toggle */}
          <DarkModeToggle />

          {/* logo animation */}
          <LogoAnimation />
        </CookiesProvider>
      </body>
    </html>
  );
}
