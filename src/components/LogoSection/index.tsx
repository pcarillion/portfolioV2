import React from 'react'
import { DMContainer } from '../utils/DMContainer'
import { MorphingSVG } from './morphing-svg'

export const LogoSection = () => {
  return (
    <DMContainer>
      <div className="relative h-50vh w-full snap-center overflow-hidden md:h-frame-lg">
        <div className="absolute inset-0 z-2 flex items-center justify-center">
          <div className="h-full w-full max-w-full">
            <MorphingSVG />
          </div>
        </div>
      </div>
    </DMContainer>
  )
}
