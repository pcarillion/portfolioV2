'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export const LogoAnimation = () => {
  /**
   *
   * It takes 2 seconds for the logo reduce and let display the website
   *
   */
  const [fullScreen, setFullScreen] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setFullScreen(false)
    }, 2000)
  }, [])

  return (
    <div
      className={`${
        fullScreen ? 'h-full w-full bg-neutral-950' : 'h-10 w-10 bg-transparent'
      } transition-all duration-500 ease-in-out fixed bottom-0 right-0 z-50`}
    >
      <div className="flex justify-center items-center h-full w-full">
        <div
          className={`${
            fullScreen ? 'h-96 w-96 ' : 'h-10 w-10'
          } transition-all duration-300 ease-in-out relative`}
        >
          <Image
            src="/monlogo.svg"
            fill
            alt="Paul Carillion"
            className="animate-pulse"
            style={{ objectFit: 'cover', filter: 'invert(60%)', animation: 'fadeIn 3s' }}
          />
        </div>
      </div>
    </div>
  )
}
