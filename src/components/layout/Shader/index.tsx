/**
 *
 * Deprecated due to Next issue
 *
 */

"use client";

import React from "react";
import ShadertoyReact from "shadertoy-react";

export const Shader = () => {
  const fragmentShader = `
    void main(void) {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float slowTime = iTime * 0.2;
        vec3 col = 0.5 + 0.5 * cos(slowTime + uv.xyx + vec3(0, 2, 4));
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        // Adjust the brightness
        float brightness = 0.2; // Change this value to control brightness
        gray *= brightness;
        // Clamp the value to make sure it stays between 0.0 and 1.0
        gray = clamp(gray, 0.0, 1.0);
        gl_FragColor = vec4(vec3(gray), 1.0);
    }
`;

  return (
    <div
      style={{ zIndex: "-2" }}
      className="h-full w-screen fixed top-0 left-0"
    >
      <ShadertoyReact fs={fragmentShader} />
    </div>
  );
};
