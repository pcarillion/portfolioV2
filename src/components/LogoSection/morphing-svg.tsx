'use client';

import { interpolate } from 'flubber';
import { animate, motion, MotionValue, useMotionValue, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { svgPathProperties } from 'svg-path-properties';

const SVG_WIDTH = 5000;

const logoOuterPath =
  'M2295 4490 c-692 -79 -1282 -490 -1588 -1105 -272 -548 -273 -1207 -3 -1760 261 -532 724 -910 1298 -1059 201 -52 270 -61 498 -60 225 1 323 13 519 65 553 147 1020 531 1272 1044 147 301 203 546 203 890 0 218 -12 314 -63 510 -147 562 -543 1037 -1079 1293 -254 120 -511 180 -802 187 -96 2 -211 0 -255 -5z m350 -100 c813 -93 1467 -710 1606 -1515 29 -173 32 -439 5 -600 -49 -296 -165 -572 -344 -815 -31 -41 -114 -134 -186 -205 -254 -253 -567 -423 -900 -489 -255 -51 -434 -56 -671 -20 -770 119 -1382 711 -1526 1476 -30 161 -37 434 -15 588 61 420 246 785 542 1070 301 290 664 462 1074 509 108 12 310 13 415 1z';

const logoInnerPath =
  'M1630 2872 l0 -1302 -312 -2 -313 -3 -3 -52 -3 -53 315 0 316 0 0 -225 0 -226 58 3 57 3 3 223 2 222 1040 0 1040 0 0 24 c0 22 -5 23 -73 29 -293 25 -607 221 -781 489 -174 267 -223 614 -129 913 127 402 467 691 892 756 67 10 81 16 81 31 0 16 -9 18 -77 18 -280 -1 -624 -185 -814 -435 -95 -125 -158 -253 -201 -405 -26 -95 -37 -364 -18 -479 52 -322 260 -624 546 -791 l69 -40 -788 0 -787 0 0 324 0 323 63 7 c381 42 703 296 825 651 42 124 55 220 49 360 -12 265 -107 480 -292 660 -172 168 -389 260 -642 272 l-123 6 0 -1301z m335 1157 c159 -49 320 -155 421 -277 68 -83 135 -212 170 -328 24 -77 27 -107 28 -224 0 -110 -4 -151 -23 -220 -77 -292 -286 -515 -570 -610 -54 -18 -126 -34 -168 -37 l-73 -6 0 868 0 868 73 -6 c40 -4 104 -16 142 -28z';

type Point = {
  x: number;
  y: number;
};

type PathPair = {
  normal: string;
  mirrored: string;
};

const commandParamCount: Record<string, number> = {
  M: 2,
  L: 2,
  C: 6,
};

function tokenizePath(path: string): string[] {
  return path.match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) ?? [];
}

function formatNumber(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function mirrorX(x: number): number {
  return SVG_WIDTH - x;
}

function splitIntoAbsoluteSubpaths(path: string): string[] {
  const tokens = tokenizePath(path);
  const subpaths: string[] = [];
  let subpath: string[] = [];
  let index = 0;
  let command = '';
  let current: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };

  const readNumber = () => Number(tokens[index++]);
  const hasNumber = () => index < tokens.length && !/[a-zA-Z]/.test(tokens[index]);

  const closeSubpath = () => {
    if (!subpath.length) return;

    subpath.push('Z');
    subpaths.push(subpath.join(' '));
    subpath = [];
    current = { ...start };
  };

  while (index < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[index])) {
      command = tokens[index++];
    }

    const upperCommand = command.toUpperCase();
    const isRelative = command === command.toLowerCase();

    if (upperCommand === 'Z') {
      closeSubpath();
      continue;
    }

    if (!commandParamCount[upperCommand]) {
      throw new Error(`Unsupported SVG path command: ${command}`);
    }

    while (hasNumber()) {
      if (upperCommand === 'M') {
        const x = readNumber();
        const y = readNumber();
        const absolutePoint = {
          x: isRelative ? current.x + x : x,
          y: isRelative ? current.y + y : y,
        };

        if (subpath.length) {
          subpaths.push(subpath.join(' '));
          subpath = [];
        }

        subpath.push(
          `M ${formatNumber(absolutePoint.x)} ${formatNumber(absolutePoint.y)}`,
        );
        current = absolutePoint;
        start = absolutePoint;
        command = isRelative ? 'l' : 'L';
        continue;
      }

      if (upperCommand === 'L') {
        const x = readNumber();
        const y = readNumber();
        const absolutePoint = {
          x: isRelative ? current.x + x : x,
          y: isRelative ? current.y + y : y,
        };

        subpath.push(
          `L ${formatNumber(absolutePoint.x)} ${formatNumber(absolutePoint.y)}`,
        );
        current = absolutePoint;
        continue;
      }

      if (upperCommand === 'C') {
        const x1 = readNumber();
        const y1 = readNumber();
        const x2 = readNumber();
        const y2 = readNumber();
        const x = readNumber();
        const y = readNumber();
        const controlPoint1 = {
          x: isRelative ? current.x + x1 : x1,
          y: isRelative ? current.y + y1 : y1,
        };
        const controlPoint2 = {
          x: isRelative ? current.x + x2 : x2,
          y: isRelative ? current.y + y2 : y2,
        };
        const endPoint = {
          x: isRelative ? current.x + x : x,
          y: isRelative ? current.y + y : y,
        };

        subpath.push(
          [
            'C',
            formatNumber(controlPoint1.x),
            formatNumber(controlPoint1.y),
            formatNumber(controlPoint2.x),
            formatNumber(controlPoint2.y),
            formatNumber(endPoint.x),
            formatNumber(endPoint.y),
          ].join(' '),
        );
        current = endPoint;
      }
    }
  }

  if (subpath.length) {
    subpaths.push(subpath.join(' '));
  }

  return subpaths;
}

