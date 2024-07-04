"use client";

import React, { useEffect, useRef } from "react";
import { useIsDM } from "@/hooks/useIsDM";

const WebGLCanvas = () => {
  const canvasRef = useRef<any>(null);
  const isDM = useIsDM();
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error(
        "Unable to initialize WebGL. Your browser may not support it."
      );
      return;
    }

    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main(void) {
        gl_Position = aVertexPosition;
      }
    `;

    // Fragment shader program
    const fsSource = `
      precision mediump float;

      uniform vec2 iResolution;
      uniform float iTime;

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

    const fsSourceWhite = `precision mediump float;

      uniform vec2 iResolution;
      uniform float iTime;

      void main(void) {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float slowTime = iTime * 0.2;
        vec3 col = 0.5 + 0.5 * cos(slowTime + uv.xyx + vec3(0, 2, 4));
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        // Adjust the brightness
        float brightness = 0.7; // Change this value to control brightness
        gray *= brightness;
        // Invert the gray value to get the inverted color effect
        gray = 1.0 - gray;
        // Clamp the value to make sure it stays between 0.0 and 1.0
        gray = clamp(gray, 0.0, 1.0);
        gl_FragColor = vec4(vec3(gray), 1.0);
      }`;

    // Function to compile a shader
    function loadShader(
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ) {
      const shader = gl.createShader(type) as WebGLShader;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(
      gl,
      gl.FRAGMENT_SHADER,
      isDM ? fsSource : fsSourceWhite
    );

    if (!vertexShader || !fragmentShader) {
      return;
    }

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram)
      );
      return;
    }

    gl.useProgram(shaderProgram);

    // Initialize buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vertexPosition = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Set the resolution uniform
    const iResolution = gl.getUniformLocation(shaderProgram, "iResolution");
    gl.uniform2f(iResolution, canvas.width, canvas.height);

    // Animation loop
    let startTime = null as number | null;

    function render(now: number) {
      if (!startTime) {
        startTime = now;
      }

      const iTime = (now - startTime) * 0.001; // Convert to seconds
      const timeUniformLocation = gl.getUniformLocation(shaderProgram, "iTime");
      gl.uniform1f(timeUniformLocation, iTime);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, [canvasRef, isDM]);

  return (
    <canvas
      ref={canvasRef}
      style={{ zIndex: -2 }}
      className="fixed top-0 left-0 w-screen h-screen"
    />
  );
};

export default WebGLCanvas;
