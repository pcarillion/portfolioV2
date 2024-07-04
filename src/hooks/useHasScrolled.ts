'use client'

import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

export const useHasScrolled = (): { hasScrolled: boolean } => {
  const [hasScrolled, setHasScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0) {
      setHasScrolled(true)
    } else {
      setHasScrolled(false)
    }
  })
  return { hasScrolled }
}