function mirrorAbsoluteSubpath(path: string): string {
  const tokens = tokenizePath(path);
  const mirrored: string[] = [];
  let index = 0;

  while (index < tokens.length) {
    const command = tokens[index++];
    const paramCount = commandParamCount[command] ?? 0;

    if (command === 'Z') {
      mirrored.push(command);
      continue;
    }

    const values = Array.from({ length: paramCount }, () => Number(tokens[index++]));

    for (let i = 0; i < values.length; i += 2) {
      values[i] = mirrorX(values[i]);
    }

    mirrored.push(command, ...values.map(formatNumber));
  }

  return mirrored.join(' ');
}

function densifySubpath(path: string, samplePoints = 300): string {
  const properties = new svgPathProperties(path);
  const length = properties.getTotalLength();
  const step = length / samplePoints;
  const firstPoint = properties.getPointAtLength(0);
  let pathD = `M ${formatNumber(firstPoint.x)} ${formatNumber(firstPoint.y)}`;

  for (let i = 1; i <= samplePoints; i++) {
    const point = properties.getPointAtLength(i * step);

    pathD += ` L ${formatNumber(point.x)} ${formatNumber(point.y)}`;
  }

  return `${pathD} Z`;
}

function getPathPairs(paths: string[]): PathPair[] {
  return paths.flatMap(path =>
    splitIntoAbsoluteSubpaths(path).map(subpath => ({
      normal: densifySubpath(subpath),
      mirrored: densifySubpath(mirrorAbsoluteSubpath(subpath)),
    })),
  );
}

function MorphPath({
  pair,
  progress,
}: {
  pair: PathPair;
  progress: MotionValue<number>;
}) {
  const interpolator = React.useMemo(
    () => interpolate(pair.normal, pair.mirrored),
    [pair.mirrored, pair.normal],
  );
  const d = useTransform(progress, value => interpolator(value));

  return <motion.path d={d} />;
}

export const MorphingSVG = () => {
  const pathPairs = React.useMemo(
    () => getPathPairs([logoOuterPath, logoInnerPath]),
    [],
  );
  const progress = useMotionValue(0);
  const [isNormal, setIsNormal] = React.useState(true);
  const containerRef = useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const controls = animate(progress, isNormal ? 0 : 1, {
      duration: 0.25,
      ease: [0.42, 0, 0.58, 1],
    });

    return controls.stop;
  }, [isNormal, progress]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const middle = bounds.left + bounds.width / 2;
    const isLeft = event.clientX < middle;

    setIsNormal(isLeft);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full text-black dark:text-gray-500"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <g
        transform="translate(0 500) scale(0.1 -0.1)"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {pathPairs.map((pair, index) => (
          <MorphPath
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            pair={pair}
            progress={progress}
          />
        ))}
      </g>
    </svg>
  );
};
